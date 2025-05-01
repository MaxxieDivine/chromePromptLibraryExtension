"use client"

import { useState, useEffect } from "react"
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
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Star, Copy, Edit } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Mock data - in a real app, this would come from storage
const mockPrompt = {
  id: "1",
  title: "Product Requirements Template",
  description: "Template for creating standardized product requirements documents",
  content:
    "# [PRODUCT_NAME] Requirements Document\n\n## Overview\n[BRIEF_DESCRIPTION]\n\n## User Stories\n- As a [USER_TYPE], I want to [ACTION] so that [BENEFIT]\n\n## Functional Requirements\n1. [REQUIREMENT_1]\n2. [REQUIREMENT_2]\n\n## Non-Functional Requirements\n1. [NFR_1]\n2. [NFR_2]\n\n## Acceptance Criteria\n- [CRITERIA_1]\n- [CRITERIA_2]",
  tags: ["product", "documentation"],
  folder: "work",
  favorite: true,
  lastUsed: new Date(2023, 5, 15),
}

interface PromptDetailDialogProps {
  promptId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function PromptDetailDialog({ promptId, open, onOpenChange }: PromptDetailDialogProps) {
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [prompt, setPrompt] = useState(mockPrompt)
  const [editedPrompt, setEditedPrompt] = useState(mockPrompt)
  const [variables, setVariables] = useState<Record<string, string>>({})

  // Extract variables from content
  useEffect(() => {
    if (!prompt) return

    const variableRegex = /\[([A-Z_]+)\]/g
    const matches = [...prompt.content.matchAll(variableRegex)]
    const extractedVars: Record<string, string> = {}

    matches.forEach((match) => {
      const varName = match[1]
      if (!extractedVars[varName]) {
        extractedVars[varName] = ""
      }
    })

    setVariables(extractedVars)
  }, [prompt])

  const handleVariableChange = (varName: string, value: string) => {
    setVariables((prev) => ({
      ...prev,
      [varName]: value,
    }))
  }

  const getFilledContent = () => {
    let filledContent = prompt.content
    Object.entries(variables).forEach(([varName, value]) => {
      const regex = new RegExp(`\\[${varName}\\]`, "g")
      filledContent = filledContent.replace(regex, value || `[${varName}]`)
    })
    return filledContent
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(getFilledContent())
    toast({
      title: "Copied to clipboard",
      description: "Prompt content copied with variables filled in.",
    })
  }

  const saveChanges = () => {
    // In a real app, this would update the prompt in storage
    setPrompt(editedPrompt)
    setIsEditing(false)
    toast({
      title: "Changes saved",
      description: "Your prompt has been updated.",
    })
  }

  const handleEditChange = (field: keyof typeof editedPrompt, value: any) => {
    setEditedPrompt((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        {isEditing ? (
          // Edit mode
          <>
            <DialogHeader>
              <DialogTitle>Edit Prompt</DialogTitle>
              <DialogDescription>Make changes to your prompt template.</DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-title" className="text-right">
                  Title
                </Label>
                <Input
                  id="edit-title"
                  value={editedPrompt.title}
                  onChange={(e) => handleEditChange("title", e.target.value)}
                  className="col-span-3"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-description" className="text-right">
                  Description
                </Label>
                <Input
                  id="edit-description"
                  value={editedPrompt.description}
                  onChange={(e) => handleEditChange("description", e.target.value)}
                  className="col-span-3"
                />
              </div>

              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="edit-content" className="text-right pt-2">
                  Content
                </Label>
                <Textarea
                  id="edit-content"
                  value={editedPrompt.content}
                  onChange={(e) => handleEditChange("content", e.target.value)}
                  className="col-span-3 min-h-[200px]"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-tags" className="text-right">
                  Tags
                </Label>
                <Input
                  id="edit-tags"
                  value={editedPrompt.tags.join(", ")}
                  onChange={(e) => handleEditChange("tags", e.target.value.split(", "))}
                  className="col-span-3"
                  placeholder="product, documentation (comma separated)"
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button type="button" onClick={saveChanges}>
                Save Changes
              </Button>
            </DialogFooter>
          </>
        ) : (
          // View mode
          <>
            <DialogHeader>
              <div className="flex justify-between items-center">
                <DialogTitle>{prompt.title}</DialogTitle>
                <div className="flex space-x-2">
                  <Button variant="outline" size="icon" onClick={() => setIsEditing(true)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Star className={`h-4 w-4 ${prompt.favorite ? "fill-yellow-400 text-yellow-400" : ""}`} />
                  </Button>
                </div>
              </div>
              <DialogDescription>{prompt.description}</DialogDescription>
              <div className="flex flex-wrap gap-1 mt-2">
                {prompt.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              {/* Variables section */}
              {Object.keys(variables).length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Fill in Variables</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(variables).map(([varName, value]) => (
                      <div key={varName} className="space-y-2">
                        <Label htmlFor={`var-${varName}`}>{varName}</Label>
                        <Input
                          id={`var-${varName}`}
                          value={value}
                          onChange={(e) => handleVariableChange(varName, e.target.value)}
                          placeholder={varName}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Content preview */}
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Preview</h3>
                <div className="bg-gray-50 p-4 rounded-md border whitespace-pre-wrap font-mono text-sm">
                  {getFilledContent()}
                </div>
              </div>
            </div>

            <DialogFooter>
              <div className="flex space-x-2">
                <Button variant="outline" onClick={() => onOpenChange(false)}>
                  Close
                </Button>
                <Button onClick={copyToClipboard}>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy to Clipboard
                </Button>
              </div>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

