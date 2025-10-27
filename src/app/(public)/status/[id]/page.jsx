import fs from "fs"
import path from "path"
import Image from "next/image"
import { notFound } from "next/navigation"
import ShipmentTimeline from "@/components/home/status/ShipmentTimeline"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export default async function ShipmentPage({ params }) {
  const {id}  = await params

  // Read JSON file from public
  const filePath = path.join(process.cwd(), "public", "shipments.json")
  const jsonData = fs.readFileSync(filePath, "utf8")
  const shipments = JSON.parse(jsonData)

  // Match either id or trackingNumber
  const shipment = shipments.find((s) => s.id === id || s.trackingNumber === id)

  if (!shipment) notFound()

  return (
    <main className="min-h-screen bg-[#0B1220] text-white py-16 px-4">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Title */}
        <h1 className="text-4xl font-bold text-center mb-8">
          Shipment Tracking
        </h1>

        {/* Content Layout */}
        <div className="grid md:grid-cols-2 gap-10">
          {/* Timeline Section */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Shipment Timeline</h2>
            <ShipmentTimeline timeline={shipment.timeline} />
          </div>

          {/* Status Section */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold mb-4">Current Status & Map</h2>

            <Card className=" border-none">
              <CardHeader>
                <CardTitle className={`${shipment.last ? "text-green-500" : 'text-red-600'}`}>Your shipment is {shipment.status}.</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">
                  {shipment.status === "Delivered"
                    ? "It has safely arrived at its destination."
                    : "Your package is still in transit."}
                </p>
              </CardContent>
            </Card>

            <div className="rounded-2xl overflow-hidden border border-gray-800">
              <Image
                src="/map-placeholder.png"
                alt="Map showing shipment location"
                width={600}
                height={300}
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
