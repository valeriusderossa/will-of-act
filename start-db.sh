#!/bin/bash
cd woa-be
docker-compose up -d postgres
echo "PostgreSQL container starting..."
sleep 5
echo "Database should be available on localhost:6666"
