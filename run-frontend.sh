#!/usr/bin/env sh

docker run \
  --name budget-manager-frontend \
  --detach \
  --publish 8000:80 \
  --network budget-manager-network \
  budget-manager-frontend-image
