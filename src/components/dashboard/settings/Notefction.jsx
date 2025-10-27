"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export default function Notification() {
  return (
    <div className="w-full">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold">Notifications</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6 mt-2">
          <div className="flex items-start justify-between">
            <div>
              <Label>Email Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive updates and alerts directly to your inbox.
              </p>
            </div>
            <Checkbox id="email-alerts" />
          </div>

          <div className="flex items-start justify-between">
            <div>
              <Label>In-App Alerts</Label>
              <p className="text-sm text-muted-foreground">
                Get notified within the app about important updates.
              </p>
            </div>
            <Checkbox id="inapp-alerts" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
