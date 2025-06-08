# Database Migrations with Flyway

## Overview

This project uses Flyway for database schema management and versioning. Flyway automatically handles database migrations when the application starts up.

## Migration Files Organization

Migration files are organized into two categories:

### Schema Migrations (`src/main/resources/db/migration/`)
Required for all environments - contains table structures and schema changes:
- `V1__Create_quotations_table.sql` - Creates quotations table with indexes
- `V2__Create_sentences_table.sql` - Creates sentences table for English-Polish translations
- `V3__Create_affirmations_table.sql` - Creates affirmations table with full-text search

### Sample Data (`src/main/resources/db/test-data/`)
Optional sample data for development and testing:
- `V100__Insert_sample_quotations.sql` - Sample quotations from famous people
- `V101__Insert_sample_sentences.sql` - Sample English-Polish sentence pairs
- `V102__Insert_sample_affirmations.sql` - Sample positive affirmations

**Note**: Sample data migrations use version numbers starting from V100 to avoid conflicts with schema migrations.

## Environment Configuration

### Local Development (`application-local.yml`)
- Includes both schema migrations AND sample data
- Uses `locations: classpath:db/migration,classpath:db/test-data`
- Provides realistic data for development and manual testing

### Testing (`application-test.yml`)
- Includes both schema migrations AND sample data
- Uses H2 in-memory database for fast test execution
- Sample data helps with integration tests

### Production (`application-prod.yml`)
- Includes ONLY schema migrations
- Uses `locations: classpath:db/migration`
- No sample data to keep production clean

## Database Schema

### Quotations Table
```sql
CREATE TABLE quotations (
    id BIGSERIAL PRIMARY KEY,
    author VARCHAR(255) NOT NULL,
    quotation TEXT NOT NULL,
    date DATE NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

### Sentences Table
```sql
CREATE TABLE sentences (
    id BIGSERIAL PRIMARY KEY,
    english_text VARCHAR(1000) NOT NULL,
    polish_text VARCHAR(1000) NOT NULL,
    pronunciation VARCHAR(1000),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

### Affirmations Table
```sql
CREATE TABLE affirmations (
    id BIGSERIAL PRIMARY KEY,
    text TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

## Available Gradle Tasks

### Manual Migration Management
```bash
# Run migrations manually
./gradlew flywayMigrate

# Get migration status/info
./gradlew flywayInfo

# Validate migrations
./gradlew flywayValidate

# Clean database (removes all objects - BE CAREFUL!)
./gradlew flywayClean

# Repair migration history (fixes checksum mismatches)
./gradlew flywayRepair
```

### Helper Scripts
For easier local development, use the provided helper script:

**Linux/Mac:**
```bash
# Make script executable (first time only)
chmod +x scripts/flyway-local.sh

# Show migration status
./scripts/flyway-local.sh info

# Run migrations
./scripts/flyway-local.sh migrate

# Reset database (clean + migrate)
./scripts/flyway-local.sh reset
```

**Windows:**
```batch
# Show migration status
scripts\flyway-local.bat info

# Run migrations
scripts\flyway-local.bat migrate

# Reset database
scripts\flyway-local.bat reset
```

## Migration File Naming Convention

Migration files must follow this naming pattern:
```
V{version}__{description}.sql
```

Examples:
- `V1__Create_quotations_table.sql`
- `V4__Add_user_table.sql`
- `V5__Add_index_to_quotations.sql`
- `V100__Insert_sample_data.sql` (for test data)

## Creating New Migrations

1. Create a new SQL file in `src/main/resources/db/migration/`
2. Use the next available version number: `V4__Your_description.sql`
3. Write your DDL/DML statements
4. Test locally first: `./scripts/flyway-local.sh migrate`
5. Commit the file to version control

### Example New Migration
```sql
-- V4__Add_user_table.sql
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
```

## Best Practices

1. **Never modify existing migration files** - create new ones instead
2. **Keep schema and data separate** - use migration folder for schema, test-data for samples
3. **Test migrations locally** before deploying
4. **Use descriptive names** for migration files
5. **Keep migrations simple** - one logical change per file
6. **Include proper indexes** for performance
7. **Use appropriate data types** matching your Kotlin entities

## Integration with Hibernate

The application is configured to use:
- `hibernate.ddl-auto: validate` - Hibernate validates schema against entities
- `generate-ddl: false` - Flyway handles all schema generation

This ensures Flyway is the single source of truth for database schema changes.

## Troubleshooting

### Checksum Mismatch
If you modified a migration file after it was applied:
```bash
./scripts/flyway-local.sh repair
```

### Starting Fresh (Development Only)
To reset your local database completely:
```bash
./scripts/flyway-local.sh reset
```

**WARNING**: Never use reset/clean commands in production!

### Viewing Migration History
Query the Flyway metadata table:
```sql
SELECT * FROM flyway_schema_history ORDER BY installed_rank;
```
