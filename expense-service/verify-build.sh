#!/bin/bash

docker run --rm -v "$(pwd)":/app -w /app php:8.2-cli-alpine php -r '
if (is_dir("dist") && count(scandir("dist")) > 2) {
    exit(0);
} else {
    exit(1);
}'
