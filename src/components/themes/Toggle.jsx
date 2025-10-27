"use client"
import React from 'react'
import { Button } from '../ui/button'
import { Sun, Moon } from "lucide-react"
import { useTheme } from "next-themes"

export default function Toggle() {
    const { theme, setTheme } = useTheme()
    return (
        <Button
            aria-label="toggle theme"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-full"
        >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
    )
}
