"use client"

import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle2, Truck, Package } from "lucide-react"

const icons = {
  Delivered: <CheckCircle2 className="text-green-500 w-6 h-6" />,
  "In Transit": <Truck className="text-blue-400 w-6 h-6" />,
  "Order Placed": <Package className="text-gray-400 w-6 h-6" />,
}

export default function ShipmentTimeline({ timeline }) {
  if (!timeline || !timeline.length) return null

  return (
    <Card className=" border-none">
      <CardContent className="pt-6">
        <ul className="relative border-l border-gray-700 space-y-6 ml-3">
          {timeline.map((item, index) => (
            <li key={index} className="pl-6 relative">
              <div className="absolute -left-[11px] top-1">
                {icons[item.status] || (
                  <Package className=" w-6 h-6" />
                )}
              </div>
              <p className={ `font-semibold `}>{item.status}</p>
              <p className="text-sm text-gray-400">{item.date}</p>
              {item.details && (
                <p className="text-sm text-gray-500 mt-1">{item.details}</p>
              )}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
