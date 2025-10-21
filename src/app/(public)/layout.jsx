import Footer from '@/components/home/landing/Footer'
import Navbar from '@/components/home/landing/Navbar'
import React from 'react'

export default function layout({ children }) {
    return (
        <div>
            <Navbar />
            {children}
            <Footer />

        </div>
    )
}
