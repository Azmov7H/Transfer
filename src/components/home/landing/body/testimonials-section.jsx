import React from "react"


function Testimonial({ quote, name, role }) {
    return (
        <div className="rounded-lg p-6 bg-gradient-to-t from-[#1961a9] to-transparent shadow-inner">
            <blockquote className=" text-sm">{quote}</blockquote>
            <footer className="mt-4 ">
                <div className="font-semibold">{name}</div>
                <div className="text-xs">{role}</div>
            </footer>
        </div>
    )
}


export default function TestimonialsSection() {
    const items = [
        {
            quote: '"Transfer has revolutionized how we manage our shipments. The real-time tracking and smart alerts have significantly improved our efficiency."',
            name: 'Alex Johnson',
            role: 'Logistics Manager',
        },
        {
            quote: '"The multi-carrier integration is a game-changer. We can now track all our shipments in one place, saving us valuable time and resources."',
            name: 'Sarah Lee',
            role: 'Operations Director',
        },
        {
            quote: '"The user interface is intuitive and easy to use. Transfer has become an indispensable tool for our logistics team."',
            name: 'David Chen',
            role: 'Supply Chain Analyst',
        },
    ]


    return (
        <section className="py-20 ">
            <div className="container mx-auto px-6 text-center">
                <h2 className="text-3xl font-bold ">Loved by logistics teams</h2>
                <p className="mt-3  max-w-2xl mx-auto">Don't just take our word for it. Here's what our customers have to say.</p>


                <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {items.map((it, idx) => (
                        <Testimonial key={idx} quote={it.quote} name={it.name} role={it.role} />
                    ))}
                </div>
            </div>
        </section>
    )
}