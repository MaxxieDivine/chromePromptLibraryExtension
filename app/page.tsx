"use client"

import { useState } from "react"
import { Search, Download, Upload, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import PromptList from "@/components/prompt-list"
import Sidebar from "@/components/sidebar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

export default function Home() {
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")

  const handleImport = () => {
    toast({
      title: "Import Prompts",
      description: "This would open a file dialog to import prompts.",
    })
  }

  const handleExport = () => {
    toast({
      title: "Export Prompts",
      description: "This would export all prompts to a JSON file.",
    })
  }

  return (
    <main className="flex min-h-screen flex-col bg-gray-50">
      <div className="bg-white p-4 border-b flex items-center justify-between">
        <h1 className="text-xl font-bold">Prompt Manager</h1>
        <div className="flex items-center space-x-2">
          <Link href="/chatbot-demo">
            <Button variant="outline">Chatbot Demo</Button>
          </Link>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="bg-white p-4 border-b flex items-center justify-between">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Search prompts..."
                className="pl-9 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-2 ml-4">
              <Button variant="outline" size="icon" onClick={handleImport}>
                <Upload className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={handleExport}>
                <Download className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Tabs defaultValue="all" className="flex-1 overflow-hidden">
            <div className="px-4 pt-4 border-b">
              <TabsList>
                <TabsTrigger value="all">All Prompts</TabsTrigger>
                <TabsTrigger value="recent">Recent</TabsTrigger>
                <TabsTrigger value="favorites">Favorites</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="all" className="flex-1 overflow-auto p-4">
              <PromptList searchQuery={searchQuery} />
            </TabsContent>
            <TabsContent value="recent" className="flex-1 overflow-auto p-4">
              <PromptList searchQuery={searchQuery} filterType="recent" />
            </TabsContent>
            <TabsContent value="favorites" className="flex-1 overflow-auto p-4">
              <PromptList searchQuery={searchQuery} filterType="favorites" />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </main>
  )
}

