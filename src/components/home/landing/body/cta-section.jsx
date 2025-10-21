import React from "react"
import { Button } from "@/components/ui/button"


export default function CTASection() {
return (
<section className="py-16 ">
<div className="container mx-auto px-6 text-center">
<h3 className="text-2xl sm:text-3xl font-bold ">Ready to simplify your shipment tracking?</h3>
<p className="mt-3  max-w-2xl mx-auto">Sign up for Transfer today and experience the future of logistics.</p>
<div className="mt-8">
<Button className="rounded-full px-8 py-3 bg-gradient-to-b from-[#1e7cf5] to-[#0663f9]">Start Tracking Now</Button>
</div>
</div>
</section>
)
}