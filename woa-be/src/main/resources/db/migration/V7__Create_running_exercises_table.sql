-- Create running_exercises table
CREATE TABLE IF NOT EXISTS running_exercises (
    id VARCHAR(255) PRIMARY KEY,
    distance DOUBLE PRECISION NOT NULL,
    time BIGINT NOT NULL, -- Duration in seconds
    date DATE NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_running_exercises_date ON running_exercises(date DESC);
CREATE INDEX IF NOT EXISTS idx_running_exercises_distance ON running_exercises(distance);
CREATE INDEX IF NOT EXISTS idx_running_exercises_time ON running_exercises(time);
