'use client'

import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Trophy, Dumbbell, Apple, Users, Video, Calendar } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

export default function ProgramPresentation() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })
  
  const containerRef = useRef<HTMLDivElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  
  const springConfig = { damping: 25, stiffness: 150 }
  const mouseXSpring = useSpring(mouseX, springConfig)
  const mouseYSpring = useSpring(mouseY, springConfig)
  
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

  const modules = [
    {
      icon: Dumbbell,
      title: "Elite Training System",
      description: "12-week periodized program with exact sets, reps, and tempo for maximum aesthetic development",
      features: ["Video demonstrations", "Progressive overload tracking", "Mobile app access"]
    },
    {
      icon: Apple,
      title: "Championship Nutrition",
      description: "Personalized meal plans that adapt to your body type and goals",
      features: ["Macro calculations", "200+ recipes", "Supplement protocols"]
    },
    {
      icon: Video,
      title: "Weekly Live Coaching",
      description: "Direct access to Brandon in exclusive group coaching calls",
      features: ["Form checks", "Q&A sessions", "Progress reviews"]
    },
    {
      icon: Users,
      title: "Private Community",
      description: "Connect with other dedicated athletes on the same journey",
      features: ["24/7 support", "Accountability partners", "Success stories"]
    },
    {
      icon: Calendar,
      title: "90-Day Transformation",
      description: "Structured roadmap to your best physique ever",
      features: ["Weekly check-ins", "Progress photos", "Milestone rewards"]
    },
    {
      icon: Trophy,
      title: "Champion Mindset",
      description: "Mental training techniques used by elite competitors",
      features: ["Visualization guides", "Goal setting", "Competition prep"]
    }
  ]

  return (
    <section ref={containerRef} className="py-20 bg-champion-black relative overflow-hidden">
      {/* Mouse-following golden shadow */}
      <motion.div
        className="absolute w-[800px] h-[800px] rounded-full pointer-events-none z-10"
        style={{
          background: 'radial-gradient(circle, rgba(255,215,0,0.1) 0%, transparent 70%)',
          left: mousePosition.x - 400,
          top: mousePosition.y - 400,
          x: mouseXSpring,
          y: mouseYSpring,
        }}
      />
      
      <div ref={ref} className="section-padding relative z-20">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-20">
            <motion.h2 
              className="heading-2 mb-4"
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              Introducing <motion.span 
                className="text-gradient-gold"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.8, delay: 0.3, type: "spring", damping: 12 }}
              >
                CHAMPION'S PHYSIQUE
              </motion.span>
            </motion.h2>
            <motion.p 
              className="text-xl text-gray-400 max-w-3xl mx-auto"
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              The complete transformation system that takes you from where you are now 
              to the physique you've always wanted - guaranteed.
            </motion.p>
          </div>

          {/* Modules Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {modules.map((module, index) => {
              const Icon = module.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50, scale: 0.9 }}
                  animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
                  transition={{ duration: 0.6, delay: 0.5 + index * 0.15, ease: "easeOut" }}
                  className="relative bg-champion-charcoal rounded-xl p-8 border border-gray-800 overflow-hidden group"
                  style={{ transformStyle: "preserve-3d" }}
                  whileHover={{ y: -10, transition: { type: 'spring', stiffness: 300 } }}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-champion-gold to-yellow-600 opacity-0 group-hover:opacity-10 transition-opacity duration-300"
                  />
                  <motion.div 
                    className="absolute inset-0 border-2 border-champion-gold rounded-xl"
                    style={{
                      maskImage: 'linear-gradient(to bottom right, transparent 0%, black 50%, transparent 100%)',
                      WebkitMaskImage: 'linear-gradient(to bottom right, transparent 0%, black 50%, transparent 100%)',
                    }}
                    initial={{ rotate: '0deg' }}
                    animate={{ rotate: '360deg' }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  />
                  <div className="relative z-10" style={{ transform: "translateZ(20px)" }}>
                    <motion.div 
                      className="absolute -inset-8 bg-champion-gold/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    />
                    {/* Icon */}
                    <motion.div 
                      className="w-16 h-16 bg-champion-gold/10 rounded-xl flex items-center justify-center mb-6 border border-champion-gold/20 relative"
                      initial={{ scale: 0, rotateY: 180 }}
                      animate={inView ? { scale: 1, rotateY: 0 } : {}}
                      transition={{ duration: 0.6, delay: 0.7 + index * 0.15, type: 'spring' }}
                      whileHover={{
                        boxShadow: "0px 0px 30px rgba(255, 215, 0, 0.6)",
                      }}
                    >
                      <Icon className="w-8 h-8 text-champion-gold" />
                    </motion.div>

                    {/* Content */}
                    <h3 className="text-2xl font-montserrat font-bold mb-3">{module.title}</h3>
                    <p className="text-gray-400 mb-6">{module.description}</p>

                    {/* Features */}
                    <ul className="space-y-3">
                      {module.features.map((feature, featureIndex) => (
                        <motion.li 
                          key={featureIndex} 
                          className="flex items-center gap-3 text-sm text-gray-300"
                          initial={{ opacity: 0, x: -30 }}
                          animate={inView ? { opacity: 1, x: 0 } : {}}
                          transition={{ duration: 0.5, delay: 0.9 + index * 0.15 + featureIndex * 0.1, ease: "easeOut" }}
                        >
                          <motion.div 
                            className="w-2 h-2 bg-champion-gold rounded-full"
                            initial={{ scale: 0 }}
                            animate={inView ? { scale: 1 } : {}}
                            transition={{ duration: 0.4, delay: 1 + index * 0.15 + featureIndex * 0.1, type: 'spring' }}
                          />
                          <span>{feature}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-20">
            <motion.p 
              className="text-2xl text-gray-300 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 1.2 }}
            >
              Everything you need to build a <span className="text-champion-gold font-bold">championship physique</span> is included.
            </motion.p>
            <motion.div 
              className="inline-flex items-center gap-4 bg-champion-gold/10 border border-champion-gold/30 rounded-full px-6 py-3"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.8, delay: 1.4, type: 'spring' }}
              whileHover={{
                boxShadow: "0px 0px 20px rgba(255, 215, 0, 0.5)",
                y: -5
              }}
            >
              <Trophy className="w-5 h-5 text-champion-gold" />
              <span className="text-champion-gold font-medium">
                Valued at $497 - Available Today for a Fraction of the Price
              </span>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}