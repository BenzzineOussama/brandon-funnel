'use client'

import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Star, Quote, ChevronLeft, ChevronRight, Award, TrendingUp } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'

interface Testimonial {
  name: string
  age: number
  location: string
  result: string
  quote: string
  beforeImage: string
  afterImage: string
  rating: number
  timeframe: string
}

export default function Testimonials() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })
  
  const containerRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
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

  const testimonials: Testimonial[] = [
    {
      name: "Marcus Johnson",
      age: 32,
      location: "Los Angeles, CA",
      result: "Lost 35 lbs & Built Lean Muscle",
      quote: "Brandon's program completely transformed not just my body, but my entire approach to fitness. The attention to detail is unmatched.",
      beforeImage: "https://images.unsplash.com/photo-1583500178450-e59e4309b57d?q=80&w=400",
      afterImage: "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?q=80&w=400",
      rating: 5,
      timeframe: "12 weeks"
    },
    {
      name: "David Chen",
      age: 28,
      location: "New York, NY",
      result: "Gained 20 lbs of Muscle",
      quote: "I went from skinny to aesthetic in 90 days. The nutrition plan was a game-changer - I finally understood how to eat for my goals.",
      beforeImage: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=400",
      afterImage: "https://images.unsplash.com/photo-1583500178450-e59e4309b57d?q=80&w=400",
      rating: 5,
      timeframe: "90 days"
    },
    {
      name: "James Williams",
      age: 41,
      location: "Miami, FL",
      result: "Best Shape at 40+",
      quote: "At 41, I'm in better shape than I was at 21. Brandon's methods work regardless of age. My confidence has skyrocketed.",
      beforeImage: "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?q=80&w=400",
      afterImage: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=400",
      rating: 5,
      timeframe: "16 weeks"
    }
  ]

  // Auto-play carousel
  useEffect(() => {
    if (!isAutoPlaying) return
    
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    
    return () => clearInterval(interval)
  }, [isAutoPlaying, testimonials.length])

  const handlePrevious = () => {
    setIsAutoPlaying(false)
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  const handleNext = () => {
    setIsAutoPlaying(false)
    setActiveIndex((prev) => (prev + 1) % testimonials.length)
  }

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
      
      {/* Animated background elements */}
      <div ref={ref} className="absolute inset-0">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-64 h-64 bg-champion-gold/5 rounded-full blur-3xl"
            style={{
              left: `${i * 40}%`,
              top: `${i * 30}%`,
            }}
            animate={{
              x: [0, 50, 0],
              y: [0, -30, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 10 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 2,
            }}
          />
        ))}
      </div>

      <div className="section-padding relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center gap-2 bg-champion-gold/10 border border-champion-gold/30 rounded-full px-4 py-2 mb-6"
            >
              <Award className="w-5 h-5 text-champion-gold" />
              <span className="text-champion-gold font-medium text-sm uppercase tracking-wider">
                Real Results, Real People
              </span>
            </motion.div>
            
            <h2 className="heading-2 mb-4">
              <motion.span
                initial={{ opacity: 0, x: -20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="inline-block"
              >
                Join Thousands Who've
              </motion.span>{' '}
              <motion.span
                initial={{ opacity: 0, scale: 0 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.5, duration: 0.6, type: "spring" }}
                className="text-gradient-gold inline-block"
              >
                Transformed
              </motion.span>
            </h2>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="text-xl text-gray-400"
            >
              These are just a few of the success stories from the Champion's program
            </motion.p>
          </motion.div>

          {/* Testimonials Carousel */}
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
                className="grid md:grid-cols-5 gap-8 items-center"
              >
                {/* Before/After Images (takes 2/5 width) */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="md:col-span-2 relative h-96"
                >
                  <motion.div 
                    className="absolute inset-0 rounded-2xl overflow-hidden shadow-2xl"
                    whileHover={{ scale: 1.03 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <img
                      src={testimonials[activeIndex].afterImage}
                      alt="After"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute top-4 right-4 bg-champion-gold text-champion-black text-xs font-bold uppercase px-2 py-1 rounded">After</div>
                  </motion.div>
                  
                  <motion.div 
                    className="absolute top-1/4 left-[-20%] w-1/2 h-1/2 rounded-2xl overflow-hidden shadow-2xl border-4 border-champion-charcoal"
                    drag
                    dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                    whileHover={{ scale: 1.1, zIndex: 20 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <img
                      src={testimonials[activeIndex].beforeImage}
                      alt="Before"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute top-2 right-2 bg-white text-black text-xs font-bold uppercase px-2 py-1 rounded">Before</div>
                  </motion.div>
                </motion.div>

                {/* Testimonial Content (takes 3/5 width) */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  className="md:col-span-3 relative"
                >
                  
                  
                  <div className="relative">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-5 h-5 ${i < testimonials[activeIndex].rating ? 'text-champion-gold fill-current' : 'text-gray-600'}`} />
                        ))}
                      </div>
                      <div className="bg-champion-gold/10 text-champion-gold text-sm font-medium px-3 py-1 rounded-full">
                        {testimonials[activeIndex].timeframe} Transformation
                      </div>
                    </div>

                    <motion.h3 
                      className="text-2xl font-montserrat font-bold mb-2 text-white"
                      initial={{ opacity: 0, filter: 'blur(8px)', y: 20 }}
                      animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
                      transition={{ duration: 0.6, delay: 0.4 }}
                    >
                      {testimonials[activeIndex].result}
                    </motion.h3>
                    
                    <motion.p 
                      className="text-gray-400 mb-6"
                      initial={{ opacity: 0, filter: 'blur(8px)', y: 20 }}
                      animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
                      transition={{ duration: 0.6, delay: 0.5 }}
                    >
                      "{testimonials[activeIndex].quote}"
                    </motion.p>
                    
                    <motion.div 
                      className="flex items-center gap-4"
                      initial={{ opacity: 0, filter: 'blur(8px)', y: 20 }}
                      animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
                      transition={{ duration: 0.6, delay: 0.6 }}
                    >
                      <img src={testimonials[activeIndex].afterImage} alt={testimonials[activeIndex].name} className="w-12 h-12 rounded-full object-cover"/>
                      <div>
                        <div className="font-bold text-white">{testimonials[activeIndex].name}</div>
                        <div className="text-sm text-gray-500">{testimonials[activeIndex].location}</div>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Controls */}
            <div className="flex justify-center items-center gap-4 mt-12">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handlePrevious}
                className="w-12 h-12 bg-champion-charcoal rounded-full flex items-center justify-center hover:bg-champion-gold/20 transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </motion.button>
              
              {/* Dots Indicator */}
              <div className="flex gap-2">
                {testimonials.map((_, index) => (
                  <motion.button
                    key={index}
                    onClick={() => {
                      setActiveIndex(index)
                      setIsAutoPlaying(false)
                    }}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === activeIndex ? 'w-8 bg-champion-gold' : 'w-2 bg-gray-600'
                    }`}
                    whileHover={{ scale: 1.2 }}
                  />
                ))}
              </div>
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleNext}
                className="w-12 h-12 bg-champion-charcoal rounded-full flex items-center justify-center hover:bg-champion-gold/20 transition-colors"
              >
                <ChevronRight className="w-6 h-6" />
              </motion.button>
            </div>
          </div>

          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 1, duration: 0.6 }}
            className="grid grid-cols-3 gap-8 mt-16 text-center"
          >
            {[
              { number: '50,000+', label: 'Success Stories' },
              { number: '4.9/5', label: 'Average Rating' },
              { number: '97%', label: 'Would Recommend' },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 1.2 + index * 0.1, type: "spring" }}
                whileHover={{ y: -5 }}
                className="bg-champion-charcoal/50 backdrop-blur-sm rounded-lg p-6"
              >
                <motion.div
                  className="text-3xl font-montserrat font-black text-champion-gold mb-2"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                >
                  {stat.number}
                </motion.div>
                <div className="text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}