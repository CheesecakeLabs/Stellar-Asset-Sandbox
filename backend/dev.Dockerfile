# Base image, golang 1.18
FROM golang:1.20.3
WORKDIR /workspace
# Copy all files into the image
COPY . .
# Run go mod
RUN go mod download
RUN go run -tags migrate .
# Expose ports
EXPOSE 8080
# Run Go program, just like locally
ENTRYPOINT ["go","run","main.go"]