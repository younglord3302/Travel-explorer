"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { MapPin, Star, Calendar, Users, Filter, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/client"
import { motion } from "framer-motion"
import Image from "next/image"
import { FALLBACK_DESTINATIONS, type Destination } from "@/lib/constants"

// Fallback destinations are used in the useEffect below

export default function DestinationsPage() {
  const [destinations, setDestinations] = useState<Destination[]>([])
  const [filteredDestinations, setFilteredDestinations] = useState<Destination[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedContinent, setSelectedContinent] = useState<string>("")
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("")

  const supabase = createClient()

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const { data, error } = await supabase
          .from('destinations')
          .select('*')
          .eq('is_active', true)
          .order('rating', { ascending: false })

        if (error) throw error

        const fetchedDestinations = data || []
        const allDestinations = fetchedDestinations.length > 0 ? fetchedDestinations : FALLBACK_DESTINATIONS
        
        setDestinations(allDestinations)
        setFilteredDestinations(allDestinations)
      } catch (error) {
        console.error('Error fetching destinations:', error)
        // Set fallback in case of error
        setDestinations(FALLBACK_DESTINATIONS)
        setFilteredDestinations(FALLBACK_DESTINATIONS)
      } finally {
        setLoading(false)
      }
    }

    fetchDestinations()
  }, [supabase])

  useEffect(() => {
    let filtered = destinations

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(dest =>
        dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dest.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dest.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dest.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Filter by continent
    if (selectedContinent) {
      filtered = filtered.filter(dest => dest.continent === selectedContinent)
    }

    // Filter by difficulty
    if (selectedDifficulty) {
      filtered = filtered.filter(dest => dest.difficulty === selectedDifficulty)
    }

    setFilteredDestinations(filtered)
  }, [destinations, searchQuery, selectedContinent, selectedDifficulty])

  const continents = [...new Set(destinations.map(d => d.continent))]
  const difficulties = [...new Set(destinations.map(d => d.difficulty))]

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedContinent("")
    setSelectedDifficulty("")
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="relative bg-slate-950 pt-32 pb-24 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 blur-[120px] rounded-full animate-float" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/10 blur-[120px] rounded-full animate-pulse" />
        
        <div className="container relative mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl md:text-6xl font-black text-white mb-6 tracking-tight">
              Where will you <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-indigo-400">go next?</span>
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Explore our hand-picked selection of the world&apos;s most breathtaking destinations.
            </p>
          </motion.div>

          {/* Search and Filters */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="max-w-5xl mx-auto"
          >
            <div className="glass p-2 md:p-4 rounded-[2.5rem] border-white/10 shadow-2xl flex flex-col md:flex-row gap-4 items-stretch md:items-center">
              {/* Search Bar */}
              <div className="flex-1 relative group">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-primary h-5 w-5 group-focus-within:scale-110 transition-transform" />
                <Input
                  type="text"
                  placeholder="Search destinations, locations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-14 h-16 bg-white/5 border-none rounded-[2rem] text-lg text-white placeholder:text-slate-500 focus-visible:ring-1 focus-visible:ring-white/20 transition-all"
                />
              </div>

              {/* Filter Row */}
              <div className="flex flex-wrap md:flex-nowrap gap-3 px-2">
                <div className="flex items-center bg-white/5 rounded-2xl px-4 h-16 border border-white/5">
                  <Filter className="h-4 w-4 text-primary mr-3" />
                  <select
                    value={selectedContinent}
                    onChange={(e) => setSelectedContinent(e.target.value)}
                    className="bg-transparent border-none text-white text-sm focus:ring-0 outline-none appearance-none cursor-pointer pr-8"
                  >
                    <option value="" className="bg-slate-900">All Continents</option>
                    {continents.map(continent => (
                      <option key={continent} value={continent} className="bg-slate-900">{continent}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center bg-white/5 rounded-2xl px-4 h-16 border border-white/5">
                  <Users className="h-4 w-4 text-primary mr-3" />
                  <select
                    value={selectedDifficulty}
                    onChange={(e) => setSelectedDifficulty(e.target.value)}
                    className="bg-transparent border-none text-white text-sm focus:ring-0 outline-none appearance-none cursor-pointer pr-8"
                  >
                    <option value="" className="bg-slate-900">All Difficulties</option>
                    {difficulties.map(difficulty => (
                      <option key={difficulty} value={difficulty} className="bg-slate-900">{difficulty}</option>
                    ))}
                  </select>
                </div>

                {(searchQuery || selectedContinent || selectedDifficulty) && (
                  <Button 
                    variant="ghost" 
                    className="h-16 px-6 text-white hover:bg-white/10 rounded-2xl"
                    onClick={clearFilters}
                  >
                    Clear
                  </Button>
                )}
                
                <Button className="h-16 px-10 bg-primary hover:bg-primary/90 text-white rounded-[1.8rem] font-bold text-lg shadow-xl shadow-primary/20 transition-all active:scale-95">
                  Search
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Results */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            {filteredDestinations.length} destination{filteredDestinations.length !== 1 ? 's' : ''} found
          </p>
        </div>

        {filteredDestinations.length === 0 ? (
          <div className="text-center py-12">
            <MapPin className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No destinations found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search criteria or filters.
            </p>
            <Button onClick={clearFilters}>Clear All Filters</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDestinations.map((destination) => (
              <Card key={destination.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video bg-gray-200 relative overflow-hidden">
                  {destination.images && destination.images.length > 0 ? (
                    <Image
                      src={destination.images[0]}
                      alt={destination.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
                      <MapPin className="h-12 w-12 text-white" />
                    </div>
                  )}
                  <div className="absolute top-3 right-3">
                    <Badge variant="secondary" className="bg-white/90 text-gray-900">
                      {destination.difficulty}
                    </Badge>
                  </div>
                  <div className="absolute bottom-3 left-3 text-white">
                    <div className="flex items-center space-x-1 bg-black/50 rounded px-2 py-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{destination.rating.toFixed(1)}</span>
                    </div>
                  </div>
                </div>

                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl mb-1">{destination.name}</CardTitle>
                      <CardDescription className="flex items-center space-x-1">
                        <MapPin className="h-4 w-4" />
                        <span>{destination.location}, {destination.country}</span>
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {destination.description}
                  </p>

                  <div className="flex items-center justify-between mb-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{destination.duration} days</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4" />
                      <span>Max {destination.max_group_size}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="text-2xl font-bold text-primary">
                        ${destination.price.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-500">per person</div>
                    </div>
                    <Link href={`/destinations/${destination.id}`}>
                      <Button>View Details</Button>
                    </Link>
                  </div>

                  {destination.highlights && destination.highlights.length > 0 && (
                    <div className="pt-3 border-t">
                      <p className="text-xs text-gray-500 mb-2">Highlights:</p>
                      <div className="flex flex-wrap gap-1">
                        {destination.highlights.slice(0, 3).map((highlight, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {highlight.length > 20 ? highlight.substring(0, 20) + '...' : highlight}
                          </Badge>
                        ))}
                        {destination.highlights.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{destination.highlights.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
