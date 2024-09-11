# Example Dockerfile for expense-service
FROM openjdk:17-jdk-slim
VOLUME /tmp
COPY target/expense-service-0.0.1-SNAPSHOT.jar expense-service.jar
ENTRYPOINT ["java","-jar","/expense-service.jar"]