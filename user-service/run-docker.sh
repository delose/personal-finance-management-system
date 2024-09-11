#!/bin/bash

# •	-p <host_port>:<container_port>:
# •	<host_port> is the port on your host machine (i.e., your MacBook) that you want to map.
# •	<container_port> is the port that the application is listening on inside the Docker container.

docker run -d -p 8081:8080 --name user-service delose/user-service:latest


