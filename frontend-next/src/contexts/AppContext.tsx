'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface App {
  id: string
  name: string
  description: string
  icon: string
  status: 'running' | 'stopped' | 'error'
  cpu: number
  memory: number
  storage: number
  version: string
  createdAt: string
  lastStarted: string
  ports: string[]
  environment: Record<string, string>
}

interface AppContextType {
  apps: App[]
  loading: boolean
  refreshApps: () => Promise<void>
  startApp: (appId: string) => Promise<boolean>
  stopApp: (appId: string) => Promise<boolean>
  removeApp: (appId: string) => Promise<boolean>
  installApp: (file: File, options: any) => Promise<boolean>
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [apps, setApps] = useState<App[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    refreshApps()
  }, [])

  const refreshApps = async () => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const mockApps: App[] = [
        {
          id: '1',
          name: 'Web Server',
          description: 'Nginx web server for hosting static content',
          icon: '🌐',
          status: 'running',
          cpu: 12,
          memory: 256,
          storage: 128,
          version: '1.21.0',
          createdAt: '2024-01-15T10:30:00Z',
          lastStarted: '2024-01-20T08:15:00Z',
          ports: ['80:8080', '443:8443'],
          environment: {
            'NGINX_PORT': '80',
            'SSL_ENABLED': 'true',
            'LOG_LEVEL': 'info'
          }
        },
        {
          id: '2',
          name: 'Database',
          description: 'PostgreSQL database server',
          icon: '🗄️',
          status: 'running',
          cpu: 8,
          memory: 512,
          storage: 1024,
          version: '14.2',
          createdAt: '2024-01-10T14:20:00Z',
          lastStarted: '2024-01-19T22:30:00Z',
          ports: ['5432:5432'],
          environment: {
            'POSTGRES_DB': 'appdb',
            'POSTGRES_USER': 'admin',
            'LOG_LEVEL': 'warning'
          }
        },
        {
          id: '3',
          name: 'Redis Cache',
          description: 'In-memory data structure store',
          icon: '⚡',
          status: 'stopped',
          cpu: 0,
          memory: 0,
          storage: 64,
          version: '7.0.5',
          createdAt: '2024-01-12T09:15:00Z',
          lastStarted: '2024-01-18T16:45:00Z',
          ports: ['6379:6379'],
          environment: {
            'REDIS_PASSWORD': 'secret',
            'MAX_MEMORY': '256mb'
          }
        }
      ]
      
      setApps(mockApps)
    } catch (error) {
      console.error('Error fetching apps:', error)
    } finally {
      setLoading(false)
    }
  }

  const startApp = async (appId: string): Promise<boolean> => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setApps(prev => prev.map(app => 
        app.id === appId 
          ? { ...app, status: 'running' as const, lastStarted: new Date().toISOString() }
          : app
      ))
      return true
    } catch (error) {
      console.error('Error starting app:', error)
      return false
    }
  }

  const stopApp = async (appId: string): Promise<boolean> => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setApps(prev => prev.map(app => 
        app.id === appId 
          ? { ...app, status: 'stopped' as const, cpu: 0, memory: 0 }
          : app
      ))
      return true
    } catch (error) {
      console.error('Error stopping app:', error)
      return false
    }
  }

  const removeApp = async (appId: string): Promise<boolean> => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setApps(prev => prev.filter(app => app.id !== appId))
      return true
    } catch (error) {
      console.error('Error removing app:', error)
      return false
    }
  }

  const installApp = async (file: File, options: any): Promise<boolean> => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const newApp: App = {
        id: Date.now().toString(),
        name: options.containerName || file.name.replace('.deb', ''),
        description: 'Newly installed application',
        icon: '📦',
        status: 'stopped',
        cpu: 0,
        memory: 0,
        storage: 0,
        version: '1.0.0',
        createdAt: new Date().toISOString(),
        lastStarted: '',
        ports: [],
        environment: {}
      }
      
      setApps(prev => [...prev, newApp])
      return true
    } catch (error) {
      console.error('Error installing app:', error)
      return false
    }
  }

  return (
    <AppContext.Provider value={{
      apps,
      loading,
      refreshApps,
      startApp,
      stopApp,
      removeApp,
      installApp
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}