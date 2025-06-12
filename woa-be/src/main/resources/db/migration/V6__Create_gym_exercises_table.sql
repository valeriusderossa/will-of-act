-- Create gym_exercises table
CREATE TABLE IF NOT EXISTS gym_exercises (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    part_of_body VARCHAR(100) NOT NULL,
    date DATE NOT NULL
);

-- Create gym_sets table for sets collection
CREATE TABLE IF NOT EXISTS gym_sets (
    id BIGSERIAL PRIMARY KEY,
    gym_exercise_id VARCHAR(255) NOT NULL,
    reps INTEGER NOT NULL,
    weight DOUBLE PRECISION NOT NULL,
    FOREIGN KEY (gym_exercise_id) REFERENCES gym_exercises(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_gym_exercises_date ON gym_exercises(date DESC);
CREATE INDEX IF NOT EXISTS idx_gym_exercises_part_of_body ON gym_exercises(part_of_body);
CREATE INDEX IF NOT EXISTS idx_gym_exercises_name ON gym_exercises(name);
CREATE INDEX IF NOT EXISTS idx_gym_sets_exercise_id ON gym_sets(gym_exercise_id);

-- Create full-text search index for exercise name
CREATE INDEX IF NOT EXISTS idx_gym_exercises_name_search ON gym_exercises USING gin(to_tsvector('english', name));
