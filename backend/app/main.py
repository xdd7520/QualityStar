import sentry_sdk
from fastapi import FastAPI
from fastapi.routing import APIRoute
from fastapi_pagination import add_pagination
from starlette.middleware.cors import CORSMiddleware

from app.api.main import api_router
from app.core.config import settings
from app.scheduler.scheduler import scheduler
from app.service.gather_interface import query_prometheus
from config.logging_config import global_logger as logger


def custom_generate_unique_id(route: APIRoute) -> str:
    return f"{route.tags[0]}-{route.name}"


if settings.SENTRY_DSN and settings.ENVIRONMENT != "local":
    sentry_sdk.init(dsn=str(settings.SENTRY_DSN), enable_tracing=True)

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    generate_unique_id_function=custom_generate_unique_id,
)

# Set all CORS enabled origins
if settings.BACKEND_CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[
            str(origin).strip("/") for origin in settings.BACKEND_CORS_ORIGINS
        ],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

app.include_router(api_router, prefix=settings.API_V1_STR)

# 下面是非项目模板中的配置

add_pagination(app)


# 定时任务
@app.on_event("startup")
async def start_scheduler():
    # domain_scheduler.add_job(weekly_task, 'cron', day_of_week='mon', hour=9, minute=15)
    # domain_scheduler.add_job(daily_task, 'cron', hour=10, minute=30)
    # domain_scheduler.add_job(recurring_task, 'interval', minutes=10)
    # domain_scheduler.add_job(my_task, 'interval', minutes=1)
    scheduler.add_job(query_prometheus, 'interval', hours=1)
    logger.info(f"定时任务列表：{scheduler.list_jobs()}")
