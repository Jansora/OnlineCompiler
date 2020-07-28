FROM ubuntu:18.04

RUN apt update && apt install ca-certificates -y

COPY ./sources.list /etc/apt/sources.list

RUN cat /etc/apt/sources.list
RUN rm -rf /var/lib/apt/lists/*
RUN apt-get update

RUN apt-get install nginx openjdk-11-jdk golang python3 python3-pip nodejs -y

RUN mkdir -p /app

WORKDIR /app

COPY . .

COPY ./nginx.conf /etc/nginx/nginx.conf



RUN ls -l

RUN pip3 list

RUN pip3 install tornado -i https://pypi.tuna.tsinghua.edu.cn/simple


CMD ["service", "nginx", "start", " && ", "python3", "backend/serve.py"]





