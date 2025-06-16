-- Migration to convert running_exercises.id from VARCHAR to BIGINT with auto-increment

-- Step 1: Create a temporary new table with BIGINT id
CREATE TABLE IF NOT EXISTS running_exercises_new (
    id BIGSERIAL PRIMARY KEY,
    distance DOUBLE PRECISION NOT NULL,
    time BIGINT NOT NULL, -- Duration in seconds
    date DATE NOT NULL
);

-- Step 2: Migrate data from old table to new table (preserving order by date)
INSERT INTO running_exercises_new (distance, time, date)
SELECT distance, time, date
FROM running_exercises
ORDER BY date;

-- Step 3: Drop old table
DROP TABLE IF EXISTS running_exercises CASCADE;

-- Step 4: Rename new table to original name
ALTER TABLE running_exercises_new RENAME TO running_exercises;

-- Step 5: Recreate indexes for better performance
CREATE INDEX IF NOT EXISTS idx_running_exercises_date ON running_exercises(date DESC);
CREATE INDEX IF NOT EXISTS idx_running_exercises_distance ON running_exercises(distance);
CREATE INDEX IF NOT EXISTS idx_running_exercises_time ON running_exercises(time);
