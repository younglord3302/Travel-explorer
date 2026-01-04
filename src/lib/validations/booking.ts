import { z } from 'zod'

export const bookingSchema = z.object({
  startDate: z.string().min(1, 'Please select a start date'),
  numberOfTravelers: z.number().min(1, 'At least 1 traveler is required').max(20, 'Maximum 20 travelers allowed'),
  specialRequests: z.string().optional(),
  contactInfo: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email address'),
    phone: z.string().min(10, 'Please enter a valid phone number'),
  }),
  travelerDetails: z.array(z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    dateOfBirth: z.string().min(1, 'Date of birth is required'),
    nationality: z.string().min(1, 'Nationality is required'),
    passportNumber: z.string().optional(),
    passportExpiry: z.string().optional(),
  })).optional(),
  agreeToTerms: z.boolean().refine(val => val === true, {
    message: 'You must agree to the terms and conditions',
  }),
})

export const searchFiltersSchema = z.object({
  query: z.string().optional(),
  location: z.string().optional(),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  duration: z.number().optional(),
  difficulty: z.enum(['Easy', 'Moderate', 'Challenging']).optional(),
  rating: z.number().min(1).max(5).optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
})

// Export types
export type BookingFormData = z.infer<typeof bookingSchema>
export type SearchFiltersData = z.infer<typeof searchFiltersSchema>
