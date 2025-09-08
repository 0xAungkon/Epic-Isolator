'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Activity } from 'lucide-react'

interface AppUsage {
  name: string
  cpu: number
  memory: number
  status: 'running' | 'stopped' | 'error'
}

export function AppUsageList() {
  const appUsage: AppUsage[] = [
    { name: 'Web Server', cpu: 12, memory: 256, status: 'running' },
    { name: 'Database', cpu: 8, memory: 512, status: 'running' },
    { name: 'Cache Service', cpu: 3, memory: 128, status: 'stopped' },
    { name: 'Monitor', cpu: 2, memory: 64, status: 'running' }
  ]

  const getStatusColor = (status: AppUsage['status']) => {
    switch (status) {
      case 'running': return 'bg-green-500'
      case 'stopped': return 'bg-gray-500'
      case 'error': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <Activity className="h-4 w-4" />
          App Usage
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {appUsage.map((app, index) => (
            <div key={index} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${getStatusColor(app.status)}`} />
                <span className="truncate max-w-24">{app.name}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <span>{app.cpu}%</span>
                <span>•</span>
                <span>{app.memory}MB</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}