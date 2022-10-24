FROM ubuntu:20.04

# 解决中文乱码问题
ENV LANG C.UTF-8
ENV LC_CTYPE=C.UTF-8


RUN apt update && apt install ca-certificates -y

COPY ./sources.list /etc/apt/sources.list

RUN cat /etc/apt/sources.list
RUN rm -rf /var/lib/apt/lists/*

RUN apt-get update
RUN apt update
RUN apt install tzdata -y


# 添加时区环境变量，亚洲，上海
ENV TimeZone=Asia/Shanghai
# 使用软连接，并且将时区配置覆盖/etc/timezone
RUN ln -snf /usr/share/zoneinfo/$TimeZone /etc/localtime
RUN echo $TimeZone > /etc/timezone



RUN apt-get install nginx openjdk-17-jdk golang python3 python3-pip nodejs -y

RUN pip3 install tornado -i https://pypi.tuna.tsinghua.edu.cn/simple

RUN mkdir -p /app

WORKDIR /app

COPY ./backend ./backend

COPY ./frontend ./frontend

COPY ./nginx.conf /etc/nginx/nginx.conf


CMD ["sh","-c", "service nginx restart && python3 backend/serve.py"]





