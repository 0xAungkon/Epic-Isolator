'use client'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AppContextMenu } from './ContextMenu'

interface App {
  id: string
  name: string
  description: string
  icon: string
  status: 'running' | 'stopped' | 'error'
  cpu: number
  memory: number
}

interface AppCardProps {
  app: App
  onAction: (action: string, appId: string) => void
}

export function AppCard({ app, onAction }: AppCardProps) {
  const getStatusColor = (status: App['status']) => {
    switch (status) {
      case 'running': return 'bg-green-500'
      case 'stopped': return 'bg-gray-500'
      case 'error': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusText = (status: App['status']) => {
    switch (status) {
      case 'running': return 'Running'
      case 'stopped': return 'Stopped'
      case 'error': return 'Error'
      default: return 'Unknown'
    }
  }

  const handleAction = (action: string) => {
    onAction(action, app.id)
  }

  return (
    <AppContextMenu onAction={handleAction}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <span className="text-lg font-bold text-primary">{app.icon}</span>
              </div>
              <div>
                <h3 className="font-semibold text-sm">{app.name}</h3>
                <div className="flex items-center gap-1 mt-1">
                  <div className={`w-2 h-2 rounded-full ${getStatusColor(app.status)}`} />
                  <span className="text-xs text-muted-foreground">{getStatusText(app.status)}</span>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
            {app.description}
          </p>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>CPU: {app.cpu}%</span>
            <span>Memory: {app.memory}MB</span>
          </div>
        </CardContent>
      </Card>
    </AppContextMenu>
  )
}