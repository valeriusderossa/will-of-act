-- Create quotations table
CREATE TABLE quotations (
    id BIGSERIAL PRIMARY KEY,
    author VARCHAR(255) NOT NULL,
    quotation TEXT NOT NULL,
    date DATE NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX idx_quotations_author ON quotations(author);
CREATE INDEX idx_quotations_date ON quotations(date);
CREATE INDEX idx_quotations_created_at ON quotations(created_at);
