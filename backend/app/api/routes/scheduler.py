from fastapi import APIRouter

from app.scheduler.scheduler import scheduler

router = APIRouter()


#
# @router.post("/start/{job_id}")
# async def start_job(job_id: str, interval: int):
#     if job_id in domain_scheduler.get_jobs():
#         raise HTTPException(status_code=400, detail="Job already running.")
#     scheduler.start_fetching(interval, job_id)
#     return {"message": "Job started", "job_id": job_id}
#
#
# @router.delete("/stop/{job_id}")
# async def stop_job(job_id: str):
#     if job_id not in scheduler.get_jobs():
#         raise HTTPException(status_code=404, detail="Job not found.")
#     scheduler.stop_fetching(job_id)
#     return {"message": "Job stopped", "job_id": job_id}
#

@router.get("/jobs")
async def list_jobs():
    """
    列出所有定时任务
    """
    return scheduler.list_jobs()
