import React from 'react'

const EnvCheck: React.FC = () => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    return (
      <div style={{ 
        padding: '20px', 
        textAlign: 'center', 
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#fff3cd',
        border: '1px solid #ffeaa7',
        borderRadius: '8px',
        margin: '20px',
        color: '#856404'
      }}>
        <h2>⚠️ 环境变量配置缺失</h2>
        <p>应用需要以下环境变量才能正常运行：</p>
        <ul style={{ textAlign: 'left', display: 'inline-block' }}>
          <li>VITE_SUPABASE_URL: {supabaseUrl ? '✅ 已配置' : '❌ 缺失'}</li>
          <li>VITE_SUPABASE_ANON_KEY: {supabaseKey ? '✅ 已配置' : '❌ 缺失'}</li>
        </ul>
        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
          <h3>解决方案：</h3>
          <p>请在Vercel Dashboard中配置环境变量：</p>
          <ol style={{ textAlign: 'left', display: 'inline-block' }}>
            <li>进入Vercel项目设置</li>
            <li>点击 "Environment Variables"</li>
            <li>添加 VITE_SUPABASE_URL 和 VITE_SUPABASE_ANON_KEY</li>
            <li>重新部署项目</li>
          </ol>
        </div>
      </div>
    )
  }

  return null
}

export default EnvCheck