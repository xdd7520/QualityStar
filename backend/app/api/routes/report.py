# Created by xdd at 2024/6/3

from fastapi import APIRouter, HTTPException
from app.models import ReportRUI, Message
from app.api.deps import SessionDep

from app.service.gather_interface import upload_uris
from config.logging_config import global_logger as logger

router = APIRouter()

@router.post("/report")
def report_uris(data: ReportRUI, session: SessionDep) -> Message:
    """
    上报自动化内容接口
    """
    data_json = data.json()
    logger.info(f"{data_json}")
    upload_uris(data, session)
    return Message(message="upload successfully")

