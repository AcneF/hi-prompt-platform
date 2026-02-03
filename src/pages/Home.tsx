import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { Heart, Eye, Tag, ArrowRight, Search, Filter, X } from 'lucide-react'
import toast from 'react-hot-toast'

interface Prompt {
  id: string
  title: string
  description: string | null
  content: string
  category_id: string | null
  author_id: string
  is_public: boolean
  tags: string[] | null
  likes_count: number
  views_count: number
  created_at: string
  updated_at: string
  profiles: {
    full_name: string | null
    username: string | null
  } | null
  categories: {
    name: string
  } | null
}

interface Category {
  id: string
  name: string
  description: string | null
}

const Home: React.FC = () => {
  const [prompts, setPrompts] = useState<Prompt[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [featuredPrompt, setFeaturedPrompt] = useState<Prompt | null>(null)
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    fetchPrompts()
    fetchCategories()
  }, [selectedCategory, searchTerm])

  const fetchPrompts = async () => {
    try {
      let query = supabase
        .from('prompts')
        .select(`
          *,
          categories!prompts_category_id_fkey (name)
        `)
        .eq('is_public', true)
        .order('created_at', { ascending: false })

      if (selectedCategory) {
        query = query.eq('category_id', selectedCategory)
      }

      if (searchTerm) {
        query = query.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
      }

      const { data, error } = await query

      if (error) throw error
      setPrompts(data || [])
      
      // Set featured prompt (most liked)
      if (data && data.length > 0) {
        const featured = data.reduce((prev, current) => 
          (prev.likes_count > current.likes_count) ? prev : current
        )
        setFeaturedPrompt(featured)
      }
    } catch (error) {
      console.error('Error fetching prompts:', error)
      // 只在开发环境显示错误提示
      if (process.env.NODE_ENV === 'development') {
        toast.error('获取Prompt列表失败')
      }
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name')

      if (error) throw error
      setCategories(data || [])
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const handlePromptClick = (prompt: Prompt) => {
    setSelectedPrompt(prompt)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedPrompt(null)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="font-ui text-neutral">Loading editorial content...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-secondary">
      {/* Hero Section */}
      <section className="py-16 bg-white">
        <div className="editorial-grid">
          <div></div>
          <div>
            <div className="text-center stagger-animation">
              <h1 className="font-display text-6xl font-bold text-primary mb-6 accent-line inline-block">
                Craft Your Prompts
              </h1>
              <p className="font-body text-xl text-neutral max-w-2xl mx-auto mb-8 leading-relaxed">
                Discover, create, and share the most effective AI prompts. 
                Join our editorial community of prompt craftspeople.
              </p>
              <div className="flex justify-center space-x-4">
                <Link to="/register" className="editorial-button">
                  <span>Start Creating</span>
                </Link>
                <Link 
                  to="#discover" 
                  className="font-ui text-sm font-medium text-primary hover:text-accent transition-colors uppercase tracking-wide flex items-center space-x-2"
                >
                  <span>Explore Collection</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
          <div></div>
        </div>
      </section>

      {/* Featured Prompt */}
      {featuredPrompt && (
        <section className="py-16">
          <div className="editorial-grid">
            <div>
              <div className="sticky top-24">
                <h2 className="font-display text-2xl font-semibold text-primary mb-4 accent-line">
                  Editor's Pick
                </h2>
                <p className="font-ui text-sm text-neutral uppercase tracking-wide">
                  Most Appreciated
                </p>
              </div>
            </div>
            <div>
              <div className="magazine-card p-8">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="font-display text-3xl font-semibold text-primary mb-2">
                      {featuredPrompt.title}
                    </h3>
                    <p className="font-body text-neutral mb-4">
                      {featuredPrompt.description}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-4 text-sm text-neutral font-ui">
                      <span className="flex items-center space-x-1">
                        <Heart className="w-4 h-4" />
                        <span>{featuredPrompt.likes_count}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Eye className="w-4 h-4" />
                        <span>{featuredPrompt.views_count}</span>
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <span className="font-ui text-sm text-neutral">
                      {formatDate(featuredPrompt.created_at)}
                    </span>
                  </div>
                  <Link 
                    to={`/prompt/${featuredPrompt.id}`}
                    className="font-ui text-sm font-medium text-accent hover:text-primary transition-colors uppercase tracking-wide flex items-center space-x-2"
                  >
                    <span>Read More</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
            <div></div>
          </div>
        </section>
      )}

      {/* Search and Filter */}
      <section id="discover" className="py-8 bg-white">
        <div className="editorial-grid">
          <div>
            <h2 className="font-display text-2xl font-semibold text-primary mb-4 accent-line">
              Browse Collection
            </h2>
          </div>
          <div>
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral" />
                <input
                  type="text"
                  placeholder="Search prompts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="editorial-input w-full pl-10"
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="editorial-input pl-10 pr-8 appearance-none bg-transparent"
                >
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div></div>
        </div>
      </section>

      {/* Prompts Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 stagger-animation">
            {prompts.map((prompt) => (
            <div
              key={prompt.id}
              onClick={() => handlePromptClick(prompt)}
              className="magazine-card p-5 group cursor-pointer hover:shadow-lg transition-all duration-200"
            >
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <span className="font-ui text-xs text-accent uppercase tracking-wide">
                    {prompt.categories?.name || 'Uncategorized'}
                  </span>
                  <span className="font-ui text-xs text-neutral">
                    {formatDate(prompt.created_at)}
                  </span>
                </div>

                {/* Content */}
                <div>
                  <h3 className="font-display text-lg font-semibold text-primary mb-3 group-hover:text-accent transition-colors line-clamp-2">
                    {prompt.title}
                  </h3>
                  {prompt.description && (
                    <p className="font-body text-neutral text-sm leading-relaxed line-clamp-3">
                      {prompt.description}
                    </p>
                  )}
                </div>

                {/* Footer */}
                <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                  <div className="flex items-center space-x-3 text-xs text-neutral font-ui">
                    <span className="flex items-center space-x-1">
                      <Heart className="w-3 h-3" />
                      <span>{prompt.likes_count}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Eye className="w-3 h-3" />
                      <span>{prompt.views_count}</span>
                    </span>
                  </div>
                  <span className="font-ui text-xs font-medium text-primary group-hover:text-accent transition-colors uppercase tracking-wide">
                    Read →
                  </span>
                </div>
              </div>
            </div>
            ))}

            {prompts.length === 0 && (
              <div className="text-center py-16 col-span-full">
                <p className="font-body text-xl text-neutral">
                  No prompts found matching your criteria.
                </p>
                <Link 
                  to="/create" 
                  className="inline-block mt-4 font-ui text-sm font-medium text-accent hover:text-primary transition-colors uppercase tracking-wide"
                >
                  Create the first one →
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Modal for Prompt Details */}
      {showModal && selectedPrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex justify-between items-start">
              <div className="flex-1 pr-4">
                <div className="flex items-center space-x-3 mb-2">
                  <span className="font-ui text-xs text-accent uppercase tracking-wide">
                    {selectedPrompt.categories?.name || 'Uncategorized'}
                  </span>
                  <span className="font-ui text-xs text-neutral">
                    {formatDate(selectedPrompt.created_at)}
                  </span>
                </div>
                <h2 className="font-display text-3xl font-semibold text-primary mb-2">
                  {selectedPrompt.title}
                </h2>
                {selectedPrompt.description && (
                  <p className="font-body text-neutral text-lg leading-relaxed">
                    {selectedPrompt.description}
                  </p>
                )}
              </div>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-neutral" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <div className="mb-6">
                <h3 className="font-display text-xl font-semibold text-primary mb-4 accent-line">
                  Prompt Content
                </h3>
                <div className="bg-secondary p-6 rounded-lg">
                  <pre className="font-mono text-sm text-primary whitespace-pre-wrap leading-relaxed">
                    {selectedPrompt.content}
                  </pre>
                </div>
              </div>

              {/* Tags */}
              {selectedPrompt.tags && selectedPrompt.tags.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-display text-lg font-semibold text-primary mb-3">
                    Tags
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedPrompt.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-ui bg-accent/10 text-accent"
                      >
                        <Tag className="w-3 h-3 mr-1" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Stats */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center space-x-6 text-sm text-neutral font-ui">
                  <span className="flex items-center space-x-2">
                    <Heart className="w-4 h-4" />
                    <span>{selectedPrompt.likes_count} likes</span>
                  </span>
                  <span className="flex items-center space-x-2">
                    <Eye className="w-4 h-4" />
                    <span>{selectedPrompt.views_count} views</span>
                  </span>
                </div>
                <div className="flex items-center space-x-4">
                  <button className="editorial-button text-sm">
                    <Heart className="w-4 h-4 mr-2" />
                    <span>Like</span>
                  </button>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(selectedPrompt.content)
                      toast.success('Prompt copied to clipboard!')
                    }}
                    className="font-ui text-sm font-medium text-accent hover:text-primary transition-colors uppercase tracking-wide"
                  >
                    Copy Prompt
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Home