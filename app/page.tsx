'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useState, useRef } from 'react'
import Hero from '@/components/Hero'
import VideoSalesLetter from '@/components/VideoSalesLetter'
import ProblemSolution from '@/components/ProblemSolution'
import ProgramPresentation from '@/components/ProgramPresentation'
import Testimonials from '@/components/Testimonials'
import Offer from '@/components/Offer'
import FAQ from '@/components/FAQ'
import FinalCTA from '@/components/FinalCTA'
import AIQualificationBot from '@/components/AIQualificationBot'

export default function SinglePageFunnel() {
  const router = useRouter()
  const [openAIBot, setOpenAIBot] = useState(false)

  const handlePurchase = () => {
    // Open AI bot without scrolling
    setOpenAIBot(true)
  }

  // Stagger animation for sections
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2
      }
    }
  }

  const sectionVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.43, 0.13, 0.23, 0.96]
      }
    }
  }

  return (
    <main className="min-h-screen bg-champion-black overflow-x-hidden">
      {/* Hero Section */}
      <Hero />
      
      {/* Sales Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative"
      >
        {/* Animated background gradient */}
        <motion.div
          className="fixed inset-0 pointer-events-none"
          animate={{
            background: [
              'radial-gradient(circle at 0% 0%, rgba(212, 175, 55, 0.1) 0%, transparent 50%)',
              'radial-gradient(circle at 100% 100%, rgba(212, 175, 55, 0.1) 0%, transparent 50%)',
              'radial-gradient(circle at 0% 100%, rgba(212, 175, 55, 0.1) 0%, transparent 50%)',
              'radial-gradient(circle at 100% 0%, rgba(212, 175, 55, 0.1) 0%, transparent 50%)',
              'radial-gradient(circle at 0% 0%, rgba(212, 175, 55, 0.1) 0%, transparent 50%)',
            ],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        
        <motion.div
          id="vsl-section"
          variants={sectionVariants}
          className="relative"
        >
          <VideoSalesLetter />
        </motion.div>
        
        <motion.div variants={sectionVariants} className="relative">
          <ProblemSolution />
        </motion.div>
        
        <motion.div variants={sectionVariants} className="relative">
          <ProgramPresentation />
        </motion.div>
        
        <motion.div variants={sectionVariants} className="relative">
          <Testimonials />
        </motion.div>
        
        <motion.div variants={sectionVariants} className="relative">
          <Offer onPurchase={handlePurchase} />
        </motion.div>
        
        <motion.div variants={sectionVariants} className="relative">
          <FAQ />
        </motion.div>
        
        <motion.div variants={sectionVariants} className="relative">
          <FinalCTA onPurchase={handlePurchase} />
        </motion.div>
      </motion.div>
      
      {/* AI Qualification Bot instead of floating button */}
      <AIQualificationBot 
        forceOpen={openAIBot} 
        onClose={() => setOpenAIBot(false)}
      />
    </main>
  )
}