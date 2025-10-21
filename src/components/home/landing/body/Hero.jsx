"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"


// HeroSection: headline, description and tracking input (rounded pill)
export default function HeroSection() {
    return (
        <section className="relative overflow-hidden">
            {/* subtle background map image (add file to /public/screen-bg.png) */}
            <div className="absolute inset-0 bg-[url('/screen-bg.png')] bg-center bg-cover opacity-20 filter blur-sm" aria-hidden />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#28447b]" aria-hidden />


            <div className="container mx-auto px-6 pt-24 pb-20 text-center">
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold  leading-tight">
                    Track any shipment, anytime.
                </h1>


                <p className="mt-4 max-w-2xl mx-auto ">
                    Stay updated on your deliveries with real-time tracking, smart alerts, and multi-carrier integration.
                </p>


                {/* Tracking input - pill */}
                <form className="mt-10 mx-auto max-w-2xl relative">
                    <div className="relative">
                        <span className="absolute inset-y-0 left-4 flex items-center "><Search className="h-5 w-5" /></span>
                        <Input
                            placeholder="Enter tracking number"
                            className="h-14 sm:h-16 rounded-full pl-14 pr-36 border   shadow-[0_8px_30px_rgba(3,10,20,0.6)]"
                        />
                        <Button
                            type="submit"
                            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full h-12 px-6 bg-gradient-to-b from-[#1e7cf5] to-[#0663f9] shadow-lg"
                        >
                            Track
                        </Button>
                    </div>
                </form>
            </div>
        </section>
    )
}