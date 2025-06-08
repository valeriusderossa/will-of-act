#!/bin/bash

# Script to create new Flyway migration files with proper naming

set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print colored output
print_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Navigate to project root
cd "$(dirname "$0")/.."

# Check if description was provided
if [ -z "$1" ]; then
    echo "Usage: $0 <migration_description> [--test-data]"
    echo ""
    echo "Examples:"
    echo "  $0 \"Add user table\""
    echo "  $0 \"Insert sample users\" --test-data"
    echo ""
    echo "Options:"
    echo "  --test-data    Create migration in test-data folder (for sample data)"
    exit 1
fi

DESCRIPTION="$1"
IS_TEST_DATA=false

# Check for test-data flag
if [ "$2" = "--test-data" ]; then
    IS_TEST_DATA=true
fi

# Clean up description for filename
CLEAN_DESCRIPTION=$(echo "$DESCRIPTION" | sed 's/[^a-zA-Z0-9 ]//g' | sed 's/ /_/g')

# Determine the target directory and next version number
if [ "$IS_TEST_DATA" = true ]; then
    TARGET_DIR="src/main/resources/db/test-data"
    # Find next version number starting from V100
    EXISTING_FILES=$(find "$TARGET_DIR" -name "V*.sql" 2>/dev/null | wc -l)
    if [ "$EXISTING_FILES" -eq 0 ]; then
        NEXT_VERSION=100
    else
        LATEST_VERSION=$(find "$TARGET_DIR" -name "V*.sql" | sed 's/.*V\([0-9]*\)__.*/\1/' | sort -n | tail -1)
        NEXT_VERSION=$((LATEST_VERSION + 1))
    fi
else
    TARGET_DIR="src/main/resources/db/migration"
    # Find next version number starting from V1
    EXISTING_FILES=$(find "$TARGET_DIR" -name "V*.sql" 2>/dev/null | wc -l)
    if [ "$EXISTING_FILES" -eq 0 ]; then
        NEXT_VERSION=1
    else
        LATEST_VERSION=$(find "$TARGET_DIR" -name "V*.sql" | sed 's/.*V\([0-9]*\)__.*/\1/' | sort -n | tail -1)
        if [ "$LATEST_VERSION" -ge 100 ]; then
            # Find the highest schema migration (below 100)
            LATEST_VERSION=$(find "$TARGET_DIR" -name "V*.sql" | sed 's/.*V\([0-9]*\)__.*/\1/' | awk '$1 < 100' | sort -n | tail -1)
            if [ -z "$LATEST_VERSION" ]; then
                LATEST_VERSION=0
            fi
        fi
        NEXT_VERSION=$((LATEST_VERSION + 1))
    fi
fi

# Create filename
FILENAME="V${NEXT_VERSION}__${CLEAN_DESCRIPTION}.sql"
FULL_PATH="$TARGET_DIR/$FILENAME"

# Create the directory if it doesn't exist
mkdir -p "$TARGET_DIR"

# Check if file already exists
if [ -f "$FULL_PATH" ]; then
    print_error "File already exists: $FULL_PATH"
    exit 1
fi

# Create the migration file with basic template
if [ "$IS_TEST_DATA" = true ]; then
    cat > "$FULL_PATH" << EOF
-- $DESCRIPTION
-- Sample data migration for development and testing

-- TODO: Add your sample data INSERT statements here
-- Example:
-- INSERT INTO your_table (column1, column2) VALUES 
-- ('value1', 'value2'),
-- ('value3', 'value4');
EOF
else
    cat > "$FULL_PATH" << EOF
-- $DESCRIPTION
-- Schema migration

-- TODO: Add your DDL statements here
-- Examples:
-- CREATE TABLE your_table (
--     id BIGSERIAL PRIMARY KEY,
--     name VARCHAR(255) NOT NULL,
--     created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
-- );
-- 
-- CREATE INDEX idx_your_table_name ON your_table(name);
EOF
fi

print_info "Created migration file: $FULL_PATH"

if [ "$IS_TEST_DATA" = true ]; then
    print_warning "This is a test data migration. It will only be applied in local and test environments."
else
    print_info "This is a schema migration. It will be applied in all environments."
fi

print_info "Next steps:"
echo "  1. Edit the file: $FULL_PATH"
echo "  2. Add your SQL statements"
echo "  3. Test locally: ./scripts/flyway-local.sh migrate"
echo "  4. Commit the file to version control"
