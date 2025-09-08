'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FileUploader } from './FileUploader'
import { AdvancedOptions } from './AdvancedOptions'
import { X, Upload, Settings, Check } from 'lucide-react'

interface InstallWizardProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function InstallWizard({ open, onOpenChange }: InstallWizardProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isInstalling, setIsInstalling] = useState(false)
  const [installProgress, setInstallProgress] = useState(0)
  const [installComplete, setInstallComplete] = useState(false)

  const handleInstall = async () => {
    if (!selectedFile) return

    setIsInstalling(true)
    setInstallProgress(0)

    // Simulate installation process
    const interval = setInterval(() => {
      setInstallProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(() => {
            setIsInstalling(false)
            setInstallComplete(true)
          }, 500)
          return 100
        }
        return prev + 10
      })
    }, 200)
  }

  const handleClose = () => {
    onOpenChange(false)
    // Reset state
    setSelectedFile(null)
    setIsInstalling(false)
    setInstallProgress(0)
    setInstallComplete(false)
  }

  const handleReset = () => {
    setSelectedFile(null)
    setIsInstalling(false)
    setInstallProgress(0)
    setInstallComplete(false)
  }

  if (!open) return null

  return (
    <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div className="flex items-center gap-3">
          <Upload className="h-5 w-5" />
          <CardTitle>Install New Application</CardTitle>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleClose}
          disabled={isInstalling}
        >
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      
      <CardContent className="space-y-6 overflow-y-auto max-h-[calc(90vh-8rem)]">
        {installComplete ? (
          <div className="text-center space-y-6 py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Installation Complete!</h3>
              <p className="text-muted-foreground">
                Your application has been successfully installed and is ready to use.
              </p>
            </div>
            <div className="flex gap-3 justify-center">
              <Button variant="outline" onClick={handleReset}>
                Install Another
              </Button>
              <Button onClick={handleClose}>
                Done
              </Button>
            </div>
          </div>
        ) : (
          <>
            {/* File Upload Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                <h3 className="font-semibold">Upload Application</h3>
              </div>
              <FileUploader 
                onFileSelect={setSelectedFile} 
                selectedFile={selectedFile}
                disabled={isInstalling}
              />
            </div>

            {/* Configuration Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                <h3 className="font-semibold">Configuration</h3>
              </div>
              <AdvancedOptions disabled={isInstalling} />
            </div>

            {/* Installation Progress */}
            {isInstalling && (
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary mb-2">{installProgress}%</div>
                  <p className="text-sm text-muted-foreground">Installing application...</p>
                </div>
                <div className="w-full bg-secondary rounded-full h-3">
                  <div 
                    className="bg-primary h-3 rounded-full transition-all duration-300" 
                    style={{ width: `${installProgress}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-between pt-4 border-t">
              <Button
                variant="outline"
                onClick={handleClose}
                disabled={isInstalling}
              >
                Cancel
              </Button>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={handleReset}
                  disabled={isInstalling}
                >
                  Reset
                </Button>
                <Button
                  onClick={handleInstall}
                  disabled={!selectedFile || isInstalling}
                >
                  {isInstalling ? 'Installing...' : 'Install Application'}
                </Button>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}