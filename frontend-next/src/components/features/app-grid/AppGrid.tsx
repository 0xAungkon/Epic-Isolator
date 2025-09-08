'use client'

import { AppCard } from './AppCard'

interface App {
  id: string
  name: string
  description: string
  icon: string
  status: 'running' | 'stopped' | 'error'
  cpu: number
  memory: number
}

interface AppGridProps {
  apps: App[]
  onAppAction?: (action: string, appId: string) => void
}

export function AppGrid({ apps, onAppAction }: AppGridProps) {
  const handleAppAction = (action: string, appId: string) => {
    if (onAppAction) {
      onAppAction(action, appId)
    }
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {apps.map((app) => (
        <AppCard key={app.id} app={app} onAction={handleAppAction} />
      ))}
    </div>
  )
}