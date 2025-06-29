'use client'

import { useRouter } from 'next/navigation'
import VideoSalesLetter from '@/components/VideoSalesLetter'
import ProblemSolution from '@/components/ProblemSolution'
import ProgramPresentation from '@/components/ProgramPresentation'
import Testimonials from '@/components/Testimonials'
import Offer from '@/components/Offer'
import FAQ from '@/components/FAQ'
import FinalCTA from '@/components/FinalCTA'

export default function SalesPage() {
  const router = useRouter()

  const handlePurchase = () => {
    // Redirect to checkout page
    router.push('/checkout')
  }

  return (
    <main className="min-h-screen bg-champion-black">
      {/* Sales Page Components in Order */}
      <VideoSalesLetter />
      <ProblemSolution />
      <ProgramPresentation />
      <Testimonials />
      <Offer onPurchase={handlePurchase} />
      <FAQ />
      <FinalCTA onPurchase={handlePurchase} />
    </main>
  )
}