'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion'
import { CheckCircle, Mail, Users, Rocket, ArrowRight, Star, Trophy, Sparkles, Download, Play, Shield, Crown, Zap, Heart } from 'lucide-react'
import Link from 'next/link'
import confetti from 'canvas-confetti'

// Particle component for background effects
const Particle = ({ delay }: { delay: number }) => {
  const randomX = Math.random() * 100
  const randomDuration = 15 + Math.random() * 20
  
  return (
    <motion.div
      initial={{ x: `${randomX}vw`, y: '100vh', opacity: 0 }}
      animate={{ 
        y: '-10vh',
        opacity: [0, 1, 1, 0],
        x: `${randomX + (Math.random() - 0.5) * 20}vw`
      }}
      transition={{
        duration: randomDuration,
        delay,
        repeat: Infinity,
        ease: "linear"
      }}
      className="absolute w-1 h-1 bg-champion-gold rounded-full"
      style={{ filter: 'blur(1px)' }}
    />
  )
}

// Animated counter component
const AnimatedCounter = ({ value, duration = 2 }: { value: number; duration?: number }) => {
  const [count, setCount] = useState(0)
  
  useEffect(() => {
    const startTime = Date.now()
    const endValue = value
    
    const updateCount = () => {
      const now = Date.now()
      const progress = Math.min((now - startTime) / (duration * 1000), 1)
      const currentCount = Math.floor(progress * endValue)
      setCount(currentCount)
      
      if (progress < 1) {
        requestAnimationFrame(updateCount)
      }
    }
    
    updateCount()
  }, [value, duration])
  
  return <span>{count.toLocaleString()}</span>
}

