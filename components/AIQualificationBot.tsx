'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useAnimation } from 'framer-motion'
import { MessageSquare, X, Sparkles, ChevronRight, Bot, Zap, Brain, Trophy, Target, Clock, DollarSign, Activity, Award, Calendar, Shield, BarChart3, TrendingUp, Star, Users, MessageCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'

interface Question {
  id: string
  text: string
  icon?: any
  options: {
    text: string
    score: number
    emoji?: string
    nextQuestion?: string
  }[]
  weight: number
}

const questions: Record<string, Question> = {
  initial: {
    id: 'initial',
    text: "What's your current fitness level?",
    icon: Activity,
    weight: 2,
    options: [
      { text: "Complete beginner", score: 3, emoji: "🌱", nextQuestion: 'goal' },
      { text: "Some experience (6-12 months)", score: 5, emoji: "💪", nextQuestion: 'goal' },
      { text: "Intermediate (1-3 years)", score: 8, emoji: "🔥", nextQuestion: 'goal' },
      { text: "Advanced (3+ years)", score: 10, emoji: "⚡", nextQuestion: 'goal' }
    ]
  },
  goal: {
    id: 'goal',
    text: "What's your primary fitness goal?",
    icon: Target,
    weight: 3,
    options: [
      { text: "Build muscle mass", score: 10, emoji: "💯", nextQuestion: 'commitment' },
      { text: "Get shredded & defined", score: 10, emoji: "🎯", nextQuestion: 'commitment' },
      { text: "Improve overall fitness", score: 7, emoji: "📈", nextQuestion: 'commitment' },
      { text: "Just exploring options", score: 2, emoji: "🤔", nextQuestion: 'commitment' }
    ]
  },
  commitment: {
    id: 'commitment',
    text: "How many days per week can you train?",
    icon: Clock,
    weight: 2.5,
    options: [
      { text: "1-2 days", score: 3, emoji: "📅", nextQuestion: 'budget' },
      { text: "3-4 days", score: 7, emoji: "📆", nextQuestion: 'budget' },
      { text: "5-6 days", score: 10, emoji: "🗓️", nextQuestion: 'budget' },
      { text: "Every day", score: 9, emoji: "🔥", nextQuestion: 'budget' }
    ]
  },
  budget: {
    id: 'budget',
    text: "Are you ready to invest in your transformation?",
    icon: DollarSign,
    weight: 3.5,
    options: [
      { text: "Yes, I'm ready to invest in myself", score: 10, emoji: "💎", nextQuestion: 'timeline' },
      { text: "I need to see the value first", score: 6, emoji: "🤝", nextQuestion: 'timeline' },
      { text: "Depends on the price", score: 4, emoji: "💭", nextQuestion: 'timeline' },
      { text: "Just looking for free content", score: 1, emoji: "👀", nextQuestion: 'timeline' }
    ]
  },
  timeline: {
    id: 'timeline',
    text: "When do you want to start seeing results?",
    icon: Zap,
    weight: 2,
    options: [
      { text: "Immediately - I'm ready now", score: 10, emoji: "🚀", nextQuestion: 'final' },
      { text: "Within the next month", score: 8, emoji: "📈", nextQuestion: 'final' },
      { text: "In a few months", score: 5, emoji: "📊", nextQuestion: 'final' },
      { text: "No specific timeline", score: 2, emoji: "🕐", nextQuestion: 'final' }
    ]
  },
  final: {
    id: 'final',
    text: "Have you tried other fitness programs before?",
    icon: Trophy,
    weight: 1.5,
    options: [
      { text: "Yes, but didn't get results", score: 9, emoji: "💪" },
      { text: "Yes, and got some results", score: 7, emoji: "✅" },
      { text: "No, this would be my first", score: 8, emoji: "🆕" },
      { text: "I prefer to train on my own", score: 3, emoji: "🏃" }
    ]
  }
}

// Floating particles component
const FloatingParticles = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 15 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-champion-gold/30 rounded-full"
          initial={{
            x: Math.random() * 400,
            y: Math.random() * 600,
          }}
          animate={{
            x: Math.random() * 400,
            y: -20,
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "linear"
          }}
        />
      ))}
    </div>
  )
}

interface AIQualificationBotProps {
  forceOpen?: boolean
  onClose?: () => void
}

