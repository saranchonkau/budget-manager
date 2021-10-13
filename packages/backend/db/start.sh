#!/usr/bin/env sh

WORKING_DIR=/Users/ivan_saranchonkau/work/budget-manager/packages/backend/db
docker run --detach --name budget-manager-postgres --publish 5432:5432 --env-file $WORKING_DIR/.env.local --volume $WORKING_DIR/data:/var/lib/postgresql/data postgres:14-alpine
