'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { 
  Lock, CreditCard, Shield, Check, Zap, Star, 
  TrendingUp, Award, Sparkles, ShieldCheck, 
  CheckCircle2, ArrowRight, Fingerprint, Globe,
  Smartphone, Mail, User, Calendar, MapPin, Gift,
  Trophy, Target, Rocket, Users
} from 'lucide-react'

export default function CheckoutPage() {
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const [completedFields, setCompletedFields] = useState<Set<string>>(new Set())
  const [cardType, setCardType] = useState<string>('')
  const [showSuccess, setShowSuccess] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: '',
    zipCode: ''
  })
  
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [fieldValid, setFieldValid] = useState<Record<string, boolean>>({})

  // Mouse tracking for 3D effects
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const rotateX = useTransform(mouseY, [-300, 300], [10, -10])
  const rotateY = useTransform(mouseX, [-300, 300], [-10, 10])
  
  const springConfig = { damping: 25, stiffness: 150 }
  const rotateXSpring = useSpring(rotateX, springConfig)
  const rotateYSpring = useSpring(rotateY, springConfig)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      mouseX.set(e.clientX - centerX)
      mouseY.set(e.clientY - centerY)
    }
    
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [mouseX, mouseY])

  // Card type detection with more accurate patterns
  const detectCardType = (number: string) => {
    const cleaned = number.replace(/\s/g, '')
    
    // Visa: starts with 4
    if (/^4/.test(cleaned)) return 'visa'
    
    // Mastercard: starts with 51-55 or 2221-2720
    if (/^5[1-5]/.test(cleaned) || /^2[2-7]/.test(cleaned)) return 'mastercard'
    
    // American Express: starts with 34 or 37
    if (/^3[47]/.test(cleaned)) return 'amex'
    
    // Discover: starts with 6011, 622126-622925, 644-649, or 65
    if (/^6011/.test(cleaned) || /^62212[6-9]/.test(cleaned) || 
        /^6221[3-9]/.test(cleaned) || /^622[2-8]/.test(cleaned) || 
        /^6229[0-1]/.test(cleaned) || /^62292[0-5]/.test(cleaned) ||
        /^64[4-9]/.test(cleaned) || /^65/.test(cleaned)) return 'discover'
    
    // Diners Club: starts with 300-305, 36, or 38
    if (/^30[0-5]/.test(cleaned) || /^3[68]/.test(cleaned)) return 'diners'
    
    // JCB: starts with 3528-3589
    if (/^35[2-8]/.test(cleaned)) return 'jcb'
    
    return ''
  }

  // Format card number based on card type
  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, '')
    
    // American Express: 4-6-5 format
    if (cardType === 'amex') {
      const match = cleaned.match(/^(\d{1,4})(\d{1,6})?(\d{1,5})?/)
      if (match) {
        return [match[1], match[2], match[3]].filter(Boolean).join(' ')
      }
    }
    
    // Default: 4-4-4-4 format
    const chunks = cleaned.match(/.{1,4}/g) || []
    return chunks.join(' ')
  }

  // Format expiry date
  const formatExpiryDate = (value: string) => {
    const cleaned = value.replace(/\D/g, '')
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4)
    }
    return cleaned
  }
