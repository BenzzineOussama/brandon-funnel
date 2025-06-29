'use client'

import { motion } from 'framer-motion'
import { useCountdownTimer } from '@/hooks/useCountdownTimer'

export default function FuturisticTimer() {
  const timeLeft = useCountdownTimer()
  
  return (
    <div className="relative">
      {/* Holographic background effect */}
      <div className="absolute inset-0 -inset-x-20">
        <motion.div
          className="absolute inset-0 opacity-30"
          style={{
            background: 'conic-gradient(from 0deg at 50% 50%, #FFD700 0deg, #FF6B6B 60deg, #4ECDC4 120deg, #45B7D1 180deg, #96CEB4 240deg, #FFEAA7 300deg, #FFD700 360deg)',
            filter: 'blur(40px)',
          }}
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>
      
      {/* Main timer container */}
      <div className="relative z-10">
        {/* Futuristic header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <motion.div
            className="inline-flex items-center gap-3 bg-gradient-to-r from-red-500/10 via-orange-500/10 to-yellow-500/10 backdrop-blur-sm border border-red-500/30 rounded-full px-6 py-3"
            animate={{
              boxShadow: [
                '0 0 20px rgba(255, 0, 0, 0.3)',
                '0 0 40px rgba(255, 100, 0, 0.5)',
                '0 0 20px rgba(255, 0, 0, 0.3)',
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {/* Animated warning icon */}
            <motion.div
              className="relative w-6 h-6"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-500 rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
              <motion.div
                className="absolute inset-1 bg-black rounded-full"
                animate={{ scale: [1, 0.8, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
            </motion.div>
            
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 font-bold text-sm uppercase tracking-wider">
              Limited Time Offer Expires In
            </span>
          </motion.div>
        </motion.div>
        
        {/* Timer display */}
        <div className="flex items-center justify-center gap-2 sm:gap-4">
          {[
            { value: timeLeft.hours, label: 'HRS', color: 'from-red-500 to-orange-500' },
            { value: timeLeft.minutes, label: 'MIN', color: 'from-orange-500 to-yellow-500' },
            { value: timeLeft.seconds, label: 'SEC', color: 'from-yellow-500 to-green-500' }
          ].map((item, index) => (
            <div key={index} className="relative">
              {/* Futuristic time unit */}
              <motion.div
                className="relative"
                animate={{ 
                  y: item.value === 0 ? [0, -5, 0] : 0,
                }}
                transition={{ duration: 0.5 }}
              >
                {/* Hexagonal container */}
                <div className="relative w-20 h-24 sm:w-24 sm:h-28">
                  {/* Background hexagon with gradient */}
                  <svg
                    viewBox="0 0 100 115"
                    className="absolute inset-0 w-full h-full"
                  >
                    <defs>
                      <linearGradient id={`gradient-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#1a1a1a" />
                        <stop offset="100%" stopColor="#0a0a0a" />
                      </linearGradient>
                      <filter id={`glow-${index}`}>
                        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                        <feMerge>
                          <feMergeNode in="coloredBlur"/>
                          <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                      </filter>
                    </defs>
                    
                    {/* Outer glow */}
                    <motion.polygon
                      points="50,5 90,30 90,75 50,100 10,75 10,30"
                      fill="none"
                      stroke="url(#gradient-glow)"
                      strokeWidth="2"
                      filter={`url(#glow-${index})`}
                      animate={{
                        strokeOpacity: [0.3, 0.8, 0.3],
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    
                    {/* Main hexagon */}
                    <polygon
                      points="50,5 90,30 90,75 50,100 10,75 10,30"
                      fill={`url(#gradient-${index})`}
                      stroke="rgba(255, 215, 0, 0.2)"
                      strokeWidth="1"
                    />
                    
                    {/* Inner glow effect */}
                    <motion.polygon
                      points="50,15 80,35 80,70 50,90 20,70 20,35"
                      fill="none"
                      stroke="rgba(255, 215, 0, 0.3)"
                      strokeWidth="0.5"
                      animate={{
                        opacity: [0, 1, 0],
                        scale: [0.8, 1, 0.8],
                      }}
                      transition={{ duration: 3, repeat: Infinity }}
                      style={{ transformOrigin: 'center' }}
                    />
                  </svg>
                  
                  {/* Digital number display */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <motion.div
                      key={item.value}
                      initial={{ rotateX: -90, opacity: 0, scale: 0.5 }}
                      animate={{ rotateX: 0, opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, type: "spring" }}
                      className="relative"
                      style={{ transformStyle: "preserve-3d" }}
                    >
                      {/* Number with gradient */}
                      <motion.div
                        className={`text-3xl sm:text-4xl font-mono font-black bg-gradient-to-b ${item.color} text-transparent bg-clip-text`}
                        animate={{
                          textShadow: [
                            '0 0 10px rgba(255, 215, 0, 0.5)',
                            '0 0 20px rgba(255, 215, 0, 0.8)',
                            '0 0 10px rgba(255, 215, 0, 0.5)',
                          ]
                        }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        {String(item.value).padStart(2, '0')}
                      </motion.div>
                      
                      {/* Holographic shimmer */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-t from-transparent via-white/20 to-transparent"
                        animate={{
                          y: [-20, 20],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          repeatType: "reverse",
                        }}
                      />
                    </motion.div>
                    
                    {/* Label */}
                    <motion.div
                      className="text-[10px] sm:text-xs text-gray-500 font-bold tracking-wider mt-1"
                      animate={{
                        opacity: [0.5, 1, 0.5],
                      }}
                      transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                    >
                      {item.label}
                    </motion.div>
                  </div>
                  
                  {/* Orbiting particles */}
                  {[0, 120, 240].map((angle, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1 h-1 bg-champion-gold rounded-full"
                      style={{
                        top: '50%',
                        left: '50%',
                      }}
                      animate={{
                        x: [
                          Math.cos((angle + 0) * Math.PI / 180) * 40,
                          Math.cos((angle + 120) * Math.PI / 180) * 40,
                          Math.cos((angle + 240) * Math.PI / 180) * 40,
                          Math.cos((angle + 360) * Math.PI / 180) * 40,
                        ],
                        y: [
                          Math.sin((angle + 0) * Math.PI / 180) * 40,
                          Math.sin((angle + 120) * Math.PI / 180) * 40,
                          Math.sin((angle + 240) * Math.PI / 180) * 40,
                          Math.sin((angle + 360) * Math.PI / 180) * 40,
                        ],
                        opacity: [0, 1, 1, 0],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        delay: i * 1,
                        ease: "linear",
                      }}
                    />
                  ))}
                </div>
              </motion.div>
              
              {/* Separator */}
              {index < 2 && (
                <div className="absolute -right-2 sm:-right-3 top-1/2 -translate-y-1/2">
                  <motion.div
                    className="flex flex-col gap-1"
                    animate={{
                      opacity: [0.3, 1, 0.3],
                    }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    <motion.div
                      className="w-1.5 h-1.5 bg-champion-gold rounded-full"
                      animate={{ scale: [1, 1.5, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                    <motion.div
                      className="w-1.5 h-1.5 bg-champion-gold rounded-full"
                      animate={{ scale: [1, 1.5, 1] }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0.5 }}
                    />
                  </motion.div>
                </div>
              )}
            </div>
          ))}
        </div>
        
        {/* Warning message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-6"
        >
          <motion.div
            className="inline-block bg-red-500/10 backdrop-blur-sm border border-red-500/30 rounded-lg px-4 py-2"
            animate={{
              boxShadow: [
                '0 0 10px rgba(255, 0, 0, 0.2)',
                '0 0 20px rgba(255, 0, 0, 0.4)',
                '0 0 10px rgba(255, 0, 0, 0.2)',
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <motion.p
              className="text-sm font-medium"
              animate={{
                opacity: [0.8, 1, 0.8],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span className="text-gray-200">Price increases to</span>{' '}
              <span className="text-red-400 font-bold text-base">$497</span>{' '}
              <span className="text-gray-200">when timer expires</span>
            </motion.p>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Bottom light effect */}
      <motion.div
        className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-full h-20 opacity-50"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(255, 215, 0, 0.3) 0%, transparent 70%)',
          filter: 'blur(20px)',
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{ duration: 3, repeat: Infinity }}
      />
    </div>
  )
}