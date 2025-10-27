import React from "react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Toggle from "../themes/Toggle";

export default function Topbar() {
  return (
    <header className="w-full flex items-center justify-between p-4 border-b bg-background">
      <h1 className="hidden md:block text-lg font-semibold">Admin Dashboard</h1>

      <div className="flex items-center gap-4">
        <Toggle />
        <Input
          type="text"
          placeholder="Search..."
          className="w-[250px] md:w-[300px]"
        />

        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>AD</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
