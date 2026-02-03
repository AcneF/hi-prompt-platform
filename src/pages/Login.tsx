import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'

const Login: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { signIn } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !password) {
      toast.error('请填写所有字段')
      return
    }

    setLoading(true)
    try {
      const { error } = await signIn(email, password)
      if (error) {
        toast.error('登录失败：' + error.message)
      } else {
        toast.success('登录成功！')
        navigate('/')
      }
    } catch (error) {
      toast.error('登录失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-secondary">
      <div className="editorial-grid py-16">
        {/* Left Column - Visual Content */}
        <div className="col-span-1">
          <div className="sticky top-24">
            <div className="space-y-8">
              <div>
                <h2 className="font-display text-3xl font-semibold text-primary mb-4 accent-line">
                  Welcome Back
                </h2>
                <p className="font-body text-neutral leading-relaxed">
                  Continue your journey in the world of AI prompt crafting. 
                  Your creative workspace awaits.
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-accent flex items-center justify-center">
                    <span className="text-white font-ui text-sm font-semibold">1</span>
                  </div>
                  <p className="font-ui text-sm text-neutral">Access your personal prompt library</p>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-supporting flex items-center justify-center">
                    <span className="text-white font-ui text-sm font-semibold">2</span>
                  </div>
                  <p className="font-ui text-sm text-neutral">Connect with the community</p>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary flex items-center justify-center">
                    <span className="text-secondary font-ui text-sm font-semibold">3</span>
                  </div>
                  <p className="font-ui text-sm text-neutral">Share your creative prompts</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Login Form */}
        <div className="col-span-2">
          <div className="max-w-md mx-auto">
            <div className="magazine-card p-8">
              <div className="mb-8">
                <h1 className="font-display text-2xl font-semibold text-primary mb-2">
                  Sign In
                </h1>
                <p className="font-ui text-sm text-neutral">
                  Enter your credentials to access your account
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
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
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="editorial-button w-full flex items-center justify-center space-x-2"
                >
                  <span>{loading ? 'Signing In...' : 'Sign In'}</span>
                  {!loading && <ArrowRight className="w-4 h-4" />}
                </button>
              </form>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="font-ui text-sm text-neutral text-center">
                  Don't have an account?{' '}
                  <Link 
                    to="/register" 
                    className="text-accent hover:text-primary transition-colors font-medium"
                  >
                    Create one here
                  </Link>
                </p>
              </div>
            </div>

            {/* Additional Info */}
            <div className="mt-8 text-center">
              <p className="font-ui text-xs text-neutral uppercase tracking-wide mb-4">
                Trusted by Creative Professionals
              </p>
              <div className="flex justify-center space-x-8 opacity-60">
                <div className="text-center">
                  <div className="font-display text-lg font-semibold text-primary">500+</div>
                  <div className="font-ui text-xs text-neutral">Active Users</div>
                </div>
                <div className="text-center">
                  <div className="font-display text-lg font-semibold text-primary">2K+</div>
                  <div className="font-ui text-xs text-neutral">Prompts Shared</div>
                </div>
                <div className="text-center">
                  <div className="font-display text-lg font-semibold text-primary">50+</div>
                  <div className="font-ui text-xs text-neutral">Categories</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login