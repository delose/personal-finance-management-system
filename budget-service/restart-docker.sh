#!/bin/bash

./build.sh && ./stop-remote-docker.sh && ./docker-build.sh && ./run-docker.sh

