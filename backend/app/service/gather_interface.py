# Created by xdd at 2024/6/5
import uuid
from typing import Dict, Set
import requests
from app.models import IgnoreInterface, ReportRUI, GatherInterface, TransactionLog, ActionEnum, ProjectNameMapping, \
    UploadInterface
from config.logging_config import global_logger as logger
from sqlalchemy import select, func
from sqlalchemy.orm import sessionmaker
from app.core.db import engine

# 采集 Actuator + Prometheus 中的数据，保存到数据库中

SessionLocal = sessionmaker(bind=engine)

# 内存缓存
project_mapping_cache = {}


def get_or_create_project_name(session, application_name):
    """
    查询或创建 ProjectNameMapping 实例
    """
    if application_name in project_mapping_cache:
        return project_mapping_cache[application_name]

    project_name_mapping = session.execute(
        select(ProjectNameMapping).where(ProjectNameMapping.eureka_name == application_name)
    ).scalar()

    if not project_name_mapping:
        project_name_mapping = ProjectNameMapping(eureka_name=application_name)
        session.add(project_name_mapping)
        session.commit()
        logger.info(f"Added new ProjectNameMapping for {application_name}")

    project_mapping_cache[application_name] = project_name_mapping
    return project_name_mapping


def query_prometheus(query_param="http_server_requests_seconds_count"):
    """
    从 Prometheus 查询微服务的接口信息并保存到 GatherInterface 表中
    """
    prometheus_url = "http://itest-qtrack.jetmobo.com"
    url = f"{prometheus_url}/api/v1/query?query={query_param}"
    logger.info(f"url: {url}")
    response = requests.get(url)
    response.raise_for_status()  # 检查请求是否成功
    data = response.json()

    results = data.get('data', {}).get('result', [])

    with SessionLocal() as session:
        new_entries = []
        entries_count_by_name = {}
        batch_id = str(uuid.uuid4())  # 生成批次号

        for result in results:
            metric = result.get('metric', {})
            application_name = str(metric.get('application', '')).lower()
            uri = metric.get('uri', '')
            if uri.startswith('/api'):
                project_name_mapping = get_or_create_project_name(session, application_name)

                if not check_if_gather_interface_exists(session, project_name_mapping.id, uri,
                                                        metric.get('method', '')):
                    gather_interface = GatherInterface(
                        url=uri,
                        project_name_mapping_id=project_name_mapping.id,
                        method=metric.get('method', ''),
                        is_active=False  # 默认设置为未实现自动化
                    )
                    new_entries.append(gather_interface)
                    if application_name in entries_count_by_name:
                        entries_count_by_name[application_name] += 1
                    else:
                        entries_count_by_name[application_name] = 1

        if new_entries:
            session.bulk_save_objects(new_entries)
            session.commit()
            logger.info(f"已将 {len(new_entries)} 条记录保存到 GatherInterface。")

            # 记录流水信息
            for name, count in entries_count_by_name.items():
                details = f"系统：{name}，新增 {count} 条新记录。"
                transaction_log = TransactionLog(
                    action=ActionEnum.QUERY,
                    name=name,
                    count=count,
                    batch_id=batch_id,
                    details=details
                )
                session.add(transaction_log)
            session.commit()  # 确保流水日志也被保存
        else:
            logger.info("没有要保存的新数据。")


def check_if_gather_interface_exists(session, project_name_mapping_id, url, method):
    """
    检查指定的 GatherInterface 是否已存在于数据库中
    """
    # 构建查询语句，检查具有相同 project_name_mapping_id, url, 和 method 的记录是否存在
    exists = session.execute(
        select(GatherInterface).where(
            GatherInterface.project_name_mapping_id == project_name_mapping_id,
            GatherInterface.url == url,
            GatherInterface.method == method
        )
    ).first() is not None
    return exists


def get_ignore_list(session):
    statement = select(IgnoreInterface.uri)
    ignore_list = session.execute(statement).scalars().all()
    logger.info(f"len: {len(ignore_list)}, data: {ignore_list}")
    return ignore_list


def get_project_mapping_list():
    """
    不是通过接口层传 session 过来的样例
    """
    with SessionLocal() as session:
        statement = select(ProjectNameMapping).offset(0).limit(1000)
        return session.execute(statement).scalars().all()


def upload_uris(data: ReportRUI, session):
    ignore_list = get_ignore_list(session)
    new_entries = []
    received_count = 0
    new_entries_count_by_name: Dict[str, int] = {}
    seen_urls: Set[str] = set()

    for data_uri_item in data.data:
        for uri_item in data_uri_item.url_list:
            if uri_item.url in seen_urls:
                continue

            seen_urls.add(uri_item.url)
            received_count += 1

            if uri_item.url not in ignore_list:
                existing_entry = session.execute(
                    select(UploadInterface)
                    .where(UploadInterface.url == uri_item.url)
                    .where(UploadInterface.name == data_uri_item.name)
                ).scalars().first()

                if not existing_entry:
                    new_entry = UploadInterface(
                        url=uri_item.url,
                        name=data_uri_item.name,
                        method=uri_item.method,
                        description=uri_item.description,
                        is_active=True
                    )
                    new_entries.append(new_entry)
                    if data_uri_item.name in new_entries_count_by_name:
                        new_entries_count_by_name[data_uri_item.name] += 1
                    else:
                        new_entries_count_by_name[data_uri_item.name] = 1

    if new_entries:
        session.bulk_save_objects(new_entries)
        session.commit()
        logger.info(f"已收到 {received_count} 条记录，新增 {len(new_entries)} 条记录保存到数据库。")
        for name, count in new_entries_count_by_name.items():
            logger.info(f"系统：{name}，新增 {count} 条新记录。")
    else:
        logger.info(f"收到 {received_count} 条记录，没有新增数据。")

    # 记录流水信息
    batch_id = str(uuid.uuid4())  # 生成批次号
    for name, count in new_entries_count_by_name.items():
        details = f"系统：{name}，新增 {count} 条新记录。"
        transaction_log = TransactionLog(
            action=ActionEnum.UPLOAD,
            name=name,
            count=count,
            batch_id=batch_id,
            details=details
        )
        session.add(transaction_log)

    session.commit()
    update_coverage(session)


def update_coverage(session):
    # 查询所有的 UploadInterface 条目
    upload_interfaces = session.execute(select(UploadInterface)).scalars().all()

    # 遍历 UploadInterface 条目
    for upload in upload_interfaces:
        # 使用 ProjectNameMapping 表来找到对应的 GatherInterface 条目
        # 这假设 `upload.name` 与 `ProjectNameMapping.upload_name` 相关联
        gather_interfaces = session.execute(
            select(GatherInterface).join(ProjectNameMapping)
            .where(ProjectNameMapping.upload_name == upload.name)
            .where(GatherInterface.url == upload.url)
            .where(GatherInterface.method == upload.method)
        ).scalars().all()

        # 如果找到对应的 GatherInterface 条目，更新它们的 is_active 字段
        for gather_interface in gather_interfaces:
            logger.info(f"gather_interface: {gather_interface}")
            gather_interface.is_active = True
            session.add(gather_interface)

    # 提交所有更改
    session.commit()
