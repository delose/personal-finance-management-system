# Example Dockerfile for config-server
FROM eclipse-temurin:17-jre-jammy
VOLUME /tmp
COPY target/config-server-0.0.1-SNAPSHOT.jar config-server.jar
ENTRYPOINT ["java","-jar","/config-server.jar"]