"use client"

import { useState } from "react"
import { Home, FolderPlus, Tag, Plus, ChevronDown, ChevronRight, Folder } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import CreatePromptDialog from "./create-prompt-dialog"

export default function Sidebar() {
  const { toast } = useToast()
  const [isCreatePromptOpen, setIsCreatePromptOpen] = useState(false)
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    work: true,
    personal: false,
  })

  const toggleFolder = (folderId: string) => {
    setExpandedFolders((prev) => ({
      ...prev,
      [folderId]: !prev[folderId],
    }))
  }

  const handleCreateFolder = () => {
    toast({
      title: "Create Folder",
      description: "This would open a dialog to create a new folder.",
    })
  }

  const handleCreateTag = () => {
    toast({
      title: "Create Tag",
      description: "This would open a dialog to create a new tag.",
    })
  }

  return (
    <div className="w-64 border-r bg-white flex flex-col h-full">
      <div className="p-4 border-b">
        <h1 className="text-xl font-bold">Prompt Manager</h1>
      </div>

      <div className="p-2">
        <Button className="w-full justify-start" variant="default" onClick={() => setIsCreatePromptOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Prompt
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2">
          <Button variant="ghost" className="w-full justify-start">
            <Home className="mr-2 h-4 w-4" />
            Home
          </Button>

          <Separator className="my-2" />

          <div className="space-y-1">
            <div className="flex items-center justify-between px-2 py-1.5 text-sm font-medium">
              <span>Folders</span>
              <Button variant="ghost" size="icon" className="h-5 w-5" onClick={handleCreateFolder}>
                <FolderPlus className="h-4 w-4" />
              </Button>
            </div>

            {/* Work folder */}
            <div>
              <Button variant="ghost" className="w-full justify-start" onClick={() => toggleFolder("work")}>
                {expandedFolders["work"] ? (
                  <ChevronDown className="mr-2 h-4 w-4" />
                ) : (
                  <ChevronRight className="mr-2 h-4 w-4" />
                )}
                <Folder className="mr-2 h-4 w-4" />
                Work
              </Button>

              {expandedFolders["work"] && (
                <div className="ml-6 space-y-1 mt-1">
                  <Button variant="ghost" className="w-full justify-start text-sm h-8">
                    Product Specs
                  </Button>
                  <Button variant="ghost" className="w-full justify-start text-sm h-8">
                    Requirements
                  </Button>
                  <Button variant="ghost" className="w-full justify-start text-sm h-8">
                    Feedback Analysis
                  </Button>
                </div>
              )}
            </div>

            {/* Personal folder */}
            <div>
              <Button variant="ghost" className="w-full justify-start" onClick={() => toggleFolder("personal")}>
                {expandedFolders["personal"] ? (
                  <ChevronDown className="mr-2 h-4 w-4" />
                ) : (
                  <ChevronRight className="mr-2 h-4 w-4" />
                )}
                <Folder className="mr-2 h-4 w-4" />
                Personal
              </Button>

              {expandedFolders["personal"] && (
                <div className="ml-6 space-y-1 mt-1">
                  <Button variant="ghost" className="w-full justify-start text-sm h-8">
                    Creative Writing
                  </Button>
                  <Button variant="ghost" className="w-full justify-start text-sm h-8">
                    Research
                  </Button>
                </div>
              )}
            </div>
          </div>

          <Separator className="my-2" />

          <div className="space-y-1">
            <div className="flex items-center justify-between px-2 py-1.5 text-sm font-medium">
              <span>Tags</span>
              <Button variant="ghost" size="icon" className="h-5 w-5" onClick={handleCreateTag}>
                <Tag className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-1">
              <Button variant="ghost" className="w-full justify-start">
                <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                Development
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                Writing
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <div className="w-2 h-2 rounded-full bg-purple-500 mr-2"></div>
                Research
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <div className="w-2 h-2 rounded-full bg-yellow-500 mr-2"></div>
                Analysis
              </Button>
            </div>
          </div>
        </div>
      </ScrollArea>

      <CreatePromptDialog open={isCreatePromptOpen} onOpenChange={setIsCreatePromptOpen} />
    </div>
  )
}

