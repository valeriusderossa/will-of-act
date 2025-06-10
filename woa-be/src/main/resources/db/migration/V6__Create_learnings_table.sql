-- Create learnings table
CREATE TABLE learnings (
    id BIGSERIAL PRIMARY KEY,
    language VARCHAR(50) NOT NULL,
    subject VARCHAR(200) NOT NULL,
    text TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_learnings_language ON learnings(language);
CREATE INDEX idx_learnings_created_at ON learnings(created_at DESC);
CREATE INDEX idx_learnings_subject ON learnings(subject);

-- Create full-text search index for text content
CREATE INDEX idx_learnings_text_search ON learnings USING gin(to_tsvector('english', text));
CREATE INDEX idx_learnings_subject_search ON learnings USING gin(to_tsvector('english', subject));

-- Add some sample data
INSERT INTO learnings (language, subject, text) VALUES 
('Kotlin', 'For loops in Kotlin', 'Learned different ways to iterate in Kotlin:
- for (i in 1..10) { } // Range iteration
- for (item in list) { } // Collection iteration  
- for (index in list.indices) { } // Index iteration
- for ((index, value) in list.withIndex()) { } // Index and value

Key points:
- Ranges are inclusive on both ends
- Use until for exclusive end: 1 until 10
- downTo for reverse iteration: 10 downTo 1
- step for custom increments: 1..10 step 2'),

('JavaScript', 'Array Methods', 'JavaScript array methods for functional programming:

map() - Transform each element:
const doubled = [1,2,3].map(x => x * 2) // [2,4,6]

filter() - Select elements:
const evens = [1,2,3,4].filter(x => x % 2 === 0) // [2,4]

reduce() - Accumulate values:
const sum = [1,2,3].reduce((acc, x) => acc + x, 0) // 6

forEach() - Side effects:
[1,2,3].forEach(x => console.log(x))

find() - First match:
const found = [1,2,3].find(x => x > 2) // 3'),

('SQL', 'JOIN Operations', 'Different types of SQL JOINs:

INNER JOIN - Only matching records:
SELECT * FROM users u INNER JOIN orders o ON u.id = o.user_id

LEFT JOIN - All from left table:
SELECT * FROM users u LEFT JOIN orders o ON u.id = o.user_id

RIGHT JOIN - All from right table:
SELECT * FROM users u RIGHT JOIN orders o ON u.id = o.user_id

FULL OUTER JOIN - All records:
SELECT * FROM users u FULL OUTER JOIN orders o ON u.id = o.user_id

Key concepts:
- INNER JOIN returns only matches
- LEFT JOIN keeps all left table records
- Use table aliases for readability'),

('Python', 'List Comprehensions', 'Python list comprehensions for concise code:

Basic syntax:
[expression for item in iterable]

With condition:
[expression for item in iterable if condition]

Examples:
squares = [x**2 for x in range(10)]
evens = [x for x in range(20) if x % 2 == 0]
words = [word.upper() for word in ["hello", "world"]]

Nested comprehensions:
matrix = [[i*j for j in range(3)] for i in range(3)]

Performance benefit over regular loops!'),

('Angular', 'Component Lifecycle', 'Angular component lifecycle hooks:

ngOnInit() - Component initialization
- Best place for data fetching
- Called once after constructor

ngOnDestroy() - Cleanup
- Unsubscribe from observables
- Clear timers/intervals

ngOnChanges() - Input property changes
- Receives SimpleChanges object
- Called before ngOnInit

ngAfterViewInit() - View initialization
- DOM elements are available
- ViewChild queries resolved

Example:
export class MyComponent implements OnInit, OnDestroy {
  ngOnInit() { /* fetch data */ }
  ngOnDestroy() { /* cleanup */ }
}');
