FROM gradle:8.6-jdk17-alpine AS build
WORKDIR /app
COPY . .
RUN gradle build --no-daemon -x test

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/build/libs/*.jar app.jar

# Add health check dependencies
RUN apk add --no-cache curl

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
