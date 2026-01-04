"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Calendar, MapPin, Users, CreditCard, Loader2 } from "lucide-react"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
// Badge import removed as it was unused
import { useAuthStore } from "@/stores/auth-store"
import { bookingSchema, type BookingFormData } from "@/lib/validations/booking"
import { createClient } from "@/lib/supabase/client"

interface Destination {
  id: string
  name: string
  description: string
  location: string
  country: string
  price: number
  currency: string
  duration: number
  max_group_size: number
}

function NewBookingPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, isAuthenticated } = useAuthStore()
  const [destination, setDestination] = useState<Destination | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const supabase = createClient()
  const destinationId = searchParams.get('destination')

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      startDate: format(new Date(), 'yyyy-MM-dd'),
      numberOfTravelers: 1,
      contactInfo: {
        name: user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : '',
        email: user?.email || '',
        phone: user?.phone || '',
      },
      travelerDetails: [],
      specialRequests: '',
      agreeToTerms: false,
    },
  })

  const { fields: travelerFields, append: appendTraveler, remove: removeTraveler } = useFieldArray({
    control,
    name: "travelerDetails",
  })

  const numberOfTravelers = watch("numberOfTravelers")

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login')
      return
    }

    const fetchDestination = async () => {
      if (!destinationId) {
        setError('No destination selected')
        setLoading(false)
        return
      }

      try {
        const { data, error } = await supabase
          .from('destinations')
          .select('id, name, description, location, country, price, currency, duration, max_group_size')
          .eq('id', destinationId)
          .eq('is_active', true)
          .single()

        if (error) throw error

        setDestination(data)

        // Update traveler details based on number of travelers
        const travelers = Array.from({ length: Math.max(0, numberOfTravelers - 1) }, () => ({
          firstName: '',
          lastName: '',
          dateOfBirth: '',
          nationality: '',
          passportNumber: '',
          passportExpiry: '',
        }))

        setValue('travelerDetails', travelers)
      } catch (error) {
        console.error('Error fetching destination:', error)
        setError('Destination not found')
      } finally {
        setLoading(false)
      }
    }

    fetchDestination()
  }, [destinationId, isAuthenticated, router, supabase, numberOfTravelers, setValue])

  // Update traveler details when number of travelers changes
  useEffect(() => {
    const currentTravelers = travelerFields.length
    const newTravelers = Math.max(0, numberOfTravelers - 1)

    if (newTravelers > currentTravelers) {
      // Add travelers
      for (let i = currentTravelers; i < newTravelers; i++) {
        appendTraveler({
          firstName: '',
          lastName: '',
          dateOfBirth: '',
          nationality: '',
          passportNumber: '',
          passportExpiry: '',
        })
      }
    } else if (newTravelers < currentTravelers) {
      // Remove travelers
      for (let i = currentTravelers - 1; i >= newTravelers; i--) {
        removeTraveler(i)
      }
    }
  }, [numberOfTravelers, travelerFields.length, appendTraveler, removeTraveler])

  const onSubmit = async (data: BookingFormData) => {
    if (!destination) return

    setSubmitting(true)
    setError(null)

    try {
      // Calculate total price
      const totalPrice = destination.price * data.numberOfTravelers

      // Create booking
      const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .insert({
          user_id: user!.id,
          destination_id: destination.id,
          start_date: data.startDate,
          end_date: new Date(new Date(data.startDate).getTime() + destination.duration * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          number_of_travelers: data.numberOfTravelers,
          total_price: totalPrice,
          currency: destination.currency,
          contact_info: data.contactInfo,
          traveler_details: data.travelerDetails,
          special_requests: data.specialRequests,
        })
        .select()
        .single()

      if (bookingError) throw bookingError

      // Redirect to booking confirmation
      router.push(`/bookings/${booking.id}/confirmation`)
    } catch (error) {
      console.error('Error creating booking:', error)
      setError('Failed to create booking. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (error || !destination) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error</h1>
          <p className="text-gray-600 mb-6">{error || 'Something went wrong'}</p>
          <Link href="/destinations">
            <Button>Back to Destinations</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <Link href={`/destinations/${destination.id}`} className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to {destination.name}
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Booking</h1>
            <p className="text-gray-600">Fill in the details below to secure your spot on this amazing adventure.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Trip Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5" />
                  <span>Trip Summary</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">{destination.name}</h3>
                    <p className="text-gray-600 mb-4">{destination.description}</p>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4" />
                        <span>{destination.location}, {destination.country}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4" />
                        <span>{destination.duration} days</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4" />
                        <span>Max {destination.max_group_size} travelers</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-primary mb-2">
                      ${destination.price.toLocaleString()}
                    </div>
                    <div className="text-gray-600">per person</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Booking Details */}
            <Card>
              <CardHeader>
                <CardTitle>Booking Details</CardTitle>
                <CardDescription>Choose your travel dates and group size</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Departure Date</Label>
                    <Input
                      id="startDate"
                      type="date"
                      {...register("startDate")}
                      min={format(new Date(), 'yyyy-MM-dd')}
                      className={errors.startDate ? "border-red-500" : ""}
                    />
                    {errors.startDate && (
                      <p className="text-sm text-red-500">{errors.startDate.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="numberOfTravelers">Number of Travelers</Label>
                    <select
                      id="numberOfTravelers"
                      {...register("numberOfTravelers", { valueAsNumber: true })}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      {Array.from({ length: Math.min(destination.max_group_size, 10) }, (_, i) => i + 1).map(num => (
                        <option key={num} value={num}>{num} traveler{num > 1 ? 's' : ''}</option>
                      ))}
                    </select>
                    {errors.numberOfTravelers && (
                      <p className="text-sm text-red-500">{errors.numberOfTravelers.message}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>We&apos;ll use this information to send you booking confirmations and updates</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="contactName">Full Name</Label>
                    <Input
                      id="contactName"
                      placeholder="John Doe"
                      {...register("contactInfo.name")}
                      className={errors.contactInfo?.name ? "border-red-500" : ""}
                    />
                    {errors.contactInfo?.name && (
                      <p className="text-sm text-red-500">{errors.contactInfo.name.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contactEmail">Email Address</Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      placeholder="john@example.com"
                      {...register("contactInfo.email")}
                      className={errors.contactInfo?.email ? "border-red-500" : ""}
                    />
                    {errors.contactInfo?.email && (
                      <p className="text-sm text-red-500">{errors.contactInfo.email.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contactPhone">Phone Number</Label>
                    <Input
                      id="contactPhone"
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      {...register("contactInfo.phone")}
                      className={errors.contactInfo?.phone ? "border-red-500" : ""}
                    />
                    {errors.contactInfo?.phone && (
                      <p className="text-sm text-red-500">{errors.contactInfo.phone.message}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Traveler Details */}
            {travelerFields.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Additional Traveler Details</CardTitle>
                  <CardDescription>Please provide information for all travelers in your group</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {travelerFields.map((field, index) => (
                    <div key={field.id} className="border rounded-lg p-6">
                      <h4 className="font-semibold mb-4">Traveler {index + 2}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`traveler-${index}-firstName`}>First Name</Label>
                          <Input
                            id={`traveler-${index}-firstName`}
                            {...register(`travelerDetails.${index}.firstName`)}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`traveler-${index}-lastName`}>Last Name</Label>
                          <Input
                            id={`traveler-${index}-lastName`}
                            {...register(`travelerDetails.${index}.lastName`)}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`traveler-${index}-dateOfBirth`}>Date of Birth</Label>
                          <Input
                            id={`traveler-${index}-dateOfBirth`}
                            type="date"
                            {...register(`travelerDetails.${index}.dateOfBirth`)}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`traveler-${index}-nationality`}>Nationality</Label>
                          <Input
                            id={`traveler-${index}-nationality`}
                            {...register(`travelerDetails.${index}.nationality`)}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`traveler-${index}-passportNumber`}>Passport Number</Label>
                          <Input
                            id={`traveler-${index}-passportNumber`}
                            {...register(`travelerDetails.${index}.passportNumber`)}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`traveler-${index}-passportExpiry`}>Passport Expiry</Label>
                          <Input
                            id={`traveler-${index}-passportExpiry`}
                            type="date"
                            {...register(`travelerDetails.${index}.passportExpiry`)}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Special Requests */}
            <Card>
              <CardHeader>
                <CardTitle>Special Requests</CardTitle>
                <CardDescription>Any special requirements or preferences for your trip</CardDescription>
              </CardHeader>
              <CardContent>
                <textarea
                  {...register("specialRequests")}
                  placeholder="Dietary restrictions, accessibility needs, celebration occasions, etc."
                  className="w-full p-3 border border-gray-300 rounded-md resize-none"
                  rows={4}
                />
              </CardContent>
            </Card>

            {/* Terms and Conditions */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="agreeToTerms"
                    {...register("agreeToTerms")}
                    className="mt-1"
                  />
                  <div className="text-sm">
                    <Label htmlFor="agreeToTerms" className="text-gray-900 font-medium">
                      I agree to the Terms and Conditions and Privacy Policy
                    </Label>
                    <p className="text-gray-600 mt-1">
                      By booking this trip, you agree to our terms of service and cancellation policy.
                      Please review the full terms before proceeding.
                    </p>
                    {errors.agreeToTerms && (
                      <p className="text-red-500 mt-1">{errors.agreeToTerms.message}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-600">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <Link href={`/destinations/${destination.id}`}>
                <Button variant="outline" type="button">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" size="lg" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Complete Booking
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default function NewBookingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    }>
      <NewBookingPageContent />
    </Suspense>
  )
}
