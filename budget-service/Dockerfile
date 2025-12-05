# Example Dockerfile for budget-service
FROM eclipse-temurin:17-jre-jammy
VOLUME /tmp
COPY target/budget-service-0.0.1-SNAPSHOT.jar budget-service.jar
ENTRYPOINT ["java","-jar","/budget-service.jar"]