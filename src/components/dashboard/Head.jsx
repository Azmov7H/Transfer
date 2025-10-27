import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Head() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-bold">Total Users</CardTitle>
        </CardHeader>
        <CardContent className="text-2xl font-semibold">12,869</CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-bold">Active Shipments</CardTitle>
        </CardHeader>
        <CardContent className="text-2xl font-semibold">678</CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-bold">System Health</CardTitle>
        </CardHeader>
        <CardContent className="text-2xl font-semibold">99.9%</CardContent>
      </Card>
    </div>
  )
}
