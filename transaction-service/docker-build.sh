#!/bin/bash

npm run build
docker build -t transaction-service .

