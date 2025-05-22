# Testing Guide

## Frontend Testing

### Test Structure
```
woa-fe/src/app/features/affirmations/
├── services/
│   ├── affirmation.service.spec.ts       # Service unit tests
│   └── affirmation.service.ts
├── components/
│   ├── affirmation-list/
│   │   ├── affirmation-list.component.spec.ts  # Component unit tests
│   │   └── affirmation-list.component.ts
│   └── affirmation-dialog/
│       ├── affirmation-dialog.component.spec.ts # Dialog unit tests
│       └── affirmation-dialog.component.ts
```

### Running Tests

#### Unit Tests
```bash
cd woa-fe
npm test
```

#### Test Coverage
```bash
cd woa-fe
npm run test -- --code-coverage
```

#### Watch Mode
```bash
cd woa-fe
npm test -- --watch
```

### Test Coverage Areas

#### AffirmationService Tests
- ✅ HTTP GET requests (getAllAffirmations, getById)
- ✅ HTTP POST requests (createAffirmation)
- ✅ HTTP PUT requests (updateAffirmation)
- ✅ HTTP DELETE requests (deleteAffirmation)
- ✅ Error handling scenarios

#### AffirmationListComponent Tests
- ✅ Component initialization
- ✅ Data loading (success/error scenarios)
- ✅ Dialog interactions (add/edit)
- ✅ Delete functionality with confirmation
- ✅ Utility methods (date formatting, text truncation)

#### AffirmationDialogComponent Tests
- ✅ Form initialization (add/edit modes)
- ✅ Form validation (required fields)
- ✅ Save/Cancel functionality
- ✅ Dialog data handling

## Backend Testing

### Test Structure
```
woa-be/src/test/groovy/org/woa/
├── service/
│   ├── AffirmationServiceTest.groovy     # Service unit tests
│   └── SentenceServiceTest.groovy        # Service unit tests
└── controller/
    └── AffirmationControllerIntegrationTest.groovy  # API integration tests
```

### Running Tests

#### All Tests
```bash
cd woa-be
./gradlew test
```

#### Specific Test Class
```bash
cd woa-be
./gradlew test --tests "org.woa.service.AffirmationServiceTest"
```

#### Test Report
```bash
cd woa-be
./gradlew test
# Open: build/reports/tests/test/index.html
```

### Test Coverage Areas

#### AffirmationService Tests (Spock)
- ✅ CRUD operations (create, read, update, delete)
- ✅ Error scenarios (not found exceptions)
- ✅ Repository interactions
- ✅ Data transformation (Entity ↔ DTO)

#### AffirmationController Integration Tests
- ✅ HTTP endpoints (GET, POST, PUT, DELETE)
- ✅ Request/Response validation
- ✅ Status codes (200, 201, 404)
- ✅ JSON serialization/deserialization

#### SentenceService Tests
- ✅ Bilingual sentence operations
- ✅ Category and difficulty filtering
- ✅ Search functionality
- ✅ Pronunciation handling

## Test Quality Standards

### Unit Tests
- **Isolation**: Each test is independent
- **Mocking**: External dependencies are mocked
- **Coverage**: All public methods tested
- **Edge Cases**: Error scenarios included

### Integration Tests
- **End-to-End**: Full request/response cycle
- **Real Components**: Actual Spring context
- **HTTP Testing**: MockMvc for web layer
- **Data Validation**: JSON structure verification

### Best Practices
- **Descriptive Names**: Test names explain what's being tested
- **AAA Pattern**: Arrange, Act, Assert
- **Single Responsibility**: One assertion per test
- **Test Data**: Realistic but minimal test data
