FROM alpine:latest

ARG PB_VERSION=0.30.0

RUN apk add --no-cache \
    unzip \
    ca-certificates

# download and unzip PocketBase
ADD https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_linux_amd64.zip /tmp/pb.zip
RUN unzip /tmp/pb.zip -d /pb/ && rm /tmp/pb.zip

# Set working directory
WORKDIR /pb


# Start PocketBase
# Wipes data each boot (ephemeral for Railway free plan)
CMD rm -rf /pb/pb_data && ./pocketbase serve --http=0.0.0.0:${PORT}
