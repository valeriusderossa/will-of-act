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

-- Add some sample data
INSERT INTO quotations (author, quotation, date) VALUES 
('Albert Einstein', 'Imagination is more important than knowledge. For knowledge is limited, whereas imagination embraces the entire world, stimulating progress, giving birth to evolution.', '1929-10-26'),
('Maya Angelou', 'I''ve learned that people will forget what you said, people will forget what you did, but people will never forget how you made them feel.', '1969-04-04'),
('Nelson Mandela', 'Education is the most powerful weapon which you can use to change the world.', '1990-02-11'),
('Steve Jobs', 'Your work is going to fill a large part of your life, and the only way to be truly satisfied is to do what you believe is great work.', '2005-06-12'),
('Martin Luther King Jr.', 'Darkness cannot drive out darkness; only light can do that. Hate cannot drive out hate; only love can do that.', '1963-08-28');
