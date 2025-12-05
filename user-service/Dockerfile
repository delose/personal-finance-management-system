# Example Dockerfile for user-service
FROM eclipse-temurin:17-jre-jammy
VOLUME /tmp
COPY target/user-service-0.0.1-SNAPSHOT.jar user-service.jar
ENTRYPOINT ["java","-jar","/user-service.jar"]