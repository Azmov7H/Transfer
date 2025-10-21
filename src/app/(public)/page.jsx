import CTASection from '@/components/home/landing/body/cta-section'
import FeaturesSection from '@/components/home/landing/body/features-section'
import HeroSection from '@/components/home/landing/body/Hero'
import TestimonialsSection from '@/components/home/landing/body/testimonials-section'
import ChatButton from '@/components/home/landing/chat-button'
import React from 'react'

export default function page() {
  return (
    <div>
      
        <HeroSection />
        <FeaturesSection />
        <TestimonialsSection />
        <CTASection />
        <ChatButton />

    </div>
  )
}
