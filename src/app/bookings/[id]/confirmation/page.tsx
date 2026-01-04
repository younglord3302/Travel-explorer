"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { CheckCircle, Calendar, MapPin, Users, Download, Mail, Home } from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useAuthStore } from "@/stores/auth-store"
import { createClient } from "@/lib/supabase/client"

interface Booking {
  id: string
  start_date: string
  end_date: string
  number_of_travelers: number
  total_price: number
  currency: string
  status: string
  contact_info: {
    name: string
    email: string
    phone: string
  }
  special_requests: string | null
  destinations: {
    id: string
    name: string
    location: string
    country: string
    duration: number
  } | null
}

export default function BookingConfirmationPage() {
  const params = useParams()
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()
  const [booking, setBooking] = useState<Booking | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const supabase = createClient()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login')
      return
    }

    const fetchBooking = async () => {
      if (!params.id) {
        setError('Booking ID not found')
        setLoading(false)
        return
      }

      try {
        const { data, error } = await supabase
          .from('bookings')
          .select(`
            id,
            start_date,
            end_date,
            number_of_travelers,
            total_price,
            currency,
            status,
            contact_info,
            special_requests,
            destinations (
              id,
              name,
              location,
              country,
              duration
            )
          `)
          .eq('id', params.id)
          .single()

        if (error) throw error

        setBooking(data as unknown as Booking)
      } catch (error) {
        console.error('Error fetching booking:', error)
        setError('Booking not found or access denied')
      } finally {
        setLoading(false)
      }
    }

    fetchBooking()
  }, [params.id, isAuthenticated, router, supabase])

  const handleDownloadReceipt = () => {
    // In a real application, this would generate and download a PDF receipt
    alert('Receipt download feature would be implemented here')
  }

  const handleEmailConfirmation = () => {
    // In a real application, this would send an email confirmation
    alert('Email confirmation would be sent to: ' + booking?.contact_info.email)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Booking Not Found</h1>
          <p className="text-gray-600 mb-6">{error || 'Something went wrong'}</p>
          <Link href="/dashboard">
            <Button>Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
            <p className="text-lg text-gray-600">
              Your adventure has been successfully booked. We&apos;re excited to help you create unforgettable memories!
            </p>
          </div>

          {/* Booking Summary */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span>Booking #{booking.id.slice(-8).toUpperCase()}</span>
              </CardTitle>
              <CardDescription>
                Your booking details and confirmation information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Trip Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-lg mb-4">Trip Details</h3>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="font-medium">{booking.destinations?.name || 'Unknown Destination'}</p>
                        <p className="text-gray-600">{booking.destinations?.location || ''}, {booking.destinations?.country || ''}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Calendar className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="font-medium">
                          {format(new Date(booking.start_date), 'MMM dd, yyyy')} - {format(new Date(booking.end_date), 'MMM dd, yyyy')}
                        </p>
                        <p className="text-gray-600">{booking.destinations?.duration || 0} days</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Users className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="font-medium">{booking.number_of_travelers} traveler{booking.number_of_travelers > 1 ? 's' : ''}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-4">Contact Information</h3>
                  <div className="space-y-2">
                    <p><span className="font-medium">Name:</span> {booking.contact_info.name}</p>
                    <p><span className="font-medium">Email:</span> {booking.contact_info.email}</p>
                    <p><span className="font-medium">Phone:</span> {booking.contact_info.phone}</p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Pricing */}
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-600">Booking Status</p>
                  <p className="font-medium text-green-600 capitalize">{booking.status}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Total Amount</p>
                  <p className="text-2xl font-bold text-primary">
                    {booking.currency} ${booking.total_price.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Special Requests */}
              {booking.special_requests && (
                <>
                  <Separator />
                  <div>
                    <h3 className="font-semibold mb-2">Special Requests</h3>
                    <p className="text-gray-600">{booking.special_requests}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>What&apos;s Next?</CardTitle>
              <CardDescription>Your booking journey continues here</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Mail className="h-6 w-6 text-blue-600" />
                  </div>
                  <h4 className="font-semibold mb-1">Email Confirmation</h4>
                  <p className="text-sm text-gray-600">Check your inbox for booking details</p>
                </div>

                <div className="text-center p-4 border rounded-lg">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Calendar className="h-6 w-6 text-green-600" />
                  </div>
                  <h4 className="font-semibold mb-1">Trip Planning</h4>
                  <p className="text-sm text-gray-600">We&apos;ll contact you with preparation details</p>
                </div>

                <div className="text-center p-4 border rounded-lg">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <CheckCircle className="h-6 w-6 text-purple-600" />
                  </div>
                  <h4 className="font-semibold mb-1">Adventure Awaits</h4>
                  <p className="text-sm text-gray-600">Get ready for your unforgettable journey</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={handleDownloadReceipt}>
              <Download className="mr-2 h-4 w-4" />
              Download Receipt
            </Button>

            <Button variant="outline" onClick={handleEmailConfirmation}>
              <Mail className="mr-2 h-4 w-4" />
              Email Confirmation
            </Button>

            <Link href="/dashboard">
              <Button variant="outline">
                <Home className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
          </div>

          {/* Important Information */}
          <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">Important Information</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• A confirmation email has been sent to {booking.contact_info.email}</li>
              <li>• Keep this booking reference number: {booking.id.slice(-8).toUpperCase()}</li>
              <li>• Contact us at support@travel-explorer.com for any questions</li>
              <li>• Check-in details will be provided 7 days before departure</li>
              <li>• Emergency contact: +1 (555) 123-4567</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
