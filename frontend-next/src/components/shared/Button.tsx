'use client'

import { Button as ShadcnButton, ButtonProps as ShadcnButtonProps } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

interface ButtonProps extends ShadcnButtonProps {
  loading?: boolean
}

export function Button({ children, loading, disabled, ...props }: ButtonProps) {
  return (
    <ShadcnButton
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </ShadcnButton>
  )
}