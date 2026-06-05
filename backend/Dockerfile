FROM python:3.12-slim as dev

WORKDIR /backend

RUN apt-get update && apt-get install -y \ 
  build-essential \  
  default-libmysqlclient-dev \
  pkg-config 

COPY requirements.txt .

RUN pip install --user --no-cache-dir -r requirements.txt && \
  rm -rf /root/.cache/pip


FROM python:3.12-slim

WORKDIR /backend

COPY --from=dev /root/.local /root/.local

COPY . .

ENV PATH=/root/.local/bin:$PATH
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

RUN apt-get update && apt-get install -y --no-install-recommends \
  libmariadb3 \
  && rm -rf /var/lib/apt/lists/*

CMD ["python","app.py"]