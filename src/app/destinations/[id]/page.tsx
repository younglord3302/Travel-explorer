"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Calendar, MapPin, Star, Users, Clock, CheckCircle, Heart, Share2, Shield, Info, CircleX } from "lucide-react"
import { format } from "date-fns"
import { motion } from "framer-motion"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useAuthStore } from "@/stores/auth-store"
import { createClient } from "@/lib/supabase/client"
import { FALLBACK_DESTINATIONS, type Destination as LocalDestination, type ItineraryDay } from "@/lib/constants"

// Reuse the interface from constants but can extend if needed
type Destination = LocalDestination

// Redundant interfaces removed, using definitions from @/lib/constants

export default function DestinationDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()
  const [destination, setDestination] = useState<Destination | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState(0)

  const supabase = createClient()

  useEffect(() => {
    const fetchDestination = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Check if it's a fallback destination
        const fallback = FALLBACK_DESTINATIONS.find(d => d.id === params.id)
        if (fallback) {
          // Add default empty arrays/objects if missing to match expected type
          setDestination({
            ...fallback,
            itinerary: fallback.itinerary || [],
            included: fallback.included || [],
            excluded: fallback.excluded || [],
            languages: fallback.languages || []
          })
          setLoading(false)
          return
        }

        const { data, error } = await supabase
          .from('destinations')
          .select('*')
          .eq('id', params.id)
          .eq('is_active', true)
          .single()

        if (error) throw error

        setDestination(data)
      } catch (error) {
        console.error('Error fetching destination:', error)
        setError('Destination not found')
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchDestination()
    }
  }, [params.id, supabase])

  const handleBookNow = () => {
    if (!isAuthenticated) {
      router.push('/auth/login')
      return
    }

    // Navigate to booking page with destination data
    router.push(`/bookings/new?destination=${params.id}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error || !destination) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Destination Not Found</h1>
          <p className="text-gray-600 mb-6">The destination you&apos;re looking for doesn&apos;t exist or is no longer available.</p>
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
          <Link href="/" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <MapPin className="h-5 w-5 text-gray-500" />
              <span className="text-sm text-gray-600">{destination.location}, {destination.country}</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Heart className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-2">{destination.name}</h1>

          <div className="flex items-center space-x-4 mb-4">
            <div className="flex items-center space-x-1">
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold">{destination.rating.toFixed(1)}</span>
              <span className="text-gray-600">(2,847 reviews)</span>
            </div>
            <Badge variant="secondary">{destination.difficulty}</Badge>
            <Badge variant="outline">{destination.duration} days</Badge>
          </div>

          <p className="text-lg text-gray-600 max-w-3xl">{destination.description}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <Card>
              <CardContent className="p-0">
                <div className="relative h-[24rem]">
                  <Image
                    src={destination.images[selectedImage] || '/images/placeholder.jpg'}
                    alt={destination.name}
                    fill
                    className="object-cover rounded-t-lg"
                    priority
                  />
                  <div className="absolute bottom-4 left-4">
                    <div className="flex space-x-2">
                      {destination.images.slice(0, 4).map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedImage(index)}
                          className={`w-3 h-3 rounded-full ${
                            selectedImage === index ? 'bg-white' : 'bg-white/50'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
                    {destination.images.map((image, index) => (
                      <div 
                        key={index}
                        className={`relative w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden cursor-pointer transition-all ${
                          selectedImage === index ? 'ring-2 ring-primary ring-offset-2' : 'opacity-70 hover:opacity-100'
                        }`}
                        onClick={() => setSelectedImage(index)}
                      >
                        <Image
                          src={image || '/images/placeholder.jpg'}
                          alt={`${destination.name} ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Highlights */}
            <Card>
              <CardHeader>
                <CardTitle>Trip Highlights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {destination.highlights.map((highlight, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{highlight}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* What&apos;s Included */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="rounded-[2.5rem] border-slate-200 dark:border-white/10 overflow-hidden shadow-lg">
                <CardHeader className="bg-green-50 dark:bg-green-950/20 pb-4">
                  <CardTitle className="text-green-600 dark:text-green-400 flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    What&apos;s Included
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <ul className="space-y-3">
                    {(destination.included || []).map((item, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="rounded-[2.5rem] border-slate-200 dark:border-white/10 overflow-hidden shadow-lg">
                <CardHeader className="bg-red-50 dark:bg-red-950/20 pb-4">
                  <CardTitle className="text-red-600 dark:text-red-400 flex items-center">
                    <CircleX className="h-5 w-5 mr-2" />
                    What&apos;s Not Included
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <ul className="space-y-3">
                    {(destination.excluded || []).map((item, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <div className="h-1.5 w-1.5 rounded-full bg-red-400 mt-2 flex-shrink-0" />
                        <span className="text-sm font-medium text-slate-600 dark:text-slate-400">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Itinerary */}
            {destination.itinerary && destination.itinerary.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Sample Itinerary</CardTitle>
                  <CardDescription>Day-by-day breakdown of your adventure</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {destination.itinerary.map((day: ItineraryDay, index: number) => (
                      <div key={index} className="flex space-x-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-semibold">
                          {index + 1}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{day.title}</h4>
                          <p className="text-gray-600 text-sm">{day.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              {/* Booking Card */}
              <Card className="glass sticky top-24 border-white/10 shadow-2xl overflow-hidden rounded-[2rem]">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/50 via-primary to-primary/50" />
                <CardHeader className="pb-4">
                  <div className="flex items-baseline justify-between mb-2">
                    <CardTitle className="text-3xl font-bold text-slate-900 dark:text-white">
                      ${destination.price.toLocaleString()}
                    </CardTitle>
                    <span className="text-sm font-medium text-slate-500">per person</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm text-slate-600 dark:text-slate-400">
                    <div className="flex items-center space-x-1 px-2 py-1 bg-slate-100 dark:bg-white/5 rounded-full">
                      <Clock className="h-3.5 w-3.5 text-primary" />
                      <span>{destination.duration} days</span>
                    </div>
                    <div className="flex items-center space-x-1 px-2 py-1 bg-slate-100 dark:bg-white/5 rounded-full">
                      <Users className="h-3.5 w-3.5 text-primary" />
                      <span>Max {destination.max_group_size}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Departure Date</label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
                        <input
                          type="date"
                          className="w-full pl-10 p-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all [color-scheme:dark]"
                          min={format(new Date(), 'yyyy-MM-dd')}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Number of Travelers</label>
                      <div className="relative">
                        <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
                        <select className="w-full pl-10 p-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none appearance-none transition-all">
                          {Array.from({ length: Math.min(destination.max_group_size, 10) }, (_, i) => i + 1).map(num => (
                            <option key={num} value={num}>{num} traveler{num > 1 ? 's' : ''}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-primary/5 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600 dark:text-slate-400">Price per person</span>
                      <span className="font-semibold text-slate-900 dark:text-white">${destination.price.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600 dark:text-slate-400">Service Fee</span>
                      <span className="font-semibold text-slate-900 dark:text-white">$0</span>
                    </div>
                    <Separator className="bg-primary/10" />
                    <div className="flex justify-between items-center pt-1">
                      <span className="font-bold text-slate-900 dark:text-white">Total Amount</span>
                      <span className="text-xl font-bold text-primary">${destination.price.toLocaleString()}</span>
                    </div>
                  </div>

                  <Button
                    className="w-full h-14 rounded-2xl text-lg font-bold shadow-xl shadow-primary/20 hover:shadow-primary/30 active:scale-[0.98] transition-all"
                    onClick={handleBookNow}
                  >
                    {isAuthenticated ? 'Book Adventure' : 'Sign In to Book'}
                  </Button>

                  <div className="flex items-center justify-center space-x-2 text-[10px] text-slate-500 font-medium uppercase tracking-widest">
                    <Shield className="h-3 w-3 text-green-500" />
                    <span>Secure Booking Policy</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Trip Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="rounded-3xl border-slate-200 dark:border-white/10 overflow-hidden">
                <CardHeader className="bg-slate-50 dark:bg-white/5 pb-4">
                  <CardTitle className="text-lg font-bold flex items-center">
                    <Info className="h-4 w-4 mr-2 text-primary" />
                    Trip Quick Facts
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500">Activity Level</span>
                    <Badge variant="secondary" className="rounded-full px-3 py-1 font-bold">
                      {destination.difficulty}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500">Languages</span>
                    <span className="font-bold text-slate-900 dark:text-white">{(destination.languages || []).join(', ')}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500">Group Size</span>
                    <span className="font-bold text-slate-900 dark:text-white">Max {destination.max_group_size}</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
