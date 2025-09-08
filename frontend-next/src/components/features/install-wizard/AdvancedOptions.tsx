'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface AdvancedOptionsProps {
  disabled?: boolean
}

export function AdvancedOptions({ disabled = false }: AdvancedOptionsProps) {
  const [options, setOptions] = useState({
    containerName: '',
    cpuLimit: '2',
    memoryLimit: '1024',
    autoStart: true,
    networkMode: 'bridge',
    environmentVars: '',
    ports: ''
  })

  const handleOptionChange = (key: string, value: string | boolean) => {
    if (!disabled) {
      setOptions(prev => ({ ...prev, [key]: value }))
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Container Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="containerName">Container Name</Label>
            <Input
              id="containerName"
              placeholder="my-app-container"
              value={options.containerName}
              onChange={(e) => handleOptionChange('containerName', e.target.value)}
              disabled={disabled}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cpuLimit">CPU Limit (cores)</Label>
              <Select value={options.cpuLimit} onValueChange={(value) => handleOptionChange('cpuLimit', value)} disabled={disabled}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 core</SelectItem>
                  <SelectItem value="2">2 cores</SelectItem>
                  <SelectItem value="4">4 cores</SelectItem>
                  <SelectItem value="8">8 cores</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="memoryLimit">Memory Limit (MB)</Label>
              <Select value={options.memoryLimit} onValueChange={(value) => handleOptionChange('memoryLimit', value)} disabled={disabled}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="512">512 MB</SelectItem>
                  <SelectItem value="1024">1 GB</SelectItem>
                  <SelectItem value="2048">2 GB</SelectItem>
                  <SelectItem value="4096">4 GB</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="networkMode">Network Mode</Label>
            <Select value={options.networkMode} onValueChange={(value) => handleOptionChange('networkMode', value)} disabled={disabled}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bridge">Bridge</SelectItem>
                <SelectItem value="host">Host</SelectItem>
                <SelectItem value="none">None</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Advanced Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Auto-start on boot</Label>
              <p className="text-sm text-muted-foreground">
                Start the container automatically when the system boots
              </p>
            </div>
            <Switch
              checked={options.autoStart}
              onCheckedChange={(checked) => handleOptionChange('autoStart', checked)}
              disabled={disabled}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ports">Port Mapping</Label>
            <Input
              id="ports"
              placeholder="8080:80, 8443:443"
              value={options.ports}
              onChange={(e) => handleOptionChange('ports', e.target.value)}
              disabled={disabled}
            />
            <p className="text-xs text-muted-foreground">
              Format: host_port:container_port (comma-separated for multiple ports)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="environmentVars">Environment Variables</Label>
            <Textarea
              id="environmentVars"
              placeholder="KEY=value\nDATABASE_URL=postgresql://..."
              value={options.environmentVars}
              onChange={(e) => handleOptionChange('environmentVars', e.target.value)}
              rows={3}
              disabled={disabled}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}