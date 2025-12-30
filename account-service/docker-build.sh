#!/bin/bash

npm run build
docker build -t account-service .

