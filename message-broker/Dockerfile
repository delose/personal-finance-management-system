# Example Dockerfile for message-broker
FROM eclipse-temurin:17-jre-jammy
VOLUME /tmp
COPY target/message-broker-0.0.1-SNAPSHOT.jar message-broker.jar
ENTRYPOINT ["java","-jar","/message-broker.jar"]