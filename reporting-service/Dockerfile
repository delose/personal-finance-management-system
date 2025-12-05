# Example Dockerfile for reporting-service
FROM eclipse-temurin:17-jre-jammy
VOLUME /tmp
COPY target/reporting-service-0.0.1-SNAPSHOT.jar reporting-service.jar
ENTRYPOINT ["java","-jar","/reporting-service.jar"]