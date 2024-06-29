# Stage 0: Build frontend
FROM node:20 as frontend-build

WORKDIR /frontend

COPY frontend/package*.json ./

RUN npm install

COPY frontend/ ./

ARG VITE_API_URL=${VITE_API_URL}

RUN npm run build

# Stage 1: Build backend and combine with frontend
FROM python:3.10

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

LABEL maintainer="xdd <xdd7520@gmail.com>"


#COPY ./start.sh /start.sh
RUN #chmod +x /start.sh


COPY ./backend/start-reload.sh /start-reload.sh
RUN chmod +x /start-reload.sh

COPY ./backend/app /app

ENV PYTHONPATH=/app

EXPOSE 8080

WORKDIR /app/

# Install Poetry
RUN curl -sSL https://install.python-poetry.org | POETRY_HOME=/opt/poetry python && \
    cd /usr/local/bin && \
    ln -s /opt/poetry/bin/poetry && \
    poetry config virtualenvs.create false

# Copy poetry.lock* in case it doesn't exist in the repo
COPY ./backend/pyproject.toml ./backend/poetry.lock* /app/

# Allow installing dev dependencies to run tests
ARG INSTALL_DEV=false
RUN bash -c "if [ $INSTALL_DEV == 'true' ] ; then poetry install --no-root ; else poetry install --no-root --only main ; fi"

ENV PYTHONPATH=/app

COPY ./backend/scripts/ /app/

COPY ./backend/alembic.ini /app/

COPY ./backend/prestart.sh /app/

COPY ./backend/tests-start.sh /app/

COPY ./backend/app /app/app


# Run the start script, it will check for an /app/prestart.sh script (e.g. for migrations)
# And then will start Gunicorn with Uvicorn
#CMD ["/start.sh"]
#CMD ["/start-reload.sh"]
#CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "880"]


# Install Nginx
RUN apt-get update && apt-get install -y nginx

# Copy frontend build from previous stage
COPY --from=frontend-build /frontend/dist /usr/share/nginx/html

# Copy Nginx configurations
COPY ./frontend/nginx.conf /etc/nginx/conf.d/default.conf
COPY ./frontend/nginx-backend-not-found.conf /etc/nginx/extra-conf.d/backend-not-found.conf

# Expose port 80 for Nginx
EXPOSE 80

# Start Nginx and Uvicorn
CMD service nginx start && ["/start-reload.sh"]