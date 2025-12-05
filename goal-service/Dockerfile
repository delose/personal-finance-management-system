# Example Dockerfile for goal-service
FROM eclipse-temurin:17-jre-jammy
VOLUME /tmp
COPY target/goal-service-0.0.1-SNAPSHOT.jar goal-service.jar
ENTRYPOINT ["java","-jar","/goal-service.jar"]