#!/bin/bash

./docker-build.sh && ./stop-remote-docker.sh && ./run-docker.sh

