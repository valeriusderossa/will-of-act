# Will of Act Backend (woa-be)

A Spring Boot backend application for managing personal development content including quotes, affirmations, thoughts, sentences, and technical learnings.

## Tech Stack

- **Kotlin** - Primary programming language
- **Spring Boot 3.4.5** - Application framework
- **Spring Data JPA** - Data persistence
- **PostgreSQL** - Primary database
- **H2** - Test database
- **Flyway** - Database migration
- **Gradle** - Build tool
- **JUnit 5** - Testing framework
- **MockK/Mockito** - Mocking framework

## Project Structure

```
src/
├── main/kotlin/org/woa/
│   ├── config/          # Configuration classes
│   ├── controller/      # REST controllers
│   ├── dto/            # Data transfer objects
│   ├── entity/         # JPA entities
│   ├── exception/      # Exception handling
│   ├── repository/     # Data access layer
│   └── service/        # Business logic
├── main/resources/
│   ├── db/migration/   # Flyway database migrations
│   └── application.yml # Application configuration
└── test/               # Test classes
```

## Features

### Technical Learning Management
- Full CRUD operations for technical learning notes
- Search functionality across all fields
- Language and subject categorization
- Text preview generation for performance
- Statistics and analytics

### Other Entities
- **Quotations** - Inspirational quotes management
- **Affirmations** - Personal affirmations
- **Thoughts** - General thoughts and ideas
- **Sentences** - Notable sentences and phrases

## API Endpoints

### Technical Learnings (`/api/learnings`)
- `GET /` - List all learnings (summary)
- `GET /{id}` - Get learning details
- `POST /` - Create new learning
- `PUT /{id}` - Update learning
- `DELETE /{id}` - Delete learning
- `GET /search?q={keyword}` - Search learnings
- `GET /by-language/{language}` - Get by language
- `GET /languages` - List all languages
- `GET /languages/{language}/subjects` - Get subjects for language
- `GET /statistics` - Get learning statistics

## Quick Start

### Prerequisites
- Java 21 or higher
- PostgreSQL 12+ (for production)
- Gradle 8.0+ (or use wrapper)

### Database Setup

1. **Start PostgreSQL** (using Docker):
```bash
docker run --name woa-postgres \
  -e POSTGRES_DB=woa_db \
  -e POSTGRES_USER=woa_user \
  -e POSTGRES_PASSWORD=woa_password \
  -p 6666:5432 \
  -d postgres:15
```

### Running the Application

1. **Clone and navigate**:
```bash
git clone <repository-url>
cd woa-be
```

2. **Run with Gradle**:
```bash
./gradlew bootRun
```

The application will start on http://localhost:8090

### Testing

```bash
# Run all tests
./gradlew test

# Run specific test
./gradlew test --tests TechnicalLearningServiceTest
```

## Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DB_HOST` | Database host | localhost |
| `DB_PORT` | Database port | 6666 |
| `DB_NAME` | Database name | woa_db |
| `DB_USER` | Database user | woa_user |
| `DB_PASSWORD` | Database password | woa_password |
| `SERVER_PORT` | Application port | 8090 |

For detailed API documentation, see [TECHNICAL_LEARNING_API.md](TECHNICAL_LEARNING_API.md)
