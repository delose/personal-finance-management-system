#!/bin/bash

mvn clean package

# run spring boot jar
java -jar target/config-server-0.0.1-SNAPSHOT.jar
# mvn spring-boot:run
# Note: no need to define any profile to use since we are using this as config server
