import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Mail, Lock, User, ArrowRight, Eye, EyeOff, Check } from 'lucide-react'
import toast from 'react-hot-toast'

const Register: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { signUp } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !password || !confirmPassword || !fullName) {
      toast.error('请填写所有字段')
      return
    }

    if (password !== confirmPassword) {
      toast.error('密码确认不匹配')
      return
    }

    if (password.length < 6) {
      toast.error('密码至少需要6个字符')
      return
    }

    setLoading(true)
    try {
      const { error } = await signUp(email, password, fullName)
      if (error) {
        toast.error('注册失败：' + error.message)
      } else {
        toast.success('注册成功！请查看邮箱验证链接')
        navigate('/login')
      }
    } catch (error) {
      toast.error('注册失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  const passwordRequirements = [
    { text: 'At least 6 characters', met: password.length >= 6 },
    { text: 'Contains letters', met: /[a-zA-Z]/.test(password) },
    { text: 'Passwords match', met: password === confirmPassword && password.length > 0 },
  ]

  return (
    <div className="min-h-screen bg-secondary">
      <div className="editorial-grid py-16">
        {/* Left Column - Visual Content */}
        <div className="col-span-1">
          <div className="sticky top-24">
            <div className="space-y-8">
              <div>
                <h2 className="font-display text-3xl font-semibold text-primary mb-4 accent-line">
                  Join the Community
                </h2>
                <p className="font-body text-neutral leading-relaxed">
                  Become part of a creative community dedicated to crafting 
                  and sharing exceptional AI prompts.
                </p>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-accent flex items-center justify-center mt-1">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-ui font-semibold text-primary mb-1">Personal Library</h3>
                    <p className="font-ui text-sm text-neutral">
                      Organize and manage your prompt collection with powerful tools
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-supporting flex items-center justify-center mt-1">
                    <ArrowRight className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-ui font-semibold text-primary mb-1">Share & Discover</h3>
                    <p className="font-ui text-sm text-neutral">
                      Connect with other creators and discover new prompt techniques
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary flex items-center justify-center mt-1">
                    <Check className="w-6 h-6 text-secondary" />
                  </div>
                  <div>
                    <h3 className="font-ui font-semibold text-primary mb-1">Quality Focused</h3>
                    <p className="font-ui text-sm text-neutral">
                      Curated content with community-driven quality standards
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Registration Form */}
        <div className="col-span-2">
          <div className="max-w-md mx-auto">
            <div className="magazine-card p-8">
              <div className="mb-8">
                <h1 className="font-display text-2xl font-semibold text-primary mb-2">
                  Create Account
                </h1>
                <p className="font-ui text-sm text-neutral">
                  Start your journey as a prompt craftsperson
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral" />
                    <input
                      type="text"
                      placeholder="Full name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="editorial-input w-full pl-10"
                      required
                    />
                  </div>

                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral" />
                    <input
                      type="email"
                      placeholder="Email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="editorial-input w-full pl-10"
                      required
                    />
                  </div>

                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="editorial-input w-full pl-10 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral hover:text-primary transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>

                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="editorial-input w-full pl-10 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral hover:text-primary transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Password Requirements */}
                {password && (
                  <div className="space-y-2">
                    <p className="font-ui text-xs text-neutral uppercase tracking-wide">
                      Password Requirements
                    </p>
                    {passwordRequirements.map((req, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className={`w-4 h-4 flex items-center justify-center ${
                          req.met ? 'bg-supporting' : 'bg-gray-200'
                        }`}>
                          {req.met && <Check className="w-3 h-3 text-white" />}
                        </div>
                        <span className={`font-ui text-xs ${
                          req.met ? 'text-supporting' : 'text-neutral'
                        }`}>
                          {req.text}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="editorial-button w-full flex items-center justify-center space-x-2"
                >
                  <span>{loading ? 'Creating Account...' : 'Create Account'}</span>
                  {!loading && <ArrowRight className="w-4 h-4" />}
                </button>
              </form>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="font-ui text-sm text-neutral text-center">
                  Already have an account?{' '}
                  <Link 
                    to="/login" 
                    className="text-accent hover:text-primary transition-colors font-medium"
                  >
                    Sign in here
                  </Link>
                </p>
              </div>
            </div>

            {/* Terms */}
            <div className="mt-6 text-center">
              <p className="font-ui text-xs text-neutral">
                By creating an account, you agree to our{' '}
                <a href="#" className="text-accent hover:text-primary transition-colors">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-accent hover:text-primary transition-colors">
                  Privacy Policy
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register