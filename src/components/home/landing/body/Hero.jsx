"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"

// HeroSection: headline, description and tracking input (rounded pill)
export default function HeroSection() {
  const [trackingNumber, setTrackingNumber] = useState("")
  const router = useRouter()

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!trackingNumber.trim()) return
    // Navigate to shipment status page
    router.push(`/status/${trackingNumber.trim()}`)
  }

  return (
    <section className="relative overflow-hidden text-white">
      {/* Background map image */}
      <div
        className="absolute inset-0 bg-[url('/screen-bg.png')] bg-center bg-cover opacity-20 filter blur-sm"
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-gradient-to-b from-transparent to-[#28447b]"
        aria-hidden
      />

      <div className="container mx-auto px-6 pt-24 pb-20 text-center relative z-10">
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-tight">
          Track any shipment, anytime.
        </h1>

        <p className="mt-4 max-w-2xl mx-auto text-gray-300">
          Stay updated on your deliveries with real-time tracking, smart alerts,
          and multi-carrier integration.
        </p>

        {/* Tracking input - pill */}
        <form
          onSubmit={handleSubmit}
          className="mt-10 mx-auto max-w-2xl relative"
        >
          <div className="relative">
            <span className="absolute inset-y-0 left-4 flex items-center">
              <Search className="h-5 w-5 text-gray-400" />
            </span>

            <Input
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              placeholder="Enter tracking number"
              className="h-14 sm:h-16 rounded-full pl-14 pr-36 border border-gray-700 bg-white/10 backdrop-blur text-white placeholder-gray-400 shadow-[0_8px_30px_rgba(3,10,20,0.6)] focus-visible:ring-2 focus-visible:ring-[#1e7cf5]"
            />

            <Button
              type="submit"
              disabled={!trackingNumber.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full h-12 px-6 bg-gradient-to-b from-[#1e7cf5] to-[#0663f9] shadow-lg hover:opacity-90 transition-opacity"
            >
              Track
            </Button>
          </div>
        </form>
      </div>
    </section>
  )
}
