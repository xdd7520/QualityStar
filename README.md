
## 开发环境配置

### 配置
更新 `.env` 文件中的配置来自定义您的设置。

在部署之前，请确保至少更改以下值： 
- `SECRET_KEY` 
- `FIRST_SUPERUSER_PASSWORD` 
- `POSTGRES_PASSWORD`
### 生成密钥

`.env` 文件中的某些环境变量默认值为 `changethis`。

您需要用一个密钥替换它们，生成密钥可以运行以下命令：

```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```


`.env` 配置文件说明

- `project_name`: （默认值：`"FastAPI Project"`）项目名称，显示给API用户（在.env文件中）。 
- `stack_name`: （默认值：`"fastapi-project"`）用于Docker Compose标签的堆栈名称（无空格）（在.env文件中）。 
- `secret_key`: （默认值：`"changethis"`）项目的密钥，用于安全保护，存储在.env文件中，您可以使用上述方法生成一个。 
- `first_superuser`: （默认值：`"admin@example.com"`）第一个超级用户的电子邮件（在.env文件中）。 
- `first_superuser_password`: （默认值：`"changethis"`）第一个超级用户的密码（在.env文件中）。 
- `smtp_host`: （默认值：""）用于发送电子邮件的SMTP服务器主机，您可以稍后在.env文件中设置。 
- `smtp_user`: （默认值：""）用于发送电子邮件的SMTP服务器用户，您可以稍后在.env文件中设置。 
- `smtp_password`: （默认值：""）用于发送电子邮件的SMTP服务器密码，您可以稍后在.env文件中设置。 
- `emails_from_email`: （默认值：`"info@example.com"`）发送电子邮件的账户，您可以稍后在.env文件中设置。 
- `postgres_password`: （默认值：`"changethis"`）PostgreSQL数据库的密码，存储在.env文件中，您可以使用上述方法生成一个。 
- `sentry_dsn`: （默认值：""）如果您在使用Sentry，其DSN，您可以稍后在.env文件中设置。


- # FastAPI项目 - 后端
## 要求 
- [Docker](https://www.docker.com/) 。 
- [Poetry](https://python-poetry.org/)  用于Python包和环境管理。
## 本地开发
- 使用Docker Compose启动堆栈：

```bash
docker compose up -d
```


- 现在您可以打开浏览器，并与以下URLs交互：

前端，使用Docker构建，根据路径处理路由：[http://localhost](http://localhost/) 

后端，基于OpenAPI的JSON web API：[http://localhost/api/](http://localhost/api/) 

自动交互式文档与Swagger UI（来自OpenAPI后端）：[http://localhost/docs](http://localhost/docs) 

Adminer，数据库网络管理：[http://localhost:8080](http://localhost:8080/) 

Traefik UI，查看代理如何处理路由：[http://localhost:8090](http://localhost:8090/) 

**注意** ：第一次启动堆栈时，可能需要一分钟时间才能准备好。后端在等待数据库准备好并配置一切时。您可以检查日志以监控它。

检查日志，运行：

```bash
docker compose logs
```



检查特定服务的日志，添加服务名称，例如：

```bash
docker compose logs backend
```



如果您的Docker不是运行在`localhost`（上面的URL将不起作用），您需要使用Docker运行的IP或域名。
## 后端本地开发的其他详细信息
### 常规工作流程

默认情况下，依赖关系由[Poetry](https://python-poetry.org/) 管理，前往那里安装它。

`pip install poetry`

从`./backend/`目录，您可以安装所有依赖项：

```bash
poetry install
```



然后您可以开始一个带有新环境的shell会话(或者自己启动的虚拟环境)：

```bash
poetry shell
```



确保您的编辑器使用正确的Python虚拟环境。

修改或添加SQLModel模型用于数据和SQL表在`./backend/app/models.py`，API端点在`./backend/app/api/`，CRUD（创建，读取，更新，删除）工具在`./backend/app/crud.py`。

### 准备开发
 > 请注意查看脚本：[prestart.sh](backend/prestart.sh) 手动执行里面的脚本 


- Alembic已经配置好从`./backend/app/models.py`导入您的SQLModel模型。 
- 修改模型后（例如，添加列），在容器内创建修订版，例如：


```console
$ alembic revision --autogenerate -m "Add column last_name to User model"
```

 
- 将在alembic目录生成的文件提交到git仓库。 
- 创建修订版后，在数据库中运行迁移（这实际上会更改数据库）：

```console
$ alembic upgrade head
```



如果您根本不想使用alembic，可以取消注释`./backend/app/db/init_db.py`文件中以以下内容结束的行：

```python
SQLModel.metadata.create_all(engine)
```



并注释`prestart.sh`文件中包含的行：

```console
$ alembic upgrade head
```



如果您不想从默认模型开始，并想从一开始就移除或修改它们，而且没有任何之前的修订，您可以删除`./backend/app/alembic/versions/`下的修订文件（`.py` Python文件）。然后按照上述描述创建第一个迁移。


### 启动项目
```bash
 poetry run uvicorn app.main:app --reload
```