export default function AIQualificationBot({ forceOpen, onClose }: AIQualificationBotProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState<string>('initial')
  const [answers, setAnswers] = useState<Record<string, { score: number, weight: number, emoji?: string }>>({})
  const [isTyping, setIsTyping] = useState(false)
  const [showPulse, setShowPulse] = useState(true)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [showWelcome, setShowWelcome] = useState(true)
  const [isHovering, setIsHovering] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [finalScore, setFinalScore] = useState(0)
  const router = useRouter()
  const controls = useAnimation()
  const chatRef = useRef<HTMLDivElement>(null)

  // Calculate total score
  const calculateScore = () => {
    const totalWeightedScore = Object.values(answers).reduce((sum, answer) => 
      sum + (answer.score * answer.weight), 0
    )
    const totalWeight = Object.values(answers).reduce((sum, answer) => 
      sum + answer.weight, 0
    )
    return totalWeight > 0 ? (totalWeightedScore / totalWeight) : 0
  }

  // Handle answer selection with enhanced UX
  const handleAnswer = async (option: { text: string, score: number, emoji?: string, nextQuestion?: string }, index: number) => {
    const question = questions[currentQuestion]
    
    // Visual feedback
    setSelectedOption(index)
    
    // Haptic feedback simulation
    controls.start({
      scale: [1, 0.95, 1.05, 1],
      transition: { duration: 0.3 }
    })
    
    await new Promise(resolve => setTimeout(resolve, 300))
    
    // Save answer with weight
    setAnswers(prev => ({
      ...prev,
      [currentQuestion]: { score: option.score, weight: question.weight, emoji: option.emoji }
    }))

    // Show typing animation
    setIsTyping(true)
    await new Promise(resolve => setTimeout(resolve, 1200))
    setIsTyping(false)
    setSelectedOption(null)

    // Move to next question or show results
    if (option.nextQuestion) {
      setCurrentQuestion(option.nextQuestion)
      // Scroll to bottom
      if (chatRef.current) {
        chatRef.current.scrollTop = chatRef.current.scrollHeight
      }
    } else {
      // Calculate final score and redirect based on qualification
      const newAnswers = {
        ...answers,
        [currentQuestion]: { score: option.score, weight: question.weight, emoji: option.emoji }
      }
      const totalWeightedScore = Object.values(newAnswers).reduce((sum, answer) => 
        sum + (answer.score * answer.weight), 0
      )
      const totalWeight = Object.values(newAnswers).reduce((sum, answer) => 
        sum + answer.weight, 0
      )
      const actualFinalScore = totalWeight > 0 ? (totalWeightedScore / totalWeight) : 0

      // Show result animation
      setIsTyping(true)
      await new Promise(resolve => setTimeout(resolve, 1500))
      setIsTyping(false)
      
      // Set final score and show results
      setFinalScore(actualFinalScore)
      setShowResults(true)
      setCurrentQuestion('results')
    }
  }

  // Enhanced pulse animation
  useEffect(() => {
    const interval = setInterval(() => {
      setShowPulse(true)
      setTimeout(() => setShowPulse(false), 2000)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  // Handle forceOpen prop
  useEffect(() => {
    if (forceOpen && !isOpen) {
      setIsOpen(true)
    }
  }, [forceOpen])

  // No automatic timer - wait for user to click the button

  return (
    <>
      {/* Advanced AI Chatbot Button - Futuristic Design */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0, rotate: -180 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 0, opacity: 0, rotate: 180 }}
            transition={{ 
              type: "spring", 
              damping: 20, 
              stiffness: 260,
              mass: 0.8,
              duration: 0.6
            }}
            className="fixed bottom-6 right-6 z-50"
          >
            {/* AI Qualification bubble */}
            <AnimatePresence mode="wait">
              <motion.div
                key={isHovering ? "hover" : "default"}
                initial={{ opacity: 0, y: 10, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.8 }}
                transition={{ duration: 0.3 }}
                className="absolute bottom-20 right-0 mb-2"
              >
                <motion.div
                  className="relative bg-black/90 backdrop-blur-md rounded-2xl shadow-2xl px-4 py-3 max-w-[240px] border border-champion-gold/30"
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  {isHovering ? (
                    <>
                      <div className="flex items-center gap-2">
                        <motion.div 
                          className="w-2 h-2 rounded-full"
                          style={{ background: "radial-gradient(circle, #FFD700 0%, #FFA500 100%)" }}
                          animate={{ scale: [1, 1.5, 1] }}
                          transition={{ duration: 0.5, repeat: Infinity }}
                        />
                        <span className="text-sm font-bold text-champion-gold">CLICK TO START</span>
                      </div>
                      <p className="text-xs text-gray-300 mt-1">Begin your transformation 🚀</p>
                      <p className="text-xs text-champion-gold/80 font-semibold">100% Personalized</p>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-2">
                        <motion.div 
                          className="w-2 h-2 rounded-full"
                          style={{ background: "radial-gradient(circle, #00ff00 0%, #00cc00 100%)" }}
                          animate={{ opacity: [0.5, 1, 0.5] }}
                          transition={{ duration: 1, repeat: Infinity }}
                        />
                        <span className="text-sm font-bold text-champion-gold">AI QUALIFICATION</span>
                      </div>
                      <p className="text-xs text-gray-300 mt-1">Find out if you're ready 🎯</p>
                      <p className="text-xs text-champion-gold/80 font-semibold">Quick test • 2 min</p>
                    </>
                  )}
                  {/* Chat bubble tail with glow */}
                  <div className="absolute -bottom-2 right-6 w-4 h-4 bg-black/90 transform rotate-45 border-r border-b border-champion-gold/30" />
                </motion.div>
              </motion.div>
            </AnimatePresence>

            {/* Main AI button */}
            <motion.button
              onClick={() => setIsOpen(true)}
              className="relative group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              {/* AI Energy field */}
              <motion.div
                className="absolute -inset-4 rounded-full opacity-60"
                style={{
                  background: "radial-gradient(circle, rgba(255,215,0,0.2) 0%, transparent 70%)",
                  filter: "blur(10px)",
                }}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.6, 0.3, 0.6],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />

              {/* Hexagonal grid pattern */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100">
                <defs>
                  <pattern id="hexagon-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                    <polygon points="10,2 18,7 18,13 10,18 2,13 2,7" fill="none" stroke="#FFD700" strokeWidth="0.5" opacity="0.3" />
                  </pattern>
                </defs>
                <circle cx="50" cy="50" r="45" fill="url(#hexagon-pattern)" />
              </svg>

              {/* Rotating tech rings */}
              <motion.div
                className="absolute inset-0 rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#FFD700" strokeWidth="1" strokeDasharray="5 5" opacity="0.5" />
                  <circle cx="50" cy="50" r="35" fill="none" stroke="#FFA500" strokeWidth="0.5" strokeDasharray="10 5" opacity="0.3" />
                </svg>
              </motion.div>

              {/* Button container with holographic effect */}
              <motion.div
                className="relative w-20 h-20 rounded-full overflow-hidden"
                style={{
                  background: "linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #000000 100%)",
                  boxShadow: "0 0 40px rgba(255, 215, 0, 0.5), inset 0 0 20px rgba(255, 215, 0, 0.2)",
                }}
              >
                {/* Holographic shimmer */}
                <motion.div
                  className="absolute inset-0"
                  style={{
                    background: "linear-gradient(45deg, transparent 30%, rgba(255,215,0,0.3) 50%, transparent 70%)",
                  }}
                  animate={{
                    x: [-100, 100],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />

                {/* AI Brain icon with neural connections */}
                <div className="relative w-full h-full flex items-center justify-center">
                  {/* Neural network animation background */}
                  <motion.div className="absolute inset-0 opacity-30">
                    {[0, 45, 90, 135].map((rotation, i) => (
                      <motion.div
                        key={i}
                        className="absolute inset-0"
                        style={{ transform: `rotate(${rotation}deg)` }}
                      >
                        <motion.div
                          className="absolute top-1/2 left-1/2 w-full h-0.5 bg-gradient-to-r from-transparent via-champion-gold to-transparent"
                          style={{ transform: "translate(-50%, -50%)" }}
                          animate={{
                            scaleX: [0, 1, 0],
                            opacity: [0, 1, 0],
                          }}
                          transition={{
                            duration: 3,
                            delay: i * 0.5,
                            repeat: Infinity,
                          }}
                        />
                      </motion.div>
                    ))}
                  </motion.div>

                  {/* Central AI Brain */}
                  <motion.div
                    className="relative z-10"
                    animate={{
                      filter: [
                        "drop-shadow(0 0 10px rgba(255,215,0,0.5))",
                        "drop-shadow(0 0 20px rgba(255,215,0,0.8))",
                        "drop-shadow(0 0 10px rgba(255,215,0,0.5))",
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Brain className="w-10 h-10 text-champion-gold" strokeWidth={1.5} />
                  </motion.div>

                  {/* Data flow particles */}
                  <div className="absolute inset-0">
                    {[0, 1, 2, 3].map((i) => (
                      <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-champion-gold rounded-full"
                        style={{
                          top: "50%",
                          left: "50%",
                        }}
                        animate={{
                          x: [0, Math.cos(i * 90 * Math.PI / 180) * 30, 0],
                          y: [0, Math.sin(i * 90 * Math.PI / 180) * 30, 0],
                          opacity: [0, 1, 0],
                          scale: [0, 1.5, 0],
                        }}
                        transition={{
                          duration: 2,
                          delay: i * 0.5,
                          repeat: Infinity,
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Tech corner accents */}
                <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-champion-gold" />
                <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-champion-gold" />
                <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-champion-gold" />
                <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-champion-gold" />
              </motion.div>

              {/* AI Processing indicator */}
              <motion.div
                className="absolute -bottom-2 left-1/2 -translate-x-1/2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <motion.div
                  className="flex gap-1 bg-black/80 px-2 py-1 rounded-full"
                  animate={{
                    boxShadow: [
                      "0 0 10px rgba(255,215,0,0.3)",
                      "0 0 20px rgba(255,215,0,0.5)",
                      "0 0 10px rgba(255,215,0,0.3)",
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-1.5 h-1.5 rounded-full bg-champion-gold"
                      animate={{
                        opacity: [0.3, 1, 0.3],
                        scale: [0.8, 1.2, 0.8],
                      }}
                      transition={{
                        duration: 1.5,
                        delay: i * 0.2,
                        repeat: Infinity,
                      }}
                    />
                  ))}
                </motion.div>
              </motion.div>

              
            </motion.button>

            {/* Floating tech elements */}
            <AnimatePresence>
              {showPulse && (
                <>
                  {[0, 120, 240].map((angle, i) => (
                    <motion.div
                      key={i}
                      className="absolute pointer-events-none"
                      initial={{
                        x: 40,
                        y: 40,
                        opacity: 0,
                        scale: 0,
                      }}
                      animate={{
                        x: 40 + Math.cos(angle * Math.PI / 180) * 60,
                        y: 40 + Math.sin(angle * Math.PI / 180) * 60,
                        opacity: [0, 1, 0],
                        scale: [0, 1, 0],
                      }}
                      exit={{ opacity: 0 }}
                      transition={{
                        duration: 3,
                        delay: i * 0.3,
                        ease: "easeOut",
                      }}
                    >
                      <div className="w-8 h-8 rounded-full bg-champion-gold/20 backdrop-blur-sm flex items-center justify-center">
                        {i === 0 && <Sparkles className="w-4 h-4 text-champion-gold" />}
                        {i === 1 && <Zap className="w-4 h-4 text-champion-gold" />}
                        {i === 2 && <Activity className="w-4 h-4 text-champion-gold" />}
                      </div>
                    </motion.div>
                  ))}
                </>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enhanced Chat Interface */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-end p-4 sm:p-8"
            onClick={() => {
              setIsOpen(false)
              onClose?.()
            }}
          >
            {/* Backdrop blur */}
            <motion.div
              initial={{ backdropFilter: "blur(0px)", opacity: 0 }}
              animate={{ 
                backdropFilter: "blur(20px)", 
                opacity: 1,
                transition: {
                  duration: 0.6,
                  ease: [0.25, 0.1, 0.25, 1],
                  opacity: { duration: 0.3 }
                }
              }}
              exit={{ 
                backdropFilter: "blur(0px)", 
                opacity: 0,
                transition: {
                  duration: 0.4,
                  ease: [0.4, 0, 1, 1]
                }
              }}
              className="absolute inset-0 bg-black/40"
            />

            <motion.div
              initial={{ 
                y: 200, 
                opacity: 0, 
                scale: 0.5, 
                rotateX: 60, 
                rotateY: -20,
                filter: "blur(10px)"
              }}
              animate={{ 
                y: 0, 
                opacity: 1, 
                scale: 1, 
                rotateX: 0,
                rotateY: 0,
                filter: "blur(0px)",
                transition: {
                  type: "spring",
                  damping: 20,
                  stiffness: 200,
                  mass: 0.8,
                  duration: 0.8,
                  opacity: { duration: 0.4 },
                  filter: { duration: 0.6 }
                }
              }}
              exit={{ 
                y: 200, 
                opacity: 0, 
                scale: 0.5, 
                rotateX: -60,
                rotateY: 20,
                filter: "blur(10px)",
                transition: {
                  duration: 0.4,
                  ease: [0.4, 0, 1, 1]
                }
              }}
              className="relative w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
              style={{ 
                perspective: 1200,
                transformStyle: "preserve-3d",
                transformOrigin: "center bottom"
              }}
            >
              <motion.div 
                className="relative bg-champion-charcoal/95 backdrop-blur-xl border border-champion-gold/20 rounded-2xl shadow-2xl overflow-hidden"
                initial={{ boxShadow: "0 0 0 rgba(255, 215, 0, 0)" }}
                animate={{ 
                  boxShadow: "0 0 50px rgba(255, 215, 0, 0.3)",
                  transition: { delay: 0.3, duration: 0.6 }
                }}
              >
                {/* Animated background with gradient mesh */}
                <div className="absolute inset-0">
                  <motion.div
                    className="absolute inset-0 opacity-20"
                    animate={{
                      background: [
                        "radial-gradient(circle at 0% 0%, #FFD700 0%, transparent 40%)",
                        "radial-gradient(circle at 100% 100%, #FFD700 0%, transparent 40%)",
                        "radial-gradient(circle at 0% 100%, #FFD700 0%, transparent 40%)",
                        "radial-gradient(circle at 100% 0%, #FFD700 0%, transparent 40%)",
                        "radial-gradient(circle at 0% 0%, #FFD700 0%, transparent 40%)",
                      ],
                    }}
                    transition={{ duration: 10, repeat: Infinity }}
                  />
                  <FloatingParticles />
                </div>

                {/* Premium Header */}
                <div className="relative bg-gradient-to-r from-champion-black/90 to-champion-charcoal/90 p-4 border-b border-champion-gold/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <motion.div
                        className="relative"
                        animate={{ rotate: [0, 5, -5, 0] }}
                        transition={{ duration: 4, repeat: Infinity }}
                      >
                        <div className="w-12 h-12 bg-gradient-gold rounded-full flex items-center justify-center shadow-lg overflow-hidden">
                          {/* Advanced logo design for header */}
                          <div className="relative w-full h-full flex items-center justify-center">
                            {/* Rotating hexagon background */}
                            <motion.div
                              className="absolute inset-0"
                              animate={{ rotate: 360 }}
                              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                            >
                              <svg viewBox="0 0 48 48" className="w-full h-full">
                                <polygon
                                  points="24,4 40,14 40,34 24,44 8,34 8,14"
                                  fill="none"
                                  stroke="rgba(0,0,0,0.2)"
                                  strokeWidth="1"
                                />
                              </svg>
                            </motion.div>
                            
                            {/* Pulsing core */}
                            <motion.div
                              className="absolute inset-2"
                              animate={{ 
                                scale: [0.8, 1, 0.8],
                                opacity: [0.5, 1, 0.5]
                              }}
                              transition={{ duration: 2, repeat: Infinity }}
                            >
                              <div className="w-full h-full rounded-full bg-gradient-to-br from-champion-black/20 to-transparent" />
                            </motion.div>

                            {/* 3D Brain with holographic effect */}
                            <motion.div
                              className="relative z-10"
                              animate={{
                                y: [0, -2, 0],
                                filter: [
                                  "hue-rotate(0deg)",
                                  "hue-rotate(20deg)",
                                  "hue-rotate(0deg)"
                                ]
                              }}
                              transition={{ duration: 3, repeat: Infinity }}
                            >
                              <Brain className="w-7 h-7 text-champion-black drop-shadow-lg" />
                            </motion.div>

                            {/* Energy particles */}
                            {[0, 90, 180, 270].map((angle, i) => (
                              <motion.div
                                key={i}
                                className="absolute inset-0"
                                animate={{ rotate: [angle, angle + 360] }}
                                transition={{ 
                                  duration: 4 + i * 0.5, 
                                  repeat: Infinity, 
                                  ease: "linear" 
                                }}
                              >
                                <div className="absolute w-1 h-1 bg-champion-black/60 rounded-full top-2 left-1/2 -translate-x-1/2" />
                              </motion.div>
                            ))}
                          </div>
                        </div>
                        <motion.div
                          className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-champion-charcoal shadow-lg flex items-center justify-center"
                          animate={{ 
                            scale: [1, 1.3, 1],
                            boxShadow: [
                              "0 0 0 0 rgba(34, 197, 94, 0.4)",
                              "0 0 0 8px rgba(34, 197, 94, 0)",
                              "0 0 0 0 rgba(34, 197, 94, 0)"
                            ]
                          }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <motion.div
                            className="w-2 h-2 bg-white rounded-full"
                            animate={{ scale: [0.5, 1, 0.5] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          />
                        </motion.div>
                      </motion.div>
                      <div>
                        <h3 className="font-bold text-white text-lg">Brandon's AI Coach</h3>
                        <div className="flex items-center gap-2">
                          <motion.div
                            className="flex items-center gap-1"
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            <div className="w-2 h-2 bg-green-500 rounded-full" />
                            <p className="text-xs text-green-500">Online</p>
                          </motion.div>
                          <span className="text-xs text-gray-400">• Qualifying your journey</span>
                        </div>
                      </div>
                    </div>
                    <motion.button
                      onClick={() => {
              setIsOpen(false)
              onClose?.()
            }}
                      className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <X className="w-5 h-5" />
                    </motion.button>
                  </div>
                </div>

                {/* Enhanced Chat Content */}
                <div ref={chatRef} className="relative p-6 h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-champion-gold/20 scrollbar-track-transparent">
                  <AnimatePresence mode="wait">
                    {/* Modern Sequential Welcome Message */}
                    {showWelcome && isOpen && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="relative flex flex-col items-center justify-center py-12 px-6 text-center overflow-hidden min-h-[400px]"
                      >
                        {/* Sequential animated background */}
                        <motion.div 
                          className="absolute inset-0 pointer-events-none"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.5 }}
                        >
                          {/* Gradient waves */}
                          <motion.div
                            className="absolute inset-0"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.3 }}
                            transition={{ duration: 0.8 }}
                          >
                            <motion.div
                              className="absolute inset-0"
                              style={{
                                background: "radial-gradient(circle at 50% 50%, rgba(255,215,0,0.2) 0%, transparent 70%)"
                              }}
                              animate={{
                                scale: [0.8, 1.5, 0.8],
                              }}
                              transition={{
                                duration: 8,
                                repeat: Infinity,
                                ease: "easeInOut"
                              }}
                            />
                          </motion.div>
                          
                          {/* Sequential floating orbs */}
                          {[...Array(3)].map((_, i) => (
                            <motion.div
                              key={`orb-${i}`}
                              className="absolute w-32 h-32 rounded-full"
                              style={{
                                background: `radial-gradient(circle, rgba(255,215,0,0.15) 0%, transparent 60%)`,
                                left: `${30 + i * 20}%`,
                                top: `${20 + i * 25}%`
                              }}
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{
                                scale: [0, 1, 1],
                                opacity: [0, 0.6, 0.6],
                                y: [-50, 0, 30, 0, -50],
                                x: [-20, 0, 20, 0, -20],
                              }}
                              transition={{
                                duration: 6,
                                delay: i * 0.1,
                                repeat: Infinity,
                                ease: "easeInOut"
                              }}
                            />
                          ))}
                          
                          {/* Sequential sparkle particles */}
                          {[...Array(6)].map((_, i) => (
                            <motion.div
                              key={`sparkle-${i}`}
                              className="absolute"
                              style={{
                                left: `${15 + i * 15}%`,
                                top: `${10 + (i % 2) * 80}%`
                              }}
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{
                                scale: [0, 1, 0],
                                opacity: [0, 1, 0],
                                rotate: [0, 180, 360]
                              }}
                              transition={{
                                duration: 3,
                                delay: 0.3 + i * 0.1,
                                repeat: Infinity,
                                ease: "easeInOut"
                              }}
                            >
                              <Sparkles className="w-3 h-3 text-champion-gold/50" />
                            </motion.div>
                          ))}
                        </motion.div>

                        {/* Sequential AI Avatar entrance */}
                        <motion.div
                          className="relative mb-8 z-10"
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ 
                            duration: 0.6,
                            delay: 0,
                            ease: [0.34, 1.56, 0.64, 1]
                          }}
                        >
                          {/* Sequential rotating rings */}
                          <motion.div
                            className="absolute inset-0 flex items-center justify-center"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1, rotate: 360 }}
                            transition={{ 
                              opacity: { duration: 0.3, delay: 0.2 },
                              rotate: { duration: 20, repeat: Infinity, ease: "linear", delay: 0.2 }
                            }}
                          >
                            <div className="absolute w-24 h-24 border-2 border-champion-gold/20 rounded-full" />
                          </motion.div>
                          <motion.div
                            className="absolute inset-0 flex items-center justify-center"
                            animate={{ rotate: -360 }}
                            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                          >
                            <div className="absolute w-28 h-28 border border-champion-gold/10 rounded-full" />
                          </motion.div>
                          
                          {/* Main avatar */}
                          <motion.div 
                            className="relative w-20 h-20 bg-gradient-gold rounded-full flex items-center justify-center shadow-2xl"
                            animate={{
                              boxShadow: [
                                "0 20px 25px -5px rgba(255, 215, 0, 0.3)",
                                "0 20px 40px -5px rgba(255, 215, 0, 0.5)",
                                "0 20px 25px -5px rgba(255, 215, 0, 0.3)"
                              ]
                            }}
                            transition={{ duration: 3, repeat: Infinity }}
                          >
                            <motion.div
                              animate={{ 
                                rotate: [0, 10, -10, 0],
                                scale: [1, 1.1, 1]
                              }}
                              transition={{ duration: 4, repeat: Infinity }}
                            >
                              <Brain className="w-10 h-10 text-champion-black" />
                            </motion.div>
                          </motion.div>
                          
                          {/* Pulsing glow */}
                          <motion.div
                            className="absolute -inset-2 bg-champion-gold/20 rounded-full blur-xl"
                            animate={{ 
                              scale: [1, 1.3, 1],
                              opacity: [0.5, 0.8, 0.5]
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                          />
                          
                          {/* Energy particles */}
                          {[...Array(6)].map((_, i) => (
                            <motion.div
                              key={`particle-${i}`}
                              className="absolute w-1 h-1 bg-champion-gold rounded-full"
                              initial={{
                                x: 0,
                                y: 0,
                              }}
                              animate={{
                                x: Math.cos(i * 60 * Math.PI / 180) * 40,
                                y: Math.sin(i * 60 * Math.PI / 180) * 40,
                                opacity: [1, 0],
                                scale: [0, 1.5],
                              }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                delay: i * 0.2,
                                ease: "easeOut"
                              }}
                            />
                          ))}
                        </motion.div>

                        {/* Sequential Welcome Text */}
                        <motion.div
                          className="relative z-10 mb-8"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.3 }}
                        >
                          {/* Main title with word-by-word reveal */}
                          <motion.h2 className="text-2xl font-bold text-white mb-4 overflow-hidden">
                            <motion.div className="flex flex-wrap justify-center gap-2">
                              <motion.span
                                initial={{ y: 50, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ 
                                  duration: 0.4,
                                  delay: 0.4,
                                  ease: [0.25, 0.46, 0.45, 0.94]
                                }}
                                className="inline-block"
                              >
                                Welcome,
                              </motion.span>
                              <motion.span
                                initial={{ y: 50, opacity: 0, scale: 0.5 }}
                                animate={{ y: 0, opacity: 1, scale: 1 }}
                                transition={{ 
                                  duration: 0.4,
                                  delay: 0.6,
                                  ease: [0.25, 0.46, 0.45, 0.94]
                                }}
                                className="inline-block text-champion-gold"
                              >
                                Future Champion!
                              </motion.span>
                              <motion.span
                                initial={{ scale: 0, rotate: -720 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ 
                                  duration: 0.6,
                                  delay: 0.8,
                                  type: "spring",
                                  damping: 12
                                }}
                                className="inline-block"
                              >
                                🏆
                              </motion.span>
                            </motion.div>
                          </motion.h2>
                          
                          {/* Subtitle with smooth sequential reveal */}
                          <motion.div
                            className="overflow-hidden"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1 }}
                          >
                            <motion.p
                              initial={{ y: 30 }}
                              animate={{ y: 0 }}
                              transition={{ 
                                duration: 0.5,
                                delay: 1,
                                ease: "easeOut"
                              }}
                              className="text-gray-300 max-w-sm mx-auto"
                            >
                              <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3, delay: 1.1 }}
                              >
                                Let's discover your perfect
                              </motion.span>
                              {" "}
                              <motion.span
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ 
                                  duration: 0.3,
                                  delay: 1.3,
                                  type: "spring"
                                }}
                                className="text-champion-gold font-semibold"
                              >
                                transformation plan
                              </motion.span>
                              {" "}
                              <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3, delay: 1.5 }}
                              >
                                in just 2 minutes.
                              </motion.span>
                            </motion.p>
                          </motion.div>
                        </motion.div>

                        {/* Start button */}
                        <motion.button
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.7, type: "spring", damping: 15 }}
                          onClick={() => setShowWelcome(false)}
                          className="relative bg-gradient-gold text-champion-black font-bold py-4 px-10 rounded-xl shadow-2xl hover:shadow-champion-gold/50 transition-all duration-300 overflow-hidden group"
                          whileHover={{ scale: 1.05, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {/* Shimmer effect */}
                          <motion.div
                            className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
                            style={{
                              background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)"
                            }}
                          />
                          
                          {/* Pulse rings */}
                          <motion.div
                            className="absolute inset-0 rounded-xl"
                            animate={{
                              boxShadow: [
                                "0 0 0 0 rgba(255, 215, 0, 0.4)",
                                "0 0 0 20px rgba(255, 215, 0, 0)",
                              ]
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: "easeOut"
                            }}
                          />
                          
                          {/* Button content */}
                          <div className="relative flex items-center gap-3">
                            <motion.span 
                              className="text-lg"
                              animate={{
                                textShadow: [
                                  "0 0 0px rgba(0,0,0,0)",
                                  "0 0 20px rgba(255,215,0,0.5)",
                                  "0 0 0px rgba(0,0,0,0)"
                                ]
                              }}
                              transition={{
                                duration: 3,
                                repeat: Infinity,
                                ease: "easeInOut"
                              }}
                            >
                              Start Now
                            </motion.span>
                            
                            {/* Animated arrow with particles */}
                            <motion.div
                              className="relative"
                              animate={{ x: [0, 5, 0] }}
                              transition={{ duration: 1.5, repeat: Infinity }}
                            >
                              <ChevronRight className="w-6 h-6" />
                              
                              {/* Floating particles */}
                              {[...Array(3)].map((_, i) => (
                                <motion.div
                                  key={i}
                                  className="absolute w-1 h-1 bg-champion-black rounded-full"
                                  initial={{ x: 0, y: 0, opacity: 0 }}
                                  animate={{
                                    x: [0, 20 + i * 10],
                                    y: [0, -5 + i * 3, 5 - i * 3, 0],
                                    opacity: [0, 1, 1, 0]
                                  }}
                                  transition={{
                                    duration: 2,
                                    delay: i * 0.2,
                                    repeat: Infinity,
                                    ease: "easeOut"
                                  }}
                                />
                              ))}
                            </motion.div>
                          </div>
                          
                          {/* Gradient morph background */}
                          <motion.div
                            className="absolute inset-0 opacity-30 -z-10"
                            animate={{
                              background: [
                                "radial-gradient(circle at 20% 50%, #FFD700 0%, transparent 50%)",
                                "radial-gradient(circle at 80% 50%, #FFA500 0%, transparent 50%)",
                                "radial-gradient(circle at 20% 50%, #FFD700 0%, transparent 50%)"
                              ]
                            }}
                            transition={{
                              duration: 4,
                              repeat: Infinity,
                              ease: "linear"
                            }}
                          />
                        </motion.button>
                      </motion.div>
                    )}

                    {/* Show Results */}
                    {showResults && !showWelcome ? (
                      <motion.div
                        key="results"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="space-y-6"
                      >
                        {/* Score Display */}
                        <div className="text-center">
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", damping: 10 }}
                            className="inline-block"
                          >
                            <div className="relative">
                              {/* Animated background circle */}
                              <motion.div
                                className="absolute inset-0 bg-gradient-to-br from-champion-gold/30 to-champion-gold/10 rounded-full blur-xl"
                                animate={{
                                  scale: [1, 1.2, 1],
                                  opacity: [0.5, 0.8, 0.5]
                                }}
                                transition={{ duration: 3, repeat: Infinity }}
                              />
                              
                              {/* Score circle */}
                              <div className="relative w-32 h-32 mx-auto">
                                <svg className="w-full h-full -rotate-90">
                                  <circle
                                    cx="64"
                                    cy="64"
                                    r="56"
                                    stroke="rgba(255, 215, 0, 0.1)"
                                    strokeWidth="12"
                                    fill="none"
                                  />
                                  <motion.circle
                                    cx="64"
                                    cy="64"
                                    r="56"
                                    stroke="url(#scoreGradient)"
                                    strokeWidth="12"
                                    fill="none"
                                    strokeLinecap="round"
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: finalScore / 10 }}
                                    transition={{ duration: 2, ease: "easeOut" }}
                                    strokeDasharray="1"
                                  />
                                  <defs>
                                    <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                      <stop offset="0%" stopColor="#FFD700" />
                                      <stop offset="100%" stopColor="#FFA500" />
                                    </linearGradient>
                                  </defs>
                                </svg>
                                
                                {/* Score text */}
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                  <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 }}
                                  >
                                    <span className="text-4xl font-bold text-white">{finalScore.toFixed(1)}</span>
                                    <span className="text-sm text-gray-400 block">/10</span>
                                  </motion.div>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        </div>

                        {/* Qualification Status */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.8 }}
                          className="text-center space-y-4"
                        >
                          {finalScore >= 7.5 ? (
                            <>
                              <div className="flex items-center justify-center gap-2">
                                <Trophy className="w-8 h-8 text-champion-gold" />
                                <h3 className="text-2xl font-bold text-champion-gold">
                                  HIGHLY QUALIFIED!
                                </h3>
                              </div>
                              <p className="text-white text-lg">
                                Congratulations, Champion! 🎉
                              </p>
                              <p className="text-gray-300 max-w-md mx-auto">
                                {(() => {
                                  // Customize message based on specific high-scoring answers
                                  const hasExperience = answers.initial?.score >= 8
                                  const hasUrgency = answers.timeline?.score >= 8
                                  const readyToInvest = answers.budget?.score >= 8
                                  
                                  if (hasExperience && hasUrgency && readyToInvest) {
                                    return "You're the perfect candidate - experienced, urgent, and ready to invest. Brandon's elite methods will take you to the next level immediately."
                                  } else if (hasExperience) {
                                    return "Your advanced experience combined with Brandon's championship methods will create extraordinary results. You're ready for the most elite training."
                                  } else if (hasUrgency && readyToInvest) {
                                    return "Your urgency and investment mindset show you're serious about transformation. Brandon will fast-track your journey to championship physique."
                                  } else {
                                    return "You're exactly the type of dedicated individual Brandon works with. Your commitment level and goals align perfectly with our elite transformation program."
                                  }
                                })()}
                              </p>
                            </>
                          ) : finalScore >= 5 ? (
                            <>
                              <div className="flex items-center justify-center gap-2">
                                <Target className="w-8 h-8 text-yellow-500" />
                                <h3 className="text-2xl font-bold text-yellow-500">
                                  QUALIFIED
                                </h3>
                              </div>
                              <p className="text-white text-lg">
                                Great potential! 💪
                              </p>
                              <p className="text-gray-300 max-w-md mx-auto">
                                {(() => {
                                  // Customize based on mid-range scores
                                  const commitment = answers.commitment?.score || 0
                                  const goal = answers.goal?.score || 0
                                  
                                  if (commitment >= 7 && goal >= 8) {
                                    return "Your strong commitment and clear goals are the foundation for success. Brandon's guidance will accelerate your transformation journey."
                                  } else if (goal >= 8) {
                                    return "Your ambitious goals show you're ready for change. With Brandon's proven system, you'll achieve the transformation you desire."
                                  } else {
                                    return "You have what it takes to succeed. With the right guidance and Brandon's proven system, you can achieve the transformation you're looking for."
                                  }
                                })()}
                              </p>
                            </>
                          ) : (
                            <>
                              <div className="flex items-center justify-center gap-2">
                                <Activity className="w-8 h-8 text-gray-400" />
                                <h3 className="text-2xl font-bold text-gray-400">
                                  BUILDING FOUNDATION
                                </h3>
                              </div>
                              <p className="text-white text-lg">
                                Let's start your journey! 🌱
                              </p>
                              <p className="text-gray-300 max-w-md mx-auto">
                                {(() => {
                                  // Encourage based on their situation
                                  const isExploring = answers.goal?.score <= 3
                                  const isBeginner = answers.initial?.score <= 3
                                  
                                  if (isExploring) {
                                    return "Taking time to explore your options is wise. We have resources to help you understand what's possible with the right guidance."
                                  } else if (isBeginner) {
                                    return "Every champion started as a beginner. We'll help you build a strong foundation and develop the habits for long-term success."
                                  } else {
                                    return "Everyone starts somewhere. While you may need more preparation, we have resources to help you build the foundation for success."
                                  }
                                })()}
                              </p>
                            </>
                          )}
                        </motion.div>

                        {/* Personalized Message based on answers */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 1.2 }}
                          className="bg-champion-black/50 rounded-xl p-6 border border-champion-gold/20"
                        >
                          <h4 className="text-champion-gold font-semibold mb-3">Your Personalized Analysis:</h4>
                          <div className="space-y-3">
                            {Object.entries(answers).map(([questionId, answer], index) => {
                              const question = questions[questionId]
                              const selectedOption = question.options.find(opt => opt.score === answer.score)
                              
                              // Generate highly personalized message based on actual answer
                              let title = ""
                              let message = ""
                              let icon = null
                              
                              if (questionId === 'initial' && selectedOption) {
                                title = "Fitness Level"
                                icon = answer.score >= 8 ? Trophy : answer.score >= 5 ? Target : Activity
                                if (answer.score >= 10) {
                                  message = `As an advanced athlete with 3+ years of experience, you're in the top 5% of fitness enthusiasts. Brandon's elite protocols will push you beyond your current limits and unlock new levels of performance.`
                                } else if (answer.score >= 8) {
                                  message = `Your intermediate experience (1-3 years) gives you a solid foundation. You've already seen good results, but Brandon's methods will accelerate your progress exponentially.`
                                } else if (answer.score >= 5) {
                                  message = `With 6-12 months of experience, you've learned the basics. Now it's time to implement advanced strategies that will transform your physique dramatically.`
                                } else {
                                  message = `As a beginner, you have the unique advantage of learning everything correctly from day one. No bad habits to break - just pure, optimized progress ahead.`
                                }
                              }
                              
                              if (questionId === 'goal' && selectedOption) {
                                title = "Transformation Goal"
                                icon = answer.score >= 10 ? Zap : answer.score >= 7 ? Target : Sparkles
                                if (selectedOption.text.includes("Complete body transformation")) {
                                  message = `Choosing complete body transformation shows championship mindset. You're not just changing your body - you're revolutionizing your entire life. Brandon specializes in these total transformations.`
                                } else if (selectedOption.text.includes("Build muscle")) {
                                  message = `Building muscle and strength requires precise programming and nutrition. Brandon's hypertrophy protocols have created dozens of competition-ready physiques.`
                                } else if (selectedOption.text.includes("Lose weight")) {
                                  message = `Weight loss and toning demand a scientific approach. Brandon's metabolic optimization strategies ensure you lose fat while preserving lean muscle.`
                                } else {
                                  message = `Exploring your options is the first step. Brandon will help clarify your goals and create a customized path to achieve them.`
                                }
                              }
                              
                              if (questionId === 'commitment' && selectedOption) {
                                title = "Training Commitment"
                                icon = answer.score >= 10 ? Award : answer.score >= 7 ? Calendar : Clock
                                const days = selectedOption.text.match(/\d+-?\d*/)?.[0] || "your available"
                                if (answer.score >= 10) {
                                  message = `Training ${days} days per week demonstrates elite-level commitment. This frequency allows for advanced programming with specialized muscle group focus and optimal recovery.`
                                } else if (answer.score >= 7) {
                                  message = `With ${days} days per week, you'll follow a perfectly balanced program that maximizes results while maintaining life balance. This is the sweet spot for transformation.`
                                } else {
                                  message = `Even with ${days} days per week, Brandon's high-efficiency training methods will deliver impressive results. Quality over quantity is the key.`
                                }
                              }
                              
                              if (questionId === 'budget' && selectedOption) {
                                title = "Investment Readiness"
                                icon = answer.score >= 10 ? DollarSign : answer.score >= 7 ? Shield : BarChart3
                                if (selectedOption.text.includes("quality costs")) {
                                  message = `You recognize that premium coaching is an investment that pays dividends for life. This mindset alone predicts your success - you value expertise and results over shortcuts.`
                                } else if (selectedOption.text.includes("Depends on the value")) {
                                  message = `Being value-conscious shows wisdom. Brandon's program delivers ROI through permanent lifestyle changes, increased confidence, and a physique that commands respect.`
                                } else if (selectedOption.text.includes("budget options")) {
                                  message = `Budget awareness is important. We offer flexible payment plans to make Brandon's elite coaching accessible without compromising quality.`
                                } else {
                                  message = `Researching thoroughly before committing is smart. Take time to understand how Brandon's methods differ from typical fitness programs.`
                                }
                              }
                              
                              if (questionId === 'timeline' && selectedOption) {
                                title = "Urgency Level"
                                icon = answer.score >= 10 ? Zap : answer.score >= 8 ? TrendingUp : Clock
                                if (selectedOption.text.includes("ASAP")) {
                                  message = `Your readiness to start immediately is powerful. This urgency, combined with Brandon's rapid transformation protocols, will generate momentum that becomes unstoppable.`
                                } else if (selectedOption.text.includes("next month")) {
                                  message = `Starting within a month gives you time to prepare mentally while maintaining enthusiasm. Use this time to clear your schedule and prepare for transformation.`
                                } else if (selectedOption.text.includes("few months")) {
                                  message = `A longer timeline allows for thorough preparation. Consider this your pre-season - start implementing small changes now to hit the ground running.`
                                } else {
                                  message = `Taking your time shows patience. When you're truly ready to commit, Brandon's program will be here to deliver the results you deserve.`
                                }
                              }
                              
                              if (questionId === 'final' && selectedOption) {
                                title = "Coaching Experience"
                                icon = answer.score >= 10 ? Star : answer.score >= 7 ? Users : MessageCircle
                                if (selectedOption.text.includes("great results")) {
                                  message = `Your previous coaching success proves you're coachable and committed. Brandon's advanced methods will take you even further than before.`
                                } else if (selectedOption.text.includes("limited results")) {
                                  message = `Past coaching with limited results often means the wrong approach, not the wrong person. Brandon's proven system succeeds where others fail.`
                                } else if (selectedOption.text.includes("but I'm ready")) {
                                  message = `First-time coaching clients often see the most dramatic transformations. You're starting fresh with the best in the industry.`
                                } else {
                                  message = `Coaching hesitation is natural. Brandon's approach builds trust through consistent results and personalized attention to your concerns.`
                                }
                              }
                              
                              const IconComponent = icon
                              
                              return (message && IconComponent) ? (
                                <motion.div
                                  key={questionId}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: 1.4 + index * 0.15 }}
                                  className="bg-champion-black/30 rounded-lg p-4 border border-champion-gold/10"
                                >
                                  <div className="flex items-start gap-3">
                                    <div className="mt-1">
                                      <IconComponent className="w-5 h-5 text-champion-gold" />
                                    </div>
                                    <div className="flex-1">
                                      <h5 className="text-white font-semibold mb-1 flex items-center gap-2">
                                        {title}
                                        {answer.emoji && <span>{answer.emoji}</span>}
                                      </h5>
                                      <p className="text-gray-300 text-sm leading-relaxed">{message}</p>
                                    </div>
                                  </div>
                                </motion.div>
                              ) : null
                            })}
                          </div>
                        </motion.div>

                        {/* CTA Button */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 1.8 }}
                          className="text-center"
                        >
                          {finalScore >= 5 ? (
                            <motion.button
                              onClick={() => router.push('/checkout?qualified=true&score=' + finalScore.toFixed(1))}
                              className="bg-gradient-gold text-champion-black font-bold py-4 px-8 rounded-xl shadow-2xl hover:shadow-champion-gold/50 transition-all duration-300"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <div className="flex items-center gap-3">
                                <span className="text-lg">Continue to Your Transformation</span>
                                <ChevronRight className="w-5 h-5" />
                              </div>
                            </motion.button>
                          ) : (
                            <motion.button
                              onClick={() => router.push('/sales?qualified=explorer')}
                              className="bg-champion-charcoal text-white font-bold py-4 px-8 rounded-xl border border-champion-gold/30 hover:border-champion-gold/50 transition-all duration-300"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <div className="flex items-center gap-3">
                                <span className="text-lg">Explore Our Resources</span>
                                <ChevronRight className="w-5 h-5" />
                              </div>
                            </motion.button>
                          )}
                        </motion.div>
                      </motion.div>
                    ) : !showWelcome ? (
                      <motion.div
                        key={currentQuestion}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3 }}
                      >
                        {/* Question with icon */}
                        <div className="mb-6">
                          <div className="flex items-start gap-3">
                            <motion.div
                              className="w-8 h-8 bg-champion-gold/20 rounded-full flex items-center justify-center flex-shrink-0"
                              animate={{ rotate: [0, 360] }}
                              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                            >
                              {questions[currentQuestion]?.icon ? (
                                React.createElement(questions[currentQuestion].icon, {
                                  className: "w-5 h-5 text-champion-gold"
                                })
                              ) : (
                                <Bot className="w-5 h-5 text-champion-gold" />
                              )}
                            </motion.div>
                            <motion.div
                              initial={{ scale: 0.9 }}
                              animate={{ scale: 1 }}
                              className="bg-champion-black/50 rounded-2xl rounded-tl-none p-4 max-w-[80%] backdrop-blur-sm border border-champion-gold/10"
                            >
                              <p className="text-white font-medium">{questions[currentQuestion]?.text}</p>
                            </motion.div>
                          </div>
                        </div>

                      {/* Enhanced typing indicator */}
                      {isTyping && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="flex items-center gap-3 mb-4"
                        >
                          <div className="w-8 h-8" />
                          <div className="bg-champion-black/50 rounded-2xl rounded-tl-none p-4 backdrop-blur-sm">
                            <div className="flex items-center gap-2">
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              >
                                <Brain className="w-4 h-4 text-champion-gold" />
                              </motion.div>
                              <div className="flex gap-1">
                                {[0, 1, 2].map((i) => (
                                  <motion.div
                                    key={i}
                                    className="w-2 h-2 bg-champion-gold rounded-full"
                                    animate={{ 
                                      y: [0, -8, 0],
                                      opacity: [0.3, 1, 0.3]
                                    }}
                                    transition={{
                                      duration: 0.8,
                                      delay: i * 0.15,
                                      repeat: Infinity,
                                    }}
                                  />
                                ))}
                              </div>
                              <span className="text-xs text-gray-400 ml-2">Analyzing...</span>
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {/* Enhanced Options with 3D effects */}
                      {!isTyping && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                          className="space-y-3"
                        >
                          {questions[currentQuestion].options.map((option, index) => (
                            <motion.button
                              key={index}
                              initial={{ opacity: 0, x: 50, rotateY: -20 }}
                              animate={{ opacity: 1, x: 0, rotateY: 0 }}
                              transition={{ 
                                delay: 0.4 + index * 0.1,
                                type: "spring",
                                stiffness: 100
                              }}
                              onClick={() => handleAnswer(option, index)}
                              className="w-full text-left group"
                              whileHover={{ scale: 1.02, x: 5 }}
                              whileTap={{ scale: 0.98 }}
                              style={{ perspective: 1000 }}
                            >
                              <motion.div
                                className="relative"
                                animate={{
                                  rotateX: selectedOption === index ? [0, 5, 0] : 0,
                                }}
                              >
                                {/* 3D shadow effect */}
                                <motion.div
                                  className="absolute inset-0 bg-champion-gold/20 rounded-xl blur-xl"
                                  initial={{ opacity: 0 }}
                                  whileHover={{ opacity: 0.5 }}
                                  animate={{
                                    opacity: selectedOption === index ? 0.6 : 0,
                                  }}
                                />
                                
                                <div className={`relative bg-gradient-to-r ${
                                  selectedOption === index 
                                    ? 'from-champion-gold/30 to-champion-gold/20 border-champion-gold/60' 
                                    : 'from-champion-black/50 to-champion-charcoal/50 border-champion-gold/20 hover:border-champion-gold/40'
                                } backdrop-blur-sm border rounded-xl p-4 transition-all duration-300`}>
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                      {option.emoji && (
                                        <motion.span
                                          className="text-2xl"
                                          animate={{
                                            rotate: selectedOption === index ? [0, 10, -10, 0] : 0,
                                            scale: selectedOption === index ? [1, 1.2, 1] : 1,
                                          }}
                                        >
                                          {option.emoji}
                                        </motion.span>
                                      )}
                                      <span className={`${
                                        selectedOption === index ? 'text-white' : 'text-gray-300'
                                      } group-hover:text-white transition-colors font-medium`}>
                                        {option.text}
                                      </span>
                                    </div>
                                    <motion.div
                                      animate={{
                                        x: selectedOption === index ? 0 : -10,
                                        opacity: selectedOption === index ? 1 : 0,
                                      }}
                                      className="flex items-center gap-2"
                                    >
                                      <Zap className="w-4 h-4 text-champion-gold" />
                                      <ChevronRight className="w-4 h-4 text-champion-gold" />
                                    </motion.div>
                                  </div>
                                </div>
                              </motion.div>
                            </motion.button>
                          ))}
                        </motion.div>
                      )}
                    </motion.div>
                    ) : null}
                  </AnimatePresence>
                </div>

                {/* Enhanced Progress bar with segments */}
                <div className="relative p-4 border-t border-champion-gold/20 bg-champion-black/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-400 font-medium">Qualification Progress</span>
                    <motion.span
                      key={Object.keys(answers).length}
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      className="text-xs text-champion-gold font-bold"
                    >
                      {Math.round((Object.keys(answers).length / Object.keys(questions).length) * 100)}%
                    </motion.span>
                  </div>
                  <div className="relative h-3 bg-champion-black rounded-full overflow-hidden">
                    {/* Segmented progress */}
                    <div className="absolute inset-0 flex">
                      {Object.keys(questions).map((_, index) => (
                        <div
                          key={index}
                          className="flex-1 border-r border-champion-charcoal last:border-r-0"
                        />
                      ))}
                    </div>
                    {/* Animated fill */}
                    <motion.div
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-champion-gold via-yellow-500 to-champion-gold"
                      initial={{ width: 0 }}
                      animate={{ 
                        width: `${(Object.keys(answers).length / Object.keys(questions).length) * 100}%`,
                        backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                      }}
                      transition={{ 
                        width: { duration: 0.5 },
                        backgroundPosition: { duration: 3, repeat: Infinity }
                      }}
                    />
                    {/* Glow effect */}
                    <motion.div
                      className="absolute inset-y-0 left-0 bg-champion-gold/50 blur-md"
                      initial={{ width: 0 }}
                      animate={{ 
                        width: `${(Object.keys(answers).length / Object.keys(questions).length) * 100}%` 
                      }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                  {/* Step indicators */}
                  <div className="flex justify-between mt-2">
                    {Object.keys(questions).map((key, index) => (
                      <motion.div
                        key={key}
                        initial={{ scale: 0 }}
                        animate={{ 
                          scale: index < Object.keys(answers).length ? 1 : 0.5,
                          opacity: index < Object.keys(answers).length ? 1 : 0.3
                        }}
                        transition={{ delay: index * 0.1 }}
                        className="w-2 h-2 bg-champion-gold rounded-full"
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}