export default function ThankYouPage() {
  const [userEmail, setUserEmail] = useState('')
  const [userName, setUserName] = useState('')
  const [showConfetti, setShowConfetti] = useState(false)
  const [hoveredStep, setHoveredStep] = useState<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  
  // Mouse tracking
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const springX = useSpring(mouseX, { stiffness: 300, damping: 30 })
  const springY = useSpring(mouseY, { stiffness: 300, damping: 30 })

  useEffect(() => {
    // Get user data from localStorage
    const email = localStorage.getItem('purchaseEmail') || 'your inbox'
    const name = localStorage.getItem('purchaseName') || 'Champion'
    setUserEmail(email)
    setUserName(name.split(' ')[0]) // Get first name only
    
    // Trigger confetti after a delay
    const confettiTimer = setTimeout(() => {
      setShowConfetti(true)
      // Fire confetti from multiple angles
      const count = 200
      const defaults = {
        origin: { y: 0.7 },
        zIndex: 9999
      }

      function fire(particleRatio: number, opts: any) {
        confetti({
          ...defaults,
          ...opts,
          particleCount: Math.floor(count * particleRatio),
          colors: ['#D4AF37', '#FFD700', '#FFA500', '#FF6B6B', '#4ECDC4']
        })
      }

      fire(0.25, {
        spread: 26,
        startVelocity: 55,
      })
      fire(0.2, {
        spread: 60,
      })
      fire(0.35, {
        spread: 100,
        decay: 0.91,
        scalar: 0.8
      })
      fire(0.1, {
        spread: 120,
        startVelocity: 25,
        decay: 0.92,
        scalar: 1.2
      })
      fire(0.1, {
        spread: 120,
        startVelocity: 45,
      })
    }, 500)
    
    // Mouse tracking
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        mouseX.set((e.clientX - rect.left) / rect.width)
        mouseY.set((e.clientY - rect.top) / rect.height)
      }
    }
    
    window.addEventListener('mousemove', handleMouseMove)
    
    return () => {
      clearTimeout(confettiTimer)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [mouseX, mouseY])

  const nextSteps = [
    {
      icon: Mail,
      title: "Check Your Email",
      description: `We've sent your login credentials to ${userEmail}`,
      color: "from-blue-500 to-purple-500",
      delay: 0.1
    },
    {
      icon: Download,
      title: "Download The App",
      description: "Get instant access to your workouts and meal plans",
      color: "from-green-500 to-emerald-500",
      delay: 0.2
    },
    {
      icon: Users,
      title: "Join The Elite Community",
      description: "Connect with 10,000+ champions transforming their lives",
      color: "from-purple-500 to-pink-500",
      delay: 0.3
    }
  ]

  const achievements = [
    { icon: Trophy, label: "Elite Member", color: "text-yellow-500" },
    { icon: Crown, label: "VIP Access", color: "text-purple-500" },
    { icon: Zap, label: "Fast Track", color: "text-blue-500" },
    { icon: Shield, label: "Lifetime Support", color: "text-green-500" }
  ]

  // Golden glow that follows mouse
  const glowX = useTransform(springX, [0, 1], [-50, 50])
  const glowY = useTransform(springY, [0, 1], [-50, 50])

  return (
    <main className="min-h-screen bg-champion-black relative overflow-hidden" ref={containerRef}>
      {/* Animated background particles */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <Particle key={i} delay={i * 0.5} />
        ))}
      </div>

      {/* Golden glow effect */}
      <motion.div
        className="fixed w-96 h-96 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(212, 175, 55, 0.15) 0%, transparent 70%)',
          x: glowX,
          y: glowY,
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          filter: 'blur(40px)',
        }}
      />

      <div className="section-padding py-20 relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Success Animation with 3D effect */}
          <motion.div
            initial={{ scale: 0, rotateY: -180 }}
            animate={{ scale: 1, rotateY: 0 }}
            transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
            className="flex justify-center mb-12"
          >
            <div className="relative">
              {/* Outer ring animation */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -inset-8 rounded-full"
                style={{
                  background: 'conic-gradient(from 0deg, transparent, #D4AF37, transparent)',
                  filter: 'blur(20px)',
                }}
              />
              
              {/* Main success icon */}
              <motion.div
                animate={{ 
                  boxShadow: [
                    '0 0 20px rgba(212, 175, 55, 0.5)',
                    '0 0 40px rgba(212, 175, 55, 0.8)',
                    '0 0 20px rgba(212, 175, 55, 0.5)',
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="relative w-40 h-40 bg-gradient-to-br from-champion-gold via-yellow-400 to-champion-gold rounded-full flex items-center justify-center"
              >
                <CheckCircle className="w-24 h-24 text-champion-black" strokeWidth={3} />
                
                {/* Sparkles around the icon */}
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0"
                >
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{ 
                        scale: [1, 1.5, 1],
                        opacity: [0.5, 1, 0.5]
                      }}
                      transition={{ 
                        duration: 2,
                        delay: i * 0.3,
                        repeat: Infinity
                      }}
                      className="absolute w-2 h-2 bg-champion-gold rounded-full"
                      style={{
                        top: '50%',
                        left: '50%',
                        transform: `translate(-50%, -50%) rotate(${i * 60}deg) translateY(-80px)`
                      }}
                    />
                  ))}
                </motion.div>
              </motion.div>
            </div>
          </motion.div>

          {/* Personalized Welcome Message */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-center mb-16"
          >
            <motion.h1 
              className="heading-1 mb-6"
              animate={{ 
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{ duration: 5, repeat: Infinity }}
              style={{
                backgroundImage: 'linear-gradient(90deg, #D4AF37, #FFD700, #FFA500, #D4AF37)',
                backgroundSize: '200% 100%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Welcome to the Elite, {userName}!
            </motion.h1>
            <motion.p 
              className="text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              You've just joined an exclusive group of <AnimatedCounter value={127} /> champions 
              who are transforming their bodies and lives with Brandon's proven system.
            </motion.p>
          </motion.div>

          {/* Achievement Badges */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="flex justify-center gap-8 mb-16"
          >
            {achievements.map((achievement, index) => {
              const Icon = achievement.icon
              return (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="relative"
                >
                  <motion.div
                    animate={{ 
                      y: [0, -5, 0],
                    }}
                    transition={{ 
                      duration: 2,
                      delay: index * 0.2,
                      repeat: Infinity
                    }}
                    className="bg-champion-charcoal/50 backdrop-blur-sm rounded-2xl p-4 border border-gray-800"
                  >
                    <Icon className={`w-8 h-8 ${achievement.color} mb-2`} />
                    <p className="text-xs font-medium text-gray-300">{achievement.label}</p>
                  </motion.div>
                </motion.div>
              )
            })}
          </motion.div>

          {/* Order Confirmation Card with 3D effect */}
          <motion.div
            initial={{ opacity: 0, y: 20, rotateX: -20 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            style={{ transformStyle: 'preserve-3d', perspective: 1000 }}
            className="mb-16"
          >
            <motion.div
              whileHover={{ rotateY: 5, rotateX: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="bg-gradient-to-br from-champion-charcoal via-gray-900 to-champion-black rounded-2xl p-8 border border-champion-gold/20 shadow-2xl"
              style={{
                boxShadow: '0 20px 40px rgba(212, 175, 55, 0.1)',
                transform: 'translateZ(50px)'
              }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-montserrat font-bold">Order Confirmed!</h2>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="w-8 h-8 text-champion-gold" />
                </motion.div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-black/30 rounded-lg">
                    <span className="text-gray-400">Order ID</span>
                    <span className="font-mono text-champion-gold">#CPE-{Date.now().toString().slice(-6)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-black/30 rounded-lg">
                    <span className="text-gray-400">Product</span>
                    <span className="font-bold">Champion's Physique Elite</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-black/30 rounded-lg">
                    <span className="text-gray-400">Amount Paid</span>
                    <span className="text-2xl font-montserrat font-black text-champion-gold">$297</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-black/30 rounded-lg">
                    <span className="text-gray-400">Status</span>
                    <span className="flex items-center gap-2 text-green-500">
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="w-2 h-2 bg-green-500 rounded-full"
                      />
                      Active
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Next Steps with advanced animations */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-montserrat font-bold mb-12 text-center">
              Your Journey Starts Now
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {nextSteps.map((step, index) => {
                const Icon = step.icon
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 1 + step.delay }}
                    whileHover={{ y: -10, transition: { duration: 0.2 } }}
                    onHoverStart={() => setHoveredStep(index)}
                    onHoverEnd={() => setHoveredStep(null)}
                    className="relative group"
                  >
                    <motion.div
                      className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{
                        background: `linear-gradient(135deg, ${step.color.split(' ')[1]} 0%, ${step.color.split(' ')[3]} 100%)`,
                        filter: 'blur(20px)',
                      }}
                    />
                    <div className="relative bg-champion-charcoal/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-800 group-hover:border-champion-gold/50 transition-all duration-300">
                      <motion.div
                        animate={hoveredStep === index ? { rotate: 360 } : {}}
                        transition={{ duration: 0.5 }}
                        className={`w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 bg-gradient-to-br ${step.color}`}
                      >
                        <Icon className="w-10 h-10 text-white" />
                      </motion.div>
                      <h3 className="font-montserrat font-bold text-xl mb-3">{step.title}</h3>
                      <p className="text-gray-400 leading-relaxed">{step.description}</p>
                      
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="mt-6 w-full py-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors duration-300 flex items-center justify-center gap-2"
                      >
                        <span className="text-sm font-medium">Take Action</span>
                        <ArrowRight className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>

          {/* VIP Upgrade Offer with countdown */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 1.5 }}
            className="relative mb-16 overflow-hidden rounded-3xl"
          >
            {/* Animated gradient background */}
            <motion.div
              animate={{
                backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
              }}
              transition={{ duration: 10, repeat: Infinity }}
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(135deg, #D4AF37 0%, #FFD700 25%, #FFA500 50%, #D4AF37 75%, #FFD700 100%)',
                backgroundSize: '400% 400%',
                opacity: 0.1,
              }}
            />
            
            <div className="relative bg-champion-charcoal/90 backdrop-blur-sm p-12 text-center border border-champion-gold/30">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="inline-flex items-center gap-2 bg-red-500/20 text-red-500 px-4 py-2 rounded-full text-sm font-bold mb-6"
              >
                <Heart className="w-4 h-4" />
                EXCLUSIVE ONE-TIME OFFER
              </motion.div>
              
              <h3 className="text-4xl font-montserrat font-black mb-6">
                Unlock VIP Coaching Access
              </h3>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Get personal 1-on-1 weekly check-ins with Brandon's elite coaching team. 
                This offer is only available right now at this special price.
              </p>
              
              <div className="flex items-center justify-center gap-6 mb-8">
                <motion.span 
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-4xl text-gray-500 line-through"
                >
                  $997
                </motion.span>
                <motion.span 
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="text-6xl font-montserrat font-black text-champion-gold"
                >
                  $497
                </motion.span>
                <div className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm font-bold">
                  SAVE 50%
                </div>
              </div>
              
              <Link href="/vip-upgrade">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-primary text-xl px-12 py-4 inline-flex items-center gap-3"
                >
                  <Crown className="w-6 h-6" />
                  <span>YES! UPGRADE ME TO VIP</span>
                  <ArrowRight className="w-6 h-6" />
                </motion.button>
              </Link>
              
              <motion.p 
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="text-sm text-gray-400 mt-6"
              >
                ⏰ This offer expires when you leave this page
              </motion.p>
            </div>
          </motion.div>

          {/* Motivational Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 2 }}
            className="text-center mb-16"
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-r from-transparent via-champion-gold/10 to-transparent p-12 rounded-3xl"
            >
              <blockquote className="text-3xl font-light italic text-gray-300 mb-6 leading-relaxed">
                "You've taken the first step that 99% of people never take. 
                You've invested in yourself. Now, let's build the physique 
                and confidence you've always dreamed of."
              </blockquote>
              <div className="flex items-center justify-center gap-4">
                <div className="w-16 h-16 rounded-full bg-champion-gold/20 flex items-center justify-center">
                  <Trophy className="w-8 h-8 text-champion-gold" />
                </div>
                <div className="text-left">
                  <p className="text-champion-gold font-montserrat font-bold text-xl">
                    Brandon Hendrickson
                  </p>
                  <p className="text-gray-400">3x Mr. Olympia Champion</p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 2.2 }}
            className="grid md:grid-cols-2 gap-6 mb-16"
          >
            <motion.a
              href="#"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-champion-charcoal rounded-xl p-6 border border-gray-800 hover:border-champion-gold/50 transition-all duration-300 flex items-center gap-4"
            >
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <Play className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <h4 className="font-montserrat font-bold mb-1">Watch Welcome Video</h4>
                <p className="text-sm text-gray-400">Personal message from Brandon (5 min)</p>
              </div>
            </motion.a>
            
            <motion.a
              href="#"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-champion-charcoal rounded-xl p-6 border border-gray-800 hover:border-champion-gold/50 transition-all duration-300 flex items-center gap-4"
            >
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                <Download className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <h4 className="font-montserrat font-bold mb-1">Download Quick Start Guide</h4>
                <p className="text-sm text-gray-400">Everything you need to know (PDF)</p>
              </div>
            </motion.a>
          </motion.div>

          {/* Support Info with animation */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 2.5 }}
            className="text-center text-gray-400"
          >
            <div className="bg-champion-charcoal/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-800">
              <Shield className="w-12 h-12 text-champion-gold mx-auto mb-4" />
              <p className="text-lg mb-2">Need help? Our support team is here 24/7</p>
              <p className="text-champion-gold text-xl font-medium">
                <a href="mailto:support@brandonhendrickson.com" className="hover:underline">
                  support@brandonhendrickson.com
                </a>
              </p>
              <p className="text-sm mt-4">Average response time: &lt; 2 hours</p>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  )
}