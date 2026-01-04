"use client"

import Link from "next/link"
import { ArrowRight, MapPin, Star, Calendar, Search, Globe, Shield, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { motion } from "framer-motion"
import Image from "next/image"

export default function Home() {
  const featuredDestinations = [
    {
      id: "1",
      name: "Santorini, Greece",
      location: "Greece",
      image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=800&q=80",
      rating: 4.9,
      reviews: 2847,
      price: 1299,
      duration: 7,
      description: "Experience the stunning sunsets and white-washed buildings of this iconic Greek island.",
    },
    {
      id: "2",
      name: "Tokyo, Japan",
      location: "Japan",
      image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=800&q=80",
      rating: 4.8,
      reviews: 3256,
      price: 1899,
      duration: 10,
      description: "Dive into the vibrant culture, technology, and cuisine of Japan's bustling capital.",
    },
    {
      id: "3",
      name: "Machu Picchu, Peru",
      location: "Peru",
      image: "https://images.unsplash.com/photo-1587593810167-a84920ea0781?auto=format&fit=crop&w=800&q=80",
      rating: 4.7,
      reviews: 1923,
      price: 1599,
      duration: 8,
      description: "Explore the ancient Incan citadel nestled high in the Andes Mountains.",
    },
  ]

  const features = [
    {
      icon: Globe,
      title: "Curated Destinations",
      description: "Handpicked locations offering unique experiences and authentic adventures.",
    },
    {
      icon: Shield,
      title: "Expert Guides",
      description: "Professional local guides ensuring safe and enriching travel experiences.",
    },
    {
      icon: Calendar,
      title: "Flexible Booking",
      description: "Easy booking with flexible dates and instant confirmations.",
    },
    {
      icon: CreditCard,
      title: "Secure Payments",
      description: "5-star security with 24/7 support throughout your journey.",
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Animated Background Overlay */}
        <div className="absolute inset-0 bg-slate-950">
          <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 via-purple-500/20 to-pink-500/20 animate-pulse" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px] animate-float" />
        </div>
        
        <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl sm:text-6xl lg:text-8xl font-black mb-8 leading-tight tracking-tight">
              Escape to <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-400 to-pink-400 text-glow">
                Extraordinary
              </span>
            </h1>
            <p className="text-xl sm:text-2xl mb-12 text-slate-300 max-w-2xl mx-auto font-light leading-relaxed">
              Discover breathtaking destinations and create unforgettable memories with our curated travel experiences.
            </p>
          </motion.div>

          {/* Search Bar - Glass Effect */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="glass rounded-3xl p-3 max-w-3xl mx-auto mb-12"
          >
            <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-2">
              <div className="flex items-center px-4 py-3 space-x-3 bg-white/5 rounded-2xl border border-white/10 hover:border-white/20 transition-all">
                <MapPin className="w-5 h-5 text-primary" />
                <Input
                  placeholder="Where to?"
                  className="bg-transparent border-none focus-visible:ring-0 p-0 text-white placeholder:text-slate-400"
                />
              </div>
              <div className="flex items-center px-4 py-3 space-x-3 bg-white/5 rounded-2xl border border-white/10 hover:border-white/20 transition-all">
                <Calendar className="w-5 h-5 text-primary" />
                <Input
                  type="date"
                  className="bg-transparent border-none focus-visible:ring-0 p-0 text-white [color-scheme:dark]"
                />
              </div>
              <Button size="lg" className="rounded-2xl px-8 h-full bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/20">
                <Search className="w-5 h-5 mr-2" />
                Search
              </Button>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="flex flex-col sm:flex-row gap-6 justify-center"
          >
            <Link href="/destinations">
              <Button size="lg" className="rounded-full px-8 bg-white text-slate-900 hover:bg-slate-100 transition-all">
                Explore Destinations
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="/destinations">
              <Button size="lg" variant="outline" className="rounded-full px-8 border-white/20 text-white hover:bg-white/10 transition-all backdrop-blur-sm">
                Plan Your Trip
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 tracking-tight">
              Why TravelExplorer?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-light">
              We provide exceptional travel experiences with personalized service and unforgettable adventures.
            </p>
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12"
          >
            {features.map((feature, index) => (
              <motion.div key={index} variants={itemVariants} className="group p-8 rounded-3xl transition-all hover:glass">
                <div className="w-14 h-14 glass rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  <feature.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed font-light">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Destinations */}
      <section className="py-24 bg-slate-50 dark:bg-slate-900/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-4xl font-bold mb-4 tracking-tight">
                Featured Destinations
              </h2>
              <p className="text-lg text-muted-foreground font-light">
                Discover our most popular destinations, carefully selected for their unique beauty and experiences.
              </p>
            </div>
            <Link href="/destinations">
              <Button variant="link" className="text-primary group text-lg p-0">
                View All Destinations
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {featuredDestinations.map((destination, index) => (
              <motion.div
                key={destination.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="group overflow-hidden rounded-[2rem] border-none shadow-2xl shadow-slate-200/50 dark:shadow-none hover:-translate-y-2 transition-all duration-500">
                  <div className="aspect-[4/5] relative overflow-hidden">
                    <Image 
                      src={destination.image} 
                      alt={destination.name}
                      fill
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80" />
                    
                    <div className="absolute top-6 left-6">
                      <div className="glass px-4 py-2 rounded-full flex items-center space-x-2">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-bold text-white">{destination.rating}</span>
                      </div>
                    </div>

                    <div className="absolute bottom-8 left-8 right-8 text-white">
                      <div className="flex items-center space-x-2 text-primary-foreground/80 mb-2">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm font-medium tracking-wide uppercase">{destination.location}</span>
                      </div>
                      <h3 className="text-3xl font-bold mb-4 tracking-tight">
                        {destination.name}
                      </h3>
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                          <span className="text-slate-400 text-sm">Starts from</span>
                          <span className="text-2xl font-bold">${destination.price}</span>
                        </div>
                        <Link href={`/destinations/${destination.id}`}>
                          <Button className="rounded-full w-12 h-12 p-0 bg-white text-slate-900 hover:bg-primary hover:text-white transition-all">
                            <ArrowRight className="w-5 h-5" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-[3rem] overflow-hidden bg-slate-950 p-12 md:p-24 text-center">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/40 via-purple-500/20 to-transparent" />
            <div className="relative z-10 max-w-3xl mx-auto text-white">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
                Ready to Start Your <br /> Adventure?
              </h2>
              <p className="text-xl mb-12 text-slate-400 font-light leading-relaxed">
                Join thousands of travelers who have discovered their dream destinations with us.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Button size="lg" className="rounded-full px-12 bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20 transition-all">
                  Get Started Today
                </Button>
                <Button size="lg" variant="outline" className="rounded-full px-12 border-white/20 text-white hover:bg-white/10 transition-all backdrop-blur-sm">
                  Contact Our Experts
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
