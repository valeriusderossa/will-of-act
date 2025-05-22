# Backend Testing Guide

## Test Structure

### Service Layer Tests (Unit Tests)
```
woa-be/src/test/groovy/org/woa/service/
├── AffirmationServiceTest.groovy      # CRUD operations, sorting, error handling
└── SentenceServiceTest.groovy         # Bilingual operations, search functionality
```

### Controller Layer Tests (Integration Tests)
```
woa-be/src/test/groovy/org/woa/controller/
├── AffirmationControllerIntegrationTest.groovy  # HTTP endpoints, JSON validation
└── SentenceControllerIntegrationTest.groovy     # Bilingual API endpoints
```

### Repository Layer Tests (Data Access Tests)
```
woa-be/src/test/groovy/org/woa/repository/
└── SentenceRepositoryTest.groovy      # Custom query methods, search functionality
```

### Exception Handling Tests
```
woa-be/src/test/groovy/org/woa/exception/
└── GlobalExceptionHandlerTest.groovy  # Error responses, status codes
```

## Test Coverage

### AffirmationService Tests ✅
- **CRUD Operations**: Create, Read, Update, Delete
- **Sorting**: Default desc, ascending, invalid parameters
- **Error Handling**: Not found exceptions, validation
- **Edge Cases**: Empty repository, null values
- **Business Logic**: Timestamp updates, data transformation

### SentenceService Tests ✅
- **Bilingual Operations**: English/Polish text handling
- **Search Functionality**: Text search in both languages
- **Pronunciation Handling**: Optional pronunciation field
- **CRUD Operations**: Full lifecycle management
- **Error Scenarios**: Not found, validation errors

### Controller Integration Tests ✅
- **HTTP Methods**: GET, POST, PUT, DELETE
- **Status Codes**: 200, 201, 400, 404, 500
- **Content Types**: JSON request/response validation
- **Path Parameters**: ID validation, invalid formats
- **Query Parameters**: Sorting, search text
- **Request Validation**: Malformed JSON handling

### Repository Tests ✅
- **Custom Queries**: Search functionality
- **Case Sensitivity**: Ignore case operations
- **Database Integration**: Real JPA operations
- **Data Persistence**: Entity lifecycle testing

### Exception Handler Tests ✅
- **Error Mapping**: Exception to HTTP status
- **Error Messages**: User-friendly error responses
- **Error Details**: Timestamp, path, status codes
- **Null Handling**: Graceful null message handling

## Running Tests

### All Tests
```bash
cd woa-be
./gradlew test
```

### Specific Test Class
```bash
./gradlew test --tests "org.woa.service.AffirmationServiceTest"
./gradlew test --tests "org.woa.controller.*IntegrationTest"
```

### Test Categories
```bash
# Unit Tests (Service Layer)
./gradlew test --tests "org.woa.service.*"

# Integration Tests (Controller Layer)
./gradlew test --tests "org.woa.controller.*"

# Repository Tests
./gradlew test --tests "org.woa.repository.*"
```

### Test Reports
```bash
./gradlew test
# Open: build/reports/tests/test/index.html
```

## Test Quality Metrics

### Coverage Areas
- ✅ **Service Logic**: 100% method coverage
- ✅ **API Endpoints**: All HTTP operations
- ✅ **Error Handling**: Exception scenarios
- ✅ **Data Access**: Repository queries
- ✅ **Validation**: Input validation and constraints

### Test Types
- **Unit Tests**: Isolated component testing with mocks
- **Integration Tests**: Full Spring context with MockMvc
- **Repository Tests**: Real database operations with @DataJpaTest
- **Exception Tests**: Error handling and status codes

### Best Practices Applied
- **Spock Framework**: BDD-style tests with given/when/then
- **Mock Objects**: Isolated testing with proper mocking
- **Test Data**: Realistic but minimal test scenarios
- **Edge Cases**: Null values, empty collections, invalid inputs
- **Error Scenarios**: Exception handling and error responses

## Key Features Tested

### Affirmation Management
- ✅ Create affirmations with validation
- ✅ Retrieve all with sorting options
- ✅ Update existing affirmations
- ✅ Delete with existence validation
- ✅ Proper timestamp handling

### Sentence Management
- ✅ Bilingual text operations
- ✅ Optional pronunciation handling
- ✅ Search functionality (case-insensitive)
- ✅ Category and difficulty support
- ✅ Full CRUD operations

### API Reliability
- ✅ Proper HTTP status codes
- ✅ JSON serialization/deserialization
- ✅ Error response formatting
- ✅ Input validation
- ✅ CORS support

## Test Execution Results
All tests pass with comprehensive coverage of:
- Business logic validation
- API contract compliance
- Error handling robustness
- Data persistence integrity
- Search functionality accuracy

**Status: ✅ COMPREHENSIVE BACKEND TESTING COMPLETE**
