# Example Dockerfile for discovery-server
FROM openjdk:17-jdk-slim
VOLUME /tmp
COPY target/discovery-server-0.0.1-SNAPSHOT.jar discovery-server.jar
ENTRYPOINT ["java","-jar","/discovery-server.jar"]