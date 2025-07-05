'use client'

import { motion, useScroll, useTransform, AnimatePresence, useMotionValue, useSpring } from 'framer-motion'
import { Play, Volume2, Maximize2, Pause, VolumeX, CheckCircle, Star, TrendingUp, Sparkles } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { getAssetPath } from '@/utils/assetPath'

export default function VideoSalesLetter() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [hasStarted, setHasStarted] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  
  const springConfig = { damping: 25, stiffness: 150 }
  const mouseXSpring = useSpring(mouseX, springConfig)
  const mouseYSpring = useSpring(mouseY, springConfig)
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })
  
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8])
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])
  const rotateX = useTransform(scrollYProgress, [0, 0.5, 1], [20, 0, -20])
  const y = useTransform(scrollYProgress, [0, 1], [100, -100])

  // Handle video play/pause
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
        setIsPlaying(false)
      } else {
        videoRef.current.play()
        setIsPlaying(true)
        setHasStarted(true)
      }
    }
  }

  // Handle initial play click
  const handleInitialPlay = () => {
    setHasStarted(true)
    setIsPlaying(true)
  }

  // Handle video mute/unmute
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  // Handle fullscreen
  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen()
      } else {
        videoRef.current.requestFullscreen()
      }
    }
  }

  // Start playing when video element is mounted and isPlaying is true
  useEffect(() => {
    if (videoRef.current && isPlaying && hasStarted) {
      videoRef.current.play().catch(error => {
        console.error('Error playing video:', error)
        setIsPlaying(false)
      })
    }
  }, [isPlaying, hasStarted])

  // Mouse tracking effect
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

  // Update progress bar and handle video events
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const updateProgress = () => {
      if (video.duration) {
        setProgress((video.currentTime / video.duration) * 100)
      }
    }

    const handleLoadedMetadata = () => {
      setDuration(video.duration)
    }

    const handleEnded = () => {
      setIsPlaying(false)
      setHasStarted(false)
      setProgress(0)
      if (video) {
        video.currentTime = 0
      }
    }

    const handlePlay = () => {
      setIsPlaying(true)
    }

    const handlePause = () => {
      setIsPlaying(false)
    }

    video.addEventListener('timeupdate', updateProgress)
    video.addEventListener('loadedmetadata', handleLoadedMetadata)
    video.addEventListener('ended', handleEnded)
    video.addEventListener('play', handlePlay)
    video.addEventListener('pause', handlePause)

    return () => {
      video.removeEventListener('timeupdate', updateProgress)
      video.removeEventListener('loadedmetadata', handleLoadedMetadata)
      video.removeEventListener('ended', handleEnded)
      video.removeEventListener('play', handlePlay)
      video.removeEventListener('pause', handlePause)
    }
  }, [])

  // Handle progress bar click
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation() // Prevent triggering video pause
    if (videoRef.current && duration) {
      const rect = e.currentTarget.getBoundingClientRect()
      const clickX = e.clientX - rect.left
      const percentage = clickX / rect.width
      const newTime = percentage * duration
      videoRef.current.currentTime = newTime
      setProgress(percentage * 100)
    }
  }

  // Floating particles
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    size: Math.random() * 4 + 2,
    duration: Math.random() * 20 + 20,
    delay: Math.random() * 5,
    initialX: Math.random() * 100,
    initialY: Math.random() * 100
  }))

  return (
    <section ref={containerRef} className="relative py-20 bg-champion-black overflow-hidden">
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
      <div className="absolute inset-0">
        {/* Floating particles */}
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute bg-champion-gold/20 rounded-full"
            style={{
              width: particle.size,
              height: particle.size,
              left: `${particle.initialX}%`,
              top: `${particle.initialY}%`,
            }}
            animate={{
              y: [-20, -100, -20],
              x: [0, 30, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: particle.duration,
              delay: particle.delay,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}

        {/* Morphing gradient blobs */}
        <motion.div
          className="absolute top-0 left-0 w-48 h-48 md:w-64 md:h-64 lg:w-96 lg:h-96 bg-champion-gold/5 rounded-full blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, -25, 0],
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-0 right-0 w-48 h-48 md:w-64 md:h-64 lg:w-96 lg:h-96 bg-champion-gold/5 rounded-full blur-3xl"
          animate={{
            x: [0, -50, 0],
            y: [0, 25, 0],
            scale: [1, 0.8, 1],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Animated grid pattern */}
        <motion.div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `linear-gradient(to right, #FFD700 1px, transparent 1px),
                             linear-gradient(to bottom, #FFD700 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
            y
          }}
        />
      </div>

      <div className="section-padding relative z-10">
        <motion.div
          style={{ scale, opacity, rotateX, perspective: 1000 }}
          className="max-w-4xl mx-auto"
        >
          {/* Animated Headline with sparkles */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 bg-champion-gold/10 border border-champion-gold/30 rounded-full px-3 py-1.5 md:px-4 md:py-2 mb-4 md:mb-6 relative text-xs md:text-sm"
            >
              {/* Animated sparkles */}
              <motion.div
                className="absolute -top-2 -right-2"
                animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Sparkles className="w-3 h-3 md:w-4 md:h-4 text-champion-gold" />
              </motion.div>
              
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-2 h-2 bg-champion-gold rounded-full"
              />
              <span className="text-champion-gold font-medium uppercase tracking-wider">
                Personal Message from Brandon
              </span>
            </motion.div>
            
            <h2 className="heading-2 mb-4">
              <motion.span
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                viewport={{ once: true }}
                className="inline-block"
              >
                A Message From
              </motion.span>{' '}
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                viewport={{ once: true }}
                className="text-gradient-gold inline-block relative"
              >
                Your Champion
                {/* Animated underline */}
                <motion.div
                  className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-champion-gold to-transparent"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  transition={{ delay: 0.8, duration: 0.8 }}
                  viewport={{ once: true }}
                />
              </motion.span>
            </h2>
            
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              viewport={{ once: true }}
              className="text-gray-400 text-lg"
            >
              Brandon Hendrickson wants to share something important with you
            </motion.p>
          </motion.div>

          {/* Video Container with advanced animations */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Animated glow effect */}
            <motion.div
              className="absolute -inset-4 opacity-0"
              animate={{
                opacity: isHovered ? 1 : 0,
              }}
              transition={{ duration: 0.3 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-champion-gold via-yellow-500 to-champion-gold rounded-xl blur-2xl animate-pulse" />
            </motion.div>

            {/* Glowing border effect */}
            <motion.div
              className="absolute -inset-1 bg-gradient-to-r from-champion-gold via-yellow-500 to-champion-gold rounded-xl opacity-50 blur-lg"
              animate={{
                opacity: isHovered ? 0.8 : 0.5,
                scale: isHovered ? 1.02 : 1,
              }}
              transition={{ duration: 0.3 }}
            />
            
            <div className="relative aspect-video bg-champion-charcoal rounded-xl overflow-hidden shadow-2xl">
              {/* Thumbnail/Preview - Show when not playing */}
              {!isPlaying && (
                <motion.div 
                  className="absolute inset-0 flex items-center justify-center cursor-pointer group z-20"
                  onClick={hasStarted ? togglePlay : handleInitialPlay}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Video Thumbnail - will show frame from video */}
                  <video
                    src={`${getAssetPath('brandon-message.mp4')}#t=60`}
                    className="absolute inset-0 w-full h-full object-cover"
                    muted
                  />
                  
                  {/* Animated overlay gradient */}
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-t from-champion-black via-transparent to-transparent"
                    animate={{
                      opacity: isHovered ? 0.7 : 0.4,
                    }}
                    transition={{ duration: 0.3 }}
                  />
                  
                  {/* Play Button with advanced effects */}
                  <div className="relative z-10">
                    {/* Multiple ripple effects */}
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="absolute inset-0 bg-champion-gold rounded-full"
                        animate={{
                          scale: [1, 2, 2],
                          opacity: [0.5, 0, 0],
                        }}
                        transition={{
                          duration: 2,
                          delay: i * 0.4,
                          repeat: Infinity,
                          ease: "easeOut"
                        }}
                      />
                    ))}
                    
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.95 }}
                      className="relative w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 bg-gradient-gold rounded-full flex items-center justify-center shadow-2xl"
                      animate={{
                        boxShadow: isHovered 
                          ? "0 0 60px rgba(255, 215, 0, 0.6)" 
                          : "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
                      }}
                    >
                      <Play className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 text-champion-black ml-0.5 md:ml-1" fill="currentColor" />
                    </motion.div>
                  </div>
                  
                  {/* Video duration badge with float animation */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ 
                      opacity: 1, 
                      x: 0,
                      y: isHovered ? -5 : 0,
                    }}
                    transition={{ delay: 0.5, y: { duration: 0.3 } }}
                    className="absolute top-2 left-2 md:top-4 md:left-4 bg-champion-black/80 backdrop-blur-sm rounded-lg px-2 py-1 md:px-3 md:py-1.5"
                  >
                    <span className="text-xs md:text-sm font-medium">Personal Message</span>
                  </motion.div>
                  
                  {/* Video title overlay with slide-up effect */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ 
                      opacity: 1, 
                      y: isHovered ? -10 : 0 
                    }}
                    transition={{ delay: 0.6, y: { duration: 0.3 } }}
                    className="absolute bottom-0 left-0 right-0 p-3 md:p-4 lg:p-6 bg-gradient-to-t from-champion-black/90 to-transparent"
                  >
                    <h3 className="text-base md:text-lg lg:text-xl font-montserrat font-bold mb-1 md:mb-2">
                      Why I Created This Program For You
                    </h3>
                    <p className="text-gray-300 text-xs md:text-sm">
                      Brandon Hendrickson - 3x Mr. Olympia Men's Physique Champion
                    </p>
                  </motion.div>
                </motion.div>
              )}

              {/* Video player - Always rendered but hidden when paused */}
              <div className={`relative w-full h-full bg-black ${!isPlaying ? 'invisible' : 'visible'}`}>
                <video
                  ref={videoRef}
                  className="w-full h-full cursor-pointer"
                  src={getAssetPath('brandon-message.mp4')}
                  poster={`${getAssetPath('brandon-message.mp4')}#t=60`}
                  muted={isMuted}
                  onClick={togglePlay}
                >
                  Your browser does not support the video tag.
                </video>
                
                {/* Custom video controls overlay */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isHovered ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-champion-black/90 to-transparent pointer-events-none"
                >
                  <div className="flex items-center gap-4 pointer-events-auto">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        togglePlay()
                      }}
                      className="text-white hover:text-champion-gold transition-colors"
                    >
                      {isPlaying ? (
                        <Pause className="w-6 h-6" />
                      ) : (
                        <Play className="w-6 h-6" />
                      )}
                    </button>
                    <div 
                      className="flex-1 h-1 bg-gray-700 rounded-full overflow-hidden cursor-pointer"
                      onClick={handleProgressClick}
                    >
                      <motion.div
                        className="h-full bg-gradient-to-r from-champion-gold to-yellow-500"
                        style={{ width: `${progress}%` }}
                        transition={{ duration: 0.1 }}
                      />
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleMute()
                      }}
                      className="text-white hover:text-champion-gold transition-colors"
                    >
                      {isMuted ? (
                        <VolumeX className="w-6 h-6" />
                      ) : (
                        <Volume2 className="w-6 h-6" />
                      )}
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleFullscreen()
                      }}
                      className="text-white hover:text-champion-gold transition-colors"
                    >
                      <Maximize2 className="w-6 h-6" />
                    </button>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Compelling content below video with advanced animations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            viewport={{ once: true }}
            className="mt-16"
          >
            {/* Trust indicators with 3D hover effects */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {[
                { icon: Star, title: "50,000+ Athletes", desc: "Already transforming their physique with Brandon's proven methods" },
                { icon: TrendingUp, title: "97% Success Rate", desc: "Athletes who follow the program see visible results within 30 days" },
                { icon: CheckCircle, title: "Lifetime Access", desc: "One-time investment for unlimited access to all future updates" }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 + index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center relative"
                  onMouseEnter={() => setHoveredCard(index)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <motion.div
                    className="relative"
                    animate={{
                      y: hoveredCard === index ? -10 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* 3D card effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br from-champion-gold/20 to-transparent rounded-xl blur-xl"
                      animate={{
                        opacity: hoveredCard === index ? 1 : 0,
                        scale: hoveredCard === index ? 1.1 : 1,
                      }}
                      transition={{ duration: 0.3 }}
                    />
                    
                    <div className="relative bg-champion-charcoal/50 backdrop-blur-sm border border-champion-gold/10 rounded-xl p-6">
                      <motion.div
                        className="inline-flex items-center justify-center w-16 h-16 bg-champion-gold/10 rounded-full mb-4"
                        animate={{
                          rotate: hoveredCard === index ? 360 : 0,
                          scale: hoveredCard === index ? 1.1 : 1,
                        }}
                        transition={{ duration: 0.5 }}
                      >
                        <item.icon className="w-8 h-8 text-champion-gold" />
                      </motion.div>
                      
                      <h4 className="text-xl font-bold mb-2">{item.title}</h4>
                      <p className="text-gray-400 text-sm">{item.desc}</p>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </div>

            {/* Urgency and social proof with morphing background */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              viewport={{ once: true }}
              className="relative overflow-hidden"
            >
              {/* Morphing gradient background */}
              <motion.div
                className="absolute inset-0 opacity-50"
                animate={{
                  background: [
                    "radial-gradient(circle at 20% 50%, rgba(255, 215, 0, 0.1) 0%, transparent 50%)",
                    "radial-gradient(circle at 80% 50%, rgba(255, 215, 0, 0.1) 0%, transparent 50%)",
                    "radial-gradient(circle at 20% 50%, rgba(255, 215, 0, 0.1) 0%, transparent 50%)",
                  ],
                }}
                transition={{ duration: 5, repeat: Infinity }}
              />
              
              <div className="relative bg-gradient-to-r from-champion-gold/10 to-champion-gold/5 border border-champion-gold/20 rounded-xl p-6 text-center">
                <div className="flex items-center justify-center gap-4 mb-4">
                  <div className="flex -space-x-3">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <motion.img
                        key={i}
                        initial={{ opacity: 0, scale: 0, rotate: -180 }}
                        whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                        transition={{ 
                          delay: 0.4 + i * 0.05,
                          type: "spring",
                          stiffness: 200,
                          damping: 10
                        }}
                        viewport={{ once: true }}
                        src={`https://i.pravatar.cc/40?img=${i + 10}`}
                        alt={`Athlete ${i}`}
                        className="w-10 h-10 rounded-full border-2 border-champion-black"
                        whileHover={{ scale: 1.2, zIndex: 10 }}
                      />
                    ))}
                  </div>
                  <motion.p
                    className="text-sm"
                    animate={{ x: [-5, 5, -5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <span className="text-champion-gold font-bold">127 athletes</span> joined in the last 24 hours
                  </motion.p>
                </div>

                <motion.p
                  animate={{ 
                    opacity: [0.7, 1, 0.7],
                    scale: [1, 1.05, 1],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-champion-gold font-medium"
                >
                  Limited spots available at this special price
                </motion.p>
              </div>
            </motion.div>

            {/* Clear CTA with floating animation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4 }}
              viewport={{ once: true }}
              className="text-center mt-8"
            >
              <p className="text-gray-400 mb-4">
                Ready to start your transformation journey with a 3x Mr. Olympia champion?
              </p>
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="inline-flex items-center gap-2 text-champion-gold font-medium text-lg relative"
              >
                {/* Glow effect */}
                <motion.div
                  className="absolute inset-0 bg-champion-gold/20 blur-xl"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                
                <span className="relative">Continue scrolling to see the complete program</span>
                <motion.span
                  animate={{ y: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="text-2xl relative"
                >
                  ↓
                </motion.span>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}