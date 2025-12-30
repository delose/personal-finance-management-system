#!/bin/bash

docker-compose down && docker-build.sh && docker-compose up --build -d
