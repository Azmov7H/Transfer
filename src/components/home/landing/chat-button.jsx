"use client"
import React from "react"
import { MessageSquare } from "lucide-react"


export default function ChatButton() {
return (
<button
aria-label="chat"
className="fixed right-6 bottom-6 h-14 w-14 rounded-full bg-[#0b6af1] text-white shadow-2xl flex items-center justify-center hover:scale-105 transition-transform"
>
<MessageSquare className="h-7 w-7" />
</button>
)
}