// Validation functions
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validateCardNumber = (number: string) => {
    const cleaned = number.replace(/\s/g, '')
    return cleaned.length >= 13 && cleaned.length <= 19 && /^\d+$/.test(cleaned)
  }

  const validateExpiryDate = (date: string) => {
    if (!/^\d{2}\/\d{2}$/.test(date)) return false
    const [month, year] = date.split('/').map(Number)
    if (month < 1 || month > 12) return false
    const currentYear = new Date().getFullYear() % 100
    const currentMonth = new Date().getMonth() + 1
    if (year < currentYear || (year === currentYear && month < currentMonth)) return false
    return true
  }

  const validateCVV = (cvv: string, cardType: string) => {
    const length = cardType === 'amex' ? 4 : 3
    return cvv.length === length && /^\d+$/.test(cvv)
  }

  const validateField = (name: string, value: string) => {
    switch (name) {
      case 'firstName':
      case 'lastName':
        // Plus strict : au moins 2 caractères, seulement des lettres et espaces
        return value.length >= 2 && /^[a-zA-ZÀ-ÿ\s'-]+$/.test(value)
      case 'email':
        return validateEmail(value)
      case 'cardNumber':
        return validateCardNumber(value)
      case 'cardHolder':
        // Le nom du propriétaire doit avoir au moins 3 caractères et contenir un espace (nom + prénom)
        return value.length >= 3 && /^[a-zA-ZÀ-ÿ\s'-]+$/.test(value) && value.trim().includes(' ')
      case 'expiryDate':
        return validateExpiryDate(value)
      case 'cvv':
        return validateCVV(value, cardType)
      case 'zipCode':
        // Code postal : au moins 3 caractères, alphanumérique
        return value.length >= 3 && /^[a-zA-Z0-9\s-]+$/.test(value)
      default:
        return true
    }
  }

  // Fonction pour obtenir le message d'erreur approprié
  const getFieldError = (name: string, value: string) => {
    if (!value) return 'This field is required'
    
    switch (name) {
      case 'firstName':
      case 'lastName':
        if (value.length < 2) return 'Must be at least 2 characters'
        if (!/^[a-zA-ZÀ-ÿ\s'-]+$/.test(value)) return 'Only letters allowed'
        return ''
      case 'email':
        return validateEmail(value) ? '' : 'Invalid email address'
      case 'cardNumber':
        const cleaned = value.replace(/\s/g, '')
        if (cleaned.length < 13) return 'Card number too short'
        if (!/^\d+$/.test(cleaned)) return 'Only numbers allowed'
        return ''
      case 'cardHolder':
        if (value.length < 3) return 'Name too short'
        if (!/^[a-zA-ZÀ-ÿ\s'-]+$/.test(value)) return 'Only letters allowed'
        if (!value.trim().includes(' ')) return 'Enter full name (first and last)'
        return ''
      case 'expiryDate':
        if (!/^\d{2}\/\d{2}$/.test(value)) return 'Use MM/YY format'
        const [month, year] = value.split('/').map(Number)
        if (month < 1 || month > 12) return 'Invalid month'
        const currentYear = new Date().getFullYear() % 100
        const currentMonth = new Date().getMonth() + 1
        if (year < currentYear || (year === currentYear && month < currentMonth)) return 'Card expired'
        return ''
      case 'cvv':
        const expectedLength = cardType === 'amex' ? 4 : 3
        if (value.length !== expectedLength) return `Must be ${expectedLength} digits`
        if (!/^\d+$/.test(value)) return 'Only numbers allowed'
        return ''
      case 'zipCode':
        if (value.length < 3) return 'Too short'
        if (!/^[a-zA-Z0-9\s-]+$/.test(value)) return 'Invalid format'
        return ''
      default:
        return ''
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    let formattedValue = value

    if (name === 'cardNumber') {
      const cleanedValue = value.replace(/\s/g, '')
      formattedValue = formatCardNumber(cleanedValue)
      setCardType(detectCardType(cleanedValue))
    } else if (name === 'expiryDate') {
      formattedValue = formatExpiryDate(value)
    } else if (name === 'cvv') {
      formattedValue = value.replace(/\D/g, '').slice(0, 4)
    } else if (name === 'cardHolder') {
      // Format cardholder name to uppercase
      formattedValue = value.toUpperCase()
    }

    setFormData(prev => ({ ...prev, [name]: formattedValue }))
    
    // Clear error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleFieldBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFocusedField(null)
    
    // Validate field on blur
    const isValid = validateField(name, value)
    setFieldValid(prev => ({ ...prev, [name]: isValid }))
    
    // Set error message if invalid
    if (!isValid && value) {
      const error = getFieldError(name, value)
      setFieldErrors(prev => ({ ...prev, [name]: error }))
    }
    
    // Mark field as completed if it has value
    if (value) {
      setCompletedFields(prev => new Set(prev).add(name))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate all fields before submission
    const fieldsToValidate = ['firstName', 'lastName', 'email', 'cardNumber', 'cardHolder', 'expiryDate', 'cvv', 'zipCode']
    const errors: Record<string, string> = {}
    const validations: Record<string, boolean> = {}
    
    fieldsToValidate.forEach(field => {
      const value = formData[field as keyof typeof formData]
      const isValid = validateField(field, value)
      validations[field] = isValid
      
      if (!value) {
        errors[field] = 'This field is required'
      } else if (!isValid) {
        errors[field] = getFieldError(field, value)
      }
    })
    
    setFieldValid(validations)
    setFieldErrors(errors)
    
    // Check if all fields are valid
    const hasErrors = Object.values(errors).some(error => error !== '')
    if (hasErrors) {
      // Scroll to first error field
      const firstErrorField = fieldsToValidate.find(field => errors[field])
      if (firstErrorField) {
        const element = document.querySelector(`[name="${firstErrorField}"]`)
        element?.scrollIntoView({ behavior: 'smooth', block: 'center' })
        setTimeout(() => {
          (element as HTMLInputElement)?.focus()
        }, 500)
      }
      return
    }
    
    setIsProcessing(true)
    
    // Simulate payment processing with progress
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    setShowSuccess(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Store purchase info
    localStorage.setItem('purchaseComplete', 'true')
    localStorage.setItem('purchaseEmail', formData.email)
    localStorage.setItem('purchaseName', `${formData.firstName} ${formData.lastName}`)
    
    // Redirect to thank you page
    router.push('/thank-you')
  }

  const progressPercentage = (completedFields.size / 8) * 100

  return (
    <main className="min-h-screen bg-champion-black relative overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 z-0">
        {/* Gradient orbs */}
        <motion.div
          className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] bg-champion-gold/20 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-1/4 -right-1/4 w-[600px] h-[600px] bg-yellow-500/20 rounded-full blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Floating particles */}
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-champion-gold/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, 20, -20],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div ref={containerRef} className="relative z-10 py-20">
        <div className="section-padding">
          <div className="max-w-6xl mx-auto">
            {/* Progress bar with steps */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-12"
            >
              <div className="relative">
                {/* Progress line */}
                <div className="absolute top-5 left-0 right-0 h-1 bg-gray-800 rounded-full" />
                <motion.div
                  className="absolute top-5 left-0 h-1 bg-gradient-to-r from-champion-gold via-yellow-400 to-champion-gold rounded-full shadow-lg shadow-champion-gold/50"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
                
                {/* Steps */}
                <div className="relative flex justify-between">
                  {[
                    { name: 'Information', icon: User, step: 1 },
                    { name: 'Payment', icon: CreditCard, step: 2 },
                    { name: 'Confirmation', icon: CheckCircle2, step: 3 }
                  ].map((item, index) => {
                    const isActive = progressPercentage >= (index * 50)
                    const isComplete = progressPercentage > ((index + 1) * 33.33)
                    
                    return (
                      <motion.div
                        key={item.name}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex flex-col items-center"
                      >
                        <motion.div
                          className={`
                            w-10 h-10 rounded-full flex items-center justify-center
                            transition-all duration-500 relative
                            ${isComplete 
                              ? 'bg-gradient-to-br from-champion-gold to-yellow-400 shadow-lg shadow-champion-gold/50' 
                              : isActive 
                                ? 'bg-champion-charcoal border-2 border-champion-gold' 
                                : 'bg-gray-800 border-2 border-gray-700'}
                          `}
                          whileHover={{ scale: 1.1 }}
                          animate={isComplete ? {
                            boxShadow: [
                              '0 0 20px rgba(212, 175, 55, 0.5)',
                              '0 0 40px rgba(212, 175, 55, 0.8)',
                              '0 0 20px rgba(212, 175, 55, 0.5)',
                            ]
                          } : {}}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <item.icon className={`w-5 h-5 ${isComplete || isActive ? 'text-white' : 'text-gray-500'}`} />
                          {isComplete && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute inset-0 rounded-full bg-gradient-to-br from-champion-gold/20 to-yellow-400/20"
                            />
                          )}
                        </motion.div>
                        <motion.span 
                          className={`mt-2 text-xs font-medium ${isActive ? 'text-champion-gold' : 'text-gray-500'}`}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: index * 0.1 + 0.2 }}
                        >
                          {item.name}
                        </motion.span>
                      </motion.div>
                    )
                  })}
                </div>
              </div>
              
              {/* Progress percentage with animation */}
              <motion.div 
                className="text-center mt-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <div className="inline-flex items-center gap-2 bg-champion-gold/10 backdrop-blur-sm border border-champion-gold/30 rounded-full px-4 py-2">
                  <motion.div
                    className="w-2 h-2 bg-champion-gold rounded-full"
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [1, 0.5, 1]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <span className="text-sm font-medium text-champion-gold">
                    {Math.round(progressPercentage)}% Complete
                  </span>
                </div>
              </motion.div>
            </motion.div>

            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12"
            >
              {/* Security badges */}
              <motion.div
                className="flex justify-center gap-3 mb-6 flex-wrap"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <motion.div
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-full px-4 py-2"
                  whileHover={{ scale: 1.05, borderColor: 'rgba(34, 197, 94, 0.5)' }}
                  animate={{
                    boxShadow: [
                      '0 0 10px rgba(34, 197, 94, 0.3)',
                      '0 0 20px rgba(34, 197, 94, 0.5)',
                      '0 0 10px rgba(34, 197, 94, 0.3)',
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Shield className="w-4 h-4 text-green-500" />
                  <span className="text-green-500 font-medium text-xs uppercase tracking-wider">
                    SSL Secured
                  </span>
                </motion.div>
                
                <motion.div
                  className="inline-flex items-center gap-2 bg-champion-gold/10 border border-champion-gold/30 rounded-full px-4 py-2"
                  whileHover={{ scale: 1.05, borderColor: 'rgba(212, 175, 55, 0.5)' }}
                  animate={{
                    boxShadow: [
                      '0 0 10px rgba(212, 175, 55, 0.3)',
                      '0 0 20px rgba(212, 175, 55, 0.5)',
                      '0 0 10px rgba(212, 175, 55, 0.3)',
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                >
                  <Lock className="w-4 h-4 text-champion-gold" />
                  <span className="text-champion-gold font-medium text-xs uppercase tracking-wider">
                    256-bit Encryption
                  </span>
                </motion.div>
                
                <motion.div
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-500/30 rounded-full px-4 py-2"
                  whileHover={{ scale: 1.05, borderColor: 'rgba(59, 130, 246, 0.5)' }}
                  animate={{
                    boxShadow: [
                      '0 0 10px rgba(59, 130, 246, 0.3)',
                      '0 0 20px rgba(59, 130, 246, 0.5)',
                      '0 0 10px rgba(59, 130, 246, 0.3)',
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                >
                  <Fingerprint className="w-4 h-4 text-blue-500" />
                  <span className="text-blue-500 font-medium text-xs uppercase tracking-wider">
                    PCI Compliant
                  </span>
                </motion.div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="mb-6"
              >
                <h1 className="text-5xl md:text-7xl font-montserrat font-bold mb-4 relative">
                  <motion.span
                    className="absolute -inset-4 bg-gradient-to-r from-champion-gold/20 via-yellow-400/20 to-champion-gold/20 blur-3xl"
                    animate={{
                      opacity: [0.5, 0.8, 0.5],
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />
                  <span className="relative">Complete Your</span>
                  <br />
                  <motion.span 
                    className="relative text-transparent bg-clip-text bg-gradient-to-r from-champion-gold via-yellow-400 to-champion-gold"
                    animate={{
                      backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                    }}
                    transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
                    style={{ backgroundSize: '200% 200%' }}
                  >
                    Transformation
                  </motion.span>
                </h1>
              </motion.div>
              
              {/* Trust indicators */}
              <motion.div
                className="flex justify-center items-center gap-6 flex-wrap mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="w-8 h-8 rounded-full bg-gradient-to-br from-champion-gold to-yellow-600 border-2 border-champion-black flex items-center justify-center"
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: 0.6 + i * 0.1, type: "spring" }}
                      >
                        <Star className="w-4 h-4 text-white" />
                      </motion.div>
                    ))}
                  </div>
                  <span className="text-sm text-gray-400">
                    <span className="text-champion-gold font-semibold">4.9/5</span> from 127 athletes
                  </span>
                </div>
                
                <div className="h-8 w-px bg-gray-700" />
                
                <motion.div 
                  className="flex items-center gap-2"
                  animate={{
                    scale: [1, 1.05, 1],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <motion.div 
                    className="w-2 h-2 bg-green-500 rounded-full"
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [1, 0.5, 1]
                    }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                  <span className="text-sm text-gray-400">
                    <span className="text-green-500 font-semibold">23 people</span> completing checkout now
                  </span>
                </motion.div>
              </motion.div>
              
              {/* Urgency message */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/30 rounded-lg px-4 py-3 max-w-md mx-auto"
              >
                <div className="flex items-center justify-center gap-2">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    <Zap className="w-5 h-5 text-orange-500" />
                  </motion.div>
                  <p className="text-sm font-medium text-orange-500">
                    Limited spots remaining • Price increases in 24 hours
                  </p>
                </div>
              </motion.div>
{/* Progress Steps */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex items-center justify-center gap-4 mb-12 mt-8"
              >
                {[
                  { step: 1, label: 'Information', icon: User },
                  { step: 2, label: 'Payment', icon: CreditCard },
                  { step: 3, label: 'Confirmation', icon: CheckCircle2 }
                ].map((item, index) => (
                  <div key={item.step} className="flex items-center">
                    <motion.div
                      className={`relative flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 ${
                        index === 0 || index === 1
                          ? 'border-champion-gold bg-champion-gold/20'
                          : 'border-gray-600 bg-gray-800'
                      }`}
                      whileHover={{ scale: 1.1 }}
                    >
                      <item.icon className={`w-5 h-5 ${
                        index === 0 || index === 1 ? 'text-champion-gold' : 'text-gray-500'
                      }`} />
                      {index < 2 && (
                        <motion.div
                          className="absolute -inset-1 rounded-full border-2 border-champion-gold opacity-50"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      )}
                    </motion.div>
                    {index < 2 && (
                      <div className={`w-20 h-0.5 mx-2 ${
                        index === 0 ? 'bg-champion-gold' : 'bg-gray-600'
                      }`} />
                    )}
                  </div>
                ))}
              </motion.div>
            </motion.div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Checkout Form */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="lg:col-span-2"
              >
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Contact Information */}
                  <motion.div
                    className="relative"
                    style={{
                      rotateX: rotateXSpring,
                      rotateY: rotateYSpring,
                      transformPerspective: 1200,
                    }}
                  >
                    <div className="absolute -inset-1 bg-gradient-to-r from-champion-gold/20 to-yellow-500/20 rounded-2xl blur-lg opacity-50" />
                    <div className="relative bg-gradient-to-br from-gray-900/95 via-champion-charcoal/90 to-gray-900/95 backdrop-blur-xl rounded-2xl p-8 border border-gray-800/50 overflow-hidden">
                      {/* Animated background pattern */}
                      <div className="absolute inset-0 opacity-10">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(212,175,55,0.15)_0%,transparent_50%)]" />
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(212,175,55,0.1)_0%,transparent_50%)]" />
                      </div>
                      
                      <div className="relative flex items-center gap-3 mb-6">
                        <motion.div
                          className="p-3 bg-gradient-to-br from-champion-gold/20 to-yellow-500/10 rounded-xl shadow-lg shadow-champion-gold/20"
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          animate={{ 
                            boxShadow: [
                              '0 10px 25px -5px rgba(212, 175, 55, 0.2)',
                              '0 20px 35px -5px rgba(212, 175, 55, 0.3)',
                              '0 10px 25px -5px rgba(212, 175, 55, 0.2)',
                            ]
                          }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <User className="w-6 h-6 text-champion-gold" />
                        </motion.div>
                        <h3 className="text-xl font-montserrat font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                          Contact Information
                        </h3>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-6">
                        <motion.div
                          whileFocus={{ scale: 1.02 }}
                          className="relative group"
                        >
                          <label className="block text-sm text-gray-400 mb-2 flex items-center gap-2">
                            <motion.div
                              className="w-1 h-4 bg-gradient-to-b from-champion-gold to-yellow-600 rounded-full"
                              animate={{ height: ['16px', '20px', '16px'] }}
                              transition={{ duration: 2, repeat: Infinity }}
                            />
                            First Name
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              name="firstName"
                              value={formData.firstName}
                              onChange={handleInputChange}
                              onFocus={() => setFocusedField('firstName')}
                              onBlur={handleFieldBlur}
                              required
                              className={`input-field bg-gradient-to-br from-gray-900/80 to-champion-black/80 backdrop-blur-sm transition-all duration-300 pr-10 rounded-xl shadow-inner ${
                                fieldValid.firstName === true
                                  ? 'border-green-500 focus:border-green-400 shadow-green-500/20'
                                  : fieldValid.firstName === false
                                  ? 'border-red-500 focus:border-red-400 shadow-red-500/20'
                                  : 'border-gray-700 focus:border-champion-gold focus:shadow-champion-gold/20'
                              } hover:border-gray-600 focus:shadow-lg`}
                              placeholder="Brandon"
                            />
                            {/* Validation indicator */}
                            <AnimatePresence>
                              {fieldValid.firstName !== undefined && (
                                <motion.div
                                  initial={{ scale: 0, opacity: 0, rotate: -180 }}
                                  animate={{ scale: 1, opacity: 1, rotate: 0 }}
                                  exit={{ scale: 0, opacity: 0, rotate: 180 }}
                                  transition={{ type: "spring", stiffness: 200 }}
                                  className="absolute right-3 top-1/2 -translate-y-1/2"
                                >
                                  {fieldValid.firstName ? (
                                    <motion.div
                                      animate={{ 
                                        scale: [1, 1.2, 1],
                                        filter: [
                                          'drop-shadow(0 0 0px rgba(34, 197, 94, 0))',
                                          'drop-shadow(0 0 8px rgba(34, 197, 94, 0.8))',
                                          'drop-shadow(0 0 4px rgba(34, 197, 94, 0.4))'
                                        ]
                                      }}
                                      transition={{ duration: 0.5 }}
                                    >
                                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                                    </motion.div>
                                  ) : (
                                    <motion.div 
                                      className="w-5 h-5 rounded-full border-2 border-red-500 relative"
                                      animate={{ 
                                        scale: [1, 1.1, 1],
                                        borderColor: ['#ef4444', '#dc2626', '#ef4444']
                                      }}
                                      transition={{ duration: 1, repeat: Infinity }}
                                    >
                                      <motion.div
                                        className="absolute inset-0 rounded-full bg-red-500/20"
                                        animate={{ scale: [0, 1.5], opacity: [1, 0] }}
                                        transition={{ duration: 1, repeat: Infinity }}
                                      />
                                    </motion.div>
                                  )}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                          <AnimatePresence>
                            {focusedField === 'firstName' && (
                              <>
                                <motion.div
                                  initial={{ width: 0, opacity: 0 }}
                                  animate={{ width: '100%', opacity: 1 }}
                                  exit={{ width: 0, opacity: 0 }}
                                  transition={{ duration: 0.3 }}
                                  className="absolute -bottom-0.5 left-0 h-1 bg-gradient-to-r from-champion-gold via-yellow-400 to-champion-gold rounded-full"
                                  style={{
                                    boxShadow: '0 0 20px rgba(212, 175, 55, 0.5), 0 0 40px rgba(212, 175, 55, 0.3)'
                                  }}
                                />
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: [0, 1.5, 1] }}
                                  transition={{ duration: 0.5 }}
                                  className="absolute -bottom-0.5 left-0 w-full h-1 bg-gradient-to-r from-champion-gold/30 via-yellow-400/30 to-champion-gold/30 rounded-full blur-md"
                                />
                              </>
                            )}
                          </AnimatePresence>
                        </motion.div>
                        
                        <motion.div
                          whileFocus={{ scale: 1.02 }}
                          className="relative group"
                        >
                          <label className="block text-sm text-gray-400 mb-2 flex items-center gap-2">
                            <motion.div
                              className="w-1 h-4 bg-gradient-to-b from-champion-gold to-yellow-600 rounded-full"
                              animate={{ height: ['16px', '20px', '16px'] }}
                              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                            />
                            Last Name
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              name="lastName"
                              value={formData.lastName}
                              onChange={handleInputChange}
                              onFocus={() => setFocusedField('lastName')}
                              onBlur={handleFieldBlur}
                              required
                              className={`input-field bg-gradient-to-br from-gray-900/80 to-champion-black/80 backdrop-blur-sm transition-all duration-300 pr-10 rounded-xl shadow-inner ${
                                fieldValid.lastName === true
                                  ? 'border-green-500 focus:border-green-400 shadow-green-500/20'
                                  : fieldValid.lastName === false
                                  ? 'border-red-500 focus:border-red-400 shadow-red-500/20'
                                  : 'border-gray-700 focus:border-champion-gold focus:shadow-champion-gold/20'
                              } hover:border-gray-600 focus:shadow-lg`}
                              placeholder="Hendrickson"
                            />
                            {/* Validation indicator */}
                            <AnimatePresence>
                              {fieldValid.lastName !== undefined && (
                                <motion.div
                                  initial={{ scale: 0, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  exit={{ scale: 0, opacity: 0 }}
                                  className="absolute right-3 top-1/2 -translate-y-1/2"
                                >
                                  {fieldValid.lastName ? (
                                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                                  ) : (
                                    <div className="w-5 h-5 rounded-full border-2 border-red-500" />
                                  )}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                          <AnimatePresence>
                            {focusedField === 'lastName' && (
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: '100%' }}
                                exit={{ width: 0 }}
                                className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-champion-gold to-yellow-400"
                              />
                            )}
                          </AnimatePresence>
                          {fieldErrors.lastName && (
                            <motion.p
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="text-red-500 text-xs mt-1"
                            >
                              {fieldErrors.lastName}
                            </motion.p>
                          )}
                        </motion.div>
                      </div>
                      
                      <motion.div
                        whileFocus={{ scale: 1.02 }}
                        className="relative mt-6"
                      >
                        <label className="block text-sm text-gray-400 mb-2 flex items-center gap-2">
                          <Mail className="w-3 h-3" />
                          Email Address
                        </label>
                        <div className="relative">
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            onFocus={() => setFocusedField('email')}
                            onBlur={handleFieldBlur}
                            required
                            className={`input-field bg-champion-black/50 transition-all duration-300 pr-10 ${
                              fieldValid.email === true
                                ? 'border-green-500 focus:border-green-400'
                                : fieldValid.email === false
                                ? 'border-red-500 focus:border-red-400'
                                : 'border-gray-700 focus:border-champion-gold'
                            }`}
                            placeholder="brandon@example.com"
                          />
                          {/* Validation indicator */}
                          <AnimatePresence>
                            {fieldValid.email !== undefined && (
                              <motion.div
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0, opacity: 0 }}
                                className="absolute right-3 top-1/2 -translate-y-1/2"
                              >
                                {fieldValid.email ? (
                                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                                ) : (
                                  <div className="w-5 h-5 rounded-full border-2 border-red-500" />
                                )}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                        <AnimatePresence>
                          {focusedField === 'email' && (
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: '100%' }}
                              exit={{ width: 0 }}
                              className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-champion-gold to-yellow-400"
                            />
                          )}
                        </AnimatePresence>
                        {fieldErrors.email && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-red-500 text-xs mt-1"
                          >
                            {fieldErrors.email}
                          </motion.p>
                        )}
                      </motion.div>
                    </div>
                  </motion.div>

                  {/* Payment Information */}
                  <motion.div
                    className="relative"
                    style={{
                      rotateX: rotateXSpring,
                      rotateY: rotateYSpring,
                      transformPerspective: 1200,
                    }}
                  >
                    <div className="absolute -inset-1 bg-gradient-to-r from-yellow-500/20 to-champion-gold/20 rounded-2xl blur-lg opacity-50" />
                    <div className="relative bg-gradient-to-br from-gray-900/95 via-champion-charcoal/90 to-gray-900/95 backdrop-blur-xl rounded-2xl p-8 border border-gray-800/50 overflow-hidden">
                      {/* Animated background pattern */}
                      <div className="absolute inset-0 opacity-10">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(212,175,55,0.15)_0%,transparent_50%)]" />
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(212,175,55,0.1)_0%,transparent_50%)]" />
                      </div>
                      
                      <div className="relative flex items-center gap-3 mb-6">
                        <motion.div
                          className="p-3 bg-gradient-to-br from-champion-gold/20 to-yellow-500/10 rounded-xl shadow-lg shadow-champion-gold/20"
                          whileHover={{ scale: 1.1, rotate: -5 }}
                          animate={{ 
                            boxShadow: [
                              '0 10px 25px -5px rgba(212, 175, 55, 0.2)',
                              '0 20px 35px -5px rgba(212, 175, 55, 0.3)',
                              '0 10px 25px -5px rgba(212, 175, 55, 0.2)',
                            ]
                          }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <CreditCard className="w-6 h-6 text-champion-gold" />
                        </motion.div>
                        <h3 className="text-xl font-montserrat font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                          Payment Information
                        </h3>
                        
                        {/* Security badge */}
                        <motion.div
                          className="ml-auto flex items-center gap-2 bg-green-500/10 border border-green-500/30 rounded-full px-3 py-1"
                          animate={{ 
                            borderColor: ['rgba(34, 197, 94, 0.3)', 'rgba(34, 197, 94, 0.5)', 'rgba(34, 197, 94, 0.3)']
                          }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <Shield className="w-3 h-3 text-green-500" />
                          <span className="text-xs text-green-500 font-medium">Secure</span>
                        </motion.div>
                      </div>
                      
                      <div className="space-y-6">
                        <motion.div
                          whileFocus={{ scale: 1.02 }}
                          className="relative group"
                        >
                          <label className="block text-sm text-gray-400 mb-2 flex items-center gap-2">
                            <motion.div
                              className="w-1 h-4 bg-gradient-to-b from-champion-gold to-yellow-600 rounded-full"
                              animate={{ height: ['16px', '20px', '16px'] }}
                              transition={{ duration: 2, repeat: Infinity }}
                            />
                            Card Number
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              name="cardNumber"
                              value={formData.cardNumber}
                              onChange={handleInputChange}
                              onFocus={() => setFocusedField('cardNumber')}
                              onBlur={handleFieldBlur}
                              required
                              className={`input-field bg-gradient-to-br from-gray-900/80 to-champion-black/80 backdrop-blur-sm transition-all duration-300 pr-20 rounded-xl shadow-inner ${
                                fieldValid.cardNumber === true
                                  ? 'border-green-500 focus:border-green-400 shadow-green-500/20'
                                  : fieldValid.cardNumber === false
                                  ? 'border-red-500 focus:border-red-400 shadow-red-500/20'
                                  : 'border-gray-700 focus:border-champion-gold focus:shadow-champion-gold/20'
                              }`}
                              placeholder="1234 5678 9012 3456"
                              maxLength={19}
                            />
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                              <AnimatePresence mode="wait">
                                {cardType === 'visa' && (
                                  <motion.img
                                    src="/Visa_2021.svg"
                                    alt="Visa"
                                    initial={{ scale: 0, rotate: -180, opacity: 0 }}
                                    animate={{ scale: 1, rotate: 0, opacity: 1 }}
                                    exit={{ scale: 0, rotate: 180, opacity: 0 }}
                                    transition={{ type: "spring", damping: 15 }}
                                    className="w-8 h-5 object-contain"
                                  />
                                )}
                                {cardType === 'mastercard' && (
                                  <motion.img
                                    src="/Mastercard_2019_logo.svg"
                                    alt="Mastercard"
                                    initial={{ scale: 0, rotate: -180, opacity: 0 }}
                                    animate={{ scale: 1, rotate: 0, opacity: 1 }}
                                    exit={{ scale: 0, rotate: 180, opacity: 0 }}
                                    transition={{ type: "spring", damping: 15 }}
                                    className="w-8 h-5 object-contain"
                                  />
                                )}
                                {cardType === 'amex' && (
                                  <motion.div
                                    initial={{ scale: 0, rotate: -180, opacity: 0 }}
                                    animate={{ scale: 1, rotate: 0, opacity: 1 }}
                                    exit={{ scale: 0, rotate: 180, opacity: 0 }}
                                    transition={{ type: "spring", damping: 15 }}
                                    className="w-8 h-5"
                                  >
                                    <svg viewBox="0 0 48 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <rect width="48" height="32" rx="4" fill="#2E77BB"/>
                                      <path d="M12 20L10 12H14L15 16L16 12H20L18 20H15L14.5 18L14 20H12Z" fill="white"/>
                                      <path d="M20 20V12H26V14H23V15H26V17H23V18H26V20H20Z" fill="white"/>
                                      <path d="M28 12L30 16L32 12H35L32 16L35 20H32L30 16L28 20H25L28 16L25 12H28Z" fill="white"/>
                                    </svg>
                                  </motion.div>
                                )}
                                {cardType === 'discover' && (
                                  <motion.div
                                    initial={{ scale: 0, rotate: -180, opacity: 0 }}
                                    animate={{ scale: 1, rotate: 0, opacity: 1 }}
                                    exit={{ scale: 0, rotate: 180, opacity: 0 }}
                                    transition={{ type: "spring", damping: 15 }}
                                    className="w-8 h-5"
                                  >
                                    <svg viewBox="0 0 48 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <rect width="48" height="32" rx="4" fill="#F47216"/>
                                      <circle cx="35" cy="16" r="8" fill="#FCFCFC"/>
                                      <path d="M8 12H10C12 12 13 13 13 15C13 17 12 18 10 18H8V12ZM9.5 16.5H10C10.8 16.5 11.5 16 11.5 15C11.5 14 10.8 13.5 10 13.5H9.5V16.5Z" fill="white"/>
                                      <path d="M14 12H15.5V18H14V12Z" fill="white"/>
                                      <path d="M16.5 16C16.5 14.3 17.8 13 19.5 13C20.3 13 21 13.3 21.5 13.8L20.5 14.8C20.2 14.5 19.9 14.3 19.5 14.3C18.7 14.3 18 15 18 16C18 17 18.7 17.7 19.5 17.7C19.9 17.7 20.2 17.5 20.5 17.2L21.5 18.2C21 18.7 20.3 19 19.5 19C17.8 19 16.5 17.7 16.5 16Z" fill="white"/>
                                    </svg>
                                  </motion.div>
                                )}
                                {cardType === 'diners' && (
                                  <motion.div
                                    initial={{ scale: 0, rotate: -180, opacity: 0 }}
                                    animate={{ scale: 1, rotate: 0, opacity: 1 }}
                                    exit={{ scale: 0, rotate: 180, opacity: 0 }}
                                    transition={{ type: "spring", damping: 15 }}
                                    className="w-8 h-5"
                                  >
                                    <svg viewBox="0 0 48 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <rect width="48" height="32" rx="4" fill="#0079BE"/>
                                      <circle cx="19" cy="16" r="7" fill="white"/>
                                      <circle cx="29" cy="16" r="7" fill="white"/>
                                      <circle cx="19" cy="16" r="5" fill="#0079BE"/>
                                      <circle cx="29" cy="16" r="5" fill="#0079BE"/>
                                    </svg>
                                  </motion.div>
                                )}
                                {cardType === 'jcb' && (
                                  <motion.div
                                    initial={{ scale: 0, rotate: -180, opacity: 0 }}
                                    animate={{ scale: 1, rotate: 0, opacity: 1 }}
                                    exit={{ scale: 0, rotate: 180, opacity: 0 }}
                                    transition={{ type: "spring", damping: 15 }}
                                    className="w-8 h-5"
                                  >
                                    <svg viewBox="0 0 48 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <rect width="48" height="32" rx="4" fill="white"/>
                                      <rect x="8" y="8" width="10" height="16" rx="2" fill="#0E4C96"/>
                                      <rect x="19" y="8" width="10" height="16" rx="2" fill="#EE3124"/>
                                      <rect x="30" y="8" width="10" height="16" rx="2" fill="#00A650"/>
                                      <path d="M12 14V18C12 19 12.5 19.5 13.5 19.5C14.5 19.5 15 19 15 18V14H14V18C14 18.3 13.8 18.5 13.5 18.5C13.2 18.5 13 18.3 13 18V14H12Z" fill="white"/>
                                      <path d="M23 14C21.9 14 21 14.9 21 16C21 17.1 21.9 18 23 18H25V19.5H21V20.5H25C26.1 20.5 27 19.6 27 18.5V16C27 14.9 26.1 14 25 14H23Z" fill="white"/>
                                      <path d="M34 14H36C37.1 14 38 14.9 38 16C38 16.6 37.7 17.1 37.3 17.4C37.7 17.7 38 18.2 38 18.8C38 19.9 37.1 20.8 36 20.8H34V14ZM35 17H36C36.6 17 37 16.6 37 16C37 15.4 36.6 15 36 15H35V17ZM35 19.8H36C36.6 19.8 37 19.4 37 18.8C37 18.2 36.6 17.8 36 17.8H35V19.8Z" fill="white"/>
                                    </svg>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                              {!cardType && <CreditCard className="w-5 h-5 text-gray-500" />}
                              {/* Validation indicator */}
                              {fieldValid.cardNumber !== undefined && (
                                <motion.div
                                  initial={{ scale: 0, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  exit={{ scale: 0, opacity: 0 }}
                                  className="ml-2"
                                >
                                  {fieldValid.cardNumber ? (
                                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                                  ) : (
                                    <div className="w-5 h-5 rounded-full border-2 border-red-500" />
                                  )}
                                </motion.div>
                              )}
                            </div>
                          </div>
                          <AnimatePresence>
                            {focusedField === 'cardNumber' && (
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: '100%' }}
                                exit={{ width: 0 }}
                                className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-champion-gold to-yellow-400"
                              />
                            )}
                          </AnimatePresence>
                          {fieldErrors.cardNumber && (
                            <motion.p
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="text-red-500 text-xs mt-1"
                            >
                              {fieldErrors.cardNumber}
                            </motion.p>
                          )}
                        </motion.div>
                        
                        {/* Card Holder Name */}
                        <motion.div
                          whileFocus={{ scale: 1.02 }}
                          className="relative mt-6"
                        >
                          <label className="block text-sm text-gray-400 mb-2 flex items-center gap-2">
                            <User className="w-3 h-3" />
                            Card Holder Name
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              name="cardHolder"
                              value={formData.cardHolder}
                              onChange={handleInputChange}
                              onFocus={() => setFocusedField('cardHolder')}
                              onBlur={handleFieldBlur}
                              required
                              className={`input-field bg-champion-black/50 transition-all duration-300 pr-10 ${
                                fieldValid.cardHolder === true
                                  ? 'border-green-500 focus:border-green-400'
                                  : fieldValid.cardHolder === false
                                  ? 'border-red-500 focus:border-red-400'
                                  : 'border-gray-700 focus:border-champion-gold'
                              }`}
                              placeholder="BRANDON HENDRICKSON"
                              style={{ textTransform: 'uppercase' }}
                            />
                            {/* Validation indicator */}
                            <AnimatePresence>
                              {fieldValid.cardHolder !== undefined && (
                                <motion.div
                                  initial={{ scale: 0, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  exit={{ scale: 0, opacity: 0 }}
                                  className="absolute right-3 top-1/2 -translate-y-1/2"
                                >
                                  {fieldValid.cardHolder ? (
                                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                                  ) : (
                                    <div className="w-5 h-5 rounded-full border-2 border-red-500" />
                                  )}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                          <AnimatePresence>
                            {focusedField === 'cardHolder' && (
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: '100%' }}
                                exit={{ width: 0 }}
                                className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-champion-gold to-yellow-400"
                              />
                            )}
                          </AnimatePresence>
                          {fieldErrors.cardHolder && (
                            <motion.p
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="text-red-500 text-xs mt-1"
                            >
                              {fieldErrors.cardHolder}
                            </motion.p>
                          )}
                        </motion.div>
                        
                        <div className="grid grid-cols-2 gap-6">
                          <motion.div
                            whileFocus={{ scale: 1.02 }}
                            className="relative"
                          >
                            <label className="block text-sm text-gray-400 mb-2 flex items-center gap-2">
                              <Calendar className="w-3 h-3" />
                              Expiry Date
                            </label>
                            <div className="relative">
                              <input
                                type="text"
                                name="expiryDate"
                                value={formData.expiryDate}
                                onChange={handleInputChange}
                                onFocus={() => setFocusedField('expiryDate')}
                                onBlur={handleFieldBlur}
                                required
                                className={`input-field bg-champion-black/50 transition-all duration-300 pr-10 ${
                                  fieldValid.expiryDate === true
                                    ? 'border-green-500 focus:border-green-400'
                                    : fieldValid.expiryDate === false
                                    ? 'border-red-500 focus:border-red-400'
                                    : 'border-gray-700 focus:border-champion-gold'
                                }`}
                                placeholder="MM/YY"
                                maxLength={5}
                              />
                              {/* Validation indicator */}
                              <AnimatePresence>
                                {fieldValid.expiryDate !== undefined && (
                                  <motion.div
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0, opacity: 0 }}
                                    className="absolute right-3 top-1/2 -translate-y-1/2"
                                  >
                                    {fieldValid.expiryDate ? (
                                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                                    ) : (
                                      <div className="w-5 h-5 rounded-full border-2 border-red-500" />
                                    )}
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                            <AnimatePresence>
                              {focusedField === 'expiryDate' && (
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: '100%' }}
                                  exit={{ width: 0 }}
                                  className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-champion-gold to-yellow-400"
                                />
                              )}
                            </AnimatePresence>
{fieldErrors.expiryDate && (
                              <motion.p
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-red-500 text-xs mt-1"
                              >
                                {fieldErrors.expiryDate}
                              </motion.p>
                            )}
                          </motion.div>
                          
                          <motion.div
                            whileFocus={{ scale: 1.02 }}
                            className="relative"
                          >
                            <label className="block text-sm text-gray-400 mb-2 flex items-center gap-2">
                              <Lock className="w-3 h-3" />
                              CVV
                            </label>
                            <div className="relative">
                              <input
                                type="text"
                                name="cvv"
                                value={formData.cvv}
                                onChange={handleInputChange}
                                onFocus={() => setFocusedField('cvv')}
                                onBlur={handleFieldBlur}
                                required
                                className={`input-field bg-champion-black/50 transition-all duration-300 pr-10 ${
                                  fieldValid.cvv === true
                                    ? 'border-green-500 focus:border-green-400'
                                    : fieldValid.cvv === false
                                    ? 'border-red-500 focus:border-red-400'
                                    : 'border-gray-700 focus:border-champion-gold'
                                }`}
                                placeholder="123"
                                maxLength={4}
                              />
                              {/* Validation indicator */}
                              <AnimatePresence>
                                {fieldValid.cvv !== undefined && (
                                  <motion.div
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0, opacity: 0 }}
                                    className="absolute right-3 top-1/2 -translate-y-1/2"
                                  >
                                    {fieldValid.cvv ? (
                                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                                    ) : (
                                      <div className="w-5 h-5 rounded-full border-2 border-red-500" />
                                    )}
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                            <AnimatePresence>
                              {focusedField === 'cvv' && (
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: '100%' }}
                                  exit={{ width: 0 }}
                                  className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-champion-gold to-yellow-400"
                                />
                              )}
                            </AnimatePresence>
{fieldErrors.cvv && (
                              <motion.p
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-red-500 text-xs mt-1"
                              >
                                {fieldErrors.cvv}
                              </motion.p>
                            )}
                          </motion.div>
                        </div>
                        
                        <motion.div
                          whileFocus={{ scale: 1.02 }}
                          className="relative"
                        >
                          <label className="block text-sm text-gray-400 mb-2 flex items-center gap-2">
                            <MapPin className="w-3 h-3" />
                            ZIP Code
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              name="zipCode"
                              value={formData.zipCode}
                              onChange={handleInputChange}
                              onFocus={() => setFocusedField('zipCode')}
                              onBlur={handleFieldBlur}
                              required
                              className={`input-field bg-champion-black/50 transition-all duration-300 pr-10 ${
                                fieldValid.zipCode === true
                                  ? 'border-green-500 focus:border-green-400'
                                  : fieldValid.zipCode === false
                                  ? 'border-red-500 focus:border-red-400'
                                  : 'border-gray-700 focus:border-champion-gold'
                              }`}
                              placeholder="90210"
                              maxLength={10}
                            />
                            {/* Validation indicator */}
                            <AnimatePresence>
                              {fieldValid.zipCode !== undefined && (
                                <motion.div
                                  initial={{ scale: 0, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  exit={{ scale: 0, opacity: 0 }}
                                  className="absolute right-3 top-1/2 -translate-y-1/2"
                                >
                                  {fieldValid.zipCode ? (
                                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                                  ) : (
                                    <div className="w-5 h-5 rounded-full border-2 border-red-500" />
                                  )}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                          <AnimatePresence>
                            {focusedField === 'zipCode' && (
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: '100%' }}
                                exit={{ width: 0 }}
                                className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-champion-gold to-yellow-400"
                              />
                            )}
                          </AnimatePresence>
                          {fieldErrors.zipCode && (
                            <motion.p
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="text-red-500 text-xs mt-1"
                            >
                              {fieldErrors.zipCode}
                            </motion.p>
                          )}
                        </motion.div>
                      </div>

                      {/* Security Features */}
                      <motion.div 
                        className="mt-8 grid grid-cols-4 gap-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                      >
                        {[
                          { icon: Shield, label: 'Secure', color: 'text-green-500' },
                          { icon: Lock, label: 'Encrypted', color: 'text-blue-500' },
                          { icon: Globe, label: 'Global', color: 'text-purple-500' },
                          { icon: Smartphone, label: '3D Secure', color: 'text-orange-500' },
                        ].map((item, index) => (
                          <motion.div
                            key={index}
                            className="text-center"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.6 + index * 0.1, type: "spring" }}
                            whileHover={{ scale: 1.1, y: -5 }}
                          >
                            <div className={`${item.color} mb-1`}>
                              <item.icon className="w-6 h-6 mx-auto" />
                            </div>
                            <p className="text-xs text-gray-500">{item.label}</p>
                          </motion.div>
                        ))}
                      </motion.div>
                    </div>
                  </motion.div>

{/* 3D Card Preview */}
                  <motion.div
                    initial={{ opacity: 0, y: 50, rotateX: -30 }}
                    animate={{ opacity: 1, y: 0, rotateX: 0 }}
                    transition={{ 
                      duration: 0.8, 
                      delay: 0.6,
                      type: "spring",
                      stiffness: 100
                    }}
                    className="mb-8"
                  >
                    <div className="relative h-56 perspective-1000">
                      {/* Glow effect */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-champion-gold/20 to-purple-500/20 blur-3xl"
                        animate={{
                          scale: [1, 1.2, 1],
                          opacity: [0.3, 0.5, 0.3],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      />
                      
                      <motion.div
                        className="absolute inset-0 w-full h-full preserve-3d"
                        animate={{
                          rotateY: focusedField === 'cvv' ? 180 : 0,
                          y: [0, -5, 0]
                        }}
                        transition={{ 
                          rotateY: { duration: 0.6, type: "spring", stiffness: 200 },
                          y: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                        }}
                        style={{
                          transformStyle: 'preserve-3d',
                        }}
                      >
                        {/* Card Front */}
                        <div className="absolute inset-0 w-full h-full backface-hidden">
                          <motion.div className={`
                            relative w-full h-full rounded-2xl p-6 shadow-2xl overflow-hidden
                            bg-gradient-to-br
                            ${cardType === 'visa' ? 'from-blue-600 via-blue-700 to-blue-900' :
                              cardType === 'mastercard' ? 'from-gray-900 via-gray-800 to-black' :
                              cardType === 'amex' ? 'from-green-600 via-green-700 to-teal-800' :
                              cardType === 'discover' ? 'from-orange-500 via-orange-600 to-orange-800' :
                              cardType === 'diners' ? 'from-blue-700 via-blue-800 to-blue-950' :
                              cardType === 'jcb' ? 'from-purple-600 via-purple-700 to-pink-700' :
                              'from-gray-700 via-gray-800 to-gray-900'}
                          `}
                          whileHover={{ scale: 1.02 }}
                          transition={{ type: "spring", stiffness: 300 }}
                          >
                            {/* Shine effect */}
                            <motion.div
                              className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent"
                              initial={{ x: "-100%", y: "-100%" }}
                              animate={{ x: "100%", y: "100%" }}
                              transition={{
                                duration: 3,
                                repeat: Infinity,
                                repeatDelay: 2,
                                ease: "easeInOut"
                              }}
                            />

                            {/* EMV Chip */}
                            <motion.div 
                              className="absolute top-16 left-6"
                              initial={{ opacity: 0, scale: 0 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.8, type: "spring" }}
                            >
                              <div className="w-12 h-10 rounded-md bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 shadow-lg">
                                <div className="w-full h-full rounded-md border border-yellow-600/50 p-1">
                                  <div className="w-full h-full rounded-sm bg-gradient-to-br from-yellow-500 to-yellow-600 grid grid-cols-3 gap-px p-0.5">
                                    {[...Array(9)].map((_, i) => (
                                      <motion.div 
                                        key={i} 
                                        className="bg-yellow-400/80 rounded-[1px]"
                                        animate={{ opacity: [0.6, 1, 0.6] }}
                                        transition={{ 
                                          duration: 2, 
                                          delay: i * 0.1, 
                                          repeat: Infinity 
                                        }}
                                      />
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </motion.div>

                            {/* Contactless Symbol */}
                            <motion.div 
                              className="absolute top-16 right-6"
                              initial={{ opacity: 0, scale: 0 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.9, type: "spring" }}
                            >
                              <div className="relative">
                                {[1, 2, 3, 4].map((i) => (
                                  <motion.div
                                    key={i}
                                    className="absolute inset-0"
                                    animate={{ scale: [1, 1.5], opacity: [0.8, 0] }}
                                    transition={{
                                      duration: 2,
                                      delay: i * 0.3,
                                      repeat: Infinity,
                                      ease: "easeOut"
                                    }}
                                  >
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                      <path
                                        d={`M ${6 + i * 2} 8 Q ${6 + i * 2} 4, ${10 + i * 2} 4 T ${10 + i * 2} 8`}
                                        stroke="white"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        opacity={0.8 - i * 0.2}
                                      />
                                    </svg>
                                  </motion.div>
                                ))}
                              </div>
                            </motion.div>

                            {/* Card Logo */}
                            <motion.div 
                              className="absolute top-6 right-6"
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.7 }}
                            >
                              {cardType === 'visa' ? (
                                <div className="h-8">
                                  <svg viewBox="0 0 1000 324.68" className="h-full w-auto" fill="white" xmlns="http://www.w3.org/2000/svg">
                                    <path d="m651.19.5c-70.93,0-134.32,36.77-134.32,104.69,0,77.9,112.42,83.28,112.42,122.42,0,16.48-18.88,31.23-51.14,31.23-45.77,0-79.98-20.61-79.98-20.61l-14.64,68.55s39.41,17.41,91.73,17.41c77.55,0,138.58-38.57,138.58-107.66,0-82.32-112.89-87.54-112.89-123.86,0-12.91,15.5-27.05,47.66-27.05,36.29,0,65.89,14.99,65.89,14.99l14.33-66.2S696.61.5,651.18.5h0ZM2.22,5.5L.5,15.49s29.84,5.46,56.72,16.36c34.61,12.49,37.07,19.77,42.9,42.35l63.51,244.83h85.14L379.93,5.5h-84.94l-84.28,213.17-34.39-180.7c-3.15-20.68-19.13-32.48-38.68-32.48,0,0-135.41,0-135.41,0Zm411.87,0l-66.63,313.53h81L494.85,5.5h-80.76Zm451.76,0c-19.53,0-29.88,10.46-37.47,28.73l-118.67,284.8h84.94l16.43-47.47h103.48l9.99,47.47h74.95L934.12,5.5h-68.27Zm11.05,84.71l25.18,117.65h-67.45l42.28-117.65h0Z"/>
                                  </svg>
                                </div>
                              ) : cardType === 'mastercard' ? (
                                <img src="/Mastercard_2019_logo.svg" alt="Mastercard" className="h-10 drop-shadow-lg" />
                              ) : cardType && (
                                <div className="w-16 h-10 opacity-90">
                                  {cardType === 'amex' && (
                                    <svg viewBox="0 0 48 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <path d="M12 20L10 12H14L15 16L16 12H20L18 20H15L14.5 18L14 20H12Z" fill="white"/>
                                      <path d="M20 20V12H26V14H23V15H26V17H23V18H26V20H20Z" fill="white"/>
                                      <path d="M28 12L30 16L32 12H35L32 16L35 20H32L30 16L28 20H25L28 16L25 12H28Z" fill="white"/>
                                    </svg>
                                  )}
                                  {cardType === 'discover' && (
                                    <svg viewBox="0 0 48 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <circle cx="35" cy="16" r="8" fill="#FCFCFC"/>
                                      <path d="M8 12H10C12 12 13 13 13 15C13 17 12 18 10 18H8V12ZM9.5 16.5H10C10.8 16.5 11.5 16 11.5 15C11.5 14 10.8 13.5 10 13.5H9.5V16.5Z" fill="white"/>
                                      <path d="M14 12H15.5V18H14V12Z" fill="white"/>
                                      <path d="M16.5 16C16.5 14.3 17.8 13 19.5 13C20.3 13 21 13.3 21.5 13.8L20.5 14.8C20.2 14.5 19.9 14.3 19.5 14.3C18.7 14.3 18 15 18 16C18 17 18.7 17.7 19.5 17.7C19.9 17.7 20.2 17.5 20.5 17.2L21.5 18.2C21 18.7 20.3 19 19.5 19C17.8 19 16.5 17.7 16.5 16Z" fill="white"/>
                                    </svg>
                                  )}
                                  {cardType === 'diners' && (
                                    <svg viewBox="0 0 48 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <circle cx="19" cy="16" r="7" fill="white"/>
                                      <circle cx="29" cy="16" r="7" fill="white"/>
                                      <circle cx="19" cy="16" r="5" fill="#0079BE"/>
                                      <circle cx="29" cy="16" r="5" fill="#0079BE"/>
                                    </svg>
                                  )}
                                  {cardType === 'jcb' && (
                                    <svg viewBox="0 0 48 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <rect x="8" y="8" width="10" height="16" rx="2" fill="#0E4C96"/>
                                      <rect x="19" y="8" width="10" height="16" rx="2" fill="#EE3124"/>
                                      <rect x="30" y="8" width="10" height="16" rx="2" fill="#00A650"/>
                                      <path d="M12 14V18C12 19 12.5 19.5 13.5 19.5C14.5 19.5 15 19 15 18V14H14V18C14 18.3 13.8 18.5 13.5 18.5C13.2 18.5 13 18.3 13 18V14H12Z" fill="white"/>
                                      <path d="M23 14C21.9 14 21 14.9 21 16C21 17.1 21.9 18 23 18H25V19.5H21V20.5H25C26.1 20.5 27 19.6 27 18.5V16C27 14.9 26.1 14 25 14H23Z" fill="white"/>
                                      <path d="M34 14H36C37.1 14 38 14.9 38 16C38 16.6 37.7 17.1 37.3 17.4C37.7 17.7 38 18.2 38 18.8C38 19.9 37.1 20.8 36 20.8H34V14ZM35 17H36C36.6 17 37 16.6 37 16C37 15.4 36.6 15 36 15H35V17ZM35 19.8H36C36.6 19.8 37 19.4 37 18.8C37 18.2 36.6 17.8 36 17.8H35V19.8Z" fill="white"/>
                                    </svg>
                                  )}
                                </div>
                              )}
                            </motion.div>
                            
                            {/* Card Number */}
                            <motion.div 
                              className="absolute bottom-20 left-6 right-6"
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 1 }}
                            >
                              <div className="text-white text-lg font-mono tracking-wider drop-shadow-lg">
                                {formData.cardNumber || '•••• •••• •••• ••••'}
                              </div>
                            </motion.div>
                            
                            {/* Card Holder */}
                            <motion.div 
                              className="absolute bottom-6 left-6"
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 1.1 }}
                            >
                              <div className="text-xs text-white/60 uppercase tracking-wider">Card Holder</div>
                              <div className="text-white font-medium uppercase tracking-wide drop-shadow-lg">
                                {formData.cardHolder || 'YOUR NAME'}
                              </div>
                            </motion.div>
                            
                            {/* Expiry */}
                            <motion.div 
                              className="absolute bottom-6 right-6"
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 1.2 }}
                            >
                              <div className="text-xs text-white/60 uppercase tracking-wider">Expires</div>
                              <div className="text-white font-medium tracking-wide drop-shadow-lg">
                                {formData.expiryDate || 'MM/YY'}
                              </div>
                            </motion.div>

                            {/* Hologram */}
                            <motion.div 
                              className="absolute bottom-6 right-24"
                              initial={{ opacity: 0, scale: 0 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 1.3, type: "spring" }}
                            >
                              <motion.div 
                                className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 via-pink-400 to-blue-400 opacity-70"
                                animate={{
                                  background: [
                                    "linear-gradient(to bottom right, #a78bfa, #f472b6, #60a5fa)",
                                    "linear-gradient(to bottom right, #60a5fa, #a78bfa, #f472b6)",
                                    "linear-gradient(to bottom right, #f472b6, #60a5fa, #a78bfa)",
                                    "linear-gradient(to bottom right, #a78bfa, #f472b6, #60a5fa)",
                                  ]
                                }}
                                transition={{ duration: 3, repeat: Infinity }}
                              />
                            </motion.div>
                          </motion.div>
                        </div>
                        
                        {/* Card Back */}
                        <div 
                          className="absolute inset-0 w-full h-full backface-hidden"
                          style={{ transform: 'rotateY(180deg)' }}
                        >
                          <motion.div className={`
                            relative w-full h-full rounded-2xl shadow-2xl overflow-hidden
                            bg-gradient-to-br
                            ${cardType === 'visa' ? 'from-blue-700 to-blue-900' :
                              cardType === 'mastercard' ? 'from-gray-900 to-black' :
                              cardType === 'amex' ? 'from-green-700 to-teal-800' :
                              cardType === 'discover' ? 'from-orange-600 to-orange-800' :
                              cardType === 'diners' ? 'from-blue-800 to-blue-950' :
                              cardType === 'jcb' ? 'from-purple-700 to-pink-700' :
                              'from-gray-800 to-gray-950'}
                          `}
                          whileHover={{ scale: 1.02 }}
                          transition={{ type: "spring", stiffness: 300 }}
                          >
                            {/* Magnetic Strip */}
                            <motion.div 
                              className="absolute top-8 left-0 right-0 h-12 bg-black"
                              initial={{ scaleX: 0 }}
                              animate={{ scaleX: 1 }}
                              transition={{ delay: 0.2, duration: 0.5 }}
                            />
                            
                            {/* Signature Strip */}
                            <motion.div 
                              className="absolute top-24 left-6 right-6"
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.4 }}
                            >
                              <div className="bg-gray-100 rounded p-3 relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-r from-gray-200 to-gray-100 opacity-50" />
                                <div className="text-right font-mono text-black relative z-10 font-bold">
                                  {formData.cvv || '•••'}
                                </div>
                              </div>
                              <div className="text-xs text-gray-400 mt-1 text-right">CVV</div>
                            </motion.div>

                            {/* Security Features Text */}
                            <motion.div 
                              className="absolute bottom-16 left-6 right-6"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.6 }}
                            >
                              <p className="text-[8px] text-gray-500 leading-tight">
                                This card is property of the issuing bank. If found, please return to any branch.
                                Use of this card is subject to the terms and conditions of the cardholder agreement.
                              </p>
                            </motion.div>

                            {/* Card Logo */}
                            <motion.div 
                              className="absolute bottom-6 right-6"
                              initial={{ opacity: 0, scale: 0 }}
                              animate={{ opacity: 0.7, scale: 1 }}
                              transition={{ delay: 0.8, type: "spring" }}
                            >
                              {cardType === 'visa' ? (
                                <div className="h-8 opacity-70">
                                  <svg viewBox="0 0 1000 324.68" className="h-full w-auto" fill="white" xmlns="http://www.w3.org/2000/svg">
                                    <path d="m651.19.5c-70.93,0-134.32,36.77-134.32,104.69,0,77.9,112.42,83.28,112.42,122.42,0,16.48-18.88,31.23-51.14,31.23-45.77,0-79.98-20.61-79.98-20.61l-14.64,68.55s39.41,17.41,91.73,17.41c77.55,0,138.58-38.57,138.58-107.66,0-82.32-112.89-87.54-112.89-123.86,0-12.91,15.5-27.05,47.66-27.05,36.29,0,65.89,14.99,65.89,14.99l14.33-66.2S696.61.5,651.18.5h0ZM2.22,5.5L.5,15.49s29.84,5.46,56.72,16.36c34.61,12.49,37.07,19.77,42.9,42.35l63.51,244.83h85.14L379.93,5.5h-84.94l-84.28,213.17-34.39-180.7c-3.15-20.68-19.13-32.48-38.68-32.48,0,0-135.41,0-135.41,0Zm411.87,0l-66.63,313.53h81L494.85,5.5h-80.76Zm451.76,0c-19.53,0-29.88,10.46-37.47,28.73l-118.67,284.8h84.94l16.43-47.47h103.48l9.99,47.47h74.95L934.12,5.5h-68.27Zm11.05,84.71l25.18,117.65h-67.45l42.28-117.65h0Z"/>
                                  </svg>
                                </div>
                              ) : cardType === 'mastercard' ? (
                                <img src="/Mastercard_2019_logo.svg" alt="Mastercard" className="h-10 opacity-70" />
                              ) : (
                                <div className="w-12 h-8 bg-gray-700 rounded animate-pulse" />
                              )}
                            </motion.div>

                            {/* Holographic Security Strip */}
                            <motion.div 
                              className="absolute top-0 bottom-0 right-0 w-1 bg-gradient-to-b from-purple-500 via-pink-500 to-blue-500 opacity-50"
                              animate={{
                                background: [
                                  "linear-gradient(to bottom, #a855f7, #ec4899, #3b82f6)",
                                  "linear-gradient(to bottom, #3b82f6, #a855f7, #ec4899)",
                                  "linear-gradient(to bottom, #ec4899, #3b82f6, #a855f7)",
                                  "linear-gradient(to bottom, #a855f7, #ec4899, #3b82f6)",
                                ]
                              }}
                              transition={{ duration: 2, repeat: Infinity }}
                            />
                          </motion.div>
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>
                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    disabled={isProcessing}
                    className="relative w-full overflow-hidden rounded-2xl p-[3px] disabled:opacity-50 disabled:cursor-not-allowed group"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {/* Multiple animated gradient borders */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-champion-gold via-yellow-400 to-champion-gold opacity-100"
                      animate={{
                        backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                      style={{ backgroundSize: '200% 200%' }}
                    />
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-orange-500 via-red-500 to-orange-500 opacity-0 group-hover:opacity-100"
                      animate={{
                        backgroundPosition: ['100% 50%', '0% 50%', '100% 50%'],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                      style={{ backgroundSize: '200% 200%' }}
                    />
                    
                    <div className="relative bg-gradient-to-br from-gray-900 via-champion-black to-gray-900 rounded-2xl px-8 py-6 overflow-hidden">
                      {/* Shine effect */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12"
                        initial={{ x: '-200%' }}
                        animate={{ x: '200%' }}
                        transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                      />
                      
                      <AnimatePresence mode="wait">
                        {!isProcessing && !showSuccess && (
                          <motion.div
                            key="submit"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="relative"
                          >
                            <div className="flex items-center justify-center gap-3 text-xl font-bold">
                              <motion.div
                                animate={{ 
                                  rotate: [0, 360],
                                  scale: [1, 1.2, 1]
                                }}
                                transition={{ duration: 2, repeat: Infinity }}
                              >
                                <TrendingUp className="w-6 h-6 text-champion-gold drop-shadow-[0_0_10px_rgba(212,175,55,0.5)]" />
                              </motion.div>
                              <span className="bg-gradient-to-r from-white via-champion-gold to-white bg-clip-text text-transparent">
                                COMPLETE MY ORDER - $297
                              </span>
                              <motion.div
                                animate={{ x: [0, 5, 0] }}
                                transition={{ duration: 1, repeat: Infinity }}
                              >
                                <ArrowRight className="w-6 h-6 text-champion-gold drop-shadow-[0_0_10px_rgba(212,175,55,0.5)]" />
                              </motion.div>
                            </div>
                            <motion.div 
                              className="text-sm text-gray-400 text-center mt-2"
                              animate={{ opacity: [0.5, 1, 0.5] }}
                              transition={{ duration: 2, repeat: Infinity }}
                            >
                              🔒 Secure checkout • Instant access
                            </motion.div>
                          </motion.div>
                        )}
                        
                        {isProcessing && !showSuccess && (
                          <motion.div
                            key="processing"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="flex flex-col items-center justify-center gap-3"
                          >
                            <div className="flex items-center gap-3 text-xl">
                              <div className="relative">
                                <motion.div
                                  className="w-6 h-6 border-3 border-champion-gold border-t-transparent rounded-full"
                                  animate={{ rotate: 360 }}
                                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                />
                                <motion.div
                                  className="absolute inset-0 w-6 h-6 border-3 border-champion-gold/30 rounded-full"
                                  animate={{ scale: [1, 1.5, 1], opacity: [1, 0, 1] }}
                                  transition={{ duration: 1.5, repeat: Infinity }}
                                />
                              </div>
                              Processing Payment...
                            </div>
                            <motion.div
                              className="flex gap-1"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.5 }}
                            >
                              {['Encrypting', 'Verifying', 'Confirming'].map((text, i) => (
                                <motion.span
                                  key={text}
                                  className="text-xs text-gray-400"
                                  animate={{ opacity: [0.3, 1, 0.3] }}
                                  transition={{
                                    duration: 1.5,
                                    repeat: Infinity,
                                    delay: i * 0.5,
                                  }}
                                >
                                  {text}
                                  {i < 2 && ' •'}
                                </motion.span>
                              ))}
                            </motion.div>
                          </motion.div>
                        )}
                        
                        {showSuccess && (
                          <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex items-center justify-center gap-3 text-xl text-green-500"
                          >
                            <CheckCircle2 className="w-6 h-6" />
                            Payment Successful!
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.button>

                  {/* Trust badges & Social Proof */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="mt-8 space-y-6"
                  >
                    {/* Payment Methods */}
                    <div className="text-center">
                      <p className="text-xs text-gray-500 mb-3 uppercase tracking-wider">Accepted Payment Methods</p>
                      <div className="flex items-center justify-center gap-3">
                        {/* Visa */}
                        <motion.div
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.9, type: "spring" }}
                          className="relative w-16 h-10 bg-white rounded-lg shadow-lg overflow-hidden group p-2"
                          whileHover={{ scale: 1.1, y: -2 }}
                        >
                          <svg viewBox="0 0 1000 324.68" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                            <path fill="#1434cb" d="m651.19.5c-70.93,0-134.32,36.77-134.32,104.69,0,77.9,112.42,83.28,112.42,122.42,0,16.48-18.88,31.23-51.14,31.23-45.77,0-79.98-20.61-79.98-20.61l-14.64,68.55s39.41,17.41,91.73,17.41c77.55,0,138.58-38.57,138.58-107.66,0-82.32-112.89-87.54-112.89-123.86,0-12.91,15.5-27.05,47.66-27.05,36.29,0,65.89,14.99,65.89,14.99l14.33-66.2S696.61.5,651.18.5h0ZM2.22,5.5L.5,15.49s29.84,5.46,56.72,16.36c34.61,12.49,37.07,19.77,42.9,42.35l63.51,244.83h85.14L379.93,5.5h-84.94l-84.28,213.17-34.39-180.7c-3.15-20.68-19.13-32.48-38.68-32.48,0,0-135.41,0-135.41,0Zm411.87,0l-66.63,313.53h81L494.85,5.5h-80.76Zm451.76,0c-19.53,0-29.88,10.46-37.47,28.73l-118.67,284.8h84.94l16.43-47.47h103.48l9.99,47.47h74.95L934.12,5.5h-68.27Zm11.05,84.71l25.18,117.65h-67.45l42.28-117.65h0Z"/>
                          </svg>
                        </motion.div>
                        
                        {/* Mastercard */}
                        <motion.div
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 1.0, type: "spring" }}
                          className="relative w-16 h-10 bg-white rounded-lg shadow-lg overflow-hidden group p-2"
                          whileHover={{ scale: 1.1, y: -2 }}
                        >
                          <svg viewBox="0 0 1000 618" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                            <path fill="#EB001B" d="m308,0a309,309 0 1,0 2,0z"/>
                            <path fill="#F79E1B" d="m690,0a309,309 0 1,0 2,0z"/>
                            <path fill="#FF5F00" d="m500,66a309,309 0 0,0 0,486 309,309 0 0,0 0-486"/>
                          </svg>
                        </motion.div>
                        
                        {/* American Express */}
                        <motion.div
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 1.1, type: "spring" }}
                          className="relative w-16 h-10 bg-white rounded-lg shadow-lg overflow-hidden group p-2"
                          whileHover={{ scale: 1.1, y: -2 }}
                        >
                          <svg viewBox="0 0 48 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                            <rect width="48" height="32" rx="4" fill="#2E77BB"/>
                            <path d="M12 20L10 12H14L15 16L16 12H20L18 20H15L14.5 18L14 20H12Z" fill="white"/>
                            <path d="M20 20V12H26V14H23V15H26V17H23V18H26V20H20Z" fill="white"/>
                            <path d="M28 12L30 16L32 12H35L32 16L35 20H32L30 16L28 20H25L28 16L25 12H28Z" fill="white"/>
                          </svg>
                        </motion.div>
                        
                        {/* Discover */}
                        <motion.div
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 1.2, type: "spring" }}
                          className="relative w-16 h-10 bg-white rounded-lg shadow-lg overflow-hidden group p-2"
                          whileHover={{ scale: 1.1, y: -2 }}
                        >
                          <svg viewBox="0 0 48 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                            <rect width="48" height="32" rx="4" fill="#F47216"/>
                            <circle cx="35" cy="16" r="8" fill="#FCFCFC"/>
                            <path d="M8 12H10C12 12 13 13 13 15C13 17 12 18 10 18H8V12ZM9.5 16.5H10C10.8 16.5 11.5 16 11.5 15C11.5 14 10.8 13.5 10 13.5H9.5V16.5Z" fill="white"/>
                            <path d="M14 12H15.5V18H14V12Z" fill="white"/>
                            <path d="M16.5 16C16.5 14.3 17.8 13 19.5 13C20.3 13 21 13.3 21.5 13.8L20.5 14.8C20.2 14.5 19.9 14.3 19.5 14.3C18.7 14.3 18 15 18 16C18 17 18.7 17.7 19.5 17.7C19.9 17.7 20.2 17.5 20.5 17.2L21.5 18.2C21 18.7 20.3 19 19.5 19C17.8 19 16.5 17.7 16.5 16Z" fill="white"/>
                          </svg>
                        </motion.div>
                      </div>
                    </div>
                    
                    {/* Trust Indicators Grid */}
                    <div className="grid grid-cols-3 gap-4">
                      <motion.div 
                        className="relative text-center p-4 bg-gradient-to-br from-gray-900/80 to-champion-black/80 rounded-xl border border-gray-800 overflow-hidden group"
                        whileHover={{ scale: 1.05, borderColor: 'rgba(34, 197, 94, 0.5)' }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.2 }}
                      >
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-br from-green-500/0 to-green-500/10 opacity-0 group-hover:opacity-100 transition-opacity"
                        />
                        <motion.div
                          animate={{ rotate: [0, 5, -5, 0] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="relative z-10"
                        >
                          <Shield className="w-8 h-8 text-green-500 mx-auto mb-2 drop-shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                        </motion.div>
                        <p className="text-sm font-bold text-green-400">30-Day</p>
                        <p className="text-xs text-gray-500">Money Back</p>
                      </motion.div>
                      
                      <motion.div 
                        className="relative text-center p-4 bg-gradient-to-br from-gray-900/80 to-champion-black/80 rounded-xl border border-gray-800 overflow-hidden group"
                        whileHover={{ scale: 1.05, borderColor: 'rgba(59, 130, 246, 0.5)' }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.3 }}
                      >
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity"
                        />
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="relative z-10"
                        >
                          <Lock className="w-8 h-8 text-blue-500 mx-auto mb-2 drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                        </motion.div>
                        <p className="text-sm font-bold text-blue-400">256-bit</p>
                        <p className="text-xs text-gray-500">SSL Secure</p>
                      </motion.div>
                      
                      <motion.div 
                        className="relative text-center p-4 bg-gradient-to-br from-gray-900/80 to-champion-black/80 rounded-xl border border-gray-800 overflow-hidden group"
                        whileHover={{ scale: 1.05, borderColor: 'rgba(212, 175, 55, 0.5)' }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.4 }}
                      >
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-br from-champion-gold/0 to-champion-gold/10 opacity-0 group-hover:opacity-100 transition-opacity"
                        />
                        <motion.div
                          animate={{ y: [0, -5, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                          className="relative z-10"
                        >
                          <Zap className="w-8 h-8 text-champion-gold mx-auto mb-2 drop-shadow-[0_0_10px_rgba(212,175,55,0.5)]" />
                        </motion.div>
                        <p className="text-sm font-bold text-champion-gold">Instant</p>
                        <p className="text-xs text-gray-500">Access</p>
                      </motion.div>
                    </div>
                    
                    {/* Live Activity Feed */}
                    <motion.div
                      className="relative bg-gradient-to-r from-green-500/10 via-emerald-500/10 to-green-500/10 border border-green-500/20 rounded-xl p-4 overflow-hidden"
                      animate={{
                        borderColor: ['rgba(34, 197, 94, 0.2)', 'rgba(34, 197, 94, 0.4)', 'rgba(34, 197, 94, 0.2)']
                      }}
                      transition={{ duration: 3, repeat: Infinity }}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                    >
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-green-500/0 via-green-500/5 to-green-500/0"
                        animate={{ x: ['-100%', '100%'] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                      />
                      
                      <div className="relative flex items-center justify-center gap-3">
                        <motion.div
                          animate={{ 
                            scale: [1, 1.2, 1],
                            rotate: [0, 180, 360]
                          }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <Users className="w-6 h-6 text-green-500 drop-shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                        </motion.div>
                        <div className="text-center">
                          <p className="text-sm font-bold text-green-400">
                            Join 127+ Elite Athletes
                          </p>
                          <motion.p 
                            className="text-xs text-gray-400"
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            12 joined in the last 2 hours
                          </motion.p>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                </form>
              </motion.div>

              {/* Order Summary */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <div className="sticky top-8">
                  <motion.div
                    className="relative"
                    style={{
                      rotateX: rotateXSpring,
                      rotateY: rotateYSpring,
                      transformPerspective: 1200,
                    }}
>
                      {/* Order Summary Card */}
                      <div className="bg-gradient-to-br from-gray-900/95 via-champion-black/90 to-gray-900/95 rounded-3xl p-8 border border-champion-gold/30 backdrop-blur-xl relative overflow-hidden shadow-2xl shadow-champion-gold/10">
                        {/* Animated background effects */}
                        <div className="absolute inset-0">
                          <div className="absolute inset-0 bg-gradient-to-r from-champion-gold/10 via-transparent to-champion-gold/10 animate-shimmer" />
                          <motion.div
                            className="absolute top-0 right-0 w-32 h-32 bg-champion-gold/20 rounded-full blur-3xl"
                            animate={{
                              scale: [1, 1.2, 1],
                              opacity: [0.3, 0.5, 0.3],
                            }}
                            transition={{ duration: 4, repeat: Infinity }}
                          />
                          <motion.div
                            className="absolute bottom-0 left-0 w-40 h-40 bg-yellow-500/10 rounded-full blur-3xl"
                            animate={{
                              scale: [1, 1.3, 1],
                              opacity: [0.2, 0.4, 0.2],
                            }}
                            transition={{ duration: 5, repeat: Infinity, delay: 1 }}
                          />
                        </div>

                        {/* Header */}
                        <div className="relative z-10">
                          <div className="flex items-center justify-between mb-6">
                            <h3 className="text-2xl font-bold flex items-center gap-3">
                              <motion.div
                                className="p-2 bg-gradient-to-br from-champion-gold/30 to-yellow-500/20 rounded-xl"
                                animate={{ 
                                  rotate: [0, 5, -5, 0],
                                  scale: [1, 1.05, 1],
                                }}
                                transition={{ duration: 3, repeat: Infinity }}
                              >
                                <Trophy className="w-6 h-6 text-champion-gold" />
                              </motion.div>
                              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                                Order Summary
                              </span>
                            </h3>
                            <motion.div
                              className="flex items-center gap-1 bg-green-500/10 border border-green-500/30 rounded-full px-3 py-1"
                              animate={{ 
                                scale: [1, 1.05, 1],
                              }}
                              transition={{ duration: 2, repeat: Infinity }}
                            >
                              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                              <span className="text-xs text-green-500 font-medium">Secure</span>
                            </motion.div>
                          </div>

                          {/* Product Card */}
                          <motion.div
                            className="relative bg-gradient-to-br from-champion-gold/20 via-champion-black/80 to-champion-gold/10 rounded-2xl p-6 mb-6 border border-champion-gold/30 overflow-hidden group"
                            whileHover={{ 
                              scale: 1.02,
                              borderColor: 'rgba(212, 175, 55, 0.5)'
                            }}
                            transition={{ type: "spring", stiffness: 300 }}
                          >
                            {/* Animated shine effect */}
                            <motion.div
                              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12"
                              initial={{ x: '-200%' }}
                              whileHover={{ x: '200%' }}
                              transition={{ duration: 0.8 }}
                            />
                            
                            <div className="relative flex items-start gap-4">
                              <motion.div 
                                className="relative w-16 h-16 bg-gradient-to-br from-champion-gold via-yellow-500 to-champion-gold rounded-xl flex items-center justify-center shadow-lg shadow-champion-gold/30"
                                animate={{
                                  boxShadow: [
                                    '0 10px 25px -5px rgba(212, 175, 55, 0.3)',
                                    '0 20px 35px -5px rgba(212, 175, 55, 0.4)',
                                    '0 10px 25px -5px rgba(212, 175, 55, 0.3)',
                                  ]
                                }}
                                transition={{ duration: 2, repeat: Infinity }}
                              >
                                <Target className="w-8 h-8 text-champion-black" />
                                <motion.div
                                  className="absolute -inset-1 rounded-xl bg-champion-gold/30 blur-md"
                                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                                  transition={{ duration: 2, repeat: Infinity }}
                                />
                              </motion.div>
                              <div className="flex-1">
                                <h4 className="text-lg font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent mb-1">
                                  Elite Transformation Program
                                </h4>
                                <p className="text-gray-400 text-sm mb-2">
                                  12-Week Champion Blueprint
                                </p>
                                <div className="flex items-center gap-2">
                                  <div className="flex -space-x-1">
                                    {[...Array(5)].map((_, i) => (
                                      <motion.div
                                        key={i}
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 0.1 * i, type: "spring" }}
                                      >
                                        <Star className="w-3 h-3 text-champion-gold fill-champion-gold" />
                                      </motion.div>
                                    ))}
                                  </div>
                                  <span className="text-xs text-gray-500">127 athletes enrolled</span>
                                </div>
                              </div>
                            </div>
                          </motion.div>

                          {/* What's Included */}
                          <div className="space-y-3 mb-6">
                            <h5 className="text-sm font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2 mb-4">
                              <motion.div
                                className="w-8 h-px bg-gradient-to-r from-transparent via-champion-gold to-transparent"
                                animate={{ scaleX: [0, 1, 0] }}
                                transition={{ duration: 3, repeat: Infinity }}
                              />
                              What's Included
                              <motion.div
                                className="w-8 h-px bg-gradient-to-r from-transparent via-champion-gold to-transparent"
                                animate={{ scaleX: [0, 1, 0] }}
                                transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
                              />
                            </h5>
                            {[
                              { icon: CheckCircle2, text: "Personalized Training Plan", badge: "CUSTOM", color: "from-green-500/20 to-emerald-500/10" },
                              { icon: Zap, text: "Nutrition Protocol", badge: "ELITE", color: "from-yellow-500/20 to-orange-500/10" },
                              { icon: Star, text: "Weekly Check-ins", badge: "1-ON-1", color: "from-purple-500/20 to-pink-500/10" },
                              { icon: Trophy, text: "Champion Mindset Course", badge: "BONUS", color: "from-champion-gold/20 to-yellow-500/10" },
                              { icon: Shield, text: "Lifetime Updates", badge: "FREE", color: "from-blue-500/20 to-cyan-500/10" }
                            ].map((item, index) => (
                              <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.8 + index * 0.1, type: "spring" }}
                                className={`relative flex items-center justify-between p-3 bg-gradient-to-r ${item.color} rounded-xl border border-champion-gold/10 overflow-hidden group`}
                                whileHover={{ 
                                  scale: 1.02,
                                  borderColor: 'rgba(212, 175, 55, 0.3)'
                                }}
                              >
                                {/* Hover effect */}
                                <motion.div
                                  className="absolute inset-0 bg-gradient-to-r from-champion-gold/0 via-champion-gold/5 to-champion-gold/0"
                                  initial={{ x: '-100%' }}
                                  whileHover={{ x: '100%' }}
                                  transition={{ duration: 0.6 }}
                                />
                                
                                <div className="relative flex items-center gap-3">
                                  <motion.div
                                    whileHover={{ rotate: 360 }}
                                    transition={{ duration: 0.5 }}
                                  >
                                    <item.icon className="w-4 h-4 text-champion-gold drop-shadow-[0_0_8px_rgba(212,175,55,0.5)]" />
                                  </motion.div>
                                  <span className="text-gray-300 text-sm font-medium">{item.text}</span>
                                </div>
                                <motion.span 
                                  className="relative text-xs bg-gradient-to-r from-champion-gold/30 to-yellow-500/20 text-champion-gold px-3 py-1 rounded-full font-bold border border-champion-gold/20"
                                  whileHover={{ scale: 1.1 }}
                                >
                                  {item.badge}
                                </motion.span>
                              </motion.div>
                            ))}
                          </div>

                          {/* Pricing Breakdown */}
                          <div className="relative space-y-3 mb-6 p-6 bg-gradient-to-br from-gray-900/80 to-champion-black/80 rounded-2xl border border-champion-gold/20 overflow-hidden">
                            {/* Animated background */}
                            <motion.div
                              className="absolute inset-0 bg-gradient-to-br from-champion-gold/5 via-transparent to-champion-gold/5"
                              animate={{
                                opacity: [0, 0.5, 0],
                              }}
                              transition={{ duration: 3, repeat: Infinity }}
                            />
                            
                            <div className="relative space-y-4">
                              <div className="flex justify-between items-center">
                                <span className="text-gray-400 flex items-center gap-2">
                                  <div className="w-2 h-2 bg-gray-600 rounded-full" />
                                  Regular Price
                                </span>
                                <motion.span 
                                  className="text-gray-500 line-through text-lg"
                                  initial={{ opacity: 0.5 }}
                                  animate={{ opacity: [0.5, 1, 0.5] }}
                                  transition={{ duration: 2, repeat: Infinity }}
                                >
                                  $497
                                </motion.span>
                              </div>
                              
                              <motion.div 
                                className="flex justify-between items-center p-3 bg-gradient-to-r from-red-500/10 to-orange-500/10 rounded-xl border border-red-500/20"
                                animate={{
                                  borderColor: ['rgba(239, 68, 68, 0.2)', 'rgba(239, 68, 68, 0.4)', 'rgba(239, 68, 68, 0.2)']
                                }}
                                transition={{ duration: 2, repeat: Infinity }}
                              >
                                <span className="text-orange-400 font-medium flex items-center gap-2">
                                  <motion.div
                                    animate={{ rotate: [0, -10, 10, 0] }}
                                    transition={{ duration: 1, repeat: Infinity }}
                                  >
                                    <Zap className="w-4 h-4" />
                                  </motion.div>
                                  Limited Time Discount
                                </span>
                                <motion.span 
                                  className="text-2xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent whitespace-nowrap"
                                  animate={{ 
                                    scale: [1, 1.1, 1],
                                    filter: [
                                      'drop-shadow(0 0 0px rgba(239, 68, 68, 0))',
                                      'drop-shadow(0 0 10px rgba(239, 68, 68, 0.5))',
                                      'drop-shadow(0 0 0px rgba(239, 68, 68, 0))'
                                    ]
                                  }}
                                  transition={{ duration: 1.5, repeat: Infinity }}
                                >
                                  −$200
                                </motion.span>
                              </motion.div>
                              
                              <motion.div 
                                className="h-px bg-gradient-to-r from-transparent via-champion-gold/50 to-transparent"
                                animate={{ scaleX: [0, 1, 0] }}
                                transition={{ duration: 3, repeat: Infinity }}
                              />
                              
                              <div className="flex justify-between items-center p-4 bg-gradient-to-r from-champion-gold/10 to-yellow-500/10 rounded-xl border border-champion-gold/30">
                                <span className="text-white font-bold text-lg flex items-center gap-2">
                                  <motion.div
                                    className="w-2 h-2 bg-champion-gold rounded-full"
                                    animate={{ scale: [1, 1.5, 1] }}
                                    transition={{ duration: 1, repeat: Infinity }}
                                  />
                                  Total Today
                                </span>
                                <div className="text-right">
                                  <motion.div 
                                    className="text-4xl font-bold bg-gradient-to-r from-champion-gold via-yellow-400 to-champion-gold bg-clip-text text-transparent"
                                    animate={{ 
                                      scale: [1, 1.05, 1],
                                      filter: [
                                        'drop-shadow(0 0 20px rgba(212, 175, 55, 0.3))',
                                        'drop-shadow(0 0 30px rgba(212, 175, 55, 0.5))',
                                        'drop-shadow(0 0 20px rgba(212, 175, 55, 0.3))'
                                      ]
                                    }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                  >
                                    $297
                                  </motion.div>
                                  <motion.span 
                                    className="text-xs text-gray-400"
                                    animate={{ opacity: [0.5, 1, 0.5] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                  >
                                    One-time payment
                                  </motion.span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Urgency Elements */}
                          <div className="space-y-3">
                            <motion.div
                              className="relative bg-gradient-to-r from-red-500/10 via-orange-500/10 to-red-500/10 border border-red-500/30 rounded-xl p-4 overflow-hidden"
                              animate={{ 
                                borderColor: ["rgba(239, 68, 68, 0.3)", "rgba(239, 68, 68, 0.5)", "rgba(239, 68, 68, 0.3)"]
                              }}
                              transition={{ duration: 2, repeat: Infinity }}
                            >
                              {/* Animated background pulse */}
                              <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-red-500/0 via-red-500/10 to-red-500/0"
                                animate={{
                                  x: ['-100%', '100%'],
                                }}
                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                              />
                              
                              <div className="relative flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <motion.div
                                    animate={{ 
                                      rotate: [0, 360],
                                      scale: [1, 1.2, 1]
                                    }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                  >
                                    <Sparkles className="w-5 h-5 text-red-400 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
                                  </motion.div>
                                  <span className="text-sm text-red-400 font-bold">
                                    Only 3 spots remaining at this price
                                  </span>
                                </div>
                                <motion.div
                                  className="flex items-center gap-1"
                                  animate={{ scale: [1, 1.1, 1] }}
                                  transition={{ duration: 1, repeat: Infinity }}
                                >
                                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                                  <span className="text-xs text-red-500 font-medium">LIVE</span>
                                </motion.div>
                              </div>
                            </motion.div>

                            <motion.div 
                              className="relative bg-gradient-to-r from-champion-gold/10 via-yellow-500/10 to-champion-gold/10 border border-champion-gold/30 rounded-xl p-4 overflow-hidden group"
                              whileHover={{ scale: 1.02 }}
                            >
                              {/* Shine effect on hover */}
                              <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12"
                                initial={{ x: '-200%' }}
                                whileHover={{ x: '200%' }}
                                transition={{ duration: 0.8 }}
                              />
                              
                              <div className="relative flex items-center gap-3">
                                <motion.div
                                  className="p-2 bg-champion-gold/20 rounded-lg"
                                  animate={{ 
                                    y: [0, -5, 0],
                                    rotate: [0, 5, -5, 0]
                                  }}
                                  transition={{ duration: 2, repeat: Infinity }}
                                >
                                  <Rocket className="w-5 h-5 text-champion-gold" />
                                </motion.div>
                                <div className="flex-1">
                                  <span className="text-sm text-champion-gold font-bold block">
                                    Instant access after payment
                                  </span>
                                  <span className="text-xs text-gray-400">
                                    Start your transformation immediately
                                  </span>
                                </div>
                              </div>
                            </motion.div>

                            <motion.div 
                              className="relative bg-gradient-to-r from-green-500/10 via-emerald-500/10 to-green-500/10 border border-green-500/30 rounded-xl p-4 overflow-hidden"
                              whileHover={{ scale: 1.02 }}
                              animate={{
                                borderColor: ['rgba(34, 197, 94, 0.3)', 'rgba(34, 197, 94, 0.5)', 'rgba(34, 197, 94, 0.3)']
                              }}
                              transition={{ duration: 3, repeat: Infinity }}
                            >
                              {/* Animated checkmark background */}
                              <motion.div
                                className="absolute right-0 top-0 opacity-10"
                                animate={{ 
                                  rotate: [0, 360],
                                  scale: [1, 1.2, 1]
                                }}
                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                              >
                                <ShieldCheck className="w-20 h-20 text-green-500" />
                              </motion.div>
                              
                              <div className="relative flex items-center gap-3">
                                <motion.div
                                  className="p-2 bg-green-500/20 rounded-lg"
                                  animate={{ 
                                    scale: [1, 1.1, 1],
                                  }}
                                  transition={{ duration: 2, repeat: Infinity }}
                                >
                                  <ShieldCheck className="w-5 h-5 text-green-400 drop-shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                                </motion.div>
                                <div>
                                  <span className="text-sm text-green-400 font-bold block">
                                    30-day money-back guarantee
                                  </span>
                                  <span className="text-xs text-gray-400">
                                    100% risk-free investment
                                  </span>
                                </div>
                              </div>
                            </motion.div>
                          </div>

                          {/* Security Badge */}
                          <div className="mt-6 pt-6 border-t border-champion-gold/10">
                            <div className="flex items-center justify-center gap-3 text-gray-400">
                              <Lock className="w-4 h-4" />
                              <span className="text-xs">Secured by 256-bit SSL encryption</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>

      {/* Floating Security Badge */}
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, type: "spring", damping: 20 }}
        className="fixed bottom-8 right-8 z-40"
      >
        <motion.div
          className="bg-gradient-to-br from-green-900/90 to-green-950/90 backdrop-blur-xl rounded-2xl p-4 border border-green-500/30 shadow-2xl"
          whileHover={{ scale: 1.05 }}
          animate={{
            boxShadow: [
              '0 0 20px rgba(34, 197, 94, 0.3)',
              '0 0 40px rgba(34, 197, 94, 0.5)',
              '0 0 20px rgba(34, 197, 94, 0.3)',
            ]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="flex items-center gap-3">
            <div className="relative">
              <Shield className="w-8 h-8 text-green-400" />
              <motion.div
                className="absolute -inset-1 rounded-full bg-green-500/20"
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
            <div>
              <div className="text-sm font-bold text-green-400">Secure Checkout</div>
              <div className="text-xs text-green-300/70">SSL Protected</div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              className="bg-gradient-to-br from-champion-gold/20 via-champion-black to-champion-gold/10 rounded-2xl p-8 max-w-md w-full border border-champion-gold/30 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-champion-gold/10 via-transparent to-champion-gold/10 animate-shimmer" />
              
              <div className="relative z-10 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", damping: 15 }}
                  className="w-20 h-20 bg-gradient-to-br from-champion-gold to-champion-gold/50 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <Check className="w-10 h-10 text-champion-black" />
                </motion.div>
                
                <h3 className="text-3xl font-bold text-white mb-4">
                  Welcome to the Elite!
                </h3>
                
                <p className="text-gray-300 mb-8">
                  Your transformation journey begins now. Check your email for instant access.
                </p>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.push('/thank-you')}
                  className="bg-gradient-to-r from-champion-gold to-champion-gold/80 text-champion-black font-bold py-4 px-8 rounded-xl hover:shadow-2xl hover:shadow-champion-gold/30 transition-all duration-300 flex items-center gap-2 mx-auto"
                >
                  Access Your Program
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}