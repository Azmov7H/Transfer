"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export default function ShipmentStatus({ status }) {
  if (!status) return null

  const statusColors = {
    "قيد المعالجة": "text-yellow-600",
    "تم الشحن": "text-blue-600",
    "في الطريق": "text-purple-600",
    "تم التسليم": "text-green-600",
    "ملغاة": "text-red-600",
  }

  return (
    <Card className="w-full md:w-2/3 mx-auto mt-6 shadow-lg">
      <CardHeader>
        <CardTitle className="text-center text-lg font-semibold">
          حالة الشحنة الحالية:
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className={`text-center text-xl font-bold ${statusColors[status] }`}>
          {status}
        </p>
      </CardContent>
    </Card>
  )
}
