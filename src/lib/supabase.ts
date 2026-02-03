import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

// 创建一个默认的客户端，如果环境变量缺失则使用占位符
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
)

// 检查环境变量是否配置正确
export const isSupabaseConfigured = () => {
  return !!(supabaseUrl && supabaseAnonKey && 
    supabaseUrl !== 'https://placeholder.supabase.co' && 
    supabaseAnonKey !== 'placeholder-key')
}

// 数据库类型定义
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string | null
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          created_at?: string
        }
      }
      prompts: {
        Row: {
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
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          content: string
          category_id?: string | null
          author_id: string
          is_public?: boolean
          tags?: string[] | null
          likes_count?: number
          views_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          content?: string
          category_id?: string | null
          author_id?: string
          is_public?: boolean
          tags?: string[] | null
          likes_count?: number
          views_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      prompt_likes: {
        Row: {
          id: string
          prompt_id: string
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          prompt_id: string
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          prompt_id?: string
          user_id?: string
          created_at?: string
        }
      }
    }
  }
}