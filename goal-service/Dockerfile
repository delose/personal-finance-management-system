# Example Dockerfile for goal-service
FROM openjdk:17-jdk-slim
VOLUME /tmp
COPY target/goal-service-0.0.1-SNAPSHOT.jar goal-service.jar
ENTRYPOINT ["java","-jar","/goal-service.jar"]