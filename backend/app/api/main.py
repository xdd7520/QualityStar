from fastapi import APIRouter

from app.api.routes import items, login, roles, users, utils, tester, report, ignore, scheduler, trigger

api_router = APIRouter()
api_router.include_router(login.router, tags=["login"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(utils.router, prefix="/utils", tags=["utils"])
api_router.include_router(items.router, prefix="/items", tags=["items"])
api_router.include_router(roles.router, prefix="/roles", tags=["roles"])
api_router.include_router(tester.router, tags=["tester"])
api_router.include_router(report.router, tags=["uri_report"])
api_router.include_router(ignore.router, prefix="/ignore", tags=["ignore"])
api_router.include_router(scheduler.router, prefix="/scheduler", tags=["scheduler"])
api_router.include_router(trigger.router, prefix="/trigger", tags=["trigger"])
