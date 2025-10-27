"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import React from "react";

export default function Profile() {
  return (
    <div className="w-full ">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold">Profile</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4 w-2/3  flex justify-between items-center md:flex-row flex-col">
          <div className="space-y-4">
            <Label htmlFor="username">Username</Label>
            <Input id="username" type="text" placeholder="Enter your username" />
          </div>

          <div className="space-y-4">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="Enter your email" />
          </div>
        </CardContent>

        <CardFooter className="flex flex-col md:flex-row justify-between w-2/3 gap-3">
          <Button className="w-full md:w-auto">Save Changes</Button>
          <Button variant="outline" className="w-full md:w-auto">
            Cancel
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
