# Example Dockerfile for messaging-service
FROM openjdk:17-jdk-slim
VOLUME /tmp
COPY target/messaging-service-0.0.1-SNAPSHOT.jar messaging-service.jar
ENTRYPOINT ["java","-jar","/messaging-service.jar"]