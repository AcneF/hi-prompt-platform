import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { Heart, Eye, Calendar, User, Tag, Copy, Edit, Trash2 } from 'lucide-react'
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

const PromptDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [prompt, setPrompt] = useState<Prompt | null>(null)
  const [loading, setLoading] = useState(true)
  const [isLiked, setIsLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(0)

  useEffect(() => {
    if (id) {
      fetchPrompt()
      checkIfLiked()
      incrementViewCount()
    }
  }, [id, user])

  const fetchPrompt = async () => {
    try {
      const { data, error } = await supabase
        .from('prompts')
        .select(`
          *,
          profiles:author_id (full_name, username),
          categories:category_id (name)
        `)
        .eq('id', id)
        .single()

      if (error) throw error
      
      setPrompt(data)
      setLikesCount(data.likes_count)
    } catch (error) {
      console.error('Error fetching prompt:', error)
      toast.error('获取Prompt详情失败')
      navigate('/')
    } finally {
      setLoading(false)
    }
  }

  const checkIfLiked = async () => {
    if (!user || !id) return

    try {
      const { data, error } = await supabase
        .from('prompt_likes')
        .select('id')
        .eq('prompt_id', id)
        .eq('user_id', user.id)
        .single()

      if (error && error.code !== 'PGRST116') throw error
      setIsLiked(!!data)
    } catch (error) {
      console.error('Error checking like status:', error)
    }
  }

  const incrementViewCount = async () => {
    if (!id) return

    try {
      await supabase
        .from('prompts')
        .update({ views_count: prompt?.views_count ? prompt.views_count + 1 : 1 })
        .eq('id', id)
    } catch (error) {
      console.error('Error incrementing view count:', error)
    }
  }

  const handleLike = async () => {
    if (!user) {
      toast.error('请先登录')
      return
    }

    if (!id) return

    try {
      if (isLiked) {
        // 取消点赞
        const { error } = await supabase
          .from('prompt_likes')
          .delete()
          .eq('prompt_id', id)
          .eq('user_id', user.id)

        if (error) throw error
        setIsLiked(false)
        setLikesCount(prev => prev - 1)
        toast.success('已取消点赞')
      } else {
        // 点赞
        const { error } = await supabase
          .from('prompt_likes')
          .insert([{ prompt_id: id, user_id: user.id }])

        if (error) throw error
        setIsLiked(true)
        setLikesCount(prev => prev + 1)
        toast.success('点赞成功')
      }
    } catch (error) {
      console.error('Error toggling like:', error)
      toast.error('操作失败，请稍后重试')
    }
  }

  const handleCopy = async () => {
    if (!prompt) return

    try {
      await navigator.clipboard.writeText(prompt.content)
      toast.success('Prompt内容已复制到剪贴板')
    } catch (error) {
      console.error('Error copying to clipboard:', error)
      toast.error('复制失败')
    }
  }

  const handleDelete = async () => {
    if (!prompt || !user || prompt.author_id !== user.id) return

    if (!confirm('确定要删除这个Prompt吗？此操作不可恢复。')) return

    try {
      const { error } = await supabase
        .from('prompts')
        .delete()
        .eq('id', prompt.id)

      if (error) throw error
      toast.success('Prompt已删除')
      navigate('/')
    } catch (error) {
      console.error('Error deleting prompt:', error)
      toast.error('删除失败，请稍后重试')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!prompt) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">Prompt不存在或已被删除</p>
      </div>
    )
  }

  const isAuthor = user && prompt.author_id === user.id

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* 标题和操作按钮 */}
      <div className="card p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{prompt.title}</h1>
            {prompt.description && (
              <p className="text-gray-600 text-lg">{prompt.description}</p>
            )}
          </div>
          <div className="flex items-center space-x-2 ml-4">
            {isAuthor && (
              <>
                <button className="btn-secondary flex items-center">
                  <Edit size={16} className="mr-1" />
                  编辑
                </button>
                <button
                  onClick={handleDelete}
                  className="btn-secondary text-red-600 hover:bg-red-50 flex items-center"
                >
                  <Trash2 size={16} className="mr-1" />
                  删除
                </button>
              </>
            )}
          </div>
        </div>

        {/* 元信息 */}
        <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
          <span className="flex items-center">
            <User size={16} className="mr-1" />
            {prompt.profiles?.full_name || prompt.profiles?.username || '匿名用户'}
          </span>
          <span className="flex items-center">
            <Calendar size={16} className="mr-1" />
            {formatDate(prompt.created_at)}
          </span>
          <span className="flex items-center">
            <Eye size={16} className="mr-1" />
            {prompt.views_count} 次查看
          </span>
          {prompt.categories && (
            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
              {prompt.categories.name}
            </span>
          )}
        </div>

        {/* 标签 */}
        {prompt.tags && prompt.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {prompt.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary-100 text-primary-800"
              >
                <Tag size={12} className="mr-1" />
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Prompt内容 */}
      <div className="card p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Prompt内容</h2>
          <button
            onClick={handleCopy}
            className="btn-secondary flex items-center"
          >
            <Copy size={16} className="mr-1" />
            复制
          </button>
        </div>
        <div className="bg-gray-50 rounded-lg p-4 border">
          <pre className="whitespace-pre-wrap font-mono text-sm text-gray-800 leading-relaxed">
            {prompt.content}
          </pre>
        </div>
      </div>

      {/* 点赞区域 */}
      <div className="card p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleLike}
              disabled={!user}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                isLiked
                  ? 'bg-red-100 text-red-600 hover:bg-red-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <Heart size={20} className={isLiked ? 'fill-current' : ''} />
              <span>{likesCount}</span>
            </button>
            {!user && (
              <p className="text-sm text-gray-500">登录后可以点赞</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PromptDetail