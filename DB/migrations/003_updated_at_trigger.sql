-- Traveloop updated_at trigger migration
-- Automatically update the updated_at timestamp on any table row modification.

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Attach trigger to users table
CREATE TRIGGER users_updated_at BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Attach trigger to trips table
CREATE TRIGGER trips_updated_at BEFORE UPDATE ON trips
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Attach trigger to itinerary_sections table
CREATE TRIGGER itinerary_sections_updated_at BEFORE UPDATE ON itinerary_sections
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Attach trigger to activities table
CREATE TRIGGER activities_updated_at BEFORE UPDATE ON activities
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Attach trigger to expenses table
CREATE TRIGGER expenses_updated_at BEFORE UPDATE ON expenses
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Attach trigger to packing_items table
CREATE TRIGGER packing_items_updated_at BEFORE UPDATE ON packing_items
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Attach trigger to trip_notes table
CREATE TRIGGER trip_notes_updated_at BEFORE UPDATE ON trip_notes
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Attach trigger to community_posts table
CREATE TRIGGER community_posts_updated_at BEFORE UPDATE ON community_posts
FOR EACH ROW EXECUTE FUNCTION set_updated_at();
