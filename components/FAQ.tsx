'use client'

import { motion, useScroll, useTransform, AnimatePresence, useMotionValue, useSpring } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { ChevronDown, HelpCircle, Sparkles, Zap, Shield, Star } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

const faqs = [
  {
    question: "How quickly will I see results?",
    answer: "Most clients see visible changes within 2-3 weeks when following the program consistently. The complete transformation typically occurs over the 12-week period, with the most dramatic changes happening in weeks 6-12.",
    icon: Zap,
    color: "from-yellow-500 to-orange-500"
  },
  {
    question: "What makes this different from other programs?",
    answer: "This is the exact system I used to win 3 Mr. Olympia titles. It's not generic advice - it's championship-proven methods including my personal training splits, nutrition protocols, and mindset strategies that created a world-class physique.",
    icon: Star,
    color: "from-champion-gold to-yellow-500"
  },
  {
    question: "Do I need gym access?",
    answer: "While gym access is recommended for optimal results, the program includes home workout alternatives for every exercise. You'll also get access to our equipment guide showing you exactly what you need for home training.",
    icon: Shield,
    color: "from-blue-500 to-purple-500"
  },
  {
    question: "Is this suitable for beginners?",
    answer: "Absolutely! The program includes three different levels (Beginner, Intermediate, Advanced) with clear progression paths. Every exercise includes detailed video demonstrations and form cues to ensure you're training safely and effectively.",
    icon: Sparkles,
    color: "from-green-500 to-teal-500"
  },
  {
    question: "What about nutrition? Is it very restrictive?",
    answer: "The nutrition plan is flexible and sustainable. You'll learn how to calculate your personal macros and get meal plans that include foods you enjoy. No extreme restrictions - just smart, strategic eating for maximum results.",
    icon: HelpCircle,
    color: "from-purple-500 to-pink-500"
  },
  {
    question: "How much time do I need to commit daily?",
    answer: "Workouts are 45-60 minutes, 4-5 days per week. The program is designed for busy professionals - efficient, effective training that fits into your life. Quality over quantity is the key to championship results.",
    icon: Zap,
    color: "from-red-500 to-orange-500"
  }
]

export default function FAQ() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })
  
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  
  const x = useSpring(mouseX, { damping: 25, stiffness: 150 })
  const y = useSpring(mouseY, { damping: 25, stiffness: 150 })
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })
  
  const parallaxY = useTransform(scrollYProgress, [0, 1], [100, -100])
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8])
  const rotate = useTransform(scrollYProgress, [0, 1], [-5, 5])

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
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          className="absolute top-1/4 -left-20 w-96 h-96 bg-champion-gold/5 rounded-full blur-3xl"
          style={{ y: parallaxY }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-1/4 -right-20 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl"
          style={{ y: parallaxY }}
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-champion-gold/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, 20, -20],
              x: [-10, 10, -10],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Mouse-following golden shadow */}
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

      <div className="section-padding relative z-10">
        <div ref={ref} className="max-w-4xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.2, duration: 0.6, type: 'spring' }}
              className="inline-flex items-center gap-2 bg-champion-gold/10 border border-champion-gold/30 rounded-full px-6 py-3 mb-6"
            >
              <HelpCircle className="w-5 h-5 text-champion-gold" />
              <span className="text-champion-gold font-medium text-sm uppercase tracking-wider">
                Frequently Asked Questions
              </span>
            </motion.div>
            
            <h2 className="heading-2 mb-4">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="inline-block"
              >
                Everything You Need to
              </motion.span>{' '}
              <motion.span
                initial={{ opacity: 0, scale: 0.5, rotateX: 90 }}
                animate={inView ? { opacity: 1, scale: 1, rotateX: 0 } : {}}
                transition={{ delay: 0.5, duration: 0.8, type: "spring", damping: 15 }}
                className="text-gradient-gold inline-block"
              >
                Know
              </motion.span>
            </h2>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="text-xl text-gray-400"
            >
              Get answers to the most common questions about the transformation program
            </motion.p>
          </div>

          {/* FAQ Items */}
          <motion.div 
            className="space-y-4"
            style={{ scale, rotate }}
          >
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.3 + index * 0.1, duration: 0.6, ease: 'easeOut' }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="relative group"
              >
                {/* Glow effect on hover */}
                <motion.div
                  className={`absolute -inset-1 bg-gradient-to-r ${faq.color} rounded-2xl blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-500`}
                  animate={{
                    scale: hoveredIndex === index ? 1.02 : 1,
                  }}
                />
                
                <motion.div
                  className="relative bg-champion-charcoal border border-gray-800 rounded-2xl overflow-hidden"
                  whileHover={{ 
                    borderColor: 'rgba(255, 215, 0, 0.3)',
                    transition: { duration: 0.3 }
                  }}
                >
                  <button
                    onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                    className="w-full px-8 py-6 text-left flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <motion.div
                        className={`p-3 rounded-xl bg-gradient-to-br ${faq.color} shadow-lg`}
                        animate={{
                          rotate: activeIndex === index ? 360 : 0,
                          scale: hoveredIndex === index ? 1.1 : 1,
                        }}
                        transition={{ duration: 0.5, type: "spring" }}
                      >
                        <faq.icon className="w-6 h-6 text-white" />
                      </motion.div>
                      <h3 className="text-lg font-montserrat font-semibold text-white group-hover:text-champion-gold transition-colors duration-300">
                        {faq.question}
                      </h3>
                    </div>
                    
                    <motion.div
                      animate={{ 
                        rotate: activeIndex === index ? 180 : 0,
                        scale: hoveredIndex === index ? 1.2 : 1,
                      }}
                      transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
                      className="flex-shrink-0 ml-4"
                    >
                      <ChevronDown className="w-6 h-6 text-gray-400 group-hover:text-champion-gold transition-colors" />
                    </motion.div>
                  </button>
                  
                  <AnimatePresence>
                    {activeIndex === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ 
                          height: "auto", 
                          opacity: 1,
                          transition: {
                            height: { duration: 0.4, ease: "easeOut" },
                            opacity: { duration: 0.3, delay: 0.1 }
                          }
                        }}
                        exit={{ 
                          height: 0, 
                          opacity: 0,
                          transition: {
                            height: { duration: 0.3, ease: "easeIn" },
                            opacity: { duration: 0.2 }
                          }
                        }}
                        className="overflow-hidden"
                      >
                        <motion.div 
                          className="px-8 pb-6"
                          initial={{ y: -20 }}
                          animate={{ y: 0 }}
                          exit={{ y: -20 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="pl-16">
                            <p className="text-gray-300 leading-relaxed">
                              {faq.answer}
                            </p>
                            
                            {/* Decorative element */}
                            <motion.div
                              className="mt-4 h-1 bg-gradient-to-r from-champion-gold via-yellow-500 to-transparent rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: "100%" }}
                              transition={{ duration: 0.6, delay: 0.2 }}
                            />
                          </div>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="text-center mt-12"
          >
            <p className="text-gray-400 mb-4">
              Still have questions? We're here to help!
            </p>
            <motion.a
              href="#"
              className="inline-flex items-center gap-2 text-champion-gold hover:text-yellow-400 transition-colors group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="font-semibold">Contact Support</span>
              <motion.span
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                →
              </motion.span>
            </motion.a>
          </motion.div>
        </div>
      </div>
    </section>
  )
}