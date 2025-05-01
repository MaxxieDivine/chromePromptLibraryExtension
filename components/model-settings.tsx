"use client"

import type React from "react"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface ModelConfig {
  endpoint: string
  apiKey?: string
  modelName: string
}

interface ModelSettingsProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  modelConfig: ModelConfig
  onSave: (config: ModelConfig) => void
}

export default function ModelSettings({ open, onOpenChange, modelConfig, onSave }: ModelSettingsProps) {
  const [config, setConfig] = useState<ModelConfig>(modelConfig)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(config)
  }

  const handleChange = (field: keyof ModelConfig, value: string) => {
    setConfig((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleReset = () => {
    setConfig({
      endpoint: "http://localhost:8000/v1",
      apiKey: "",
      modelName: "llama3",
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Local LLM Settings</DialogTitle>
            <DialogDescription>Configure your local LLM endpoint and model settings.</DialogDescription>
          </DialogHeader>

          <Alert className="my-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Setup Information</AlertTitle>
            <AlertDescription>
              To use a local LLM, you need to run Llama 3 with an OpenAI-compatible API server like llama.cpp,
              text-generation-webui, or LM Studio.
            </AlertDescription>
          </Alert>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="endpoint" className="text-right">
                API Endpoint
              </Label>
              <Input
                id="endpoint"
                value={config.endpoint}
                onChange={(e) => handleChange("endpoint", e.target.value)}
                className="col-span-3"
                placeholder="http://localhost:8000/v1"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="apiKey" className="text-right">
                API Key
              </Label>
              <Input
                id="apiKey"
                value={config.apiKey || ""}
                onChange={(e) => handleChange("apiKey", e.target.value)}
                className="col-span-3"
                placeholder="(Optional)"
                type="password"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="modelName" className="text-right">
                Model Name
              </Label>
              <Input
                id="modelName"
                value={config.modelName}
                onChange={(e) => handleChange("modelName", e.target.value)}
                className="col-span-3"
                placeholder="llama3"
              />
            </div>
          </div>

          <DialogFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={handleReset}>
              Reset to Defaults
            </Button>
            <div className="space-x-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">Save Settings</Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

