"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { useRouter } from "next/navigation"

export default function RegisterPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  })
  const [errors, setErrors] = useState({
    password: "",
    confirmPassword: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear errors when typing
    if (name === "password" || name === "confirmPassword") {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, agreeTerms: checked }))
  }

  const validateForm = () => {
    let valid = true
    const newErrors = { password: "", confirmPassword: "" }

    if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
      valid = false
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
      valid = false
    }

    setErrors(newErrors)
    return valid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Redirect to app
    router.push("/app")
  }

  return (
    <Card className="border-rave-dark-border bg-rave-dark-card shadow-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-white text-center">Create an account</CardTitle>
        <CardDescription className="text-gray-400 text-center">
          Join Rave and start listening to your favorite music
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username" className="text-gray-200">
              Username
            </Label>
            <Input
              id="username"
              name="username"
              placeholder="johndoe"
              required
              value={formData.username}
              onChange={handleChange}
              className="bg-rave-dark-surface border-rave-dark-border text-white placeholder-gray-500"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-200">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="name@example.com"
              required
              value={formData.email}
              onChange={handleChange}
              className="bg-rave-dark-surface border-rave-dark-border text-white placeholder-gray-500"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-200">
              Password
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              required
              value={formData.password}
              onChange={handleChange}
              className="bg-rave-dark-surface border-rave-dark-border text-white placeholder-gray-500"
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-gray-200">
              Confirm Password
            </Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="••••••••"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              className="bg-rave-dark-surface border-rave-dark-border text-white placeholder-gray-500"
            />
            {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="terms"
              checked={formData.agreeTerms}
              onCheckedChange={handleCheckboxChange}
              required
              className="border-gray-500 data-[state=checked]:bg-rave-accent data-[state=checked]:border-rave-accent"
            />
            <Label htmlFor="terms" className="text-sm text-gray-300">
              I agree to the{" "}
              <Link href="#" className="text-rave-accent hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="#" className="text-rave-accent hover:underline">
                Privacy Policy
              </Link>
            </Label>
          </div>
          <Button
            type="submit"
            className="w-full bg-rave-accent hover:bg-rave-accent-hover"
            disabled={isLoading || !formData.agreeTerms}
          >
            {isLoading ? "Creating account..." : "Create Account"}
          </Button>
        </form>

        <div className="mt-6 pt-6 border-t border-rave-dark-border">
          <div className="text-center text-sm text-gray-400">
            Already have an account?{" "}
            <Link href="/login" className="text-rave-accent hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
