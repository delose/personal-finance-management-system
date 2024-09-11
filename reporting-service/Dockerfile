# Example Dockerfile for reporting-service
FROM openjdk:17-jdk-slim
VOLUME /tmp
COPY target/reporting-service-0.0.1-SNAPSHOT.jar reporting-service.jar
ENTRYPOINT ["java","-jar","/reporting-service.jar"]