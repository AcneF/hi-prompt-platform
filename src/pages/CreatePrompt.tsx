import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { Save, Eye, EyeOff, Tag, Type, FileText, Folder, Globe, Lock } from 'lucide-react'
import toast from 'react-hot-toast'

interface Category {
  id: string
  name: string
  description: string | null
}

const CreatePrompt: React.FC = () => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [content, setContent] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const [isPublic, setIsPublic] = useState(true)
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)
  
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    fetchCategories()
  }, [])

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
      toast.error('获取分类失败')
    }
  }

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault()
      if (!tags.includes(tagInput.trim()) && tags.length < 10) {
        setTags([...tags, tagInput.trim()])
        setTagInput('')
      }
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!title.trim() || !content.trim()) {
      toast.error('请填写标题和内容')
      return
    }

    if (!user) {
      toast.error('请先登录')
      return
    }

    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('prompts')
        .insert({
          title: title.trim(),
          description: description.trim() || null,
          content: content.trim(),
          category_id: categoryId || null,
          author_id: user.id,
          is_public: isPublic,
          tags: tags.length > 0 ? tags : null,
        })
        .select()
        .single()

      if (error) throw error

      toast.success('Prompt创建成功！')
      navigate(`/prompt/${data.id}`)
    } catch (error) {
      console.error('Error creating prompt:', error)
      toast.error('创建失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-secondary">
      <div className="editorial-grid py-16">
        {/* Left Column - Form */}
        <div className="col-span-2">
          <div className="magazine-card p-8">
            <div className="mb-8">
              <h1 className="font-display text-3xl font-semibold text-primary mb-4 accent-line">
                Craft New Prompt
              </h1>
              <p className="font-body text-neutral leading-relaxed">
                Share your creative prompt with the community. Every great AI interaction starts with a well-crafted prompt.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Title */}
              <div className="space-y-2">
                <label className="flex items-center space-x-2 font-ui text-sm font-medium text-primary uppercase tracking-wide">
                  <Type className="w-4 h-4" />
                  <span>Title</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Give your prompt a compelling title..."
                  className="editorial-input w-full text-lg"
                  required
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="flex items-center space-x-2 font-ui text-sm font-medium text-primary uppercase tracking-wide">
                  <FileText className="w-4 h-4" />
                  <span>Description</span>
                  <span className="text-neutral font-normal normal-case">(Optional)</span>
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe what your prompt does and when to use it..."
                  rows={3}
                  className="editorial-input w-full resize-none"
                />
              </div>

              {/* Content */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="flex items-center space-x-2 font-ui text-sm font-medium text-primary uppercase tracking-wide">
                    <FileText className="w-4 h-4" />
                    <span>Prompt Content</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setPreviewMode(!previewMode)}
                    className="flex items-center space-x-2 font-ui text-xs text-neutral hover:text-primary transition-colors"
                  >
                    {previewMode ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    <span>{previewMode ? 'Edit' : 'Preview'}</span>
                  </button>
                </div>
                
                {previewMode ? (
                  <div className="bg-gray-50 p-6 min-h-[200px] font-mono text-sm whitespace-pre-wrap">
                    {content || 'Your prompt content will appear here...'}
                  </div>
                ) : (
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Write your prompt here. Be specific and clear about what you want the AI to do..."
                    rows={10}
                    className="editorial-input w-full resize-none font-mono text-sm"
                    required
                  />
                )}
              </div>

              {/* Category and Visibility */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="flex items-center space-x-2 font-ui text-sm font-medium text-primary uppercase tracking-wide">
                    <Folder className="w-4 h-4" />
                    <span>Category</span>
                  </label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="editorial-input w-full"
                  >
                    <option value="">Select a category...</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center space-x-2 font-ui text-sm font-medium text-primary uppercase tracking-wide">
                    {isPublic ? <Globe className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                    <span>Visibility</span>
                  </label>
                  <select
                    value={isPublic ? 'public' : 'private'}
                    onChange={(e) => setIsPublic(e.target.value === 'public')}
                    className="editorial-input w-full"
                  >
                    <option value="public">Public - Everyone can see</option>
                    <option value="private">Private - Only you can see</option>
                  </select>
                </div>
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <label className="flex items-center space-x-2 font-ui text-sm font-medium text-primary uppercase tracking-wide">
                  <Tag className="w-4 h-4" />
                  <span>Tags</span>
                  <span className="text-neutral font-normal normal-case">(Press Enter to add)</span>
                </label>
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                  placeholder="Add tags to help others discover your prompt..."
                  className="editorial-input w-full"
                />
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center space-x-1 bg-gray-100 px-3 py-1 text-sm font-ui text-neutral"
                      >
                        <Tag className="w-3 h-3" />
                        <span>{tag}</span>
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-1 text-neutral hover:text-primary transition-colors"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="editorial-button flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>{loading ? 'Publishing...' : 'Publish Prompt'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column - Tips */}
        <div className="col-span-1">
          <div className="sticky top-24 space-y-8">
            <div>
              <h3 className="font-display text-xl font-semibold text-primary mb-4 accent-line">
                Writing Tips
              </h3>
              <div className="space-y-4">
                <div className="p-4 bg-white border-l-4 border-accent">
                  <h4 className="font-ui font-semibold text-primary mb-2">Be Specific</h4>
                  <p className="font-ui text-sm text-neutral">
                    Clear, specific instructions yield better AI responses than vague requests.
                  </p>
                </div>
                
                <div className="p-4 bg-white border-l-4 border-supporting">
                  <h4 className="font-ui font-semibold text-primary mb-2">Provide Context</h4>
                  <p className="font-ui text-sm text-neutral">
                    Include relevant background information to help the AI understand your needs.
                  </p>
                </div>
                
                <div className="p-4 bg-white border-l-4 border-primary">
                  <h4 className="font-ui font-semibold text-primary mb-2">Test & Iterate</h4>
                  <p className="font-ui text-sm text-neutral">
                    Try your prompt with different AI models and refine based on results.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-display text-xl font-semibold text-primary mb-4 accent-line">
                Community Guidelines
              </h3>
              <div className="space-y-3 font-ui text-sm text-neutral">
                <p>• Keep prompts family-friendly and respectful</p>
                <p>• Credit sources when adapting existing prompts</p>
                <p>• Use descriptive titles and tags</p>
                <p>• Share prompts that add value to the community</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreatePrompt