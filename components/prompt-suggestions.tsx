"use client"

import { useState, useEffect, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star } from "lucide-react"

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

interface PromptSuggestionsProps {
  searchQuery: string
  onSelectPrompt: (content: string) => void
  onClose: () => void
}

export default function PromptSuggestions({ searchQuery, onSelectPrompt, onClose }: PromptSuggestionsProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const suggestionsRef = useRef<HTMLDivElement>(null)

  // Filter prompts based on search query
  const filteredPrompts = mockPrompts.filter(
    (prompt) =>
      prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prompt.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault()
        setSelectedIndex((prev) => (prev < filteredPrompts.length - 1 ? prev + 1 : prev))
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0))
      } else if (e.key === "Enter") {
        e.preventDefault()
        if (filteredPrompts[selectedIndex]) {
          onSelectPrompt(filteredPrompts[selectedIndex].content)
        }
      } else if (e.key === "Escape") {
        e.preventDefault()
        onClose()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [filteredPrompts, selectedIndex, onSelectPrompt, onClose])

  // Scroll selected item into view
  useEffect(() => {
    const selectedElement = document.getElementById(`prompt-suggestion-${selectedIndex}`)
    if (selectedElement && suggestionsRef.current) {
      selectedElement.scrollIntoView({ behavior: "smooth", block: "nearest" })
    }
  }, [selectedIndex])

  if (filteredPrompts.length === 0) {
    return (
      <Card className="absolute bottom-full left-0 right-0 mb-2 p-3 max-h-60 overflow-auto shadow-lg z-10">
        <div className="text-sm text-gray-500 p-2">
          No matching prompts found. Type a different query or press Esc to close.
        </div>
      </Card>
    )
  }

  return (
    <Card
      className="absolute bottom-full left-0 right-0 mb-2 max-h-60 overflow-auto shadow-lg z-10"
      ref={suggestionsRef}
    >
      <div className="p-1">
        {filteredPrompts.map((prompt, index) => (
          <Button
            key={prompt.id}
            id={`prompt-suggestion-${index}`}
            variant="ghost"
            className={`w-full justify-start text-left p-2 h-auto ${index === selectedIndex ? "bg-gray-100" : ""}`}
            onClick={() => onSelectPrompt(prompt.content)}
            onMouseEnter={() => setSelectedIndex(index)}
          >
            <div className="flex items-start w-full">
              <div className="flex-1 mr-2">
                <div className="font-medium flex items-center">
                  {prompt.title}
                  {prompt.favorite && <Star className="h-3 w-3 ml-1 fill-yellow-400 text-yellow-400" />}
                </div>
                <div className="text-xs text-gray-500 truncate">{prompt.description}</div>
              </div>
              <div className="text-xs text-gray-400">{prompt.folder}</div>
            </div>
          </Button>
        ))}
      </div>
    </Card>
  )
}

