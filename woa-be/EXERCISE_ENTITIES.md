# Exercise Entities Documentation

## Overview

This document describes the new exercise tracking entities added to the Will of Act project. The entities follow a clean, immutable design using Kotlin data classes and strong types.

## Entity Structure

### Strength Training: `Gym`
Represents a strength exercise session with multiple sets.

**Properties:**
- `id`: String — unique identifier for the exercise session
- `name`: String — name of the exercise (e.g., "Deadlift", "Bench Press")
- `partOfBody`: String — targeted muscle group (e.g., "Back", "Legs", "Chest")
- `date`: LocalDate — date of the workout
- `sets`: List<SetEntry> — list of sets performed

**Database Table:** `gym_exercises` with related `gym_sets` table

### Cardio Session: `Running`
Represents a running activity.

**Properties:**
- `id`: String — unique identifier for the run
- `distance`: Double — distance covered in kilometers
- `time`: Duration — total run duration
- `date`: LocalDate — date of the run

**Database Table:** `running_exercises`

### Set Entry: `SetEntry`
Represents individual sets in strength training.

**Properties:**
- `reps`: Int — number of repetitions in the set
- `weight`: Double — weight lifted in kilograms

## Features

✅ **Kotlin data class syntax** - Clean, immutable design
✅ **Strong types** - Uses `LocalDate` and `Duration` 
✅ **JPA annotations** - Full persistence support
✅ **Database migrations** - Flyway migration scripts included
✅ **Simple design** - Standalone entities without interfaces
✅ **Consistent style** - Follows existing project patterns

## Database Schema

### Gym Exercises
```sql
-- gym_exercises table
CREATE TABLE gym_exercises (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    part_of_body VARCHAR(100) NOT NULL,
    date DATE NOT NULL
);

-- gym_sets table (for sets collection)
CREATE TABLE gym_sets (
    id BIGSERIAL PRIMARY KEY,
    gym_exercise_id VARCHAR(255) NOT NULL,
    reps INTEGER NOT NULL,
    weight DOUBLE PRECISION NOT NULL,
    FOREIGN KEY (gym_exercise_id) REFERENCES gym_exercises(id)
);
```

### Running Exercises
```sql
CREATE TABLE running_exercises (
    id VARCHAR(255) PRIMARY KEY,
    distance DOUBLE PRECISION NOT NULL,
    time BIGINT NOT NULL, -- Duration in seconds
    date DATE NOT NULL
);
```

## Usage Examples

### Creating a Gym Session
```kotlin
val gymSession = Gym(
    id = "gym-${UUID.randomUUID()}",
    name = "Deadlift",
    partOfBody = "Back",
    date = LocalDate.now(),
    sets = listOf(
        SetEntry(reps = 8, weight = 100.0),
        SetEntry(reps = 6, weight = 110.0),
        SetEntry(reps = 4, weight = 120.0)
    )
)
```

### Creating a Running Session
```kotlin
val runningSession = Running(
    id = "run-${UUID.randomUUID()}",
    distance = 5.2,
    time = Duration.ofMinutes(25).plusSeconds(30),
    date = LocalDate.now()
)
```

## Files Created

### Entity Files
- `woa-be/src/main/kotlin/org/woa/entity/Gym.kt` - Strength training entity
- `woa-be/src/main/kotlin/org/woa/entity/Running.kt` - Cardio session entity
- `woa-be/src/main/kotlin/org/woa/entity/SetEntry.kt` - Set data structure

### Configuration
- `woa-be/src/main/kotlin/org/woa/config/DurationConverter.kt` - JPA Duration converter

### Database Migrations
- `woa-be/src/main/resources/db/migration/V6__Create_gym_exercises_table.sql`
- `woa-be/src/main/resources/db/migration/V7__Create_running_exercises_table.sql`

## Next Steps

To complete the implementation, consider adding:

1. **Repository interfaces** - `GymRepository` and `RunningRepository`
2. **Service layers** - `GymService` and `RunningService`
3. **REST controllers** - `GymController` and `RunningController`
4. **DTOs** - Request/Response DTOs for API endpoints
5. **Tests** - Unit and integration tests

The entities are designed to be simple, clean, and follow the existing project patterns while providing a solid foundation for exercise tracking functionality.
