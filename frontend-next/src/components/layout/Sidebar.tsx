'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ChevronLeft, ChevronRight, Activity, HardDrive, Cpu, MemoryStick } from 'lucide-react'
import { ResourceMonitor } from '@/components/features/resource-monitor/ResourceMonitor'
import { AppUsageList } from '@/components/features/resource-monitor/AppUsageList'
import { useApp } from '@/contexts/AppContext'

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const { apps } = useApp()
  
  const systemData = {
    cpu: 35,
    memory: { used: 67, total: 100 }, // percentage
    memoryActual: { used: 6.7, total: 10 }, // GB
    storage: { used: 45.2, total: 120 } // GB
  }

  const runningApps = apps.filter(app => app.status === 'running')

  return (
    <aside className={`fixed left-0 top-16 h-[calc(100vh-4rem)] bg-card border-r border-border transition-all duration-300 z-40 ${
      collapsed ? 'w-16' : 'w-72'
    }`}>
      <div className="flex flex-col h-full">
        <div className="p-4 border-b border-border">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className="w-full justify-center"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
        
        {!collapsed && (
          <div className="flex-1 p-4 space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  System Resources
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <ResourceMonitor />
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1">
                      <MemoryStick className="h-3 w-3" />
                      <span>Memory</span>
                    </div>
                    <div className="text-right">
                      <div>{systemData.memory.used}%</div>
                      <div className="text-muted-foreground">
                        {systemData.memoryActual.used}GB / {systemData.memoryActual.total}GB
                      </div>
                    </div>
                  </div>
                </div>
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
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span>Used</span>
                    <span>{systemData.storage.used} GB / {systemData.storage.total} GB</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full" 
                      style={{ width: `${(systemData.storage.used / systemData.storage.total) * 100}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-muted-foreground text-center">
                    {((systemData.storage.used / systemData.storage.total) * 100).toFixed(1)}% used
                  </div>
                </div>
              </CardContent>
            </Card>

            {runningApps.length > 0 && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Cpu className="h-4 w-4" />
                    Running Apps ({runningApps.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="max-h-64">
                    <div className="space-y-3">
                      {runningApps.map((app) => (
                        <div key={app.id} className="p-3 bg-muted/50 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">{app.icon}</span>
                              <span className="text-xs font-medium truncate max-w-24">{app.name}</span>
                            </div>
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Cpu className="h-3 w-3" />
                              <span>{app.cpu}%</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MemoryStick className="h-3 w-3" />
                              <span>{app.memory}MB</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </aside>
  )
}