#!/usr/bin/env sh

WORKING_DIR=/Users/ivan_saranchonkau/work/budget-manager/packages/backend/db
docker stop budget-manager-postgres
docker rm budget-manager-postgres
rm -rf $WORKING_DIR/data
