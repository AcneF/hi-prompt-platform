import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { Heart, Eye, Plus, Edit, Tag } from 'lucide-react'
import toast from 'react-hot-toast'

interface Prompt {
  id: string
  title: string
  description: string | null
  content: string
  category_id: string | null
  is_public: boolean
  tags: string[] | null
  likes_count: number
  views_count: number
  created_at: string
  categories: {
    name: string
  } | null
}

interface Profile {
  id: string
  username: string | null
  full_name: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

const Profile: React.FC = () => {
  const { user } = useAuth()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [prompts, setPrompts] = useState<Prompt[]>([])
  const [allPrompts, setAllPrompts] = useState<Prompt[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'public' | 'private'>('public')

  useEffect(() => {
    if (user) {
      fetchProfile()
      fetchAllPrompts()
      fetchPrompts()
    }
  }, [user])

  useEffect(() => {
    if (user) {
      fetchPrompts()
    }
  }, [user, activeTab])

  const fetchProfile = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error && error.code !== 'PGRST116') throw error
      setProfile(data)
    } catch (error) {
      console.error('Error fetching profile:', error)
    }
  }

  const fetchAllPrompts = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('prompts')
        .select(`
          *,
          categories!category_id (name)
        `)
        .eq('author_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setAllPrompts(data || [])
    } catch (error) {
      console.error('Error fetching all prompts:', error)
    }
  }

  const fetchPrompts = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('prompts')
        .select(`
          *,
          categories!category_id (name)
        `)
        .eq('author_id', user.id)
        .eq('is_public', activeTab === 'public')
        .order('created_at', { ascending: false })

      if (error) throw error
      setPrompts(data || [])
    } catch (error) {
      console.error('Error fetching prompts:', error)
      toast.error('Failed to fetch prompts')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const totalLikes = allPrompts.reduce((sum, prompt) => sum + prompt.likes_count, 0)
  const totalViews = allPrompts.reduce((sum, prompt) => sum + prompt.views_count, 0)

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary">
        <div className="editorial-grid py-16">
          <div></div>
          <div className="flex justify-center items-center min-h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
          </div>
          <div></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-secondary">
      <div className="editorial-grid py-16">
        {/* Left Column - Profile Info */}
        <div>
          <div className="sticky top-24 space-y-8">
            <div>
              <h2 className="font-display text-3xl font-semibold text-primary mb-4 accent-line">
                Your Profile
              </h2>
              <p className="font-body text-neutral leading-relaxed">
                Manage your creative workspace and prompt collection.
              </p>
            </div>
            
            {/* Profile Card */}
            <div className="magazine-card p-6 space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-accent flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-display font-bold text-2xl">
                    {(profile?.full_name || user?.email || 'U')[0].toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-display text-xl font-semibold text-primary mb-1">
                    {profile?.full_name || 'Name not set'}
                  </h3>
                  <p className="font-ui text-sm text-neutral mb-1 truncate">{user?.email}</p>
                  <p className="font-ui text-xs text-neutral uppercase tracking-wide">
                    Member since {formatDate(user?.created_at || '')}
                  </p>
                </div>
              </div>
              
              <button className="editorial-button-sm-dark w-full flex items-center justify-center space-x-2">
                <Edit className="w-4 h-4" />
                <span>Edit Profile</span>
              </button>
            </div>

            {/* Stats */}
            <div className="magazine-card p-6">
              <h4 className="font-display text-lg font-semibold text-primary mb-4 accent-line">
                Statistics
              </h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-accent flex items-center justify-center">
                      <span className="text-white font-ui text-sm font-semibold">{allPrompts.length}</span>
                    </div>
                    <p className="font-ui text-sm text-neutral">Prompts Created</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-supporting flex items-center justify-center">
                      <span className="text-white font-ui text-sm font-semibold">{totalLikes}</span>
                    </div>
                    <p className="font-ui text-sm text-neutral">Total Likes</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary flex items-center justify-center">
                      <span className="text-secondary font-ui text-sm font-semibold">{totalViews}</span>
                    </div>
                    <p className="font-ui text-sm text-neutral">Total Views</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Prompts */}
        <div className="space-y-8">
          {/* Tab Navigation */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div className="flex space-x-6">
              <button
                onClick={() => setActiveTab('public')}
                className={`font-ui text-sm font-medium uppercase tracking-wide transition-colors pb-2 border-b-2 ${
                  activeTab === 'public'
                    ? 'text-accent border-accent'
                    : 'text-neutral border-transparent hover:text-primary hover:border-gray-200'
                }`}
              >
                Public Prompts
              </button>
              <button
                onClick={() => setActiveTab('private')}
                className={`font-ui text-sm font-medium uppercase tracking-wide transition-colors pb-2 border-b-2 ${
                  activeTab === 'private'
                    ? 'text-accent border-accent'
                    : 'text-neutral border-transparent hover:text-primary hover:border-gray-200'
                }`}
              >
                Private Prompts
              </button>
            </div>
            <Link to="/create" className="editorial-button-sm-dark flex items-center space-x-2 self-start sm:self-auto">
              <Plus className="w-4 h-4" />
              <span>Create New</span>
            </Link>
          </div>

          {prompts.length === 0 ? (
            <div className="magazine-card p-12 text-center">
              <div className="max-w-sm mx-auto">
                <p className="font-body text-xl text-neutral mb-6">
                  {activeTab === 'public' ? 'No public prompts yet' : 'No private prompts yet'}
                </p>
                <p className="font-ui text-sm text-neutral mb-8 leading-relaxed">
                  Start building your prompt collection and share your creativity with the community.
                </p>
                <Link to="/create" className="editorial-button-sm-dark inline-flex items-center space-x-2">
                  <Plus className="w-4 h-4" />
                  <span>Create Your First Prompt</span>
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 stagger-animation">
              {prompts.map((prompt) => (
                <Link
                  key={prompt.id}
                  to={`/prompt/${prompt.id}`}
                  className="magazine-card p-6 group block h-full"
                >
                  <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-ui text-xs text-accent uppercase tracking-wide">
                        {prompt.categories?.name || 'Uncategorized'}
                      </span>
                      <span className="font-ui text-xs text-neutral">
                        {formatDate(prompt.created_at)}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 mb-4">
                      <h3 className="font-display text-xl font-semibold text-primary mb-2 group-hover:text-accent transition-colors line-clamp-2">
                        {prompt.title}
                      </h3>
                      {prompt.description && (
                        <p className="font-body text-neutral text-sm leading-relaxed line-clamp-3">
                          {prompt.description}
                        </p>
                      )}
                    </div>

                    {/* Tags */}
                    {prompt.tags && prompt.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {prompt.tags.slice(0, 3).map((tag, tagIndex) => (
                          <span 
                            key={tagIndex}
                            className="inline-flex items-center space-x-1 bg-gray-100 px-2 py-1 text-xs font-ui text-neutral"
                          >
                            <Tag className="w-3 h-3" />
                            <span>{tag}</span>
                          </span>
                        ))}
                        {prompt.tags.length > 3 && (
                          <span className="inline-flex items-center px-2 py-1 text-xs font-ui text-neutral bg-gray-50">
                            +{prompt.tags.length - 3} more
                          </span>
                        )}
                      </div>
                    )}

                    {/* Footer */}
                    <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                      <div className="flex items-center space-x-4 text-xs text-neutral font-ui">
                        <span className="flex items-center space-x-1">
                          <Heart className="w-3 h-3" />
                          <span>{prompt.likes_count}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Eye className="w-3 h-3" />
                          <span>{prompt.views_count}</span>
                        </span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span
                          className={`font-ui text-xs uppercase tracking-wide ${
                            prompt.is_public
                              ? 'text-supporting'
                              : 'text-accent'
                          }`}
                        >
                          {prompt.is_public ? 'Public' : 'Private'}
                        </span>
                        <span className="font-ui text-xs font-medium text-primary group-hover:text-accent transition-colors uppercase tracking-wide">
                          View →
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
        
        {/* Third Column - Empty for balance */}
        <div></div>
      </div>
    </div>
  )
}

export default Profile