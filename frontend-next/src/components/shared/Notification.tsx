'use client'

import { toast } from 'sonner'
import { CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react'

export type NotificationType = 'success' | 'error' | 'warning' | 'info'

interface NotificationProps {
  type: NotificationType
  title: string
  description?: string
}

export function showNotification({ type, title, description }: NotificationProps) {
  const icons = {
    success: <CheckCircle className="h-5 w-5 text-green-500" />,
    error: <XCircle className="h-5 w-5 text-red-500" />,
    warning: <AlertCircle className="h-5 w-5 text-yellow-500" />,
    info: <Info className="h-5 w-5 text-blue-500" />
  }

  toast.custom((t) => (
    <div className={`flex items-start gap-3 p-4 rounded-lg border shadow-lg ${
      type === 'success' ? 'bg-green-50 border-green-200' :
      type === 'error' ? 'bg-red-50 border-red-200' :
      type === 'warning' ? 'bg-yellow-50 border-yellow-200' :
      'bg-blue-50 border-blue-200'
    }`}>
      {icons[type]}
      <div className="flex-1">
        <h4 className="font-semibold text-gray-900">{title}</h4>
        {description && (
          <p className="text-sm text-gray-600 mt-1">{description}</p>
        )}
      </div>
      <button
        onClick={() => toast.dismiss(t)}
        className="text-gray-400 hover:text-gray-600"
      >
        ×
      </button>
    </div>
  ))
}

export const notification = {
  success: (title: string, description?: string) => 
    showNotification({ type: 'success', title, description }),
  error: (title: string, description?: string) => 
    showNotification({ type: 'error', title, description }),
  warning: (title: string, description?: string) => 
    showNotification({ type: 'warning', title, description }),
  info: (title: string, description?: string) => 
    showNotification({ type: 'info', title, description }),
}