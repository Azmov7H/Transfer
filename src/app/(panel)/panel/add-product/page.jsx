"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

export default function NewOrderPage() {
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    title: "",
    description: "",
    customerName: "",
    customerPhone: "",
    trackingNumber: "",
  })

  const router = useRouter()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message || "Failed to create order")

      toast.success("Order created successfully")
      router.push("/dashboard/orders")
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="py-10">
      <Card className="border-border bg-background shadow-md">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Create New Order</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col items-start gap-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" name="title" value={form.title} onChange={handleChange} required />
              </div>



              <div className="flex flex-col items-start gap-2">
                <Label htmlFor="customerName">Customer Name</Label>
                <Input
                  id="customerName"
                  name="customerName"
                  value={form.customerName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="flex flex-col items-start gap-2">
                <Label htmlFor="customerPhone">Customer Phone</Label>
                <Input
                  id="customerPhone"
                  name="customerPhone"
                  type="tel"
                  value={form.customerPhone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="flex flex-col items-start gap-2">
                <Label htmlFor="trackingNumber">Tracking Number (Optional)</Label>
                <Input
                  id="trackingNumber"
                  name="trackingNumber"
                  value={form.trackingNumber}
                  onChange={handleChange}
                />
              </div>
              <div className="flex flex-col items-start gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...
                </>
              ) : (
                "Create Order"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
