import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { PenTool, User, LogOut, Home, Plus } from 'lucide-react'
import toast from 'react-hot-toast'

const Navbar: React.FC = () => {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    const { error } = await signOut()
    if (error) {
      toast.error('退出登录失败')
    } else {
      toast.success('已退出登录')
      navigate('/')
    }
  }

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="editorial-grid py-4">
        {/* Logo Section - Left Column */}
        <div className="flex items-center">
          <Link to="/" className="group">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary flex items-center justify-center">
                <PenTool className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <h1 className="font-display text-xl font-semibold text-primary group-hover:text-accent transition-colors">
                  Hi Prompt
                </h1>
                <p className="font-ui text-xs text-neutral uppercase tracking-wide">
                  Editorial Platform
                </p>
              </div>
            </div>
          </Link>
        </div>

        {/* Navigation Links - Center Column */}
        <div className="flex items-center justify-center space-x-8">
          <Link 
            to="/" 
            className="font-ui text-sm font-medium text-primary hover:text-accent transition-colors uppercase tracking-wide flex items-center space-x-2"
          >
            <Home className="w-4 h-4" />
            <span>Discover</span>
          </Link>
          
          {user && (
            <Link 
              to="/create" 
              className="font-ui text-sm font-medium text-primary hover:text-accent transition-colors uppercase tracking-wide flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Create</span>
            </Link>
          )}
        </div>

        {/* User Actions - Right Column */}
        <div className="flex items-center justify-end space-x-4">
          {user ? (
            <div className="flex items-center space-x-4">
              <Link 
                to="/profile" 
                className="flex items-center space-x-2 font-ui text-sm font-medium text-primary hover:text-accent transition-colors"
              >
                <User className="w-4 h-4" />
                <span className="hidden md:inline">Profile</span>
              </Link>
              
              <button
                onClick={handleSignOut}
                className="flex items-center space-x-2 font-ui text-sm font-medium text-neutral hover:text-primary transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden md:inline">Sign Out</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link 
                to="/login" 
                className="font-ui text-sm font-medium text-primary hover:text-accent transition-colors uppercase tracking-wide"
              >
                Sign In
              </Link>
              <Link 
                to="/register" 
                className="editorial-button"
              >
                <span>Join Now</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar