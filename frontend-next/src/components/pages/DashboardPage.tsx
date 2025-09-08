'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { AppGrid } from '@/components/features/app-grid/AppGrid'
import { InstallWizard } from '@/components/features/install-wizard/InstallWizard'
import { Plus, Search, Filter, RefreshCw, Archive } from 'lucide-react'
import { useApp } from '@/contexts/AppContext'
import { Spinner } from '@/components/shared/Spinner'
import { notification } from '@/components/shared/Notification'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Modal } from '@/components/shared/Modal'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface App {
  id: string
  name: string
  description: string
  icon: string
  status: 'running' | 'stopped' | 'error'
  cpu: number
  memory: number
}

type FilterType = 'all' | 'running' | 'stopped' | 'error'

export function DashboardPage() {
  const [showInstallWizard, setShowInstallWizard] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<FilterType>('all')
  const [showRestoreModal, setShowRestoreModal] = useState(false)
  const [selectedBackupFile, setSelectedBackupFile] = useState<File | null>(null)
  const [restoreName, setRestoreName] = useState('')
  const { apps, loading, refreshApps } = useApp()

  const filteredApps = apps.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         app.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleInstallComplete = () => {
    setShowInstallWizard(false)
    refreshApps()
  }

  const handleRestoreBackup = () => {
    setShowRestoreModal(true)
  }

  const handleAppAction = (action: string, appId: string) => {
    const app = apps.find(a => a.id === appId)
    if (!app) return

    switch (action) {
      case 'launch':
        notification.success('Launch', `Launching ${app.name}...`)
        break
      case 'info':
        notification.info('Info', `Showing info for ${app.name}`)
        break
      case 'logs':
        notification.info('Logs', `Opening logs for ${app.name}`)
        break
      case 'terminal':
        notification.info('Terminal', `Opening terminal for ${app.name}`)
        break
      case 'restart':
        notification.info('Restart', `Restarting ${app.name}...`)
        break
      case 'stop':
        notification.info('Stop', `Stopping ${app.name}...`)
        break
      case 'kill':
        notification.warning('Kill', `Force killing ${app.name}...`)
        break
      case 'backup':
        notification.info('Backup', `Creating backup of ${app.name}...`)
        break
      case 'duplicate':
        notification.info('Duplicate', `Duplicating ${app.name}...`)
        break
      case 'uninstall':
        notification.warning('Uninstall', `Uninstalling ${app.name}...`)
        break
      default:
        notification.info('Action', `Performing ${action} on ${app.name}`)
    }
  }

  const handleFileSelect = (file: File) => {
    setSelectedBackupFile(file)
    setRestoreName(file.name.replace('.backup', ''))
  }

  const handleRestore = () => {
    if (selectedBackupFile && restoreName) {
      notification.success('Restore', `Restoring backup as "${restoreName}"`)
      setShowRestoreModal(false)
      setSelectedBackupFile(null)
      setRestoreName('')
    }
  }

  const getStatusText = (status: FilterType) => {
    switch (status) {
      case 'all': return 'All Status'
      case 'running': return 'Running'
      case 'stopped': return 'Stopped'
      case 'error': return 'Error'
      default: return 'All Status'
    }
  }

  const getStatusColor = (status: FilterType) => {
    switch (status) {
      case 'running': return 'text-green-600'
      case 'stopped': return 'text-gray-600'
      case 'error': return 'text-red-600'
      default: return 'text-foreground'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Manage your isolated applications</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={refreshApps} disabled={loading}>
            {loading ? <Spinner size="sm" /> : <RefreshCw className="h-4 w-4" />}
          </Button>
          <Button variant="outline" onClick={handleRestoreBackup}>
            <Archive className="mr-2 h-4 w-4" />
            Restore Backup
          </Button>
          <Button onClick={() => setShowInstallWizard(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Install App
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <input
            type="text"
            placeholder="Search applications..."
            className="w-full pl-10 pr-4 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              {getStatusText(statusFilter)}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setStatusFilter('all')}>
              All Status
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter('running')}>
              <span className="text-green-600">Running</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter('stopped')}>
              <span className="text-gray-600">Stopped</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter('error')}>
              <span className="text-red-600">Error</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-card p-4 rounded-lg border">
          <div className="text-2xl font-bold text-green-600">{apps.filter(a => a.status === 'running').length}</div>
          <div className="text-sm text-muted-foreground">Running</div>
        </div>
        <div className="bg-card p-4 rounded-lg border">
          <div className="text-2xl font-bold text-gray-600">{apps.filter(a => a.status === 'stopped').length}</div>
          <div className="text-sm text-muted-foreground">Stopped</div>
        </div>
        <div className="bg-card p-4 rounded-lg border">
          <div className="text-2xl font-bold text-red-600">{apps.filter(a => a.status === 'error').length}</div>
          <div className="text-sm text-muted-foreground">Error</div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Applications</h2>
          <div className="text-sm text-muted-foreground">
            Showing {filteredApps.length} of {apps.length} applications
          </div>
        </div>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Spinner size="lg" />
          </div>
        ) : (
          <AppGrid apps={filteredApps} onAppAction={handleAppAction} />
        )}
      </div>

      {showInstallWizard && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <InstallWizard
            open={showInstallWizard}
            onOpenChange={setShowInstallWizard}
          />
        </div>
      )}

      <Modal
        open={showRestoreModal}
        onOpenChange={setShowRestoreModal}
        title="Restore Backup"
        description="Select a backup file and set the restore name"
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="backup-file">Backup File</Label>
            <input
              id="backup-file"
              type="file"
              accept=".backup,.zip,.tar"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) handleFileSelect(file)
              }}
              className="w-full p-2 border border-border rounded-md bg-background text-foreground"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="restore-name">Restore Name</Label>
            <Input
              id="restore-name"
              placeholder="Enter restore name"
              value={restoreName}
              onChange={(e) => setRestoreName(e.target.value)}
            />
          </div>

          {selectedBackupFile && (
            <div className="p-3 bg-muted rounded-md">
              <p className="text-sm">
                <strong>Selected:</strong> {selectedBackupFile.name}
              </p>
              <p className="text-xs text-muted-foreground">
                Size: {(selectedBackupFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          )}
        </div>
        
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setShowRestoreModal(false)}>
            Cancel
          </Button>
          <Button onClick={handleRestore} disabled={!selectedBackupFile || !restoreName}>
            Restore
          </Button>
        </div>
      </Modal>
    </div>
  )
}