"use client"

import type React from "react"

import { useState } from "react"
import { Star, StarOff, Trash2, Copy } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import PromptDetailDialog from "./prompt-detail-dialog"

// Mock data for prompts
const mockPrompts = [
  {
    id: "1",
    title: "Product Requirements Template",
    description: "Template for creating standardized product requirements documents",
    content:
      "# [PRODUCT_NAME] Requirements Document\n\n## Overview\n[BRIEF_DESCRIPTION]\n\n## User Stories\n- As a [USER_TYPE], I want to [ACTION] so that [BENEFIT]\n\n## Functional Requirements\n1. [REQUIREMENT_1]\n2. [REQUIREMENT_2]\n\n## Non-Functional Requirements\n1. [NFR_1]\n2. [NFR_2]\n\n## Acceptance Criteria\n- [CRITERIA_1]\n- [CRITERIA_2]",
    tags: ["product", "documentation"],
    folder: "work",
    favorite: true,
    lastUsed: new Date(2023, 5, 15),
  },
  {
    id: "2",
    title: "Code Review Prompt",
    description: "Prompt for requesting thorough code reviews",
    content:
      "Please review the following [LANGUAGE] code for:\n\n1. Potential bugs or edge cases\n2. Performance optimizations\n3. Readability and maintainability\n4. Security vulnerabilities\n5. Adherence to best practices\n\n```[LANGUAGE]\n[CODE_BLOCK]\n```\n\nPlease provide specific suggestions for improvement with examples where applicable.",
    tags: ["development", "code"],
    folder: "work",
    favorite: false,
    lastUsed: new Date(2023, 6, 20),
  },
  {
    id: "3",
    title: "Research Summary Template",
    description: "Template for summarizing research findings",
    content:
      "# Research Summary: [TOPIC]\n\n## Key Findings\n- [FINDING_1]\n- [FINDING_2]\n- [FINDING_3]\n\n## Methodology\n[METHODOLOGY_DESCRIPTION]\n\n## Data Analysis\n[DATA_ANALYSIS_SUMMARY]\n\n## Conclusions\n[MAIN_CONCLUSIONS]\n\n## Recommendations\n1. [RECOMMENDATION_1]\n2. [RECOMMENDATION_2]",
    tags: ["research", "analysis"],
    folder: "personal",
    favorite: true,
    lastUsed: new Date(2023, 7, 5),
  },
  {
    id: "4",
    title: "Bug Report Template",
    description: "Standardized format for reporting software bugs",
    content:
      "## Bug Report: [SHORT_DESCRIPTION]\n\n### Environment\n- Browser/Device: [BROWSER_DEVICE]\n- OS: [OPERATING_SYSTEM]\n- Version: [APP_VERSION]\n\n### Steps to Reproduce\n1. [STEP_1]\n2. [STEP_2]\n3. [STEP_3]\n\n### Expected Behavior\n[EXPECTED_BEHAVIOR]\n\n### Actual Behavior\n[ACTUAL_BEHAVIOR]\n\n### Screenshots/Videos\n[ATTACH_MEDIA]\n\n### Additional Context\n[ANY_ADDITIONAL_INFORMATION]",
    tags: ["development", "qa"],
    folder: "work",
    favorite: false,
    lastUsed: new Date(2023, 7, 10),
  },
  {
    id: "5",
    title: "Creative Writing Starter",
    description: "Prompt to overcome writer's block",
    content:
      "Write a [GENRE] story with the following elements:\n\n- Main character: [CHARACTER_DESCRIPTION]\n- Setting: [SETTING_DESCRIPTION]\n- Conflict: [CONFLICT_DESCRIPTION]\n- Theme: [THEME]\n\nBegin with an engaging opening paragraph that establishes the tone and introduces the main character.",
    tags: ["writing", "creative"],
    folder: "personal",
    favorite: true,
    lastUsed: new Date(2023, 7, 15),
  },
]

interface PromptListProps {
  searchQuery?: string
  filterType?: "recent" | "favorites"
}

export default function PromptList({ searchQuery = "", filterType }: PromptListProps) {
  const { toast } = useToast()
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null)

  // Filter prompts based on search query and filter type
  const filteredPrompts = mockPrompts.filter((prompt) => {
    const matchesSearch =
      prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prompt.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prompt.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    if (filterType === "favorites") {
      return matchesSearch && prompt.favorite
    } else if (filterType === "recent") {
      // For demo purposes, consider all prompts as recent
      return matchesSearch
    }

    return matchesSearch
  })

  const toggleFavorite = (id: string, event: React.MouseEvent) => {
    event.stopPropagation()
    // In a real app, this would update the prompt in storage
    toast({
      title: "Favorite toggled",
      description: "Prompt favorite status updated.",
    })
  }

  const copyPrompt = (content: string, event: React.MouseEvent) => {
    event.stopPropagation()
    navigator.clipboard.writeText(content)
    toast({
      title: "Copied to clipboard",
      description: "Prompt content copied to clipboard.",
    })
  }

  const deletePrompt = (id: string, event: React.MouseEvent) => {
    event.stopPropagation()
    // In a real app, this would delete the prompt from storage
    toast({
      title: "Prompt deleted",
      description: "The prompt has been deleted.",
    })
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {filteredPrompts.length > 0 ? (
        filteredPrompts.map((prompt) => (
          <Card
            key={prompt.id}
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setSelectedPrompt(prompt.id)}
          >
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{prompt.title}</CardTitle>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => toggleFavorite(prompt.id, e)}>
                  {prompt.favorite ? (
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ) : (
                    <StarOff className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <CardDescription>{prompt.description}</CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="flex flex-wrap gap-1">
                {prompt.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
            <CardFooter className="pt-0 flex justify-between">
              <div className="text-xs text-gray-500">Folder: {prompt.folder}</div>
              <div className="flex space-x-1">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => copyPrompt(prompt.content, e)}>
                  <Copy className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => deletePrompt(prompt.id, e)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))
      ) : (
        <div className="col-span-full flex justify-center items-center p-8 text-gray-500">
          No prompts found. Try adjusting your search or create a new prompt.
        </div>
      )}

      {selectedPrompt && (
        <PromptDetailDialog
          promptId={selectedPrompt}
          open={!!selectedPrompt}
          onOpenChange={(open) => !open && setSelectedPrompt(null)}
        />
      )}
    </div>
  )
}

