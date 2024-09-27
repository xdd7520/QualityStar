import uuid
from datetime import datetime
from enum import Enum

from pydantic import EmailStr
from sqlmodel import Field, Relationship, SQLModel
from typing import Generic, List, TypeVar, Optional
from sqlalchemy import Column, DateTime, VARCHAR, Boolean, String, Integer


# Shared properties
class UserBase(SQLModel):
    email: EmailStr = Field(unique=True, index=True, max_length=255)
    is_active: bool = True
    is_superuser: bool = False
    full_name: str | None = Field(default=None, max_length=255)
    role_id: uuid.UUID | None = Field(default=None, foreign_key="role.id")


# Properties to receive via API on creation
class UserCreate(UserBase):
    password: str = Field(min_length=8, max_length=40)


class UserRegister(SQLModel):
    email: EmailStr = Field(max_length=255)
    password: str = Field(min_length=8, max_length=40)
    full_name: str | None = Field(default=None, max_length=255)


# Properties to receive via API on update, all are optional
class UserUpdate(UserBase):
    email: EmailStr | None = Field(default=None, max_length=255)  # type: ignore
    password: str | None = Field(default=None, min_length=8, max_length=40)


class UserUpdateMe(SQLModel):
    full_name: str | None = Field(default=None, max_length=255)
    email: EmailStr | None = Field(default=None, max_length=255)


class UpdatePassword(SQLModel):
    current_password: str = Field(min_length=8, max_length=40)
    new_password: str = Field(min_length=8, max_length=40)


# Role model
class RoleBase(SQLModel):
    name: str = Field(index=True, unique=True)
    description: str | None = None


class RoleCreate(RoleBase):
    pass


class RoleUpdate(RoleBase):
    name: str | None = None
    description: str | None = None


class RolePublic(RoleBase):
    id: uuid.UUID


# 更新现有的Role模型
class Role(RoleBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    users: list["User"] = Relationship(back_populates="role")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow, sa_column_kwargs={"onupdate": datetime.utcnow})


# Database model, database table inferred from class name
class User(UserBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    hashed_password: str
    items: list["Item"] = Relationship(back_populates="owner", cascade_delete=True)
    role: Role | None = Relationship(back_populates="users")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow, sa_column_kwargs={"onupdate": datetime.utcnow})


# Properties to return via API, id is always required
class UserPublic(UserBase):
    id: uuid.UUID


# Shared properties
class ItemBase(SQLModel):
    title: str = Field(min_length=1, max_length=255)
    description: str | None = Field(default=None, max_length=255)


# Properties to receive on item creation
class ItemCreate(ItemBase):
    pass


# Properties to receive on item update
class ItemUpdate(ItemBase):
    title: str | None = Field(default=None, min_length=1, max_length=255)  # type: ignore


# Database model, database table inferred from class name
class Item(ItemBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    title: str = Field(max_length=255)
    owner_id: uuid.UUID = Field(
        foreign_key="user.id", nullable=False, ondelete="CASCADE"
    )
    owner: User | None = Relationship(back_populates="items")


# Properties to return via API, id is always required
class ItemPublic(ItemBase):
    id: uuid.UUID
    owner_id: uuid.UUID


# Generic message
class Message(SQLModel):
    message: str


# JSON payload containing access token
class Token(SQLModel):
    access_token: str
    token_type: str = "bearer"


# Contents of JWT token
class TokenPayload(SQLModel):
    sub: str | None = None


class NewPassword(SQLModel):
    token: str
    new_password: str = Field(min_length=8, max_length=40)


T = TypeVar('T')


class PaginatedResponse(SQLModel, Generic[T]):
    data: List[T]
    total: int
    page: int
    size: int
    pages: int


class URIItem(SQLModel):
    url: str | None = None
    method: str | None = None
    description: str | None = None
    is_active: bool = False


class DataURIItems(SQLModel):
    name: str
    url_list: list[URIItem]
    base_url: str


class ReportRUI(SQLModel):
    data: list[DataURIItems]


class IgnoreUriBase(SQLModel):
    uri: str
    description: str


class IgnoreInterface(IgnoreUriBase, table=True):
    __tablename__ = "ignore_interface"
    id: int | None = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow, sa_column_kwargs={"onupdate": datetime.utcnow})


