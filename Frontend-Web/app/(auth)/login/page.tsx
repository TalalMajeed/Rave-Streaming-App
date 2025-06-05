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

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, rememberMe: checked }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Redirect to app
    router.push("/app")
  }

  return (
    <Card className="border-rave-dark-border bg-rave-dark-card shadow-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-white text-center">Welcome back</CardTitle>
        <CardDescription className="text-gray-400 text-center">Sign in to your Rave account</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
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
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-gray-200">
                Password
              </Label>
              <Link href="#" className="text-sm text-rave-accent hover:underline">
                Forgot password?
              </Link>
            </div>
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
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="remember"
              checked={formData.rememberMe}
              onCheckedChange={handleCheckboxChange}
              className="border-gray-500 data-[state=checked]:bg-rave-accent data-[state=checked]:border-rave-accent"
            />
            <Label htmlFor="remember" className="text-sm text-gray-300">
              Remember me
            </Label>
          </div>
          <Button type="submit" className="w-full bg-rave-accent hover:bg-rave-accent-hover" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <div className="mt-6 pt-6 border-t border-rave-dark-border">
          <div className="text-center text-sm text-gray-400">
            Don't have an account?{" "}
            <Link href="/register" className="text-rave-accent hover:underline">
              Sign up
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
