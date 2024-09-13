#!/bin/bash

mvn clean package

# run spring boot jar
java -jar target/api-gateway-0.0.1-SNAPSHOT.jar
# mvn spring-boot:run

