FROM golang:1.20.3

RUN mkdir /app
ADD . /app

WORKDIR /app

RUN go mod download
RUN go build -o main .

EXPOSE 8080
CMD ["/app/main"]