'use client'

import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion'
import { ArrowRight, Trophy, Star, Sparkles, Crown, Zap } from 'lucide-react'
import FuturisticTimer from './FuturisticTimer'
import { useRef, useEffect, useState } from 'react'

interface FinalCTAProps {
  onPurchase?: () => void
}

export default function FinalCTA({ onPurchase }: FinalCTAProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })
  
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8])
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])
  
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  
  const springConfig = { damping: 25, stiffness: 150 }
  const x = useSpring(mouseX, springConfig)
  const y = useSpring(mouseY, springConfig)

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
    <section ref={containerRef} className="py-20 bg-gradient-to-b from-champion-black to-champion-charcoal relative overflow-hidden">
      {/* Dynamic Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Radial Gradient that follows mouse */}
        <motion.div
          className="absolute w-[800px] h-[800px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(255,215,0,0.1) 0%, transparent 70%)',
            left: mousePosition.x - 400,
            top: mousePosition.y - 400,
            x,
            y,
          }}
        />
        
        {/* Animated Grid Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(rgba(255,215,0,0.1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,215,0,0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
            transform: 'perspective(500px) rotateX(60deg)',
            transformOrigin: 'center center',
          }} />
        </div>
        
        {/* Floating Stars */}
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            initial={{ 
              x: Math.random() * 1920,
              y: Math.random() * 1080,
              scale: 0
            }}
            animate={{
              x: Math.random() * 1920,
              y: Math.random() * 1080,
              scale: [0, 1, 0],
              rotate: [0, 180, 360]
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 5
            }}
          >
            <Star className="w-3 h-3 text-champion-gold/30 fill-champion-gold/20" />
          </motion.div>
        ))}
      </div>

      <motion.div 
        style={{ scale, opacity }}
        className="section-padding relative z-10"
      >
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, type: "spring", stiffness: 100 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          {/* Animated Trophy Icon */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            whileInView={{ scale: 1, rotate: 0 }}
            transition={{ 
              duration: 1.2, 
              type: "spring",
              stiffness: 200,
              damping: 20
            }}
            viewport={{ once: true }}
            className="relative inline-block mb-12"
          >
            {/* Orbiting Icons */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0"
            >
              {[0, 120, 240].map((rotation, i) => (
                <motion.div
                  key={i}
                  className="absolute w-full h-full"
                  style={{ rotate: rotation }}
                >
                  <motion.div
                    className="absolute -top-8 left-1/2 -translate-x-1/2"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 1, 0.5]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.7
                    }}
                  >
                    {i === 0 && <Crown className="w-6 h-6 text-champion-gold" />}
                    {i === 1 && <Zap className="w-6 h-6 text-champion-gold" />}
                    {i === 2 && <Sparkles className="w-6 h-6 text-champion-gold" />}
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
            
            {/* Central Trophy */}
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="relative inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-champion-gold/20 to-champion-gold/5 rounded-full backdrop-blur-sm"
            >
              <div className="absolute inset-0 bg-champion-gold/20 rounded-full blur-xl animate-pulse" />
              <Trophy className="w-12 h-12 text-champion-gold relative z-10" />
            </motion.div>
          </motion.div>

          {/* Headline with Letter Animation */}
          <motion.h2 
            className="heading-2 mb-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            {"Your Championship Journey ".split("").map((char, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.5,
                  delay: i * 0.03,
                  type: "spring",
                  stiffness: 200
                }}
                viewport={{ once: true }}
                className={char === " " ? "inline-block w-2" : ""}
              >
                {char}
              </motion.span>
            ))}
            <motion.span 
              className="text-gradient-gold"
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ 
                duration: 0.8,
                delay: 0.8,
                type: "spring",
                stiffness: 200
              }}
              viewport={{ once: true }}
            >
              Starts Now
            </motion.span>
          </motion.h2>

          {/* Body Copy with Fade-in Words */}
          <motion.p 
            className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            viewport={{ once: true }}
          >
            You've seen the proof. You know the system works. The only thing standing between 
            you and the physique you've always wanted is taking action right now.
          </motion.p>

          {/* Urgency Box with 3D Effect */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotateX: -30 }}
            whileInView={{ opacity: 1, scale: 1, rotateX: 0 }}
            transition={{ 
              duration: 0.8, 
              delay: 0.3,
              type: "spring",
              stiffness: 100
            }}
            viewport={{ once: true }}
            whileHover={{ 
              scale: 1.02,
              boxShadow: "0 20px 40px rgba(255,215,0,0.3)"
            }}
            className="bg-gradient-to-br from-champion-black/80 to-champion-charcoal/80 backdrop-blur-xl border border-champion-gold/40 rounded-2xl p-10 mb-10 relative overflow-hidden"
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* Animated Border Gradient */}
            <motion.div
              className="absolute inset-0 rounded-2xl"
              style={{
                background: 'linear-gradient(45deg, transparent, rgba(255,215,0,0.5), transparent)',
                backgroundSize: '200% 200%',
              }}
              animate={{
                backgroundPosition: ['0% 0%', '100% 100%', '0% 0%']
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear"
              }}
            />
            
            <div className="relative z-10">
              <FuturisticTimer />
            </div>
          </motion.div>

          {/* CTA Button with Complex Animations */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            viewport={{ once: true }}
            className="relative inline-block mb-8"
          >
            {/* Button Glow Effect */}
            <motion.div
              className="absolute inset-0 bg-champion-gold/30 rounded-full blur-2xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.8, 0.5]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            
            <motion.button
              whileHover={{ 
                scale: 1.05, 
                boxShadow: '0px 20px 40px rgba(255, 215, 0, 0.5)',
              }}
              whileTap={{ 
                scale: 0.95,
                boxShadow: '0px 0px 60px rgba(255, 215, 0, 0.9)',
              }}
              onClick={onPurchase}
              className="relative btn-primary text-xl py-8 px-16 shadow-2xl inline-flex items-center gap-4 group overflow-hidden"
            >
              {/* Animated Background */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-600"
                initial={{ x: "-100%" }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.3 }}
              />
              
              <span className="relative z-10 font-bold">YES! I WANT TO TRANSFORM MY BODY</span>
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <ArrowRight className="w-7 h-7 relative z-10" />
              </motion.div>
            </motion.button>
          </motion.div>

          {/* Guarantee Text with Icons */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            viewport={{ once: true }}
            className="flex items-center justify-center gap-6 text-sm text-gray-500 mb-16"
          >
            {["30-Day Money-Back Guarantee", "Instant Access", "Secure Checkout"].map((text, i) => (
              <motion.div
                key={i}
                className="flex items-center gap-2"
                whileHover={{ scale: 1.05, color: "#FFD700" }}
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                >
                  <Star className="w-4 h-4 text-champion-gold/50" />
                </motion.div>
                <span>{text}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* Final Message with 3D Card Effect */}
          <motion.div
            initial={{ opacity: 0, rotateY: -90 }}
            whileInView={{ opacity: 1, rotateY: 0 }}
            transition={{ 
              duration: 1.2, 
              delay: 0.8,
              type: "spring",
              stiffness: 100
            }}
            viewport={{ once: true }}
            whileHover={{ 
              rotateY: 5,
              boxShadow: "20px 20px 40px rgba(0,0,0,0.3)"
            }}
            className="relative p-8 border-l-4 border-champion-gold bg-gradient-to-r from-champion-charcoal/50 to-champion-black/50 backdrop-blur-sm rounded-r-2xl"
            style={{ 
              transformStyle: "preserve-3d",
              perspective: "1000px"
            }}
          >
            {/* Quote Marks */}
            <motion.div
              className="absolute -top-4 -left-2 text-6xl text-champion-gold/20 font-serif"
              animate={{ 
                opacity: [0.2, 0.5, 0.2],
                scale: [1, 1.1, 1]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              "
            </motion.div>
            
            <p className="text-lg italic text-gray-300 leading-relaxed mb-4">
              Champions aren't made in the gyms. Champions are made from something they have 
              deep inside them - a desire, a dream, a vision. You have that inside you. 
              Let me help you bring it out.
            </p>
            <motion.p 
              className="text-champion-gold font-montserrat font-bold text-xl"
              whileHover={{ scale: 1.05 }}
            >
              - Brandon Hendrickson
            </motion.p>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  )
}