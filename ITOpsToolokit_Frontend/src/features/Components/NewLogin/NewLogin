import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  CpuChipIcon, 
  EyeIcon, 
  EyeSlashIcon,
  UserIcon,
  LockClosedIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    userId: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [showCinematicTransition, setShowCinematicTransition] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // setIsLoading(true);
    
    const result = await login(formData.userId, formData.password);
    
    if (result.success) {
    // if (true) {

      setLoginSuccess(true);
      setIsLoading(false);
      
      // Start Netflix "Tudum" transition immediately after success
      setTimeout(() => {
        setShowCinematicTransition(true);
      }, 600);
      
      // Navigate after "Tudum" animation completes (2.5s total)
      setTimeout(() => {
        navigate('/dashboard');
      }, 3100);
    } else {
      setIsLoading(false);
    }
  };

  // Animated background circuit lines
  const CircuitBackground = () => {
    return (
      <div className="absolute inset-0 overflow-hidden">
        {/* Neural mesh pattern */}
        <div className="absolute inset-0 neural-bg opacity-20"></div>
        
        {/* Floating circuit lines */}
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="circuitGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{stopColor: '#00d4ff', stopOpacity: 0.3}} />
              <stop offset="50%" style={{stopColor: '#8b5cf6', stopOpacity: 0.2}} />
              <stop offset="100%" style={{stopColor: '#f472b6', stopOpacity: 0.3}} />
            </linearGradient>
          </defs>
          
          {/* Animated circuit paths */}
          {[...Array(8)].map((_, i) => (
            <motion.path
              key={i}
              d={`M${Math.random() * 100},${Math.random() * 100} Q${Math.random() * 100},${Math.random() * 100} ${Math.random() * 100},${Math.random() * 100}`}
              stroke="url(#circuitGradient)"
              strokeWidth="1"
              fill="none"
              pathLength="1"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{
                duration: 2 + Math.random() * 3,
                repeat: Infinity,
                repeatType: "loop",
                delay: Math.random() * 2,
              }}
            />
          ))}
        </svg>
        
        {/* Glowing particles */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-neon-blue rounded-full"
            animate={{
              x: [0, Math.random() * 200 - 100],
              y: [0, Math.random() * 200 - 100],
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
        
        {/* Gradient orbs */}
        <div className="absolute top-20 left-20 w-40 h-40 bg-gradient-to-r from-neon-blue/10 to-transparent rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-20 right-20 w-32 h-32 bg-gradient-to-r from-neon-purple/10 to-transparent rounded-full blur-3xl animate-pulse-slow" style={{animationDelay: '1s'}}></div>
      </div>
    );
  };

  return (
    <motion.div 
      animate={loginSuccess ? 
        { scale: 1.02, filter: "brightness(1.1)" } : 
        { scale: 1, filter: "brightness(1)" }
      }
      transition={{ duration: 0.8 }}
      className="min-h-screen bg-gradient-to-br from-light-900 via-light-800 to-light-900 flex items-center justify-center relative overflow-hidden"
    >
      <CircuitBackground />
      
      {/* Navigation */}
      <motion.nav 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="absolute top-0 left-0 right-0 z-50 p-6"
      >
        <div className="max-w-full mx-auto flex justify-between items-center px-4">
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-8 h-8">
              {/* <img 
                src="/cognizant-logo.png" 
                alt="  Logo" 
                className="w-full h-full object-contain"
              /> */}
            </div>
            <span className="text-sm sm:text-base md:text-lg font-bold break-words">
              <span className="text-white font-black">  Autonomous IT Operations Toolkit</span>
            </span>
          </Link>
        </div>
      </motion.nav>

      {/* Login Form */}
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={loginSuccess ? 
          { opacity: 0, y: -50, scale: 1.1 } : 
          { opacity: 1, y: 0, scale: 1 }
        }
        transition={{ duration: loginSuccess ? 0.8 : 0.8 }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        {/* Glassmorphism container */}
        <div className="glass-card p-8 relative">
          {/* Neon border effect */}
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-neon-blue/20 via-neon-purple/20 to-neon-pink/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
          
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="w-20 h-20 bg-gradient-to-br from-royal-500 to-royal-700 rounded-full flex items-center justify-center mx-auto mb-6 neon-glow"
            >
              <UserIcon className="w-10 h-10 text-white" />
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-center break-words"
            >
              <span className="gradient-text font-black bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink bg-clip-text text-transparent">Welcome Back</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-white"
            >
              Sign in to access your AI dashboard
            </motion.p>
          </div>

          {/* Login Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            {/* User ID Field */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                User ID
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="userId"
                  value={formData.userId}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:border-neon-blue/50 focus:bg-white/10 transition-all duration-300 backdrop-blur-sm"
                  placeholder="Enter your user ID"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <LockClosedIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-12 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:border-neon-blue/50 focus:bg-white/10 transition-all duration-300 backdrop-blur-sm"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 bg-gradient-to-r from-royal-600 to-royal-700 hover:from-royal-500 hover:to-royal-600 rounded-lg font-semibold text-white transition-all duration-300 flex items-center justify-center space-x-2 neon-glow disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRightIcon className="w-5 h-5" />
                </>
              )}
            </motion.button>
          </motion.form>

          {/* Footer Links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-8 text-center space-y-4"
          >
            <div className="flex justify-center space-x-6 text-sm">
              <button className="text-gray-400 hover:text-neon-blue transition-colors">
                Forgot Password?
              </button>
              <button className="text-gray-400 hover:text-neon-purple transition-colors">
                Create Account
              </button>
            </div>
            
            <div className="pt-4 border-t border-white/10">
              <Link 
                to="/"
                className="text-gray-400 hover:text-white transition-colors text-sm"
              >
                ← Back to Homepage
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Success Overlay */}
        {loginSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-emerald-600/20 backdrop-blur-sm rounded-xl flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, duration: 0.5, type: "spring", stiffness: 200 }}
                className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl"
              >
                <motion.svg
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="w-8 h-8 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </motion.svg>
              </motion.div>
              <motion.h3
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.4 }}
                className="text-xl font-semibold text-white mb-2"
              >
                Login Successful!
              </motion.h3>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.4 }}
                className="text-white mb-6"
              >
                Preparing your platform...
              </motion.p>

              {/* Platform Loading Animation */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.4 }}
                className="space-y-3"
              >
                {/* Loading Steps */}
                {[
                  { icon: "🤖", text: "Initializing AI Modules", delay: 0.9 },
                  { icon: "⚡", text: "Loading DevOps Tools", delay: 1.0 },
                  { icon: "📊", text: "Preparing Analytics", delay: 1.1 },
                  { icon: "🔒", text: "Securing Dashboard", delay: 1.2 }
                ].map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: step.delay, duration: 0.3 }}
                    className="flex items-center justify-center space-x-3 text-sm"
                  >
                    <span className="text-lg">{step.icon}</span>
                    <span className="text-white">{step.text}</span>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: step.delay + 0.2, duration: 0.2 }}
                      className="w-2 h-2 bg-green-400 rounded-full"
                    />
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </motion.div>
        )}

        {/* Netflix "Tudum" Inspired Transition */}
        {showCinematicTransition && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] overflow-hidden pointer-events-none"
          >
            {/* Dark Full-Screen Background */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 bg-black"
            />
            
            {/* Netflix-style Logo Animation */}
            <div className="absolute inset-0 flex items-center justify-center">
              {/* Glowing Background Effect */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ 
                  scale: [0, 2, 1.5],
                  opacity: [0, 0.3, 0.6, 0.3]
                }}
                transition={{ 
                  duration: 1.2,
                  delay: 0.3,
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
                className="absolute w-80 h-80 bg-gradient-to-r from-red-500/40 to-red-600/40 rounded-full blur-3xl"
              />
              
              {/* Main Logo with "Tudum" Effect */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ 
                  scale: [0, 0.3, 1.2, 1],
                  opacity: [0, 0.5, 1, 1]
                }}
                transition={{ 
                  duration: 1,
                  delay: 0.4,
                  ease: [0.34, 1.56, 0.64, 1], // Bouncy spring effect
                  times: [0, 0.3, 0.8, 1]
                }}
                className="relative"
              >
                {/* Red Glow Effect */}
                <motion.div
                  animate={{ 
                    scale: [1, 1.1, 1],
                    opacity: [0.7, 1, 0.7]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-600 rounded-full blur-xl opacity-70"
                />
                
                {/* Logo Container */}
                <div className="relative w-32 h-32 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center shadow-2xl border-4 border-red-400/50">
                  {/* App Logo */}
                  <CpuChipIcon className="w-16 h-16 text-white drop-shadow-lg" />
                  
                  {/* Additional Glow Rings */}
                  <motion.div
                    initial={{ scale: 1, opacity: 0 }}
                    animate={{ 
                      scale: [1, 1.5, 2],
                      opacity: [0, 0.5, 0]
                    }}
                    transition={{ 
                      duration: 1.5,
                      delay: 0.6,
                      ease: "easeOut"
                    }}
                    className="absolute inset-0 border-2 border-red-400 rounded-full"
                  />
                  <motion.div
                    initial={{ scale: 1, opacity: 0 }}
                    animate={{ 
                      scale: [1, 1.8, 2.5],
                      opacity: [0, 0.3, 0]
                    }}
                    transition={{ 
                      duration: 1.8,
                      delay: 0.8,
                      ease: "easeOut"
                    }}
                    className="absolute inset-0 border border-red-300 rounded-full"
                  />
                </div>
              </motion.div>
              
              {/* Optional Brand Text (appears briefly) */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: [0, 1, 1, 0], y: [50, 0, 0, -20] }}
                transition={{ 
                  duration: 2,
                  delay: 1.2,
                  times: [0, 0.3, 0.7, 1]
                }}
                className="absolute top-3/4 text-center"
              >
                <p className="text-red-400 text-sm font-medium tracking-widest mt-1">
                  AUTONOMOUS IT OPERATIONS
                </p>
              </motion.div>
            </div>
            
            {/* Sound Wave Effect (Visual representation) */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ 
                duration: 1,
                delay: 0.5,
                ease: "easeInOut"
              }}
              className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
            >
              <div className="flex items-end space-x-1">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ height: 4 }}
                    animate={{ height: [4, 20, 4] }}
                    transition={{ 
                      duration: 0.8,
                      delay: 0.5 + (i * 0.1),
                      repeat: 2,
                      ease: "easeInOut"
                    }}
                    className="w-1 bg-red-500 rounded-full"
                  />
                ))}
              </div>
            </motion.div>
            
            {/* Fade Out Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2, duration: 0.5 }}
              className="absolute inset-0 bg-gradient-to-br from-light-900 via-light-800 to-light-900"
            />
          </motion.div>
        )}

        {/* Floating elements */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-4 -right-4 w-8 h-8 border-2 border-neon-blue/30 rounded-full"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-4 -left-4 w-6 h-6 border-2 border-neon-purple/30 rounded-full"
        />
      </motion.div>
    </motion.div>
  );
};

export default LoginPage; 