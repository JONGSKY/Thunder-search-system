# pull official base image
#FROM python:3.8.5-alpine
FROM python:3.8

# set work directory
WORKDIR /usr/src/app

# set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# # install psycopg2 dependencies
# RUN apk update \
#     && apk add postgresql-dev gcc python3-dev musl-dev 

RUN apt update

#RUN apt install musl-dev mariadb-dev gcc netcat-openbsd
RUN apt install gcc 

# install dependencies
RUN pip install --upgrade pip
RUN /usr/local/bin/python -m pip install --upgrade pip
RUN pip --version
COPY ./requirements.txt .
RUN pip install -r requirements.txt

RUN pip install mysqlclient


# copy entrypoint.sh
COPY ./entrypoint.sh .

# copy project
# COPY . .

# run entrypoint.sh
ENTRYPOINT ["/usr/src/app/entrypoint.sh"]