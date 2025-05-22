# Will of Act

A full-stack application for managing and displaying affirmations.

## Project Structure

- **woa-be**: Backend service built with Kotlin and Spring Boot (package: `org.woa`)
- **woa-fe**: Frontend service built with Angular

## Prerequisites

- Docker and Docker Compose
- JDK 17+ (for local development)
- Node.js 20+ (for local development)

## Getting Started

### Running with Docker Compose

1. Clone the repository
2. Navigate to the project root
3. Run the following command:

```bash
docker-compose up -d
```

This will start the following services:
- PostgreSQL database on port 5432
- Backend service on port 8080
- Frontend service on port 80

### Local Development

#### Backend

1. Navigate to the `woa-be` directory
2. Run the following commands:

```bash
./gradlew build
./gradlew bootRun
```

#### Frontend

1. Navigate to the `woa-fe` directory
2. Run the following commands:

```bash
npm install
npm start
```

## API Endpoints

### Affirmations

- `GET /api/affirmations` - Get all affirmations
- `GET /api/affirmations?activeOnly=true` - Get active affirmations
- `GET /api/affirmations/{id}` - Get affirmation by ID
- `GET /api/affirmations/category/{category}` - Get affirmations by category
- `GET /api/affirmations/random` - Get a random affirmation
- `GET /api/affirmations/random?category={category}` - Get a random affirmation by category
- `POST /api/affirmations` - Create a new affirmation
- `PUT /api/affirmations/{id}` - Update an affirmation
- `DELETE /api/affirmations/{id}` - Delete an affirmation
- `PATCH /api/affirmations/{id}/toggle` - Toggle affirmation status

## Examples

### Create an Affirmation

```bash
curl -X POST http://localhost:8080/api/affirmations \
  -H "Content-Type: application/json" \
  -d '{
    "text": "I am capable of achieving my goals.",
    "category": "Motivation",
    "author": "Personal",
    "isActive": true
  }'
```

### Get a Random Affirmation

```bash
curl http://localhost:8080/api/affirmations/random
```
# will-of-act
# will-of-act
