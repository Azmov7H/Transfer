import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Head() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-bold">Total Transform </CardTitle>
        </CardHeader>
        <CardContent className="text-2xl font-semibold">12,869</CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-bold">Pinding Trnsform</CardTitle>
        </CardHeader>
        <CardContent className="text-2xl font-semibold">678</CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-bold">Completet Trnsform</CardTitle>
        </CardHeader>
        <CardContent className="text-2xl font-semibold">99.9%</CardContent>
      </Card>
            <Card>
        <CardHeader>
          <CardTitle className="text-lg font-bold">Actoin  Balnice</CardTitle>
        </CardHeader>
        <CardContent className="text-2xl font-semibold">100.609 $</CardContent>
      </Card>
    </div>
  )
}
