export interface ItineraryDay {
  title: string
  description: string
}

export interface Destination {
  id: string
  name: string
  description: string
  location: string
  country: string
  continent: string
  images: string[]
  price: number
  currency: string
  rating: number
  duration: number
  highlights: string[]
  difficulty: "Easy" | "Moderate" | "Challenging"
  max_group_size: number
  is_active: boolean
  itinerary?: ItineraryDay[]
  included?: string[]
  excluded?: string[]
  languages?: string[]
}

export const FALLBACK_DESTINATIONS: Destination[] = [
  {
    id: "fallback-1",
    name: "Swiss Alps Adventure",
    description: "Experience the majestic beauty of the Swiss Alps with our curated mountain retreat. Perfect for those seeking both adventure and luxury in one of the world's most stunning landscapes.",
    location: "Zermatt",
    country: "Switzerland",
    continent: "Europe",
    images: ["https://images.unsplash.com/photo-1531310197839-ccf54634509e?auto=format&fit=crop&q=80&w=1200"],
    price: 2499,
    currency: "USD",
    rating: 4.9,
    duration: 7,
    highlights: ["Matterhorn Views", "Luxury Chalets", "World-class Skiing", "Alpine Dining"],
    difficulty: "Moderate",
    max_group_size: 12,
    is_active: true,
    itinerary: [
      { title: "Arrival in Zermatt", description: "Transfer to your luxury chalet, followed by a welcome dinner with Matterhorn views." },
      { title: "Gornergrat Panorama", description: "Ride the world's highest open-air cog railway for breathtaking 360-degree views." },
      { title: "Glacier Paradise", description: "Explore the highest cable car station in Europe and the stunning Glacier Palace." },
      { title: "Alpine Trekking", description: "Guided moderate hiking through untouched alpine meadows and crystal-clear lakes." }
    ],
    included: ["Luxury Accommodation", "Daily Breakfast & Dinner", "Professional Mountain Guide"],
    excluded: ["International Flights", "Personal Expenses", "Travel Insurance"],
    languages: ["German", "English", "French"]
  },
  {
    id: "fallback-2",
    name: "Kyoto Heritage Tour",
    description: "Immerse yourself in the ancient traditions and serene beauty of Kyoto. From historic temples to bamboo forests, discover the soul of Japan in its most cultural city.",
    location: "Kyoto",
    country: "Japan",
    continent: "Asia",
    images: ["https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=1200"],
    price: 1850,
    currency: "USD",
    rating: 4.8,
    duration: 5,
    highlights: ["Kinkaku-ji Temple", "Arashiyama Bamboo Grove", "Gion District", "Tea Ceremony"],
    difficulty: "Easy",
    max_group_size: 10,
    is_active: true,
    itinerary: [
      { title: "Gion Discovery", description: "Evening walk through the historic Gion district to spot elusive geiko and maiko." },
      { title: "Temple Trail", description: "Visit the iconic Golden Pavilion (Kinkaku-ji) and the thousand red gates of Fushimi Inari." },
      { title: "Arashiyama Bamboo Grove", description: "Meditative walk through the soaring bamboo stalks and a visit to the Tenryu-ji Temple." },
      { title: "Traditional Tea Ceremony", description: "A private session with a tea master to learn the art of 'The Way of Tea'." }
    ],
    included: ["Traditional Ryokan Stay", "Local Transport Pass", "Tea Ceremony Experience"],
    excluded: ["Lunches", "Extra Drinks", "Flight to Osaka/Tokyo"],
    languages: ["Japanese", "English"]
  },
  {
    id: "fallback-3",
    name: "Santorini Sunset Bliss",
    description: "Escape to the iconic white-washed buildings and blue-domed churches of Santorini. Enjoy breathtaking caldera views and the world's most famous sunsets.",
    location: "Oia",
    country: "Greece",
    continent: "Europe",
    images: ["https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&q=80&w=1200"],
    price: 3200,
    currency: "USD",
    rating: 5.0,
    duration: 6,
    highlights: ["Sunset Cruises", "Volcanic Beaches", "Wine Tasting", "Cliffs of Fira"],
    difficulty: "Easy",
    max_group_size: 8,
    is_active: true,
    itinerary: [
      { title: "Oia Exploration", description: "Wander through the narrow streets of Oia and capture the iconic blue-domed churches." },
      { title: "Volcanic Beach Day", description: "Visit the unique Red Beach and enjoy the crystal-clear Aegean waters." },
      { title: "Caldera Sunset Cruise", description: "A private catamaran tour during sunset with dinner and drinks on board." },
      { title: "Wine Tasting Tour", description: "Visit traditional volcanic vineyards and sample world-renowned Assyrtiko wines." }
    ],
    included: ["Boutique Hotel Stay", "Private Catamaran Sunset Tour", "Local Wine Tasting"],
    excluded: ["Personal Travel", "Extra Meals", "International Flights"],
    languages: ["Greek", "English"]
  },
  {
    id: "fallback-4",
    name: "Bali Tropical Escape",
    description: "Find your balance in the spiritual heart of Bali. Explore lush rice terraces, sacred temples, and pristine beaches in this tropical paradise.",
    location: "Ubud",
    country: "Indonesia",
    continent: "Asia",
    images: ["https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=1200"],
    price: 1200,
    currency: "USD",
    rating: 4.7,
    duration: 10,
    highlights: ["Tegalalang Rice Terrace", "Sacred Monkey Forest", "Uluwatu Temple", "Surf Schools"],
    difficulty: "Moderate",
    max_group_size: 15,
    is_active: true,
    itinerary: [
      { title: "Ubud Markets", description: "Visit the local art markets and the Sacred Monkey Forest." },
      { title: "Beach Hopping", description: "Relax at Sanur and Nusa Dua beaches." },
      { title: "Spiritual Temples", description: "Visit Tirta Empul and witness a traditional purification ritual." }
    ],
    included: ["Eco-Luxury Villa", "Surf Lessons", "Cultural Workshop"],
    excluded: ["Lunches", "Beachfront Massages", "Flights"],
    languages: ["Indonesian", "English"]
  },
  {
    id: "fallback-5",
    name: "Machu Picchu Expedition",
    description: "Embark on the journey of a lifetime to the lost city of the Incas. Trek through the Andes and witness the mystery of Machu Picchu.",
    location: "Cusco",
    country: "Peru",
    continent: "Americas",
    images: ["https://images.unsplash.com/photo-1587595431973-160d0d94add1?auto=format&fit=crop&q=80&w=1200"],
    price: 2100,
    currency: "USD",
    rating: 4.9,
    duration: 8,
    highlights: ["Inca Trail", "Sun Gate Arrival", "Cusco City Tour", "Sacred Valley"],
    difficulty: "Challenging",
    max_group_size: 10,
    is_active: true,
    itinerary: [
      { title: "Cusco Arrival", description: "Acclimatize in Cusco with a light city walking tour." },
      { title: "Inca Trail Launch", description: "Begin the trek from KM 82 and set up the first camp." },
      { title: "The High Pass", description: "Conquer Dead Woman's Pass, the highest point of the trek." },
      { title: "Sun Gate", description: "Arrive at the Sun Gate for the first glimpse of Machu Picchu at sunrise." }
    ],
    included: ["Camping Gear", "Professional Porters", "Machu Picchu Entry & Guided Tour"],
    excluded: ["Sleeping Bags", "Tips for Porters", "Flights to Lima"],
    languages: ["Spanish", "Quechua", "English"]
  },
  {
    id: "fallback-6",
    name: "Amalfi Coast Charm",
    description: "Drive along one of the world's most scenic coastlines. Experience the charm of Positano, Ravello, and Amalfi while enjoying legendary Italian hospitality.",
    location: "Positano",
    country: "Italy",
    continent: "Europe",
    images: ["https://images.unsplash.com/photo-1633321088390-8e12d1b5a59a?auto=format&fit=crop&q=80&w=1200"],
    price: 2800,
    currency: "USD",
    rating: 4.8,
    duration: 7,
    highlights: ["Path of the Gods", "Capri Day Trip", "Limoncello Tasting", "Boutique Hotels"],
    difficulty: "Easy",
    max_group_size: 8,
    is_active: true,
    itinerary: [
      { title: "Positano Vibes", description: "Relax by the beach and explore the vertical village's boutique shops." },
      { title: "Island of Capri", description: "Full day private boat tour around the stunning island of Capri." },
      { title: "Ravello Heights", description: "Visit the cliffside gardens of Villa Rufolo for the best views on the coast." },
      { title: "Cooking Class", description: "Learn to make authentic pasta and limoncello in a family-run trattoria." }
    ],
    included: ["Boutique Hotel Stay", "Private Boat Tour to Capri", "Limoncello Workshop"],
    excluded: ["Local Tourist Taxes", "Parking Fees", "Flights to Naples"],
    languages: ["Italian", "English"]
  }
]
