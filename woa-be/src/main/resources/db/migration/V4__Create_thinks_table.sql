CREATE TABLE thinks (
    id BIGSERIAL PRIMARY KEY,
    text TEXT NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster searching
CREATE INDEX idx_thinks_text ON thinks USING gin(to_tsvector('english', text));
CREATE INDEX idx_thinks_created_at ON thinks(created_at DESC);
