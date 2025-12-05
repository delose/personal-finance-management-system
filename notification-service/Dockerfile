# Example Dockerfile for notification-service
FROM eclipse-temurin:17-jre-jammy
VOLUME /tmp
COPY target/notification-service-0.0.1-SNAPSHOT.jar notification-service.jar
ENTRYPOINT ["java","-jar","/notification-service.jar"]