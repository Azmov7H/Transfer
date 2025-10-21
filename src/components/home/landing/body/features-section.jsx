import React from "react"
import { Card } from "@/components/ui/card"


// Small reusable feature card — icon is an SVG element passed as prop
function FeatureCard({ title, text, icon }) {
    return (
        <Card className=" p-6 rounded-xl shadow-md border-transparent">
            <div className="flex flex-col items-start gap-4">
                <div className="h-12 w-12 rounded-full  flex items-center justify-center">{icon}</div>
                <h3 className=" font-semibold">{title}</h3>
                <p className=" text-sm">{text}</p>
            </div>
        </Card>
    )
}


export default function FeaturesSection() {
    return (
        <section id="features" className="py-20 ">
            <div className="container mx-auto px-6 text-center">
                <h2 className="text-3xl font-bold">Everything you need to track shipments</h2>
                <p className="mt-3  max-w-2xl mx-auto">Transfer offers a comprehensive suite of tools to streamline your shipment tracking.</p>


                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
                    <FeatureCard
                        title="Real-time Tracking"
                        text="Get live updates on your shipment's location and status from departure to delivery."
                        icon={<svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2l3 7h7l-5.5 4 2 7-6-4-6 4 2-7L2 9h7l3-7z" stroke="currentColor" strokeWidth="1.2" /></svg>}
                    />


                    <FeatureCard
                        title="Smart Alerts"
                        text="Receive timely notifications about delays, customs clearance, deliveries, and more."
                        icon={<svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2v6" stroke="currentColor" strokeWidth="1.2" /></svg>}
                    />


                    <FeatureCard
                        title="Multi-carrier Integration"
                        text="Track shipments from hundreds of major carriers around the world in one place."
                        icon={<svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 12h18" stroke="currentColor" strokeWidth="1.2" /></svg>}
                    />
                </div>
            </div>
        </section>
    )
}