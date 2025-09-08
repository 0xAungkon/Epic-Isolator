'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Cpu, MemoryStick, HardDrive } from 'lucide-react'

export function SystemUsage() {
  const systemData = {
    cpu: 35,
    memory: 67,
    storage: 45
  }

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1">
            <Cpu className="h-3 w-3" />
            <span>CPU</span>
          </div>
          <span>{systemData.cpu}%</span>
        </div>
        <Progress value={systemData.cpu} className="h-2" />
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1">
            <MemoryStick className="h-3 w-3" />
            <span>Memory</span>
          </div>
          <span>{systemData.memory}%</span>
        </div>
        <Progress value={systemData.memory} className="h-2" />
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1">
            <HardDrive className="h-3 w-3" />
            <span>Storage</span>
          </div>
          <span>{systemData.storage}%</span>
        </div>
        <Progress value={systemData.storage} className="h-2" />
      </div>
    </div>
  )
}