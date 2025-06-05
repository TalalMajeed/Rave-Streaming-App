import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Logo } from "@/components/logo"
import { Music, Users, Zap, Play, MapPin, Mail, Phone, Twitter, Instagram, Facebook, Github } from "lucide-react"
import Link from "next/link"
import { ContactForm } from "@/components/contact-form"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rave-dark-bg via-rave-dark-surface to-rave-dark-bg">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-rave-dark-border bg-rave-dark-surface/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Logo />
            <div className="hidden md:flex items-center space-x-8">
              <a href="#about" className="text-gray-300 hover:text-white transition-colors">
                About
              </a>
              <a href="#contact" className="text-gray-300 hover:text-white transition-colors">
                Contact
              </a>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/login">
                <Button variant="ghost" className="text-gray-300 hover:text-white">
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button className="bg-rave-accent hover:bg-rave-accent-hover">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Full Height */}
      <section className="min-h-screen flex items-center justify-center px-4 pt-20">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Your Music,
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rave-accent to-purple-400">
                {" "}
                Your Vibe
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Discover millions of songs, create playlists, and share your favorite tracks with friends. Experience
              music like never before with Rave.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/app">
                <Button size="lg" className="bg-rave-accent hover:bg-rave-accent-hover text-white px-8 py-3">
                  <Play className="mr-2 h-5 w-5" />
                  Start Listening
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4 bg-rave-dark-surface/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Why Choose Rave?</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              We're not just another music platform. We're your gateway to musical discovery and connection.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-rave-dark-card border-rave-dark-border">
              <CardContent className="p-6 text-center">
                <Music className="h-12 w-12 text-rave-accent mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Vast Library</h3>
                <p className="text-gray-300">
                  Access millions of songs from every genre and era. From chart-toppers to hidden gems.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-rave-dark-card border-rave-dark-border">
              <CardContent className="p-6 text-center">
                <Users className="h-12 w-12 text-rave-accent mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Social Features</h3>
                <p className="text-gray-300">
                  Share playlists, discover what friends are listening to, and connect through music.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-rave-dark-card border-rave-dark-border">
              <CardContent className="p-6 text-center">
                <Zap className="h-12 w-12 text-rave-accent mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Smart Recommendations</h3>
                <p className="text-gray-300">
                  AI-powered suggestions that learn your taste and introduce you to new favorites.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Section with Two Columns */}
      <section id="contact" className="py-20 px-4 bg-rave-dark-surface/30">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Get in Touch</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Left Side - Contact Information */}
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-semibold text-white mb-6">Contact Information</h3>
                <div className="space-y-6">
                  {/* Address */}
                  <div className="flex items-start gap-4">
                    <div className="bg-rave-accent/20 p-3 rounded-lg">
                      <MapPin className="h-6 w-6 text-rave-accent" />
                    </div>
                    <div>
                      <h4 className="text-white font-medium mb-1">Address</h4>
                      <p className="text-gray-300">
                        123 Music Street
                        <br />
                        San Francisco, CA 94102
                        <br />
                        United States
                      </p>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-start gap-4">
                    <div className="bg-rave-accent/20 p-3 rounded-lg">
                      <Mail className="h-6 w-6 text-rave-accent" />
                    </div>
                    <div>
                      <h4 className="text-white font-medium mb-1">Email</h4>
                      <p className="text-gray-300">
                        <a href="mailto:hello@rave.com" className="hover:text-white transition-colors">
                          hello@rave.com
                        </a>
                      </p>
                      <p className="text-gray-300">
                        <a href="mailto:support@rave.com" className="hover:text-white transition-colors">
                          support@rave.com
                        </a>
                      </p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-start gap-4">
                    <div className="bg-rave-accent/20 p-3 rounded-lg">
                      <Phone className="h-6 w-6 text-rave-accent" />
                    </div>
                    <div>
                      <h4 className="text-white font-medium mb-1">Phone</h4>
                      <p className="text-gray-300">
                        <a href="tel:+1-555-123-4567" className="hover:text-white transition-colors">
                          +1 (555) 123-4567
                        </a>
                      </p>
                      <p className="text-gray-400 text-sm">Monday - Friday, 9AM - 6PM PST</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div>
                <h3 className="text-2xl font-semibold text-white mb-6">Follow Us</h3>
                <div className="flex gap-4">
                  <a
                    href="#"
                    className="bg-rave-dark-card border border-rave-dark-border p-3 rounded-lg hover:bg-rave-dark-surface transition-colors group"
                  >
                    <Twitter className="h-6 w-6 text-gray-400 group-hover:text-rave-accent transition-colors" />
                  </a>
                  <a
                    href="#"
                    className="bg-rave-dark-card border border-rave-dark-border p-3 rounded-lg hover:bg-rave-dark-surface transition-colors group"
                  >
                    <Instagram className="h-6 w-6 text-gray-400 group-hover:text-rave-accent transition-colors" />
                  </a>
                  <a
                    href="#"
                    className="bg-rave-dark-card border border-rave-dark-border p-3 rounded-lg hover:bg-rave-dark-surface transition-colors group"
                  >
                    <Facebook className="h-6 w-6 text-gray-400 group-hover:text-rave-accent transition-colors" />
                  </a>
                  <a
                    href="#"
                    className="bg-rave-dark-card border border-rave-dark-border p-3 rounded-lg hover:bg-rave-dark-surface transition-colors group"
                  >
                    <Github className="h-6 w-6 text-gray-400 group-hover:text-rave-accent transition-colors" />
                  </a>
                </div>
              </div>

              {/* Business Hours */}
              <div>
                <h3 className="text-2xl font-semibold text-white mb-6">Business Hours</h3>
                <div className="bg-rave-dark-card border border-rave-dark-border rounded-lg p-6">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Monday - Friday</span>
                      <span className="text-white">9:00 AM - 6:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Saturday</span>
                      <span className="text-white">10:00 AM - 4:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Sunday</span>
                      <span className="text-gray-400">Closed</span>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-rave-dark-border">
                    <p className="text-gray-400 text-sm">All times are in Pacific Standard Time (PST)</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Contact Form */}
            <div>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-rave-dark-border bg-rave-dark-surface py-12 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <Logo />
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Privacy
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Terms
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Support
              </a>
            </div>
          </div>
          <div className="border-t border-rave-dark-border mt-8 pt-8 text-center">
            <p className="text-gray-400">© 2024 Rave. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
