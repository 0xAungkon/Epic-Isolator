'use client'

import { InstallWizard } from '@/components/features/install-wizard/InstallWizard'

export function InstallPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Install Application</h1>
        <p className="text-muted-foreground">Add new applications to your isolated environment</p>
      </div>
      
      <InstallWizard
        open={true}
        onOpenChange={() => {}}
      />
    </div>
  )
}