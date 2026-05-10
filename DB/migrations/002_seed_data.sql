-- Traveloop seed data migration
-- Insert sample rows for local development and testing.

INSERT INTO users (
    username,
    password_hash,
    first_name,
    last_name,
    email,
    phone_number,
    city,
    country,
    additional_info
) VALUES
    ('travelooper01', '$2b$12$examplehashedpassword1', 'Ava', 'Johnson', 'ava@example.com', '+1555000101', 'New York', 'USA', 'Prefers budget-friendly weekend trips.'),
    ('globetrotter02', '$2b$12$examplehashedpassword2', 'Noah', 'Patel', 'noah@example.com', '+1555000102', 'Toronto', 'Canada', 'Interested in food and culture experiences.');

INSERT INTO trips (
    user_id,
    start_destination,
    return_place,
    start_date,
    end_date,
    status
) VALUES
    (1, 'New York City', 'New York City', '2026-07-10', '2026-07-17', 'planned'),
    (2, 'Toronto', 'Toronto', '2026-08-05', '2026-08-12', 'active');

INSERT INTO itinerary_sections (
    trip_id,
    date_range,
    location,
    section_budget
) VALUES
    (1, daterange('2026-07-10', '2026-07-12', '[]'), 'Paris', 900.00),
    (1, daterange('2026-07-13', '2026-07-17', '[]'), 'Rome', 1200.00),
    (2, daterange('2026-08-05', '2026-08-08', '[]'), 'Vancouver', 800.00);

INSERT INTO activities (
    section_id,
    name,
    city,
    description,
    cost,
    activity_date
) VALUES
    (1, 'Louvre Museum Visit', 'Paris', 'Guided museum visit and gallery tour.', 35.00, '2026-07-11'),
    (1, 'Seine River Cruise', 'Paris', 'Evening sightseeing cruise.', 48.00, '2026-07-12'),
    (2, 'Colosseum Tour', 'Rome', 'Historical tour with skip-the-line entry.', 62.00, '2026-07-14'),
    (3, 'Stanley Park Bike Ride', 'Vancouver', 'Half-day cycling route through the park.', 25.00, '2026-08-06');

INSERT INTO expenses (
    trip_id,
    category,
    description,
    quantity,
    unit_cost,
    expense_date
) VALUES
    (1, 'Lodging', 'Hotel in Paris', 3, 210.00, '2026-07-10'),
    (1, 'Transportation', 'Airport transfer', 2, 45.00, '2026-07-10'),
    (2, 'Food', 'Dining and coffee', 6, 22.50, '2026-08-05');

INSERT INTO packing_items (
    trip_id,
    category,
    item_name,
    is_checked
) VALUES
    (1, 'Clothing', 'Light jacket', FALSE),
    (1, 'Documents', 'Passport', TRUE),
    (2, 'Electronics', 'Phone charger', FALSE);

INSERT INTO trip_notes (
    trip_id,
    content,
    tag_type
) VALUES
    (1, 'Book museum tickets in advance to avoid queues.', 'planning'),
    (1, 'Try local pastries near the Seine.', 'food'),
    (2, 'Research transit passes before arrival.', 'reminder');

INSERT INTO community_posts (
    user_id,
    trip_id,
    post_content
) VALUES
    (1, 1, 'Sharing my Paris and Rome itinerary for fellow travelers.'),
    (2, 2, 'Looking for recommendations around Vancouver for a short trip.');
