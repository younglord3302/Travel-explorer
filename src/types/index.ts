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
  duration: number // in days
  highlights: string[]
  itinerary: ItineraryItem[]
  included: string[]
  excluded: string[]
  difficulty: 'Easy' | 'Moderate' | 'Challenging'
  maxGroupSize: number
  languages: string[]
  createdAt: Date
  updatedAt: Date
}

export interface ItineraryItem {
  day: number
  title: string
  description: string
  activities: string[]
  meals: string[]
  accommodation: string
}

export interface Booking {
  id: string
  userId: string
  destinationId: string
  destination?: Destination
  startDate: Date
  endDate: Date
  numberOfTravelers: number
  totalPrice: number
  currency: string
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  paymentStatus: 'pending' | 'paid' | 'refunded'
  specialRequests?: string
  contactInfo: {
    name: string
    email: string
    phone: string
  }
  travelerDetails: TravelerDetail[]
  createdAt: Date
  updatedAt: Date
}

export interface TravelerDetail {
  firstName: string
  lastName: string
  dateOfBirth: Date
  passportNumber?: string
  nationality: string
  specialRequirements?: string
}

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  avatar?: string
  phone?: string
  dateOfBirth?: Date
  nationality?: string
  emergencyContact?: {
    name: string
    phone: string
    relationship: string
  }
  preferences: {
    dietaryRestrictions: string[]
    accessibilityNeeds: string[]
    preferredActivities: string[]
  }
  createdAt: Date
  updatedAt: Date
}

export interface Review {
  id: string
  userId: string
  destinationId: string
  bookingId: string
  rating: number
  title: string
  comment: string
  images?: string[]
  helpful: number
  verified: boolean
  createdAt: Date
}

export interface SearchFilters {
  query?: string
  location?: string
  minPrice?: number
  maxPrice?: number
  duration?: number
  difficulty?: string
  rating?: number
  startDate?: Date
  endDate?: Date
}

export interface PaymentIntent {
  id: string
  clientSecret: string
  amount: number
  currency: string
  status: string
}
