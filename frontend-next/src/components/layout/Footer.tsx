'use client'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="h-10 bg-card border-t border-border relative z-50">
      <div className="flex items-center justify-between h-full px-4 text-xs text-muted-foreground">
        <div>
          © {currentYear} Epic Isolator. All rights reserved.
        </div>
        <div className="flex items-center gap-4">
          <span>v1.0.0</span>
          <div className="flex items-center gap-2">
            <span>System Status:</span>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-green-600 font-medium">Online</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}