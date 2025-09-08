'use client'

import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/shared/ThemeToggle'
import { LogOut, Menu } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { notification } from '@/components/shared/Notification'

export function Header() {
  const { logout, user } = useAuth()

  const handleLogout = () => {
    logout()
    notification.success('Logged out', 'You have been successfully logged out')
  }

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-card border-b border-border z-50">
      <div className="flex items-center justify-between h-full px-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold">E</span>
            </div>
            <h1 className="text-xl font-bold text-foreground">Epic Isolator</h1>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="hidden md:block text-sm text-muted-foreground mr-2">
            Welcome, {user?.username}
          </div>
          <ThemeToggle />
          <Button variant="ghost" size="icon" onClick={handleLogout}>
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  )
}