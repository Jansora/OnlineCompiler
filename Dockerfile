FROM ubuntu:18.04

COPY ./sources.list /etc/apt/sources.list

RUN cat /etc/apt/sources.list
RUN rm -rf /var/lib/apt/lists/*
RUN apt-get update

RUN apt-get install openjdk-11-jdk golang python3

RUN mkdir -p /app

WORKDIR /app

COPY . /app

EXPOSE 9002/udp
EXPOSE 9002/tcp

