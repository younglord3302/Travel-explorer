"use client"

import { motion } from "framer-motion"
import { Shield, Target, Compass } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const stats = [
  { label: "Happy Travelers", value: "50k+" },
  { label: "Destinations", value: "200+" },
  { label: "Travel Experts", value: "100+" },
  { label: "Positive Reviews", value: "15k+" },
]

const values = [
  {
    icon: Shield,
    title: "Safety First",
    description: "Your safety is our top priority. We vet all our partners and destinations rigorously."
  },
  {
    icon: Target,
    title: "Eco-Conscious",
    description: "We believe in sustainable travel that preserves the beauty of our planet."
  },
  {
    icon: Compass,
    title: "Authentic Experience",
    description: "We take you off the beaten path to discover true local cultures and secrets."
  }
]

const team = [
  {
    name: "Alex Thompson",
    role: "Founder & CEO",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400"
  },
  {
    name: "Sarah Chen",
    role: "Head of Operations",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=400"
  },
  {
    name: "Michael Rodriguez",
    role: "Chief Travel Officer",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400"
  }
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#020617] text-white overflow-hidden pb-20">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4">
        <div className="absolute top-0 left-0 w-full h-[600px] overflow-hidden z-0">
          <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-[20%] left-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-6xl mx-auto relative z-10 text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-6">
              Our Journey
            </span>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
              Redefining the Way You <br />
              <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Experience the World
              </span>
            </h1>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
              We started with a simple belief: that travel should be more than just a destination. It should be a transformative journey that connects us to the extraordinary.
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-12"
          >
            {stats.map((stat, index) => (
              <div key={index} className="glass p-8 rounded-3xl border-white/5 shadow-2xl">
                <div className="text-4xl font-bold bg-gradient-to-br from-white to-slate-400 bg-clip-text text-transparent mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-slate-500 font-medium uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative h-[500px] group"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-purple-600/20 rounded-[3rem] blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <Image
              src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=1000"
              alt="Our Story"
              fill
              className="object-cover rounded-[3rem] border border-white/10 shadow-2xl transition-transform duration-700 group-hover:scale-[1.02]"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <h2 className="text-4xl font-bold mb-6">How It All Started</h2>
            <div className="space-y-4 text-slate-400 text-lg leading-relaxed">
              <p>
                Founded in 2018, TravelExplorer began as a small blog documenting remote adventures. What started as a passion project quickly evolved into a platform dedicated to making high-end, immersive travel accessible to all.
              </p>
              <p>
                Today, we operate in over 40 countries, collaborating with local guides and eco-conscious partners to create experiences that are as responsible as they are breathtaking.
              </p>
            </div>
            <div className="pt-6">
              <Button asChild variant="outline" className="rounded-full border-blue-500/30 text-blue-400 hover:bg-blue-500/10 h-12 px-8">
                <Link href="/contact">Learn More About Us</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 px-4 relative">
        <div className="max-w-6xl mx-auto text-center space-y-16">
          <div className="space-y-4">
            <h2 className="text-4xl font-bold">What We Stand For</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Our values guide everything we do, from the destinations we choose to the way we treat our guests.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.8 }}
                className="glass p-10 rounded-3xl border-white/5 hover:border-blue-500/30 transition-all duration-500 group"
              >
                <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                  <value.icon className="w-7 h-7 text-blue-400" />
                </div>
                <h3 className="text-xl font-bold mb-4">{value.title}</h3>
                <p className="text-slate-400 leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto text-center space-y-16">
          <div className="space-y-4">
            <h2 className="text-4xl font-bold">The Visionaries</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Meet the passionate individuals working behind the scenes to make your travel dreams a reality.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.8 }}
                className="group"
              >
                <div className="relative w-full aspect-square mb-6 overflow-hidden rounded-[2.5rem] border border-white/5 shadow-2xl">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-110 group-hover:scale-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
                <h3 className="text-2xl font-bold mb-1">{member.name}</h3>
                <p className="text-blue-400 font-medium">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto glass p-12 md:p-20 rounded-[4rem] text-center space-y-8 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-600/10 to-purple-600/10 z-0" />
          <div className="relative z-10 space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Ready to Start Your <br /> Own Story?</h2>
            <p className="text-lg text-slate-400 max-w-xl mx-auto">
              Explore our curated collection of extraordinary destinations and book your next escape today.
            </p>
            <div className="pt-4">
              <Button asChild size="lg" className="rounded-full bg-white text-black hover:bg-slate-200 h-14 px-10 text-lg font-bold transition-all duration-300 hover:scale-105 active:scale-95 shadow-xl shadow-white/10">
                <Link href="/destinations">Explore Destinations</Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  )
}
