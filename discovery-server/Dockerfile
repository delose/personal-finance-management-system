# Example Dockerfile for discovery-server
FROM eclipse-temurin:17-jre-jammy
VOLUME /tmp
COPY target/discovery-server-0.0.1-SNAPSHOT.jar discovery-server.jar
ENTRYPOINT ["java","-jar","/discovery-server.jar"]