'use client'

import { motion, useScroll, useTransform, useMotionValue, useSpring, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { X, Check, AlertCircle, Target, TrendingUp, Zap, Flame, Shield, Brain, Dumbbell, ChevronRight } from 'lucide-react'
import { useRef, useState, useEffect } from 'react'

export default function ProblemSolution() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })
  
  const containerRef = useRef<HTMLDivElement>(null)
  const [hoveredProblem, setHoveredProblem] = useState<number | null>(null)
  const [hoveredSolution, setHoveredSolution] = useState<number | null>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })
  
  const rotateX = useTransform(scrollYProgress, [0, 1], [15, -15])
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1, 0.9])
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])
  
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const springX = useSpring(mouseX, { stiffness: 150, damping: 20 })
  const springY = useSpring(mouseY, { stiffness: 150, damping: 20 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      mouseX.set((e.clientX - rect.left - rect.width / 2) * 0.02)
      mouseY.set((e.clientY - rect.top - rect.height / 2) * 0.02)
      setMousePosition({ x: e.clientX - rect.left, y: e.clientY - rect.top })
    }
    
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [mouseX, mouseY])

  const problems = [
    { text: "Training hard but not seeing the results you deserve", icon: Dumbbell, color: "red" },
    { text: "Confused by conflicting nutrition advice online", icon: Brain, color: "orange" },
    { text: "Lacking the structure and accountability to stay consistent", icon: AlertCircle, color: "red" },
    { text: "Plateaued and don't know how to break through", icon: X, color: "orange" },
    { text: "Wasting time on ineffective workout routines", icon: Flame, color: "red" },
  ]

  const solutions = [
    { text: "Exact training protocols used by a 3x world champion", icon: Target, color: "green" },
    { text: "Crystal-clear nutrition plan tailored for aesthetic physique", icon: Check, color: "emerald" },
    { text: "Daily accountability and progress tracking system", icon: TrendingUp, color: "green" },
    { text: "Advanced techniques to shatter any plateau", icon: Zap, color: "yellow" },
    { text: "Efficient workouts that deliver maximum results", icon: Shield, color: "emerald" },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -50, rotateY: -90 },
    visible: { 
      opacity: 1, 
      x: 0,
      rotateY: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  }

  return (
    <section ref={containerRef} className="py-20 bg-gradient-to-b from-champion-charcoal to-champion-black relative overflow-hidden">
      {/* Mouse-following golden shadow */}
      <motion.div
        className="absolute w-[800px] h-[800px] rounded-full pointer-events-none z-10"
        style={{
          background: 'radial-gradient(circle, rgba(255,215,0,0.1) 0%, transparent 70%)',
          left: mousePosition.x - 400,
          top: mousePosition.y - 400,
          x: springX,
          y: springY,
        }}
      />
      
      {/* Dynamic Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Animated Grid Pattern */}
        <motion.div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
            x: springX,
            y: springY,
          }}
        />
        
        {/* Floating Particles */}
        {[...Array(40)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full"
            style={{
              background: i % 2 === 0 ? 'rgba(239, 68, 68, 0.5)' : 'rgba(34, 197, 94, 0.5)',
            }}
            initial={{ 
              x: Math.random() * 1920,
              y: Math.random() * 1080,
              scale: 0
            }}
            animate={{
              x: Math.random() * 1920,
              y: Math.random() * 1080,
              scale: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 20 + 10,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 10
            }}
          />
        ))}
        
        {/* Gradient Orbs */}
        <motion.div
          className="absolute -top-40 -left-40 w-80 h-80 bg-red-500/10 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{ duration: 20, repeat: Infinity }}
        />
        <motion.div
          className="absolute -bottom-40 -right-40 w-80 h-80 bg-green-500/10 rounded-full blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, 50, 0],
          }}
          transition={{ duration: 20, repeat: Infinity }}
        />
      </div>

      <motion.div 
        style={{ opacity }}
        className="section-padding relative z-10"
      >
        <motion.div 
          ref={ref}
          style={{ scale }}
          className="max-w-6xl mx-auto"
        >
          {/* Section Header with Advanced Animation */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            {/* Animated Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0, rotate: -180 }}
              animate={inView ? { opacity: 1, scale: 1, rotate: 0 } : {}}
              transition={{ 
                delay: 0.2, 
                duration: 0.8,
                type: "spring",
                stiffness: 200
              }}
              className="inline-block mb-8"
            >
              <motion.div
                className="relative inline-flex items-center gap-3 bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/30 rounded-full px-6 py-3"
                whileHover={{ scale: 1.05 }}
                animate={{
                  boxShadow: [
                    '0 0 20px rgba(239, 68, 68, 0.3)',
                    '0 0 40px rgba(251, 146, 60, 0.5)',
                    '0 0 20px rgba(239, 68, 68, 0.3)',
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                >
                  <AlertCircle className="w-6 h-6 text-red-500" />
                </motion.div>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500 font-bold text-sm uppercase tracking-wider">
                  The Truth About Your Training
                </span>
              </motion.div>
            </motion.div>
            
            {/* Title with Word Animation */}
            <h2 className="heading-2 mb-6">
              <motion.span className="inline-block">
                {"You're Training Without".split(" ").map((word, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 50, rotateX: -90 }}
                    animate={inView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
                    transition={{ 
                      delay: 0.3 + i * 0.1, 
                      duration: 0.6,
                      type: "spring",
                      stiffness: 100
                    }}
                    className="inline-block mr-2"
                  >
                    {word}
                  </motion.span>
                ))}
              </motion.span>
              <motion.span
                initial={{ opacity: 0, scale: 0, rotateY: 180 }}
                animate={inView ? { opacity: 1, scale: 1, rotateY: 0 } : {}}
                transition={{ 
                  delay: 0.6, 
                  duration: 1,
                  type: "spring",
                  stiffness: 150
                }}
                className="text-gradient-gold inline-block"
              >
                Real Results?
              </motion.span>
            </h2>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="text-xl text-gray-400"
            >
              You're not alone. I've been there, and I know exactly how to fix it.
            </motion.p>
          </motion.div>

          {/* Problem/Solution Grid with 3D Cards */}
          <motion.div 
            className="grid md:grid-cols-2 gap-8 lg:gap-12"
            style={{ 
              rotateX,
              transformStyle: "preserve-3d",
              perspective: "1000px"
            }}
          >
            {/* Problems Column */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              className="relative"
            >
              <motion.div
                initial={{ opacity: 0, x: -50, rotateY: -30 }}
                animate={inView ? { opacity: 1, x: 0, rotateY: 0 } : {}}
                transition={{ delay: 0.4, duration: 0.8, type: "spring" }}
                whileHover={{ 
                  scale: 1.02,
                  rotateY: -5,
                  boxShadow: "0 20px 40px rgba(239, 68, 68, 0.3)"
                }}
                className="bg-gradient-to-br from-red-500/10 to-orange-500/10 border border-red-500/30 rounded-3xl p-8 relative overflow-hidden backdrop-blur-sm h-full"
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* Animated Background Pattern */}
                <motion.div
                  className="absolute inset-0"
                  animate={{
                    backgroundPosition: ["0% 0%", "100% 100%"],
                  }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  style={{
                    backgroundImage: `radial-gradient(circle at 20% 80%, rgba(239, 68, 68, 0.1) 0%, transparent 50%)`,
                    backgroundSize: "200% 200%",
                  }}
                />
                
                {/* Floating Icon */}
                <motion.div
                  className="absolute -top-10 -right-10 text-red-500/10"
                  animate={{
                    y: [0, -20, 0],
                    rotate: [0, 10, 0],
                  }}
                  transition={{ duration: 5, repeat: Infinity }}
                >
                  <X className="w-40 h-40" />
                </motion.div>
                
                <div className="relative z-10">
                  <motion.h3 
                    className="text-2xl font-montserrat font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400"
                    whileHover={{ scale: 1.05 }}
                  >
                    The Problems You Face
                  </motion.h3>
                  <ul className="space-y-5">
                    {problems.map((problem, index) => (
                      <motion.li
                        key={index}
                        variants={itemVariants}
                        custom={index}
                        className="relative"
                        onMouseEnter={() => setHoveredProblem(index)}
                        onMouseLeave={() => setHoveredProblem(null)}
                      >
                        <motion.div
                          className="flex items-start gap-4 group cursor-pointer"
                          whileHover={{ x: 10 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <motion.div
                            className="relative mt-1"
                            animate={{
                              rotate: hoveredProblem === index ? 360 : 0,
                              scale: hoveredProblem === index ? 1.2 : 1,
                            }}
                            transition={{ duration: 0.5 }}
                          >
                            <motion.div
                              className={`absolute inset-0 bg-${problem.color}-500/20 blur-lg`}
                              animate={{
                                scale: hoveredProblem === index ? 1.5 : 0,
                              }}
                            />
                            <problem.icon className={`w-6 h-6 text-${problem.color}-500 relative z-10`} />
                          </motion.div>
                          <span className="text-gray-300 group-hover:text-white transition-all duration-300 flex-1">
                            {problem.text}
                          </span>
                          <AnimatePresence>
                            {hoveredProblem === index && (
                              <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                              >
                                <ChevronRight className="w-5 h-5 text-red-500" />
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </motion.div>

            {/* Solutions Column */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              className="relative"
            >
              <motion.div
                initial={{ opacity: 0, x: 50, rotateY: 30 }}
                animate={inView ? { opacity: 1, x: 0, rotateY: 0 } : {}}
                transition={{ delay: 0.6, duration: 0.8, type: "spring" }}
                whileHover={{ 
                  scale: 1.02,
                  rotateY: 5,
                  boxShadow: "0 20px 40px rgba(34, 197, 94, 0.3)"
                }}
                className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-3xl p-8 relative overflow-hidden backdrop-blur-sm h-full"
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* Animated Background Pattern */}
                <motion.div
                  className="absolute inset-0"
                  animate={{
                    backgroundPosition: ["100% 100%", "0% 0%"],
                  }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  style={{
                    backgroundImage: `radial-gradient(circle at 80% 20%, rgba(34, 197, 94, 0.1) 0%, transparent 50%)`,
                    backgroundSize: "200% 200%",
                  }}
                />
                
                {/* Floating Icon */}
                <motion.div
                  className="absolute -top-10 -left-10 text-green-500/10"
                  animate={{
                    y: [0, -20, 0],
                    rotate: [0, -10, 0],
                  }}
                  transition={{ duration: 5, repeat: Infinity }}
                >
                  <Check className="w-40 h-40" />
                </motion.div>
                
                <div className="relative z-10">
                  <motion.h3 
                    className="text-2xl font-montserrat font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400"
                    whileHover={{ scale: 1.05 }}
                  >
                    The Champion's Solution
                  </motion.h3>
                  <ul className="space-y-5">
                    {solutions.map((solution, index) => (
                      <motion.li
                        key={index}
                        variants={itemVariants}
                        custom={index}
                        className="relative"
                        onMouseEnter={() => setHoveredSolution(index)}
                        onMouseLeave={() => setHoveredSolution(null)}
                      >
                        <motion.div
                          className="flex items-start gap-4 group cursor-pointer"
                          whileHover={{ x: 10 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <motion.div
                            className="relative mt-1"
                            animate={{
                              rotate: hoveredSolution === index ? 360 : 0,
                              scale: hoveredSolution === index ? 1.2 : 1,
                            }}
                            transition={{ duration: 0.5 }}
                          >
                            <motion.div
                              className={`absolute inset-0 bg-${solution.color}-500/20 blur-lg`}
                              animate={{
                                scale: hoveredSolution === index ? 1.5 : 0,
                              }}
                            />
                            <solution.icon className={`w-6 h-6 text-${solution.color}-500 relative z-10`} />
                          </motion.div>
                          <span className="text-gray-300 group-hover:text-white transition-all duration-300 flex-1">
                            {solution.text}
                          </span>
                          <AnimatePresence>
                            {hoveredSolution === index && (
                              <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                              >
                                <ChevronRight className="w-5 h-5 text-green-500" />
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Enhanced Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 1, duration: 0.8, type: "spring" }}
            className="text-center mt-16"
          >
            <motion.div
              className="inline-block relative"
              whileHover={{ scale: 1.05 }}
            >
              {/* Glow Effect */}
              <motion.div
                className="absolute inset-0 bg-champion-gold/20 rounded-full blur-2xl"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              
              <motion.div
                className="relative bg-gradient-to-r from-champion-black/80 to-champion-charcoal/80 backdrop-blur-sm border border-champion-gold/30 rounded-2xl px-8 py-6"
                whileHover={{
                  boxShadow: "0 10px 30px rgba(255, 215, 0, 0.3)",
                }}
              >
                <motion.p
                  className="text-lg text-gray-300 mb-3"
                >
                  Stop struggling and start transforming with proven methods
                </motion.p>
                <motion.div
                  className="inline-flex items-center gap-3 text-champion-gold font-bold text-xl"
                  whileHover={{ gap: "16px" }}
                >
                  <span>See how the system works</span>
                  <motion.div
                    animate={{ x: [0, 10, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ChevronRight className="w-6 h-6" />
                  </motion.div>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  )
}