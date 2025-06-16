-- Migration to convert gym_exercises.id from VARCHAR to BIGINT with auto-increment
-- and update related foreign keys

-- Step 1: Create a temporary new table with BIGINT id
CREATE TABLE IF NOT EXISTS gym_exercises_new (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    part_of_body VARCHAR(100) NOT NULL,
    date DATE NOT NULL
);

-- Step 2: Create a temporary mapping table to track old VARCHAR ids to new BIGINT ids
CREATE TABLE IF NOT EXISTS gym_id_mapping (
    old_id VARCHAR(255),
    new_id BIGINT
);

-- Step 3: Migrate data from old table to new table and track id mappings
DO $$
DECLARE
    rec RECORD;
    new_id BIGINT;
BEGIN
    FOR rec IN SELECT * FROM gym_exercises ORDER BY date LOOP
        INSERT INTO gym_exercises_new (name, part_of_body, date)
        VALUES (rec.name, rec.part_of_body, rec.date)
        RETURNING id INTO new_id;
        
        INSERT INTO gym_id_mapping (old_id, new_id)
        VALUES (rec.id, new_id);
    END LOOP;
END $$;

-- Step 4: Create new gym_sets table with BIGINT foreign key
CREATE TABLE IF NOT EXISTS gym_sets_new (
    id BIGSERIAL PRIMARY KEY,
    gym_exercise_id BIGINT NOT NULL,
    reps INTEGER NOT NULL,
    weight DOUBLE PRECISION NOT NULL,
    FOREIGN KEY (gym_exercise_id) REFERENCES gym_exercises_new(id) ON DELETE CASCADE
);

-- Step 5: Migrate gym_sets data using the mapping table
INSERT INTO gym_sets_new (gym_exercise_id, reps, weight)
SELECT mapping.new_id, gs.reps, gs.weight
FROM gym_sets gs
JOIN gym_id_mapping mapping ON gs.gym_exercise_id = mapping.old_id;

-- Step 6: Drop old tables and constraints
DROP TABLE IF EXISTS gym_sets CASCADE;
DROP TABLE IF EXISTS gym_exercises CASCADE;

-- Step 7: Rename new tables to original names
ALTER TABLE gym_exercises_new RENAME TO gym_exercises;
ALTER TABLE gym_sets_new RENAME TO gym_sets;

-- Step 8: Clean up mapping table
DROP TABLE IF EXISTS gym_id_mapping;

-- Step 9: Recreate indexes for better performance
CREATE INDEX IF NOT EXISTS idx_gym_exercises_date ON gym_exercises(date DESC);
CREATE INDEX IF NOT EXISTS idx_gym_exercises_part_of_body ON gym_exercises(part_of_body);
CREATE INDEX IF NOT EXISTS idx_gym_exercises_name ON gym_exercises(name);
CREATE INDEX IF NOT EXISTS idx_gym_sets_exercise_id ON gym_sets(gym_exercise_id);

-- Step 10: Recreate full-text search index for exercise name
CREATE INDEX IF NOT EXISTS idx_gym_exercises_name_search ON gym_exercises USING gin(to_tsvector('english', name));
