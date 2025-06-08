-- Create affirmations table for positive affirmations
CREATE TABLE affirmations (
    id BIGSERIAL PRIMARY KEY,
    text TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX idx_affirmations_created_at ON affirmations(created_at);
CREATE INDEX idx_affirmations_text ON affirmations USING gin(to_tsvector('english', text));
