import uuid
from typing import Any

from sqlmodel import Session, select

from app.core.security import get_password_hash, verify_password
from app.models import Item, ItemCreate, User, UserCreate, UserUpdate, Role, RoleCreate, RoleUpdate


def create_user(*, session: Session, user_create: UserCreate) -> User:
    db_obj = User.model_validate(
        user_create, update={"hashed_password": get_password_hash(user_create.password)}
    )
    if user_create.role_id:
        db_obj.role = session.get(Role, user_create.role_id)
    session.add(db_obj)
    session.commit()
    session.refresh(db_obj)
    return db_obj


def update_user(*, session: Session, db_user: User, user_in: UserUpdate) -> Any:
    user_data = user_in.model_dump(exclude_unset=True)
    if "password" in user_data:
        hashed_password = get_password_hash(user_data["password"])
        del user_data["password"]
        user_data["hashed_password"] = hashed_password
    if "role_id" in user_data:
        db_user.role = session.get(Role, user_data["role_id"])
        del user_data["role_id"]
    for field, value in user_data.items():
        setattr(db_user, field, value)
    session.add(db_user)
    session.commit()
    session.refresh(db_user)
    return db_user


def get_user_by_email(*, session: Session, email: str) -> User | None:
    statement = select(User).where(User.email == email)
    session_user = session.exec(statement).first()
    return session_user


def authenticate(*, session: Session, email: str, password: str) -> User | None:
    db_user = get_user_by_email(session=session, email=email)
    if not db_user:
        return None
    if not verify_password(password, db_user.hashed_password):
        return None
    return db_user


def create_item(*, session: Session, item_in: ItemCreate, owner_id: uuid.UUID) -> Item:
    db_item = Item.model_validate(item_in, update={"owner_id": owner_id})
    session.add(db_item)
    session.commit()
    session.refresh(db_item)
    return db_item


def create_role(session: Session, role: RoleCreate) -> Role:
    db_role = Role.from_orm(role)
    session.add(db_role)
    session.commit()
    session.refresh(db_role)
    return db_role


def get_role(session: Session, role_id: uuid.UUID) -> Role | None:
    return session.get(Role, role_id)


def update_role(session: Session, db_role: Role, role_in: RoleUpdate) -> Role:
    role_data = role_in.dict(exclude_unset=True)
    for key, value in role_data.items():
        setattr(db_role, key, value)
    session.add(db_role)
    session.commit()
    session.refresh(db_role)
    return db_role


def delete_role(session: Session, role_id: uuid.UUID) -> None:
    role = session.get(Role, role_id)
    if role:
        session.delete(role)
        session.commit()
