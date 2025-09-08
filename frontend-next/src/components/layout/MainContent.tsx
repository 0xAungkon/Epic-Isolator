'use client'

interface MainContentProps {
  children: React.ReactNode
  sidebarCollapsed?: boolean
}

export function MainContent({ children, sidebarCollapsed = false }: MainContentProps) {
  return (
    <main className={`flex-1 transition-all duration-300 ${
      sidebarCollapsed ? 'ml-16' : 'ml-72'
    }`}>
      <div className="p-6 min-h-[calc(100vh-10rem)]">
        {children}
      </div>
    </main>
  )
}