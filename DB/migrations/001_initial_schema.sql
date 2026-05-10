-- Traveloop initial schema migration
-- Creates all core tables in dependency order.

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

COMMENT ON TABLE users IS 'Stores user accounts and authentication/profile details for Traveloop.';

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

COMMENT ON TABLE trips IS 'Stores top-level trip plans owned by each user.';

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

COMMENT ON TABLE itinerary_sections IS 'Stores date-based itinerary sections or stops within a trip.';

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

COMMENT ON TABLE activities IS 'Stores activities, events, or bookings assigned to an itinerary section.';

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

COMMENT ON TABLE expenses IS 'Stores trip expense records for budgeting and cost tracking.';

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

COMMENT ON TABLE packing_items IS 'Stores trip packing checklist items and completion state.';

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

COMMENT ON TABLE trip_notes IS 'Stores trip notes, journal entries, and tags.';

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

COMMENT ON TABLE community_posts IS 'Stores community posts authored by users and optionally linked to trips.';

CREATE INDEX idx_trips_user_id ON trips (user_id);
CREATE INDEX idx_itinerary_sections_trip_id ON itinerary_sections (trip_id);
CREATE INDEX idx_activities_section_id ON activities (section_id);
CREATE INDEX idx_expenses_trip_id ON expenses (trip_id);
CREATE INDEX idx_packing_items_trip_id ON packing_items (trip_id);
CREATE INDEX idx_trip_notes_trip_id ON trip_notes (trip_id);
CREATE INDEX idx_community_posts_user_id ON community_posts (user_id);
CREATE INDEX idx_community_posts_trip_id ON community_posts (trip_id);
