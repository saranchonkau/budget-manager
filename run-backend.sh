#!/usr/bin/env sh

WORKING_DIR=$(pwd)
DB_DIR=$WORKING_DIR/packages/backend/db
POSTGRES_DATA_DIR=/var/lib/postgresql/data



docker run \
  --name budget-manager-postgres \
  --detach \
  --publish 5432:5432 \
  --env POSTGRES_USER=postgres \
  --env POSTGRES_PASSWORD=1234567 \
  --env POSTGRES_DB=budget-manager \
  --env PGDATA=$POSTGRES_DATA_DIR/pgdata \
  --volume $DB_DIR/data:$POSTGRES_DATA_DIR \
  --network budget-manager-network \
  postgres:14-alpine

docker run \
  --name budget-manager-backend \
  --detach \
  --publish 9000:9000 \
  --network budget-manager-network \
  budget-manager-backend-image
