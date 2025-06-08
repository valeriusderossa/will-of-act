-- Create sentences table for English-Polish translations
CREATE TABLE sentences (
    id BIGSERIAL PRIMARY KEY,
    english_text VARCHAR(1000) NOT NULL,
    polish_text VARCHAR(1000) NOT NULL,
    pronunciation VARCHAR(1000),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX idx_sentences_english ON sentences(english_text);
CREATE INDEX idx_sentences_polish ON sentences(polish_text);
CREATE INDEX idx_sentences_created_at ON sentences(created_at);
