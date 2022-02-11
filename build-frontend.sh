#!/usr/bin/env sh

docker build \
  --tag budget-manager-frontend-image \
  --file ./packages/frontend/docker/Dockerfile \
  --build-arg BACKEND_URL=http://localhost:9000 \
  .