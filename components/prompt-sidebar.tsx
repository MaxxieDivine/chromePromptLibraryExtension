"use client"

import { useState } from "react"
import { Search, ChevronDown, ChevronRight, Folder, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"

// Mock data - in a real extension this would come from storage
const mockPrompts = [
  {
    id: "1",
    title: "Product Requirements Template",
    description: "Template for creating standardized product requirements documents",
    content:
      "# Product Requirements Document\n\n## Overview\n[Brief description of the product]\n\n## User Stories\n- As a [user type], I want to [action] so that [benefit]\n\n## Functional Requirements\n1. [Requirement 1]\n2. [Requirement 2]\n\n## Non-Functional Requirements\n1. [NFR 1]\n2. [NFR 2]\n\n## Acceptance Criteria\n- [Criteria 1]\n- [Criteria 2]",
    tags: ["product", "documentation"],
    folder: "work",
    favorite: true,
  },
  {
    id: "2",
    title: "Code Review Prompt",
    description: "Prompt for requesting thorough code reviews",
    content:
      "Please review the following code for:\n\n1. Potential bugs or edge cases\n2. Performance optimizations\n3. Readability and maintainability\n4. Security vulnerabilities\n5. Adherence to best practices\n\nCode:\n```\n[Paste code here]\n```\n\nPlease provide specific suggestions for improvement with examples where applicable.",
    tags: ["development", "code"],
    folder: "work",
    favorite: false,
  },
  {
    id: "3",
    title: "Research Summary Template",
    description: "Template for summarizing research findings",
    content:
      "# Research Summary\n\n## Key Findings\n- [Finding 1]\n- [Finding 2]\n- [Finding 3]\n\n## Methodology\n[Methodology description]\n\n## Data Analysis\n[Data analysis summary]\n\n## Conclusions\n[Main conclusions]\n\n## Recommendations\n1. [Recommendation 1]\n2. [Recommendation 2]",
    tags: ["research", "analysis"],
    folder: "personal",
    favorite: true,
  },
  {
    id: "4",
    title: "Bug Report Template",
    description: "Standardized format for reporting software bugs",
    content:
      "## Bug Report\n\n### Environment\n- Browser/Device: [Browser/Device]\n- OS: [Operating System]\n- Version: [App Version]\n\n### Steps to Reproduce\n1. [Step 1]\n2. [Step 2]\n3. [Step 3]\n\n### Expected Behavior\n[Expected behavior]\n\n### Actual Behavior\n[Actual behavior]\n\n### Screenshots/Videos\n[Attach media]\n\n### Additional Context\n[Any additional information]",
    tags: ["development", "qa"],
    folder: "work",
    favorite: false,
  },
  {
    id: "5",
    title: "Creative Writing Starter",
    description: "Prompt to overcome writer's block",
    content:
      "Write a story with the following elements:\n\n- Main character: [Character description]\n- Setting: [Setting description]\n- Conflict: [Conflict description]\n- Theme: [Theme]\n\nBegin with an engaging opening paragraph that establishes the tone and introduces the main character.",
    tags: ["writing", "creative"],
    folder: "personal",
    favorite: true,
  },
]

interface PromptSidebarProps {
  onSelectPrompt: (content: string) => void
}

export default function PromptSidebar({ onSelectPrompt }: PromptSidebarProps) {
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    work: true,
    personal: false,
  })
  const [activeTab, setActiveTab] = useState<"all" | "favorites">("all")

  const toggleFolder = (folderId: string) => {
    setExpandedFolders((prev) => ({
      ...prev,
      [folderId]: !prev[folderId],
    }))
  }

  // Filter prompts based on search query and active tab
  const filteredPrompts = mockPrompts.filter((prompt) => {
    const matchesSearch =
      prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prompt.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prompt.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    if (activeTab === "favorites") {
      return matchesSearch && prompt.favorite
    }

    return matchesSearch
  })

  // Group prompts by folder
  const promptsByFolder = filteredPrompts.reduce(
    (acc, prompt) => {
      if (!acc[prompt.folder]) {
        acc[prompt.folder] = []
      }
      acc[prompt.folder].push(prompt)
      return acc
    },
    {} as Record<string, typeof mockPrompts>,
  )

  return (
    <div className="flex flex-col h-full">
      <div className="p-3">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Search prompts..."
            className="pl-9 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="px-3 pb-2">
        <div className="flex space-x-1">
          <Button
            variant={activeTab === "all" ? "default" : "outline"}
            size="sm"
            className="flex-1"
            onClick={() => setActiveTab("all")}
          >
            All
          </Button>
          <Button
            variant={activeTab === "favorites" ? "default" : "outline"}
            size="sm"
            className="flex-1"
            onClick={() => setActiveTab("favorites")}
          >
            <Star className="h-4 w-4 mr-1" />
            Favorites
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1">
        {searchQuery ? (
          // Search results view
          <div className="p-3 space-y-2">
            <h3 className="text-sm font-medium text-gray-500">Search Results</h3>
            {filteredPrompts.length > 0 ? (
              filteredPrompts.map((prompt) => (
                <Button
                  key={prompt.id}
                  variant="ghost"
                  className="w-full justify-start text-left p-2 h-auto"
                  onClick={() => onSelectPrompt(prompt.content)}
                >
                  <div className="flex items-start w-full">
                    <div className="flex-1 mr-2">
                      <div className="font-medium flex items-center">
                        {prompt.title}
                        {prompt.favorite && <Star className="h-3 w-3 ml-1 fill-yellow-400 text-yellow-400" />}
                      </div>
                      <div className="text-xs text-gray-500 truncate">{prompt.description}</div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {prompt.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="text-xs text-gray-400">{prompt.folder}</div>
                  </div>
                </Button>
              ))
            ) : (
              <div className="text-sm text-gray-500 p-2">No matching prompts found.</div>
            )}
          </div>
        ) : (
          // Folder view
          <div className="p-3">
            {Object.entries(promptsByFolder).map(([folder, prompts]) => (
              <div key={folder} className="mb-3">
                <Button variant="ghost" className="w-full justify-start mb-1" onClick={() => toggleFolder(folder)}>
                  {expandedFolders[folder] ? (
                    <ChevronDown className="mr-2 h-4 w-4" />
                  ) : (
                    <ChevronRight className="mr-2 h-4 w-4" />
                  )}
                  <Folder className="mr-2 h-4 w-4" />
                  {folder.charAt(0).toUpperCase() + folder.slice(1)}
                </Button>

                {expandedFolders[folder] && (
                  <div className="ml-6 space-y-1">
                    {prompts.map((prompt) => (
                      <Button
                        key={prompt.id}
                        variant="ghost"
                        className="w-full justify-start text-sm h-auto py-2"
                        onClick={() => onSelectPrompt(prompt.content)}
                      >
                        <div className="text-left">
                          <div className="flex items-center">
                            {prompt.title}
                            {prompt.favorite && <Star className="h-3 w-3 ml-1 fill-yellow-400 text-yellow-400" />}
                          </div>
                          <div className="text-xs text-gray-500 truncate">{prompt.description}</div>
                        </div>
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </ScrollArea>

      <div className="p-3 border-t">
        <div className="text-xs text-gray-500 mb-2">Tip: Type /prompt or /p in the chat to quickly access prompts</div>
        <div className="text-xs text-gray-500">Keyboard shortcut: Ctrl+Space to open this sidebar</div>
      </div>
    </div>
  )
}

