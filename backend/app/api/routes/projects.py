# Created by xdd at 2024/6/17
from fastapi_pagination import Page
from sqlalchemy import select
from fastapi import APIRouter, HTTPException

from app.crud import update_entity
from app.models import ProjectNameMappingPublic, ProjectNameMapping, ProjectNameMappingCreate, ProjectNameMappingUpdate
from app.api.deps import SessionDep
from fastapi_pagination.ext.sqlalchemy import paginate

router = APIRouter()


@router.get("/", response_model=Page[ProjectNameMappingPublic])
def read_project_mappings(session: SessionDep) -> Page[ProjectNameMappingPublic]:
    """
    Retrieve project name mappings.
    """
    pages = paginate(session, select(ProjectNameMapping).order_by(ProjectNameMapping.id))
    return pages


@router.post("/", response_model=ProjectNameMappingPublic)
def create_project_mapping(mapping: ProjectNameMappingCreate, session: SessionDep):
    db_mapping = ProjectNameMapping.from_orm(mapping)
    session.add(db_mapping)
    session.commit()
    session.refresh(db_mapping)
    return db_mapping


@router.get("/{mapping_id}", response_model=ProjectNameMappingPublic)
def read_project_mapping(mapping_id: int, session: SessionDep):
    mapping = session.get(ProjectNameMapping, mapping_id)
    if not mapping:
        raise HTTPException(status_code=404, detail="Project name mapping not found")
    return mapping


@router.patch("/{mapping_id}", response_model=ProjectNameMappingPublic)
def update_project_mapping(mapping_id: int, mapping_update: ProjectNameMappingUpdate, session: SessionDep):
    return update_entity(mapping_id, mapping_update, session, ProjectNameMapping)


@router.delete("/{mapping_id}", response_model=ProjectNameMappingPublic)
def delete_project_mapping(mapping_id: int, session: SessionDep):
    mapping = session.get(ProjectNameMapping, mapping_id)
    if not mapping:
        raise HTTPException(status_code=404, detail="Project name mapping not found")
    session.delete(mapping)
    session.commit()
    return mapping
