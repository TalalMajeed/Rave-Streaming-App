"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Send, CheckCircle } from "lucide-react"

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    topic: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleTopicChange = (value: string) => {
    setFormData((prev) => ({ ...prev, topic: value }))
    if (errors.topic) {
      setErrors((prev) => ({ ...prev, topic: "" }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email"
    }

    if (!formData.topic) {
      newErrors.topic = "Please select a topic"
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsSubmitting(false)
    setIsSubmitted(true)

    // Reset form after 5 seconds
    setTimeout(() => {
      setIsSubmitted(false)
      setFormData({
        name: "",
        email: "",
        topic: "",
        message: "",
      })
    }, 5000)
  }

  if (isSubmitted) {
    return (
      <Card className="bg-rave-dark-card border-rave-dark-border">
        <CardContent className="p-8 text-center">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="rounded-full bg-green-900/20 p-3">
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
            <h3 className="text-xl font-semibold text-white">Message Sent!</h3>
            <p className="text-gray-300 max-w-md">
              Thank you for reaching out. We've received your message and will get back to you soon.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-rave-dark-card border-rave-dark-border">
      <CardContent className="p-6 md:p-8">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-200">
                Name
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your name"
                className="bg-rave-dark-surface border-rave-dark-border text-white placeholder-gray-500"
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? "name-error" : undefined}
              />
              {errors.name && (
                <p id="name-error" className="text-red-500 text-xs mt-1">
                  {errors.name}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-200">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your.email@example.com"
                className="bg-rave-dark-surface border-rave-dark-border text-white placeholder-gray-500"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
              />
              {errors.email && (
                <p id="email-error" className="text-red-500 text-xs mt-1">
                  {errors.email}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="topic" className="text-gray-200">
              Topic
            </Label>
            <Select value={formData.topic} onValueChange={handleTopicChange}>
              <SelectTrigger
                id="topic"
                className="bg-rave-dark-surface border-rave-dark-border text-white"
                aria-invalid={!!errors.topic}
                aria-describedby={errors.topic ? "topic-error" : undefined}
              >
                <SelectValue placeholder="Select a topic" />
              </SelectTrigger>
              <SelectContent className="bg-rave-dark-card border-rave-dark-border">
                <SelectItem value="general">General Inquiry</SelectItem>
                <SelectItem value="support">Technical Support</SelectItem>
                <SelectItem value="feedback">Feedback</SelectItem>
                <SelectItem value="partnership">Partnership</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            {errors.topic && (
              <p id="topic-error" className="text-red-500 text-xs mt-1">
                {errors.topic}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="message" className="text-gray-200">
              Message
            </Label>
            <Textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="How can we help you?"
              className="bg-rave-dark-surface border-rave-dark-border text-white placeholder-gray-500 min-h-[120px]"
              aria-invalid={!!errors.message}
              aria-describedby={errors.message ? "message-error" : undefined}
            />
            {errors.message && (
              <p id="message-error" className="text-red-500 text-xs mt-1">
                {errors.message}
              </p>
            )}
          </div>

          <div className="flex items-center justify-end">
            <Button type="submit" className="bg-rave-accent hover:bg-rave-accent-hover" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-t-transparent border-white" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Send Message
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
