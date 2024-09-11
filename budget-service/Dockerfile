# Example Dockerfile for budget-service
FROM openjdk:17-jdk-slim
VOLUME /tmp
COPY target/budget-service-0.0.1-SNAPSHOT.jar budget-service.jar
ENTRYPOINT ["java","-jar","/budget-service.jar"]