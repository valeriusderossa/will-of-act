#!/bin/bash

echo "Starting PostgreSQL database..."
cd woa-be
docker-compose up -d postgres

echo "Waiting for database to be ready..."
sleep 10

echo "Starting backend application with local profile..."
./gradlew bootRun --args='--spring.profiles.active=local'
