"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function TrackingForm({ onTrack }) {
  const [trackingNumber, setTrackingNumber] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    if (trackingNumber.trim()) onTrack(trackingNumber)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col md:flex-row gap-3 items-center justify-center"
    >
      <Input
        placeholder="أدخل رقم التتبع"
        value={trackingNumber}
        onChange={(e) => setTrackingNumber(e.target.value)}
        className="w-full md:w-80"
      />
      <Button type="submit" className="w-full md:w-auto">
        تتبع الشحنة
      </Button>
    </form>
  )
}
