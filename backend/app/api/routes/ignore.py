# Created by xdd at 2024/6/3

from fastapi_pagination import Page
from sqlalchemy import select
from fastapi import APIRouter, HTTPException
from app.crud import update_entity
from app.models import IgnoreCreate, IgnoreInterface, IgnoreOut, IgnoreUpdate
from app.api.deps import SessionDep
from fastapi_pagination.ext.sqlalchemy import paginate

from config.logging_config import setup_logger

router = APIRouter()
logger = setup_logger()


@router.post("/ignore/add", response_model=IgnoreInterface)
def create_ignore_uri(ignore_uri: IgnoreCreate, session: SessionDep):
    """
    添加过滤信息
    """
    ignore = IgnoreInterface.from_orm(ignore_uri)
    session.add(ignore)
    session.commit()
    session.refresh(ignore)
    return ignore


@router.get("/ignores", response_model=Page[IgnoreOut])
def get_ignores_page(session: SessionDep) -> Page[IgnoreOut]:
    """
    分页模式获取过滤列表
    """
    # 直接在查询结果上使用 paginate，它将自动处理分页
    pages = paginate(session, select(IgnoreInterface).order_by(IgnoreInterface.id))
    return pages


@router.patch("/ignore/{ignore_id}", response_model=IgnoreOut)
def update_ignore(ignore_id: int, ignore_update: IgnoreUpdate, session: SessionDep):
    """
    修改过滤信息
    """
    return update_entity(ignore_id, ignore_update, session, IgnoreInterface)


@router.get("/ignores/{ignore_id}", response_model=IgnoreOut)
def read_ignore(ignore_id: int, session: SessionDep) -> IgnoreOut:
    """
    通过ID获取过滤信息
    """
    ignore = session.get(IgnoreInterface, ignore_id)
    if not ignore:
        raise HTTPException(status_code=404, detail="Ignore not found")
    return ignore
