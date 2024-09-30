# Created by xdd at 2024/6/19

from fastapi import APIRouter
from app.models import Message
from app.service.gather_interface import query_prometheus, update_coverage
from app.api.deps import SessionDep

router = APIRouter()


@router.get("/get_prometheus")
def get_prometheus() -> Message:
    """
    触发查询Prometheus 内容
    """
    query_prometheus()
    return Message(message="trigger successfully")


@router.get("/update_coverage")
def tigger_update_coverage(session: SessionDep) -> Message:
    """
    手动更新自动化覆盖率
    """
    update_coverage(session)
    return Message(message="trigger successfully")
