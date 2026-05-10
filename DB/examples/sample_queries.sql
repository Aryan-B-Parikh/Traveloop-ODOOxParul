-- Traveloop sample read queries

-- Fetch all trips for a specific user.
SELECT
    t.trip_id,
    t.user_id,
    t.start_destination,
    t.return_place,
    t.start_date,
    t.end_date,
    t.status
FROM trips t
WHERE t.user_id = 1
ORDER BY t.start_date;

-- Fetch activities for a trip with section context.
SELECT
    t.trip_id,
    i.section_id,
    i.location,
    a.activity_id,
    a.name,
    a.city,
    a.description,
    a.cost,
    a.activity_date
FROM trips t
JOIN itinerary_sections i ON i.trip_id = t.trip_id
JOIN activities a ON a.section_id = i.section_id
WHERE t.trip_id = 1
ORDER BY i.section_id, a.activity_date, a.activity_id;

-- Fetch expenses for a trip with calculated totals.
SELECT
    e.expense_id,
    e.trip_id,
    e.category,
    e.description,
    e.quantity,
    e.unit_cost,
    e.total_amount,
    e.expense_date
FROM expenses e
WHERE e.trip_id = 1
ORDER BY e.expense_date, e.expense_id;
