FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONNUMBUFFERED=1

WORKDIR /app

# Installation des dépendances système nécessaire pour MySQL

RUN apt-get update && apt-get install -y \
    default-libmysqlclient-dev \
    build-essential \
    pkg-config \
    && rm -rf /var/lib/apt-get/lists/*

COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirement.txt

COPY . /app/

EXPOSE 8000

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
