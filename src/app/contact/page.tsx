"use client"

import { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Mail, Phone, MapPin, Send, CheckCircle2, Loader2, Facebook, Twitter, Instagram, Linkedin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"

const contactInfo = [
  {
    icon: Phone,
    label: "Call Us",
    value: "+1 (555) 000-0000",
    subValue: "Mon-Fri from 8am to 6pm"
  },
  {
    icon: Mail,
    label: "Email Us",
    value: "hello@travelexplorer.com",
    subValue: "We usually respond within 24h"
  },
  {
    icon: MapPin,
    label: "Visit Us",
    value: "123 Explorer Way",
    subValue: "San Francisco, CA 94103"
  }
]

const socialLinks = [
  { icon: Facebook, href: "#" },
  { icon: Twitter, href: "#" },
  { icon: Instagram, href: "#" },
  { icon: Linkedin, href: "#" }
]

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsSubmitting(false)
    setIsSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-[#020617] text-white pt-32 pb-20 px-4 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Contact Information Side */}
          <div className="space-y-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <span className="inline-block px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium">
                Get In Touch
              </span>
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
                Let&apos;s Plan Your <br />
                <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                  Next Adventure
                </span>
              </h1>
              <p className="text-xl text-slate-400 leading-relaxed max-w-lg">
                Have questions about a destination or need help with a booking? Our team of travel experts is here to help you every step of the way.
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-1 gap-6">
              {contactInfo.map((info, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1, duration: 0.8 }}
                  className="glass p-6 rounded-3xl border-white/5 flex gap-5 items-start group hover:border-blue-500/30 transition-all duration-500"
                >
                  <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-500">
                    <info.icon className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-1">{info.label}</h3>
                    <p className="text-lg font-bold mb-1">{info.value}</p>
                    <p className="text-sm text-slate-400">{info.subValue}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="space-y-4 pt-4"
            >
              <h3 className="text-lg font-bold border-l-2 border-blue-500 pl-4 ml-1">Follow Our Journeys</h3>
              <div className="flex gap-4 ml-1">
                {socialLinks.map((social, index) => (
                  <Link
                    key={index}
                    href={social.href}
                    className="w-12 h-12 glass rounded-2xl flex items-center justify-center hover:bg-blue-500/20 hover:border-blue-500/40 transition-all duration-300 group"
                  >
                    <social.icon className="w-5 h-5 text-slate-400 group-hover:text-blue-400 transition-colors" />
                  </Link>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Form Side */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="w-full"
          >
            <Card className="glass border-white/10 shadow-[0_0_50px_-12px_rgba(59,130,246,0.1)] rounded-[3rem] overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
              <CardContent className="p-8 md:p-12">
                <AnimatePresence mode="wait">
                  {!isSubmitted ? (
                    <motion.form
                      key="contact-form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onSubmit={handleSubmit}
                      className="space-y-6"
                    >
                      <div className="grid sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="firstName" className="text-slate-300 ml-1">First Name</Label>
                          <Input
                            id="firstName"
                            placeholder="John"
                            required
                            className="bg-white/5 border-white/10 text-white placeholder:text-slate-600 focus:border-blue-500/50 focus:ring-blue-500/20 rounded-2xl h-14"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName" className="text-slate-300 ml-1">Last Name</Label>
                          <Input
                            id="lastName"
                            placeholder="Doe"
                            required
                            className="bg-white/5 border-white/10 text-white placeholder:text-slate-600 focus:border-blue-500/50 focus:ring-blue-500/20 rounded-2xl h-14"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-slate-300 ml-1">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="john@example.com"
                          required
                          className="bg-white/5 border-white/10 text-white placeholder:text-slate-600 focus:border-blue-500/50 focus:ring-blue-500/20 rounded-2xl h-14"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="subject" className="text-slate-300 ml-1">Subject</Label>
                        <Input
                          id="subject"
                          placeholder="How can we help?"
                          required
                          className="bg-white/5 border-white/10 text-white placeholder:text-slate-600 focus:border-blue-500/50 focus:ring-blue-500/20 rounded-2xl h-14"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="message" className="text-slate-300 ml-1">Your Message</Label>
                        <Textarea
                          id="message"
                          placeholder="Tell us about your next dream destination..."
                          required
                          className="bg-white/5 border-white/10 text-white placeholder:text-slate-600 focus:border-blue-500/50 focus:ring-blue-500/20 rounded-2xl min-h-[150px] resize-none"
                        />
                      </div>

                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-2xl h-14 text-lg shadow-xl shadow-blue-500/20 transition-all duration-300 active:scale-[0.98]"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                            Sending Message...
                          </>
                        ) : (
                          <>
                            <Send className="mr-2 h-5 w-5" />
                            Send Message
                          </>
                        )}
                      </Button>
                    </motion.form>
                  ) : (
                    <motion.div
                      key="success-message"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-12 space-y-6"
                    >
                      <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="w-12 h-12 text-green-400" />
                      </div>
                      <div className="space-y-2">
                        <h2 className="text-3xl font-bold">Message Sent!</h2>
                        <p className="text-slate-400 text-lg">
                          Thank you for reaching out. One of our travel experts <br />
                          will get back to you shortly.
                        </p>
                      </div>
                      <Button
                        variant="link"
                        onClick={() => setIsSubmitted(false)}
                        className="text-blue-400 hover:text-blue-300 decoration-blue-400/30"
                      >
                        Send another message
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
