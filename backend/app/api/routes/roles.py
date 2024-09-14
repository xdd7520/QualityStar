import math
import uuid
from typing import Any

from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import select, func

from app.api.deps import SessionDep, get_current_active_superuser, pagination_params
from app.models import Role, RoleCreate, RoleUpdate, RolePublic, PaginatedResponse

router = APIRouter()


@router.post("/", response_model=RolePublic, dependencies=[Depends(get_current_active_superuser)])
def create_role(*, session: SessionDep, role_in: RoleCreate) -> Any:
    db_role = Role.from_orm(role_in)
    session.add(db_role)
    session.commit()
    session.refresh(db_role)
    return db_role


@router.get("/", response_model=PaginatedResponse[RolePublic])
def read_roles(
        session: SessionDep,
        pagination: tuple[int, int] = Depends(pagination_params)
) -> PaginatedResponse[RolePublic]:
    page, size = pagination
    offset = (page - 1) * size

    total = session.exec(select(func.count()).select_from(Role)).one()
    roles = session.exec(select(Role).offset(offset).limit(size)).all()

    return PaginatedResponse(
        data=roles,
        total=total,
        page=page,
        size=size,
        pages=math.ceil(total / size)
    )


@router.get("/{role_id}", response_model=RolePublic)
def read_role(*, session: SessionDep, role_id: uuid.UUID) -> Any:
    role = session.get(Role, role_id)
    if not role:
        raise HTTPException(status_code=404, detail="Role not found")
    return role


@router.put("/{role_id}", response_model=RolePublic, dependencies=[Depends(get_current_active_superuser)])
def update_role(*, session: SessionDep, role_id: uuid.UUID, role_in: RoleUpdate) -> Any:
    db_role = session.get(Role, role_id)
    if not db_role:
        raise HTTPException(status_code=404, detail="Role not found")
    role_data = role_in.dict(exclude_unset=True)
    for key, value in role_data.items():
        setattr(db_role, key, value)
    session.add(db_role)
    session.commit()
    session.refresh(db_role)
    return db_role


@router.delete("/{role_id}", dependencies=[Depends(get_current_active_superuser)])
def delete_role(*, session: SessionDep, role_id: uuid.UUID) -> Any:
    db_role = session.get(Role, role_id)
    if not db_role:
        raise HTTPException(status_code=404, detail="Role not found")
    session.delete(db_role)
    session.commit()
    return {"ok": True}
