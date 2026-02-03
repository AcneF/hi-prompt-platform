import { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          padding: '20px', 
          textAlign: 'center', 
          fontFamily: 'Arial, sans-serif',
          backgroundColor: '#f8f9fa',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <h1 style={{ color: '#dc3545', marginBottom: '20px' }}>
            应用加载出错
          </h1>
          <div style={{ 
            backgroundColor: '#fff', 
            padding: '20px', 
            borderRadius: '8px',
            border: '1px solid #dee2e6',
            maxWidth: '600px',
            textAlign: 'left'
          }}>
            <h3>错误信息：</h3>
            <pre style={{ 
              backgroundColor: '#f8f9fa', 
              padding: '10px', 
              borderRadius: '4px',
              overflow: 'auto',
              fontSize: '14px'
            }}>
              {this.state.error?.message || '未知错误'}
            </pre>
            <h3>可能的解决方案：</h3>
            <ul>
              <li>检查Vercel环境变量是否正确配置</li>
              <li>确保VITE_SUPABASE_URL和VITE_SUPABASE_ANON_KEY已设置</li>
              <li>检查网络连接</li>
              <li>刷新页面重试</li>
            </ul>
          </div>
          <button 
            onClick={() => window.location.reload()}
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            重新加载页面
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary