FROM python:3.12-slim

WORKDIR /

COPY . .


CMD ["cd","backend","python","-m","main"]