FROM ubuntu:20.04

RUN apt update && apt install ca-certificates -y

COPY ./deploy/dependencies/sources.list /etc/apt/sources.list

RUN cat /etc/apt/sources.list
RUN rm -rf /var/lib/apt/lists/*
RUN apt-get update

RUN apt-get install nginx openjdk-8-jdk golang python3 python3-pip nodejs -y

RUN pip3 install tornado -i https://pypi.tuna.tsinghua.edu.cn/simple

RUN mkdir -p /app

WORKDIR /app

COPY ./backend/ /app/server

COPY ./deploy/dependencies/nginx/nginx.conf /etc/nginx/nginx.conf
COPY deploy/dependencies/nginx/sites-enabled/app.conf /etc/nginx/sites-enabled/app.conf



CMD ["sh","-c", "service nginx start && python3 server/serve.py"]





