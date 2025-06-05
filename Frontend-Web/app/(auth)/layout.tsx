import type React from "react"
import { Logo } from "@/components/logo"
import Link from "next/link"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rave-dark-bg via-rave-dark-surface to-rave-dark-bg flex flex-col">
      <div className="container mx-auto px-4 py-8">
        <Link href="/" className="inline-block">
          <Logo />
        </Link>
      </div>
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">{children}</div>
      </div>
      <footer className="py-6 text-center text-gray-400 text-sm">
        <p>© 2024 Rave. All rights reserved.</p>
      </footer>
    </div>
  )
}
