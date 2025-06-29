'use client'

import { motion, useScroll, useTransform, useMotionValue, useSpring, AnimatePresence } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'
import { ArrowRight, Sparkles, Trophy, Zap } from 'lucide-react'

export default function Hero() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isLoaded, setIsLoaded] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  })
  
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%'])
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0])
  
  // Mouse parallax effect
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const smoothMouseX = useSpring(mouseX, { stiffness: 300, damping: 30 })
  const smoothMouseY = useSpring(mouseY, { stiffness: 300, damping: 30 })

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e
      const { innerWidth, innerHeight } = window
      const x = (clientX - innerWidth / 2) / innerWidth
      const y = (clientY - innerHeight / 2) / innerHeight
      mouseX.set(x * 20)
      mouseY.set(y * 20)
      setMousePosition({ x: clientX, y: clientY })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [mouseX, mouseY])

  const floatingAnimation = {
    y: [0, -5, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }

  // Lightning paths for more dramatic effect
  const lightningPaths = [
    "M960,0 L980,200 L940,250 L990,400 L920,450 L970,600 L930,650 L960,1080",
    "M480,0 L500,150 L460,200 L510,350 L440,400 L490,550 L450,600 L480,1080",
    "M1440,0 L1420,180 L1460,230 L1410,380 L1480,430 L1430,580 L1470,630 L1440,1080",
    "M240,0 L260,120 L220,170 L270,320 L200,370 L250,520 L210,570 L240,1080",
    "M1680,0 L1660,160 L1700,210 L1650,360 L1720,410 L1670,560 L1710,610 L1680,1080",
  ]

  return (
    <section ref={containerRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Initial loading animation */}
      <AnimatePresence>
        {!isLoaded && (
          <motion.div
            className="fixed inset-0 z-50 bg-champion-black flex items-center justify-center"
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [1, 0.5, 1],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
              }}
            >
              <Zap className="w-24 h-24 text-champion-gold" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mouse-following golden shadow with enhanced glow */}
      <motion.div
        className="absolute w-[1000px] h-[1000px] rounded-full pointer-events-none z-10"
        style={{
          background: 'radial-gradient(circle, rgba(255,215,0,0.25) 0%, rgba(255,215,0,0.1) 40%, transparent 70%)',
          left: mousePosition.x - 500,
          top: mousePosition.y - 500,
          x: smoothMouseX,
          y: smoothMouseY,
          filter: 'blur(40px)',
        }}
      />
      
      {/* Ultra-Modern Animated Background */}
      <motion.div 
        className="absolute inset-0 z-0 bg-champion-black overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
      >
        {/* Base gradient with animation */}
        <motion.div 
          className="absolute inset-0"
          animate={{
            background: [
              'radial-gradient(circle at 20% 80%, #1a1a1a 0%, #000000 50%)',
              'radial-gradient(circle at 80% 20%, #1a1a1a 0%, #000000 50%)',
              'radial-gradient(circle at 50% 50%, #1a1a1a 0%, #000000 50%)',
              'radial-gradient(circle at 20% 80%, #1a1a1a 0%, #000000 50%)',
            ],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Enhanced animated energy vortex */}
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 0, rotate: -180 }}
          animate={{
            scale: [1, 1.5, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            scale: {
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut"
            },
            rotate: {
              duration: 30,
              repeat: Infinity,
              ease: "linear"
            }
          }}
        >
          <div 
            className="absolute inset-0"
            style={{
              background: `
                radial-gradient(circle at 50% 50%, transparent 0%, rgba(212, 175, 55, 0.15) 30%, transparent 60%),
                conic-gradient(from 0deg at 50% 50%, transparent, rgba(212, 175, 55, 0.1), transparent, rgba(212, 175, 55, 0.1), transparent)
              `,
            }}
          />
        </motion.div>
        
        {/* 3D Grid effect with animation */}
        <motion.div 
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 2 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2, delay: 0.5 }}
          style={{
            backgroundImage: `
              linear-gradient(rgba(212, 175, 55, 0.15) 1px, transparent 1px),
              linear-gradient(90deg, rgba(212, 175, 55, 0.15) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
            transform: 'perspective(1000px) rotateX(60deg)',
            transformOrigin: 'center center',
          }}
        />
        
        {/* Multiple animated energy waves */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={`wave-${i}`}
            className="absolute inset-0"
            initial={{ scale: 0 }}
            animate={{
              scale: [0, 2, 0],
              opacity: [0, 0.3, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              delay: i * 1.3,
              ease: "easeOut"
            }}
          >
            <div 
              className="absolute inset-0"
              style={{
                background: `radial-gradient(circle at 50% 50%, transparent 0%, rgba(212, 175, 55, 0.2) 40%, transparent 70%)`,
              }}
            />
          </motion.div>
        ))}
        
        {/* Enhanced Lightning effects */}
        {lightningPaths.map((path, i) => (
          <motion.div
            key={`lightning-${i}`}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0, 0, 1, 1, 0],
            }}
            transition={{
              duration: 0.5,
              repeat: Infinity,
              repeatDelay: 2 + i * 0.7,
              delay: i * 0.3,
              times: [0, 0.4, 0.5, 0.9, 1],
            }}
          >
            <svg className="w-full h-full" viewBox="0 0 1920 1080">
              <defs>
                <filter id={`glow-${i}`}>
                  <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
                <linearGradient id={`lightning-gradient-${i}`} x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#D4AF37" stopOpacity="0" />
                  <stop offset="20%" stopColor="#FFD700" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#FFFFFF" stopOpacity="1" />
                  <stop offset="80%" stopColor="#FFD700" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d={path}
                stroke={`url(#lightning-gradient-${i})`}
                strokeWidth="3"
                fill="none"
                filter={`url(#glow-${i})`}
              />
              {/* Secondary glow effect */}
              <path
                d={path}
                stroke="#D4AF37"
                strokeWidth="8"
                fill="none"
                opacity="0.3"
                filter="blur(8px)"
              />
            </svg>
          </motion.div>
        ))}
        
        {/* Geometric shapes animation with 3D effect */}
        <div className="absolute inset-0">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={`shape-${i}`}
              className="absolute"
              style={{
                left: `${10 + i * 12}%`,
                top: `${20 + i * 10}%`,
              }}
              initial={{ opacity: 0, scale: 0, rotateY: -180 }}
              animate={{
                opacity: [0.1, 0.4, 0.1],
                scale: [0.8, 1.2, 0.8],
                rotateY: [0, 360],
                rotateZ: [0, 180, 360],
              }}
              transition={{
                duration: 8 + i * 2,
                repeat: Infinity,
                delay: i * 0.3,
                ease: "easeInOut",
              }}
            >
              <div 
                className="w-24 h-24 border-2 border-champion-gold/30"
                style={{
                  clipPath: i % 3 === 0 
                    ? 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' 
                    : i % 3 === 1
                    ? 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)'
                    : 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
                  background: 'linear-gradient(45deg, transparent, rgba(212, 175, 55, 0.1), transparent)',
                  transform: 'perspective(100px) rotateX(20deg)',
                }}
              />
            </motion.div>
          ))}
        </div>
        
        {/* Enhanced particle field effect */}
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, delay: 1 }}
          style={{
            backgroundImage: `
              radial-gradient(circle, rgba(212, 175, 55, 0.4) 1px, transparent 1px),
              radial-gradient(circle, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '30px 30px, 50px 50px',
            backgroundPosition: '0 0, 25px 25px',
            x: smoothMouseX,
            y: smoothMouseY,
          }}
        />
        
        {/* Central energy core with pulsing effect */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          initial={{ scale: 0 }}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <div className="relative">
            <div className="w-[600px] h-[600px] rounded-full bg-gradient-to-r from-champion-gold/20 via-champion-gold/10 to-transparent blur-3xl" />
            <div className="absolute inset-0 w-[600px] h-[600px] rounded-full bg-gradient-to-r from-transparent via-champion-gold/20 to-champion-gold/10 blur-3xl animate-spin-slow" />
          </div>
        </motion.div>
        
        {/* Overlay gradient for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-champion-black via-transparent to-champion-black/50" />
      </motion.div>

      {/* Enhanced floating particles with glow */}
      <div className="absolute inset-0 z-10">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${5 + i * 8}%`,
              top: `${10 + i * 7}%`,
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
          >
            <motion.div
              className="relative"
              animate={{
                y: [0, -200, 0],
                x: [0, 50, -50, 0],
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 10 + i * 2,
                repeat: Infinity,
                delay: i * 0.5,
                ease: "easeInOut"
              }}
            >
              <div className="w-4 h-4 bg-champion-gold rounded-full blur-sm" />
              <div className="absolute inset-0 w-4 h-4 bg-champion-gold rounded-full animate-ping" />
              <div className="absolute inset-0 w-8 h-8 -top-2 -left-2 bg-champion-gold/30 rounded-full blur-xl" />
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* Enhanced cursor follower effect */}
      <motion.div
        className="fixed w-[500px] h-[500px] rounded-full pointer-events-none z-30"
        style={{
          background: 'radial-gradient(circle, rgba(212, 175, 55, 0.15) 0%, transparent 60%)',
          x: mousePosition.x - 250,
          y: mousePosition.y - 250,
          filter: 'blur(60px)',
        }}
        animate={{
          scale: [1, 1.3, 1],
        }}
        transition={{
          scale: {
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }
        }}
      />

      {/* Content with enhanced animations */}
      <motion.div 
        className="relative z-20 section-padding py-20"
        style={{ opacity }}
      >
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
          className="max-w-4xl mx-auto text-center"
        >
          {/* Animated badge with enhanced effects */}
          <motion.div
            initial={{ opacity: 0, scale: 0, rotateX: -90 }}
            animate={{ opacity: 1, scale: 1, rotateX: 0 }}
            transition={{ delay: 1, duration: 0.8, type: "spring", stiffness: 100 }}
            whileHover={{ scale: 1.05, rotateY: 10 }}
            className="inline-flex items-center gap-2 bg-champion-gold/10 border border-champion-gold/30 rounded-full px-6 py-3 mb-8 relative"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Multiple pulse effects */}
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={`pulse-${i}`}
                className="absolute inset-0 rounded-full bg-champion-gold/20"
                animate={{
                  scale: [1, 1.5, 2],
                  opacity: [0.5, 0.2, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.6,
                  ease: "easeOut"
                }}
              />
            ))}
            <motion.div animate={floatingAnimation}>
              <Trophy className="w-5 h-5 text-champion-gold relative z-10" />
            </motion.div>
            <span className="text-champion-gold font-medium text-sm uppercase tracking-wider relative z-10">
              3X MR. OLYMPIA CHAMPION
            </span>
          </motion.div>

          {/* Main heading with dramatic entrance */}
          <div className="mb-6">
            <motion.h1 
              className="heading-1 mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 1 }}
            >
              <motion.span
                initial={{ opacity: 0, y: -50, scale: 0.5, filter: "blur(20px)" }}
                animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                transition={{ delay: 1.3, duration: 1, ease: [0.43, 0.13, 0.23, 0.96] }}
                className="block text-gradient-gold relative perspective-1000"
                style={{ transformStyle: 'preserve-3d' }}
              >
                Transform Your Body
                <motion.span
                  className="absolute -top-8 -right-8"
                  initial={{ opacity: 0, scale: 0, rotate: -360 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  transition={{ delay: 2, duration: 0.8, type: "spring", stiffness: 200 }}
                >
                  <Sparkles className="w-10 h-10 text-champion-gold" />
                </motion.span>
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 50, scale: 0.5, filter: "blur(20px)" }}
                animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                transition={{ delay: 1.5, duration: 1, ease: [0.43, 0.13, 0.23, 0.96] }}
                className="block perspective-1000"
                style={{ transformStyle: 'preserve-3d' }}
              >
                Like a Champion
              </motion.span>
            </motion.h1>
          </div>

          {/* Subheading with typewriter effect */}
          <motion.p
            initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ delay: 1.8, duration: 0.8 }}
            className="text-xl md:text-2xl text-gray-300 mb-12 max-w-2xl mx-auto"
          >
            Get the exact training system of a 3X Mr. Olympia Champion
          </motion.p>

          {/* Ultra-Enhanced Call to Action Button */}
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 2, duration: 0.8, type: "spring", stiffness: 100 }}
            className="mt-12"
          >
            <motion.a
              href="#vsl-section"
              className="inline-flex items-center gap-3 bg-gradient-gold text-champion-black font-montserrat font-bold py-5 px-10 rounded-lg shadow-2xl hover:shadow-3xl transform transition-all duration-300 relative overflow-hidden group"
              whileHover={{ 
                scale: 1.08, 
                y: -5,
                rotateX: -5,
                rotateY: 5,
              }}
              whileTap={{ scale: 0.92 }}
              animate={{
                boxShadow: [
                  "0 10px 30px -5px rgba(212, 175, 55, 0.4), 0 0 60px -10px rgba(212, 175, 55, 0.3)",
                  "0 20px 40px -5px rgba(212, 175, 55, 0.7), 0 0 80px -10px rgba(212, 175, 55, 0.5)",
                  "0 10px 30px -5px rgba(212, 175, 55, 0.4), 0 0 60px -10px rgba(212, 175, 55, 0.3)",
                ],
              }}
              transition={{
                boxShadow: {
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }
              }}
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Pulsing background */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-champion-gold to-yellow-600"
                animate={{
                  opacity: [0.8, 1, 0.8],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              
              {/* Multiple layered shine effects */}
              <motion.div
                className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/50 to-transparent skew-x-12"
                transition={{ duration: 0.5 }}
              />
              <motion.div
                className="absolute inset-0 translate-x-full group-hover:-translate-x-full bg-gradient-to-r from-transparent via-yellow-200/30 to-transparent skew-x-12"
                transition={{ duration: 0.5, delay: 0.1 }}
              />
              <motion.div
                className="absolute inset-0 -translate-y-full group-hover:translate-y-full bg-gradient-to-b from-transparent via-white/30 to-transparent"
                transition={{ duration: 0.6, delay: 0.2 }}
              />
              
              {/* Rotating border effect */}
              <motion.div
                className="absolute inset-0 rounded-lg"
                style={{
                  background: 'conic-gradient(from 0deg, transparent, rgba(255,255,255,0.3), transparent, rgba(255,255,255,0.3), transparent)',
                }}
                animate={{
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
              
              {/* Enhanced electric effect on hover */}
              <motion.div
                className="absolute inset-0 opacity-0 group-hover:opacity-100"
                transition={{ duration: 0.3 }}
              >
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={`electric-${i}`}
                    className="absolute"
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: [0, 1, 0],
                      scale: [0.5, 1.5, 0.5],
                    }}
                    transition={{
                      duration: 0.4,
                      repeat: Infinity,
                      delay: i * 0.1,
                    }}
                    style={{
                      top: `${Math.random() * 80 + 10}%`,
                      left: `${Math.random() * 80 + 10}%`,
                    }}
                  >
                    <Zap className="w-6 h-6 text-white/70 drop-shadow-glow" />
                  </motion.div>
                ))}
              </motion.div>
              
              {/* Particle explosion on hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none">
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={`particle-${i}`}
                    className="absolute top-1/2 left-1/2 w-1 h-1 bg-yellow-300 rounded-full"
                    initial={{ x: 0, y: 0 }}
                    animate={{
                      x: [0, (Math.random() - 0.5) * 100],
                      y: [0, (Math.random() - 0.5) * 100],
                      opacity: [1, 0],
                      scale: [1, 0],
                    }}
                    transition={{
                      duration: 0.8,
                      repeat: Infinity,
                      delay: i * 0.1,
                    }}
                  />
                ))}
              </div>
              
              <span className="relative z-10 text-lg flex items-center gap-3 font-black tracking-wider">
                DISCOVER THE METHOD
                <motion.div
                  animate={{ 
                    x: [0, 8, 0],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{ 
                    duration: 1.2, 
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <ArrowRight className="w-6 h-6 filter drop-shadow-lg" />
                </motion.div>
              </span>
            </motion.a>
          </motion.div>

          {/* Ultra-Enhanced animated stats with explosive entrance */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.4, duration: 1 }}
            className="mt-20 grid grid-cols-3 gap-10 max-w-3xl mx-auto"
          >
            {[
              { number: '50K+', label: 'Athletes Transformed', icon: '💪' },
              { number: '3X', label: 'Mr. Olympia Winner', icon: '🏆' },
              { number: '10+', label: 'Years of Excellence', icon: '⭐' },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ 
                  opacity: 0, 
                  scale: 0, 
                  rotateY: -180,
                  rotateX: -180,
                  filter: "blur(20px)"
                }}
                animate={{ 
                  opacity: 1, 
                  scale: 1, 
                  rotateY: 0,
                  rotateX: 0,
                  filter: "blur(0px)"
                }}
                transition={{ 
                  delay: 2.6 + index * 0.3, 
                  duration: 1.2,
                  type: "spring",
                  stiffness: 80,
                  damping: 15
                }}
                whileHover={{ 
                  scale: 1.15, 
                  y: -15,
                  rotateY: 15,
                  rotateX: -10,
                  transition: { 
                    type: "spring", 
                    stiffness: 300,
                    damping: 10,
                    duration: 0.3
                  }
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                  duration: 0.3
                }}
                className="text-center relative group cursor-pointer"
                style={{ 
                  transformStyle: 'preserve-3d',
                  perspective: '1000px'
                }}
              >
                {/* Multiple layered glow effects */}
                <motion.div
                  className="absolute -inset-4 bg-gradient-to-r from-champion-gold/0 via-champion-gold/30 to-champion-gold/0 rounded-2xl blur-2xl"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ 
                    opacity: 1, 
                    scale: 1.2,
                    rotate: 180
                  }}
                  animate={{
                    rotate: [0, 360],
                  }}
                  transition={{ 
                    rotate: {
                      duration: 20,
                      repeat: Infinity,
                      ease: "linear"
                    },
                    opacity: { duration: 0.3 }
                  }}
                />
                
                {/* Pulsing ring effect */}
                <motion.div
                  className="absolute -inset-2 rounded-2xl"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                >
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={`ring-${i}`}
                      className="absolute inset-0 border-2 border-champion-gold/30 rounded-2xl"
                      animate={{
                        scale: [1, 1.3, 1.6],
                        opacity: [0.5, 0.2, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.6,
                        ease: "easeOut"
                      }}
                    />
                  ))}
                </motion.div>
                
                {/* 3D Card effect */}
                <motion.div
                  className="relative bg-gradient-to-br from-gray-900/90 via-champion-black/90 to-gray-900/90 rounded-2xl p-6 border border-champion-gold/20 backdrop-blur-sm"
                  whileHover={{
                    background: "linear-gradient(135deg, rgba(212, 175, 55, 0.1) 0%, rgba(0, 0, 0, 0.9) 50%, rgba(212, 175, 55, 0.1) 100%)",
                  }}
                  style={{
                    transformStyle: 'preserve-3d',
                    boxShadow: '0 10px 40px rgba(212, 175, 55, 0.2)',
                  }}
                >
                  {/* Floating icon */}
                  <motion.div
                    className="absolute -top-4 left-1/2 -translate-x-1/2 text-3xl"
                    animate={{
                      y: [0, -5, 0],
                      rotate: [0, 10, -10, 0],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    {stat.icon}
                  </motion.div>
                  
                  {/* Number with counter effect */}
                  <motion.div
                    className="text-4xl md:text-5xl font-montserrat font-black text-transparent bg-clip-text bg-gradient-to-r from-champion-gold via-yellow-300 to-champion-gold relative z-10 mt-4"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ 
                      delay: 2.8 + index * 0.15, 
                      duration: 0.8,
                      type: "spring",
                      stiffness: 200
                    }}
                    whileHover={{
                      scale: 1.1,
                      textShadow: "0 0 30px rgba(212, 175, 55, 0.8)",
                    }}
                  >
                    {stat.number}
                  </motion.div>
                  
                  {/* Label with glow effect */}
                  <motion.div 
                    className="text-sm text-gray-400 mt-2 relative z-10 font-medium"
                    whileHover={{ 
                      color: '#D4AF37',
                      textShadow: "0 0 20px rgba(212, 175, 55, 0.5)"
                    }}
                  >
                    {stat.label}
                  </motion.div>
                  
                  {/* Lightning effects on hover */}
                  <motion.div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none"
                    transition={{ duration: 0.3 }}
                  >
                    {[...Array(4)].map((_, i) => (
                      <motion.div
                        key={`lightning-stat-${i}`}
                        className="absolute"
                        initial={{ opacity: 0 }}
                        animate={{
                          opacity: [0, 1, 0],
                          scale: [0.5, 1.5, 0.5],
                        }}
                        transition={{
                          duration: 0.5,
                          repeat: Infinity,
                          delay: i * 0.15,
                        }}
                        style={{
                          top: `${Math.random() * 100}%`,
                          left: `${Math.random() * 100}%`,
                        }}
                      >
                        <Zap className="w-4 h-4 text-champion-gold/60 filter drop-shadow-glow" />
                      </motion.div>
                    ))}
                  </motion.div>
                  
                  {/* Particle burst on hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none overflow-hidden rounded-2xl">
                    {[...Array(6)].map((_, i) => (
                      <motion.div
                        key={`particle-stat-${i}`}
                        className="absolute top-1/2 left-1/2 w-1 h-1 bg-champion-gold rounded-full"
                        initial={{ x: 0, y: 0 }}
                        animate={{
                          x: [(Math.random() - 0.5) * 200],
                          y: [(Math.random() - 0.5) * 200],
                          opacity: [0, 1, 0],
                          scale: [0, 2, 0],
                        }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          delay: i * 0.1,
                          ease: "easeOut"
                        }}
                      />
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Enhanced scroll indicator with electric effect */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 3, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="relative"
        >
          <div className="w-6 h-10 border-2 border-champion-gold/50 rounded-full flex justify-center relative">
            <motion.div
              animate={{ y: [0, 15, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1 h-3 bg-champion-gold rounded-full mt-2"
            />
            {/* Electric sparks */}
            <motion.div
              className="absolute -inset-2"
              animate={{
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            >
              <Zap className="absolute w-4 h-4 text-champion-gold/50 -top-1 -right-1" />
              <Zap className="absolute w-3 h-3 text-champion-gold/30 -bottom-1 -left-1" />
            </motion.div>
          </div>
          {/* Multiple glow effects */}
          <motion.div
            className="absolute inset-0 w-6 h-10 border-2 border-champion-gold/30 rounded-full blur-md"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.5, 0, 0.5],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
            }}
          />
          <motion.div
            className="absolute inset-0 w-6 h-10 bg-champion-gold/20 rounded-full blur-xl"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 0, 0.3],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: 0.5,
            }}
          />
        </motion.div>
      </motion.div>
    </section>
  )
}