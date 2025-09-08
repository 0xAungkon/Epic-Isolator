'use client'

import { useAuth } from '@/hooks/useAuth'
import { AppShell } from '@/components/layout/AppShell'
import { LoginPage } from '@/components/pages/LoginPage'
import { DashboardPage } from '@/components/pages/DashboardPage'
import { Spinner } from '@/components/shared/Spinner'

export default function Home() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!user) {
    return <LoginPage />
  }

  return (
    <AppShell>
      <DashboardPage />
    </AppShell>
  )
}