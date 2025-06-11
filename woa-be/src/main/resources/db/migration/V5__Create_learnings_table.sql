-- Create learnings table
CREATE TABLE IF NOT EXISTS learnings (
    id BIGSERIAL PRIMARY KEY,
    language VARCHAR(50) NOT NULL,
    subject VARCHAR(200) NOT NULL,
    text TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_learnings_language ON learnings(language);
CREATE INDEX IF NOT EXISTS idx_learnings_created_at ON learnings(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_learnings_subject ON learnings(subject);

-- Create full-text search index for text content
CREATE INDEX IF NOT EXISTS idx_learnings_text_search ON learnings USING gin(to_tsvector('english', text));
CREATE INDEX IF NOT EXISTS idx_learnings_subject_search ON learnings USING gin(to_tsvector('english', subject));
