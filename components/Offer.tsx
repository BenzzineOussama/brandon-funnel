'use client'

import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Check, Shield, Clock, Zap, Gift, Star, TrendingUp, Award } from 'lucide-react'
import { useRef, useState, useEffect } from 'react'
import FuturisticTimer from './FuturisticTimer'

interface OfferProps {
  onPurchase?: () => void
}

export default function Offer({ onPurchase }: OfferProps) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })
  
  const containerRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  
  const x = useSpring(mouseX, { damping: 25, stiffness: 150 })
  const y = useSpring(mouseY, { damping: 25, stiffness: 150 })
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })
  
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1.05, 0.95])
  const rotate = useTransform(scrollYProgress, [0, 1], [-10, 10])

  const bonuses = [
    {
      icon: Zap,
      title: "Quick Start Guide",
      value: "$97",
      description: "Get results from day 1 with our accelerated start protocol",
      color: "text-yellow-500"
    },
    {
      icon: Clock,
      title: "Lifetime Updates",
      value: "$297",
      description: "All future program updates and improvements included forever",
      color: "text-blue-500"
    },
    {
      icon: Shield,
      title: "30-Day Guarantee",
      value: "Priceless",
      description: "Try the program risk-free with our money-back guarantee",
      color: "text-green-500"
    }
  ]

  const features = [
    "12-Week Champion's Training Program",
    "Personalized Nutrition Calculator",
    "Video Exercise Library (200+ exercises)",
    "Weekly Check-in System",
    "Private Community Access",
    "Supplement Guide & Protocols",
    "Mindset Mastery Module",
    "Progress Tracking App"
  ]

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      mouseX.set((e.clientX - centerX) * 0.1)
      mouseY.set((e.clientY - centerY) * 0.1)
      setMousePosition({ x: e.clientX - rect.left, y: e.clientY - rect.top })
    }
    
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [mouseX, mouseY])

  return (
    <section ref={containerRef} className="py-20 bg-champion-black relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          className="absolute -top-1/2 -left-1/4 w-[150%] h-[150%] bg-gradient-radial from-champion-gold/10 via-transparent to-transparent"
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 40,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div 
          className="absolute -bottom-1/2 -right-1/4 w-[150%] h-[150%] bg-gradient-radial from-yellow-400/10 via-transparent to-transparent"
          animate={{
            rotate: [-360, 0],
          }}
          transition={{
            duration: 50,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      {/* Mouse-following golden shadow */}
      <motion.div
        className="absolute w-[800px] h-[800px] rounded-full pointer-events-none z-[5]"
        style={{
          background: 'radial-gradient(circle, rgba(255,215,0,0.1) 0%, transparent 70%)',
          left: mousePosition.x - 400,
          top: mousePosition.y - 400,
          x,
          y,
        }}
      />

      <div className="section-padding relative z-10">
        <div 
          ref={ref}
          className="max-w-4xl mx-auto"
        >
          {/* Section Header */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.2, duration: 0.6, type: 'spring' }}
              className="inline-flex items-center gap-2 bg-champion-gold/10 border border-champion-gold/30 rounded-full px-4 py-2 mb-6"
            >
              <Gift className="w-5 h-5 text-champion-gold" />
              <span className="text-champion-gold font-medium text-sm uppercase tracking-wider">
                Limited Time Offer
              </span>
            </motion.div>
            
            <h2 className="heading-2 mb-4">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="inline-block"
              >
                Your Investment in
              </motion.span>{' '}
              <motion.span
                initial={{ opacity: 0, scale: 0.5, y: 50 }}
                animate={inView ? { opacity: 1, scale: 1, y: 0 } : {}}
                transition={{ delay: 0.5, duration: 0.8, type: "spring", damping: 15 }}
                className="text-gradient-gold inline-block"
              >
                Excellence
              </motion.span>
            </h2>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="text-xl text-gray-400"
            >
              Everything you need to build a champion's physique
            </motion.p>
          </div>

          {/* Main Offer Box */}
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ delay: 0.4, duration: 0.8, ease: 'easeOut' }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="relative group"
            style={{ rotate }}
          >
            {/* Glowing border */}
            <motion.div
              className="absolute -inset-1.5 bg-gradient-to-r from-champion-gold via-yellow-500 to-champion-gold rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            />
            <motion.div
              className="absolute -inset-0.5 bg-gradient-to-r from-champion-gold via-yellow-500 to-champion-gold rounded-2xl"
            />
            
            <div className="relative bg-champion-charcoal rounded-2xl p-8 md:p-12">
              {/* Price Section */}
              <div className="text-center mb-8">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={inView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: 0.8, duration: 0.6, ease: 'easeOut' }}
                  className="inline-block"
                >
                  <div className="flex items-center justify-center gap-4 mb-2">
                    <span className="text-3xl text-gray-500 line-through">$497</span>
                    <motion.span
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                      className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold"
                    >
                      40% OFF
                    </motion.span>
                  </div>
                  <motion.div 
                    className="text-6xl font-montserrat font-black text-champion-gold mb-2"
                    initial={{ textShadow: '0 0 0px rgba(255, 215, 0, 0)' }}
                    animate={{ textShadow: '0 0 20px rgba(255, 215, 0, 0.8)' }}
                    transition={{ duration: 1.5, repeat: Infinity, repeatType: 'reverse' }}
                  >
                    $297
                  </motion.div>
                  <p className="text-gray-400">One-time payment • Lifetime access</p>
                </motion.div>
              </div>

              {/* What's Included */}
              <div className="mb-8">
                <h3 className="text-xl font-montserrat font-bold mb-6 text-center">
                  Everything Included:
                </h3>
                <div className="grid md:grid-cols-2 gap-x-8 gap-y-4">
                  {features.map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={inView ? { opacity: 1, x: 0 } : {}}
                      transition={{ delay: 0.9 + index * 0.1, ease: 'easeOut' }}
                      className="flex items-center gap-3 group/feature"
                    >
                      <motion.div
                        className="w-5 h-5 text-green-500 flex-shrink-0"
                        initial={{ scale: 0, rotate: -180 }}
                        animate={inView ? { scale: 1, rotate: 0 } : {}}
                        transition={{ delay: 1 + index * 0.1, type: "spring" }}
                      >
                        <Check />
                      </motion.div>
                      <span className="text-gray-300 group-hover/feature:text-white transition-colors">{feature}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Bonuses */}
              <div className="border-t border-gray-800 pt-8 mb-8">
                <motion.h3
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 1.2, duration: 0.6 }}
                  className="text-xl font-montserrat font-bold mb-6 text-center flex items-center justify-center gap-2"
                >
                  <Star className="w-6 h-6 text-champion-gold" />
                  FREE Bonuses Today Only
                  <Star className="w-6 h-6 text-champion-gold" />
                </motion.h3>
                
                <div className="space-y-4">
                  {bonuses.map((bonus, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 30 }}
                      animate={inView ? { opacity: 1, y: 0 } : {}}
                      transition={{ delay: 1.3 + index * 0.15, ease: 'easeOut' }}
                      className="bg-champion-black/50 rounded-lg p-4 flex items-start gap-4 border border-transparent hover:border-champion-gold/50 transition-all duration-300"
                      whileHover={{ scale: 1.03, y: -5 }}
                    >
                      <motion.div
                        className={`${bonus.color} mt-1`}
                        initial={{ scale: 0 }}
                        animate={inView ? { scale: 1 } : {}}
                        transition={{ delay: 1.4 + index * 0.15, type: 'spring' }}
                      >
                        <bonus.icon className="w-6 h-6" />
                      </motion.div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-bold text-white">{bonus.title}</h4>
                          <span className="text-champion-gold font-bold">{bonus.value}</span>
                        </div>
                        <p className="text-sm text-gray-400">{bonus.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Total Value */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 1.6, duration: 0.6 }}
                className="bg-champion-gold/10 border border-champion-gold/30 rounded-lg p-4 mb-8 text-center"
              >
                <p className="text-gray-400 mb-1">Total Value:</p>
                <p className="text-2xl font-montserrat font-bold">
                  <span className="line-through text-gray-500">$497</span>{' '}
                  <span className="text-champion-gold">$297</span>
                </p>
                <p className="text-sm text-champion-gold mt-1">You Save $200!</p>
              </motion.div>

              {/* CTA Button */}
              <motion.button
                onClick={onPurchase}
                className="w-full btn-primary text-xl py-6 relative overflow-hidden group"
                whileHover={{ scale: 1.02, y: -5, boxShadow: '0px 10px 30px rgba(255, 215, 0, 0.4)' }}
                whileTap={{ 
                  scale: 0.95,
                  boxShadow: '0px 0px 50px rgba(255, 215, 0, 0.8)',
                  transition: { duration: 0.1 }
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 1.8, type: 'spring' }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  initial={{ x: '-150%' }}
                  animate={{ x: '150%' }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                />
                <span className="relative z-10 flex items-center justify-center gap-3">
                  <TrendingUp className="w-6 h-6" />
                  YES! I WANT TO TRANSFORM NOW
                  <Award className="w-6 h-6" />
                </span>
              </motion.button>

              {/* Guarantee Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 2, type: "spring" }}
                className="flex items-center justify-center gap-2 mt-6 text-sm text-gray-400"
              >
                <Shield className="w-5 h-5 text-green-500" />
                <span>30-Day Money-Back Guarantee • Secure Checkout</span>
              </motion.div>
            </div>
          </motion.div>

          {/* Urgency Timer */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ delay: 2.2, type: "spring", damping: 20 }}
            className="mt-12"
          >
            <FuturisticTimer />
          </motion.div>
        </div>
      </div>
    </section>
  )
}