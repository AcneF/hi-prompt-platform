import React from 'react'

const EnvCheck: React.FC = () => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

  return (
    <div style={{ 
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f8f9fa',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ 
        maxWidth: '600px',
        padding: '40px', 
        textAlign: 'center', 
        backgroundColor: '#fff',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        border: '2px solid #ffc107'
      }}>
        <div style={{ fontSize: '48px', marginBottom: '20px' }}>⚠️</div>
        <h1 style={{ color: '#856404', marginBottom: '20px', fontSize: '24px' }}>
          Hi Prompt 配置缺失
        </h1>
        <p style={{ marginBottom: '30px', fontSize: '16px', color: '#6c757d' }}>
          应用需要 Supabase 环境变量才能正常运行
        </p>
        
        <div style={{ 
          backgroundColor: '#f8f9fa', 
          padding: '20px', 
          borderRadius: '8px',
          marginBottom: '30px',
          textAlign: 'left'
        }}>
          <h3 style={{ marginBottom: '15px', color: '#495057' }}>环境变量状态：</h3>
          <div style={{ marginBottom: '10px' }}>
            <span style={{ 
              display: 'inline-block', 
              width: '20px', 
              marginRight: '10px' 
            }}>
              {supabaseUrl ? '✅' : '❌'}
            </span>
            <strong>VITE_SUPABASE_URL:</strong> {supabaseUrl ? '已配置' : '缺失'}
          </div>
          <div>
            <span style={{ 
              display: 'inline-block', 
              width: '20px', 
              marginRight: '10px' 
            }}>
              {supabaseKey ? '✅' : '❌'}
            </span>
            <strong>VITE_SUPABASE_ANON_KEY:</strong> {supabaseKey ? '已配置' : '缺失'}
          </div>
        </div>

        <div style={{ 
          backgroundColor: '#e7f3ff', 
          padding: '20px', 
          borderRadius: '8px',
          textAlign: 'left',
          border: '1px solid #b3d9ff'
        }}>
          <h3 style={{ marginBottom: '15px', color: '#0056b3' }}>🔧 解决步骤：</h3>
          <ol style={{ paddingLeft: '20px', lineHeight: '1.6' }}>
            <li>登录 <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" style={{ color: '#0056b3' }}>Vercel Dashboard</a></li>
            <li>进入项目 <strong>hi-prompt-platform</strong></li>
            <li>点击 <strong>Settings</strong> → <strong>Environment Variables</strong></li>
            <li>添加以下环境变量：
              <div style={{ 
                backgroundColor: '#f8f9fa', 
                padding: '10px', 
                borderRadius: '4px',
                marginTop: '10px',
                fontFamily: 'monospace',
                fontSize: '14px'
              }}>
                VITE_SUPABASE_URL=https://eozvjqiyiszopnrgxpnm.supabase.co<br/>
                VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
              </div>
            </li>
            <li>点击 <strong>Redeploy</strong> 重新部署</li>
          </ol>
        </div>

        <div style={{ marginTop: '30px' }}>
          <button 
            onClick={() => window.location.reload()}
            style={{
              padding: '12px 24px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold'
            }}
          >
            🔄 重新检查
          </button>
        </div>
      </div>
    </div>
  )
}

export default EnvCheck