class IgnoreList(SQLModel):
    data: list[IgnoreUriBase]


class IgnoreCreate(SQLModel):
    uri: str
    description: str


class IgnoreUpdate(SQLModel):
    uri: str | None = None
    description: str | None = None


class IgnoreOut(SQLModel):
    uri: str
    description: str
    id: int
    created_at: datetime
    updated_at: datetime


class ActionEnum(str, Enum):
    # 自动化框架上传接口
    UPLOAD = "upload"
    # 查询 Prometheus
    QUERY = "query"
    # 如果有其他动作，可以在这里添加
    OTHER_ACTION = "other_action"


class ProjectNameMapping(SQLModel, table=True):
    __tablename__ = "project_name_mapping"
    id: int = Field(default=None, primary_key=True, description="主键")
    upload_name: str = Field(sa_column=Column(String, comment="上传名称"))
    eureka_name: str = Field(sa_column=Column(String, comment="Eureka 名称"))
    name: str = Field(sa_column=Column(String, comment="项目名称"))
    description: str = Field(sa_column=Column(String, comment="描述"))
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow, sa_column_kwargs={"onupdate": datetime.utcnow})
    gather_interfaces: list['GatherInterface'] = Relationship(back_populates="project_name_mapping")


class ProjectNameMappingBase(SQLModel):
    upload_name: str
    eureka_name: str
    name: str
    description: str


class ProjectNameMappingList(SQLModel):
    data: List[ProjectNameMappingBase]


class ProjectNameMappingCreate(SQLModel):
    upload_name: str
    eureka_name: str
    name: str
    description: str


class ProjectNameMappingUpdate(SQLModel):
    upload_name: str | None = None
    eureka_name: str | None = None
    name: str | None = None
    description: str | None = None


class ProjectNameMappingOut(SQLModel):
    id: int
    upload_name: Optional[str]
    eureka_name: str
    name: Optional[str]
    description: Optional[str]
    created_at: datetime
    updated_at: datetime


class TransactionLog(SQLModel, table=True):
    __tablename__ = "transaction_log"
    id: int = Field(default=None, primary_key=True, description="主键")
    action_time: datetime = Field(default_factory=datetime.now, sa_column=Column(DateTime(), comment="执行时间"))
    action: ActionEnum = Field(sa_column=Column(String, comment="动作"))
    details: str = Field(sa_column=Column(String, comment="详细信息"))
    name: str = Field(sa_column=Column(String, comment="项目名称"))
    count: int = Field(sa_column=Column(Integer, comment="数量"))
    batch_id: str = Field(default_factory=lambda: str(uuid.uuid4()), sa_column=Column(String, comment="批次号"))


class GatherInterface(URIItem, table=True):
    __tablename__ = "gather_interface"
    id: int = Field(default=None, primary_key=True, description="主键")
    url: str = Field(sa_column=Column(VARCHAR(), comment="接口路径"))
    project_name_mapping_id: int = Field(default=None, foreign_key="project_name_mapping.id",
                                         description="项目名称映射ID")
    method: str = Field(sa_column=Column(VARCHAR(), comment="请求方法"))
    description: str = Field(sa_column=Column(VARCHAR(), comment="接口描述"))
    is_active: bool = Field(default=False, sa_column=Column(Boolean(), comment="是否已实现自动化"))
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow, sa_column_kwargs={"onupdate": datetime.utcnow})
    project_name_mapping: ProjectNameMapping = Relationship(back_populates="gather_interfaces")


class UploadInterface(SQLModel, table=True):
    __tablename__ = "upload_interface"
    id: int = Field(default=None, primary_key=True, description="主键")
    url: str = Field(sa_column=Column(VARCHAR(), comment="接口路径"))
    name: str = Field(default=None, description="自动化脚步定义名称")
    method: str = Field(sa_column=Column(VARCHAR(), comment="请求方法"))
    description: str = Field(sa_column=Column(VARCHAR(), comment="接口描述"))
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow, sa_column_kwargs={"onupdate": datetime.utcnow})
