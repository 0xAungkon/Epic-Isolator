'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Play, 
  Square, 
  Trash2, 
  Settings, 
  Activity, 
  HardDrive, 
  Cpu, 
  MemoryStick,
  ArrowLeft,
  MoreVertical
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface AppDetails {
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

export function AppDetailsPage({ appId }: { appId: string }) {
  const [app, setApp] = useState<AppDetails>({
    id: appId,
    name: 'Web Server',
    description: 'Nginx web server for hosting static content with SSL support',
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
  })

  const getStatusColor = (status: AppDetails['status']) => {
    switch (status) {
      case 'running': return 'bg-green-500'
      case 'stopped': return 'bg-gray-500'
      case 'error': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusText = (status: AppDetails['status']) => {
    switch (status) {
      case 'running': return 'Running'
      case 'stopped': return 'Stopped'
      case 'error': return 'Error'
      default: return 'Unknown'
    }
  }

  const toggleAppStatus = () => {
    setApp(prev => ({
      ...prev,
      status: prev.status === 'running' ? 'stopped' : 'running'
    }))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <span className="text-2xl font-bold text-primary">{app.icon}</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold">{app.name}</h1>
              <div className="flex items-center gap-2 mt-1">
                <div className={`w-2 h-2 rounded-full ${getStatusColor(app.status)}`} />
                <span className="text-sm text-muted-foreground">{getStatusText(app.status)}</span>
                <Badge variant="outline">v{app.version}</Badge>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant={app.status === 'running' ? 'destructive' : 'default'}
            onClick={toggleAppStatus}
          >
            {app.status === 'running' ? (
              <>
                <Square className="mr-2 h-4 w-4" />
                Stop
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" />
                Start
              </>
            )}
          </Button>
          <Button variant="outline">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Activity className="mr-2 h-4 w-4" />
                View Logs
              </DropdownMenuItem>
              <DropdownMenuItem>
                <HardDrive className="mr-2 h-4 w-4" />
                Backup
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">
                <Trash2 className="mr-2 h-4 w-4" />
                Remove
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <p className="text-muted-foreground">{app.description}</p>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="configuration">Configuration</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Cpu className="h-4 w-4" />
                  CPU Usage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{app.cpu}%</div>
                <Progress value={app.cpu} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <MemoryStick className="h-4 w-4" />
                  Memory
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{app.memory}MB</div>
                <Progress value={(app.memory / 1024) * 100} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <HardDrive className="h-4 w-4" />
                  Storage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{app.storage}MB</div>
                <Progress value={(app.storage / 1024) * 100} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${getStatusColor(app.status)}`} />
                  <span className="text-sm">{getStatusText(app.status)}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Ports</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {app.ports.map((port, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <span>Port {port}</span>
                      <Badge variant="outline">Open</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Version</span>
                  <span>{app.version}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Created</span>
                  <span>{new Date(app.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Last Started</span>
                  <span>{new Date(app.lastStarted).toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="resources">
          <Card>
            <CardHeader>
              <CardTitle>Resource Usage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>CPU Usage</span>
                    <span>{app.cpu}%</span>
                  </div>
                  <Progress value={app.cpu} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Memory Usage</span>
                    <span>{app.memory}MB</span>
                  </div>
                  <Progress value={(app.memory / 1024) * 100} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Storage Usage</span>
                    <span>{app.storage}MB</span>
                  </div>
                  <Progress value={(app.storage / 1024) * 100} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="configuration">
          <Card>
            <CardHeader>
              <CardTitle>Environment Variables</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {Object.entries(app.environment).map(([key, value]) => (
                  <div key={key} className="flex justify-between text-sm">
                    <span className="font-mono text-muted-foreground">{key}</span>
                    <span className="font-mono">{value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs">
          <Card>
            <CardHeader>
              <CardTitle>Application Logs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted p-4 rounded-md font-mono text-sm space-y-1 max-h-96 overflow-y-auto">
                <div>[2024-01-20 08:15:00] Starting nginx server...</div>
                <div>[2024-01-20 08:15:01] Configuration loaded successfully</div>
                <div>[2024-01-20 08:15:02] Listening on port 8080</div>
                <div>[2024-01-20 08:15:02] Listening on port 8443 (SSL)</div>
                <div>[2024-01-20 08:15:03] Server started successfully</div>
                <div>[2024-01-20 08:16:45] GET / 200 - 192.168.1.100</div>
                <div>[2024-01-20 08:16:46] GET /css/style.css 200 - 192.168.1.100</div>
                <div>[2024-01-20 08:16:47] GET /js/app.js 200 - 192.168.1.100</div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}