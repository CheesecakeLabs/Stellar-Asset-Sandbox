FROM node:16.13-bullseye-slim AS base
WORKDIR /app
RUN apt-get update && apt-get install make
COPY . .
RUN make clean_install_dev

FROM base AS local
ENTRYPOINT [ "make", "start_dev"]

FROM base AS builder
ARG REACT_APP_API_URL
ARG REACT_APP_SENTRY_DSN
ENV REACT_APP_API_URL=${REACT_APP_API_URL:?"ERR: REACT_APP_API_URL not set in Dockerfile"}
ENV REACT_APP_SENTRY_DSN=${REACT_APP_SENTRY_DSN:?"ERR: REACT_APP_SENTRY_DSN not set in Dockerfile"}
RUN make build

FROM node:16.13-bullseye-slim AS remote
WORKDIR /app
RUN apt-get update && apt-get install make
RUN npm install -g serve
COPY Makefile Makefile
COPY --from=builder /app/build/ /app/build/
ENTRYPOINT [ "make", "serve" ]
