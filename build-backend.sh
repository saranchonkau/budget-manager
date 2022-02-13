#!/usr/bin/env sh

docker build \
  --tag budget-manager-backend-image \
  --file ./packages/backend/docker/Dockerfile \
  .