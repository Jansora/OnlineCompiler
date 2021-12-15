FROM ubuntu:18.04

RUN apt update && apt install ca-certificates -y

COPY ./deploy/dependencies/sources.list /etc/apt/sources.list

RUN cat /etc/apt/sources.list
RUN rm -rf /var/lib/apt/lists/*
RUN apt-get update

RUN apt-get install nginx openjdk-11-jdk golang python3 python3-pip nodejs -y

RUN pip3 install tornado -i https://pypi.tuna.tsinghua.edu.cn/simple

RUN mkdir -p /app

WORKDIR /app

COPY ./backend ./backend

COPY ./frontend ./frontend

COPY ./nginx.conf /etc/nginx/nginx.conf


CMD ["sh","-c", "service nginx restart && python3 backend/serve.py"]





