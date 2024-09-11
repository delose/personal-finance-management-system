mvn clean package -DskipTests
docker build -t delose/messaging-service:latest .
