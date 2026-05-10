// Relational model: Trip → ItinerarySections → Activities
// Matches SRS schema: ItinerarySection(SectionID, TripID, DateRange, Location, SectionBudget)
//                     Activity(ActivityID, Name, City, Description, Cost)

export const tripMeta = {
  tripId: 'trip-europe-summer',
  name: 'Summer in Europe',
  totalBudget: 4200,
};

export const itinerarySections = [
  {
    sectionId: 's1',
    tripId: 'trip-europe-summer',
    dateRange: 'Jun 14 – Jun 16',
    location: 'Paris, France',
    sectionBudget: 1800,
    activities: [
      { activityId: 'a1', name: 'Check-in at boutique hotel', city: 'Paris', description: 'Cozy stay in Le Marais with rooftop terrace', cost: 220 },
      { activityId: 'a2', name: 'Sunset walk along the Seine', city: 'Paris', description: 'Golden-hour stroll from Pont Neuf to Eiffel Tower', cost: 0 },
      { activityId: 'a3', name: 'Louvre morning pass', city: 'Paris', description: 'Skip-the-line entry, Mona Lisa wing first', cost: 26 },
      { activityId: 'a4', name: 'Bistro tasting menu', city: 'Paris', description: 'Five-course dinner at a Michelin-starred bistro', cost: 140 },
    ],
  },
  {
    sectionId: 's2',
    tripId: 'trip-europe-summer',
    dateRange: 'Jun 17 – Jun 19',
    location: 'Amsterdam, Netherlands',
    sectionBudget: 1400,
    activities: [
      { activityId: 'a5', name: 'Canal cruise & drinks', city: 'Amsterdam', description: 'Evening cruise with local craft beer tasting', cost: 48 },
      { activityId: 'a6', name: 'Rijksmuseum visit', city: 'Amsterdam', description: 'Dutch Golden Age masterpieces, audio-guided tour', cost: 22 },
      { activityId: 'a7', name: 'Vondelpark bike ride', city: 'Amsterdam', description: 'Bike rental + picnic lunch in the park', cost: 18 },
    ],
  },
  {
    sectionId: 's3',
    tripId: 'trip-europe-summer',
    dateRange: 'Jun 20 – Jun 22',
    location: 'Prague, Czech Republic',
    sectionBudget: 1000,
    activities: [
      { activityId: 'a8', name: 'Old Town walking tour', city: 'Prague', description: 'Guided walk through Astronomical Clock, Charles Bridge & hidden alleys', cost: 28 },
      { activityId: 'a9', name: 'Traditional Czech dinner', city: 'Prague', description: 'Svíčková, trdelník, and local pilsner at a cellar restaurant', cost: 35 },
      { activityId: 'a10', name: 'Prague Castle tour', city: 'Prague', description: 'St. Vitus Cathedral and Golden Lane exploration', cost: 15 },
      { activityId: 'a11', name: 'Vltava river sunset kayak', city: 'Prague', description: 'Guided kayak session with panoramic castle views', cost: 42 },
    ],
  },
];
