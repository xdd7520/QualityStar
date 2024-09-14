import math
import uuid
from typing import Any

from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import select, func

from app import crud
from app.api.deps import CurrentUser, SessionDep, get_current_active_superuser, pagination_params
from app.models import Item, ItemCreate, ItemUpdate, ItemPublic, PaginatedResponse

router = APIRouter()


@router.get("/", response_model=PaginatedResponse[ItemPublic])
def read_items(
        session: SessionDep,
        current_user: CurrentUser,
        pagination: tuple[int, int] = Depends(pagination_params)
) -> PaginatedResponse[ItemPublic]:
    """
    Retrieve items with pagination.
    """
    page, size = pagination
    offset = (page - 1) * size

    if current_user.is_superuser:
        total = session.exec(select(func.count()).select_from(Item)).one()
        items = session.exec(select(Item).offset(offset).limit(size)).all()
    else:
        total = session.exec(select(func.count(Item.id)).where(Item.owner_id == current_user.id)).one()
        items = session.exec(select(Item).where(Item.owner_id == current_user.id).offset(offset).limit(size)).all()

    return PaginatedResponse(
        data=items,
        total=total,
        page=page,
        size=size,
        pages=math.ceil(total / size)
    )


@router.post("/", response_model=ItemPublic)
def create_item(
        *,
        session: SessionDep,
        item_in: ItemCreate,
        current_user: CurrentUser,
) -> Any:
    """
    Create new item.
    """
    item = crud.create_item(session=session, item_in=item_in, owner_id=current_user.id)
    return item


@router.put("/{id}", response_model=ItemPublic)
def update_item(
        *,
        session: SessionDep,
        id: uuid.UUID,
        item_in: ItemUpdate,
        current_user: CurrentUser,
) -> Any:
    """
    Update an item.
    """
    item = session.get(Item, id)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    if not current_user.is_superuser and (item.owner_id != current_user.id):
        raise HTTPException(status_code=400, detail="Not enough permissions")
    item_data = item_in.dict(exclude_unset=True)
    for field, value in item_data.items():
        setattr(item, field, value)
    session.add(item)
    session.commit()
    session.refresh(item)
    return item


@router.get("/{id}", response_model=ItemPublic)
def read_item(
        *,
        session: SessionDep,
        id: uuid.UUID,
        current_user: CurrentUser,
) -> Any:
    """
    Get item by ID.
    """
    item = session.get(Item, id)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    if not current_user.is_superuser and (item.owner_id != current_user.id):
        raise HTTPException(status_code=400, detail="Not enough permissions")
    return item


@router.delete("/{id}", response_model=ItemPublic)
def delete_item(
        *,
        session: SessionDep,
        id: uuid.UUID,
        current_user: CurrentUser,
) -> Any:
    """
    Delete an item.
    """
    item = session.get(Item, id)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    if not current_user.is_superuser and (item.owner_id != current_user.id):
        raise HTTPException(status_code=400, detail="Not enough permissions")
    session.delete(item)
    session.commit()
    return item
