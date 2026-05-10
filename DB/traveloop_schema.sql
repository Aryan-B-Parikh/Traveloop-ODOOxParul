-- Traveloop PostgreSQL schema
-- Core tables are created in dependency order for straightforward deployment.

CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone_number VARCHAR(20),
    city VARCHAR(100),
    country VARCHAR(100),
    additional_info TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE trips (
    trip_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    start_destination VARCHAR(150) NOT NULL,
    return_place VARCHAR(150) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'planned',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_trips_user
        FOREIGN KEY (user_id)
        REFERENCES users (user_id)
        ON DELETE CASCADE,
    CONSTRAINT chk_trips_dates
        CHECK (end_date >= start_date),
    CONSTRAINT chk_trips_status
        CHECK (status IN ('planned', 'active', 'completed', 'cancelled'))
);

CREATE TABLE itinerary_sections (
    section_id SERIAL PRIMARY KEY,
    trip_id INTEGER NOT NULL,
    date_range DATERANGE NOT NULL,
    location VARCHAR(150) NOT NULL,
    section_budget NUMERIC(12,2) NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_itinerary_sections_trip
        FOREIGN KEY (trip_id)
        REFERENCES trips (trip_id)
        ON DELETE CASCADE,
    CONSTRAINT chk_section_budget_nonnegative
        CHECK (section_budget >= 0)
);

CREATE TABLE activities (
    activity_id SERIAL PRIMARY KEY,
    section_id INTEGER NOT NULL,
    name VARCHAR(150) NOT NULL,
    city VARCHAR(100) NOT NULL,
    description TEXT,
    cost NUMERIC(12,2) NOT NULL DEFAULT 0,
    activity_date DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_activities_section
        FOREIGN KEY (section_id)
        REFERENCES itinerary_sections (section_id)
        ON DELETE CASCADE,
    CONSTRAINT chk_activity_cost_nonnegative
        CHECK (cost >= 0)
);

CREATE TABLE expenses (
    expense_id SERIAL PRIMARY KEY,
    trip_id INTEGER NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT,
    quantity NUMERIC(12,2) NOT NULL DEFAULT 1,
    unit_cost NUMERIC(12,2) NOT NULL DEFAULT 0,
    total_amount NUMERIC(12,2) GENERATED ALWAYS AS (quantity * unit_cost) STORED,
    expense_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_expenses_trip
        FOREIGN KEY (trip_id)
        REFERENCES trips (trip_id)
        ON DELETE CASCADE,
    CONSTRAINT chk_expenses_quantity_positive
        CHECK (quantity > 0),
    CONSTRAINT chk_expenses_unit_cost_nonnegative
        CHECK (unit_cost >= 0)
);

CREATE TABLE packing_items (
    item_id SERIAL PRIMARY KEY,
    trip_id INTEGER NOT NULL,
    category VARCHAR(100) NOT NULL,
    item_name VARCHAR(150) NOT NULL,
    is_checked BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_packing_items_trip
        FOREIGN KEY (trip_id)
        REFERENCES trips (trip_id)
        ON DELETE CASCADE
);

CREATE TABLE trip_notes (
    note_id SERIAL PRIMARY KEY,
    trip_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    tag_type VARCHAR(50),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_trip_notes_trip
        FOREIGN KEY (trip_id)
        REFERENCES trips (trip_id)
        ON DELETE CASCADE
);

CREATE TABLE community_posts (
    post_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    trip_id INTEGER,
    post_content TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_community_posts_user
        FOREIGN KEY (user_id)
        REFERENCES users (user_id)
        ON DELETE CASCADE,
    CONSTRAINT fk_community_posts_trip
        FOREIGN KEY (trip_id)
        REFERENCES trips (trip_id)
        ON DELETE CASCADE
);

COMMENT ON TABLE users IS 'Stores user accounts and authentication/profile details for Traveloop.';
COMMENT ON TABLE trips IS 'Stores top-level trip plans owned by each user.';
COMMENT ON TABLE itinerary_sections IS 'Stores date-based itinerary sections or stops within a trip.';
COMMENT ON TABLE activities IS 'Stores activities, events, or bookings assigned to an itinerary section.';
COMMENT ON TABLE expenses IS 'Stores trip expense records for budgeting and cost tracking.';
COMMENT ON TABLE packing_items IS 'Stores trip packing checklist items and completion state.';
COMMENT ON TABLE trip_notes IS 'Stores trip notes, journal entries, and tags.';
COMMENT ON TABLE community_posts IS 'Stores community posts authored by users and optionally linked to trips.';

CREATE INDEX idx_trips_user_id ON trips (user_id);
CREATE INDEX idx_itinerary_sections_trip_id ON itinerary_sections (trip_id);
CREATE INDEX idx_activities_section_id ON activities (section_id);
CREATE INDEX idx_expenses_trip_id ON expenses (trip_id);
CREATE INDEX idx_packing_items_trip_id ON packing_items (trip_id);
CREATE INDEX idx_trip_notes_trip_id ON trip_notes (trip_id);
CREATE INDEX idx_community_posts_user_id ON community_posts (user_id);
CREATE INDEX idx_community_posts_trip_id ON community_posts (trip_id);

-- Sample seed data for local testing.
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

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_updated_at BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trips_updated_at BEFORE UPDATE ON trips
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER itinerary_sections_updated_at BEFORE UPDATE ON itinerary_sections
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER activities_updated_at BEFORE UPDATE ON activities
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER expenses_updated_at BEFORE UPDATE ON expenses
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER packing_items_updated_at BEFORE UPDATE ON packing_items
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trip_notes_updated_at BEFORE UPDATE ON trip_notes
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER community_posts_updated_at BEFORE UPDATE ON community_posts
FOR EACH ROW EXECUTE FUNCTION set_updated_at();
