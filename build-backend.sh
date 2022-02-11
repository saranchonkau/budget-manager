#!/usr/bin/env sh

docker build \
  --tag budget-manager-backend-image \
  --file ./packages/backend/docker/Dockerfile \
  --build-arg DATABASE_USER=postgres \
  --build-arg DATABASE_PASSWORD=1234567 \
  --build-arg DATABASE_NAME=budget-manager \
  --build-arg JWT_SIGN_SECRET=myrS@@e7fTZdIT6$u^$POGkIOzchQ3 \
  --build-arg PORT=9000 \
  .