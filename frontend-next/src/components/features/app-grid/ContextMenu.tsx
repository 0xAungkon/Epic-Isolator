'use client'

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuSeparator,
} from '@/components/ui/context-menu'
import { 
  Play, 
  Square, 
  Trash2, 
  Settings, 
  Info, 
  FileText, 
  Terminal, 
  RotateCcw, 
  XCircle, 
  Archive, 
  Copy 
} from 'lucide-react'

interface ContextMenuProps {
  children: React.ReactNode
  onAction: (action: string) => void
}

export function AppContextMenu({ children, onAction }: ContextMenuProps) {
  return (
    <ContextMenu>
      <ContextMenuTrigger>
        {children}
      </ContextMenuTrigger>
      <ContextMenuContent className="w-64">
        <ContextMenuItem onClick={() => onAction('launch')}>
          <Play className="mr-2 h-4 w-4" />
          Launch
        </ContextMenuItem>
        <ContextMenuItem onClick={() => onAction('info')}>
          <Info className="mr-2 h-4 w-4" />
          Info
        </ContextMenuItem>
        <ContextMenuItem onClick={() => onAction('logs')}>
          <FileText className="mr-2 h-4 w-4" />
          Logs
        </ContextMenuItem>
        <ContextMenuItem onClick={() => onAction('terminal')}>
          <Terminal className="mr-2 h-4 w-4" />
          Terminal
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem onClick={() => onAction('restart')}>
          <RotateCcw className="mr-2 h-4 w-4" />
          Restart
        </ContextMenuItem>
        <ContextMenuItem onClick={() => onAction('stop')}>
          <Square className="mr-2 h-4 w-4" />
          Stop
        </ContextMenuItem>
        <ContextMenuItem onClick={() => onAction('kill')} className="text-red-600">
          <XCircle className="mr-2 h-4 w-4" />
          Kill
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem onClick={() => onAction('backup')}>
          <Archive className="mr-2 h-4 w-4" />
          Backup
        </ContextMenuItem>
        <ContextMenuItem onClick={() => onAction('duplicate')}>
          <Copy className="mr-2 h-4 w-4" />
          Duplicate
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem onClick={() => onAction('uninstall')} className="text-red-600">
          <Trash2 className="mr-2 h-4 w-4" />
          Uninstall
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}