FROM golang:1.20-alpine as base
ENV GOOS=linux
ENV GOARCH=amd64
ENV CGO_ENABLED=1
WORKDIR /workspace
RUN apk add build-base
COPY . .
RUN go mod download

FROM base as local
RUN go get github.com/githubnemo/CompileDaemon
RUN go install github.com/githubnemo/CompileDaemon
ENTRYPOINT CompileDaemon -build="go build -tags musl -o /build/app" -command="/build/app"

FROM base as builder
RUN go build -tags musl main.go

FROM scratch AS remote
WORKDIR /app
COPY --from=builder /workspace/main .
COPY --from=builder /lib/ld-musl-x86_64.so.1 /lib/ld-musl-x86_64.so.1
COPY --from=base /workspace/migrations ./migrations
ENTRYPOINT ["./main"]
