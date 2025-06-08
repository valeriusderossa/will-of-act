#!/bin/bash

# Flyway Helper Script for Local Development
# This script provides easy access to common Flyway operations

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
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

# Check if PostgreSQL is running
check_postgres() {
    print_info "Checking if PostgreSQL is running on localhost:6666..."
    if ! nc -z localhost 6666 2>/dev/null; then
        print_error "PostgreSQL is not running on localhost:6666"
        print_info "Please start your database with: docker-compose up -d"
        exit 1
    fi
    print_info "PostgreSQL is running ✓"
}

# Show help
show_help() {
    echo "Flyway Helper Script for Local Development"
    echo ""
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  info      - Show migration status"
    echo "  migrate   - Run pending migrations"
    echo "  validate  - Validate migrations"
    echo "  clean     - Clean database (removes all objects)"
    echo "  reset     - Clean and migrate (fresh start)"
    echo "  repair    - Repair migration history"
    echo "  baseline  - Baseline existing database"
    echo "  help      - Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 info"
    echo "  $0 migrate"
    echo "  $0 reset"
}

# Main command handling
case "${1:-help}" in
    "info")
        check_postgres
        print_info "Getting migration status..."
        ./gradlew flywayInfo
        ;;
    "migrate")
        check_postgres
        print_info "Running migrations..."
        ./gradlew flywayMigrate
        print_info "Migrations completed!"
        ;;
    "validate")
        check_postgres
        print_info "Validating migrations..."
        ./gradlew flywayValidate
        print_info "Validation completed!"
        ;;
    "clean")
        check_postgres
        print_warning "This will remove ALL objects from the database!"
        read -p "Are you sure? (y/N) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            print_info "Cleaning database..."
            ./gradlew flywayClean
            print_info "Database cleaned!"
        else
            print_info "Operation cancelled."
        fi
        ;;
    "reset")
        check_postgres
        print_warning "This will remove ALL objects and rerun all migrations!"
        read -p "Are you sure? (y/N) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            print_info "Cleaning database..."
            ./gradlew flywayClean
            print_info "Running migrations..."
            ./gradlew flywayMigrate
            print_info "Database reset completed!"
        else
            print_info "Operation cancelled."
        fi
        ;;
    "repair")
        check_postgres
        print_info "Repairing migration history..."
        ./gradlew flywayRepair
        print_info "Repair completed!"
        ;;
    "baseline")
        check_postgres
        print_info "Creating baseline..."
        ./gradlew flywayBaseline
        print_info "Baseline completed!"
        ;;
    "help"|*)
        show_help
        ;;
esac
