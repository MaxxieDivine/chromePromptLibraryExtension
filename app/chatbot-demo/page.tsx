"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Send, ArrowLeft, Sparkles, User, Bot, X, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import PromptSuggestions from "@/components/prompt-suggestions"
import PromptSidebar from "@/components/prompt-sidebar"
import ModelSettings from "@/components/model-settings"
import { Textarea } from "@/components/ui/textarea"

// Types for messages and model settings
interface Message {
  id: string
  role: "user" | "assistant" | "system"
  content: string
  timestamp: Date
}

interface ModelConfig {
  endpoint: string
  apiKey?: string
  modelName: string
}

// Initial messages
const initialMessages: Message[] = [
  {
    id: "1",
    role: "assistant",
    content: "Hello! I'm a local LLM assistant. How can I help you today?",
    timestamp: new Date(Date.now() - 60000 * 5),
  },
]

// Default model configuration
const defaultModelConfig: ModelConfig = {
  endpoint: "http://localhost:8000/v1",
  modelName: "llama3",
}

export default function ChatbotDemo() {
  const { toast } = useToast()
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState("")
  const [showPromptSuggestions, setShowPromptSuggestions] = useState(false)
  const [showPromptSidebar, setShowPromptSidebar] = useState(false)
  const [showModelSettings, setShowModelSettings] = useState(false)
  const [triggerText, setTriggerText] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [modelConfig, setModelConfig] = useState<ModelConfig>(defaultModelConfig)
  const [streamedResponse, setStreamedResponse] = useState("")
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, streamedResponse])

  // Focus input when component mounts
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    setInput(value)

    // Check for prompt trigger
    const promptTriggerMatch = value.match(/\/prompt\s*(.*)$/)
    const shortTriggerMatch = value.match(/\/p\s*(.*)$/)

    if (promptTriggerMatch || shortTriggerMatch) {
      const match = promptTriggerMatch || shortTriggerMatch
      setShowPromptSuggestions(true)
      setTriggerText(match?.[1] || "")
    } else {
      setShowPromptSuggestions(false)
    }
  }

  const handleSendMessage = async () => {
    if (!input.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setShowPromptSuggestions(false)
    setIsGenerating(true)
    setStreamedResponse("")

    try {
      // Call local LLM API
      await generateResponse(userMessage.content)
    } catch (error) {
      console.error("Error generating response:", error)
      toast({
        title: "Error",
        description: "Failed to connect to the local LLM. Make sure it's running and configured correctly.",
        variant: "destructive",
      })
      setIsGenerating(false)
    }
  }

  const generateResponse = async (userInput: string) => {
    try {
      // Prepare conversation history for the model
      const conversationHistory = messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }))

      // Add the new user message
      conversationHistory.push({
        role: "user",
        content: userInput,
      })

      // Simulate streaming response from local LLM
      const controller = new AbortController()
      const signal = controller.signal

      // Attempt to call the local LLM API
      try {
        const response = await fetch(`${modelConfig.endpoint}/chat/completions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(modelConfig.apiKey ? { Authorization: `Bearer ${modelConfig.apiKey}` } : {}),
          },
          body: JSON.stringify({
            model: modelConfig.modelName,
            messages: conversationHistory,
            stream: true,
            max_tokens: 1000,
            temperature: 0.7,
          }),
          signal,
        })

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`)
        }

        if (!response.body) {
          throw new Error("Response body is null")
        }

        // Process the streaming response
        const reader = response.body.getReader()
        const decoder = new TextDecoder()
        let responseText = ""

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value)
          // Parse SSE format (data: {...})
          const lines = chunk.split("\n")
          for (const line of lines) {
            if (line.startsWith("data: ") && line !== "data: [DONE]") {
              try {
                const data = JSON.parse(line.substring(6))
                if (data.choices && data.choices[0]?.delta?.content) {
                  const content = data.choices[0].delta.content
                  responseText += content
                  setStreamedResponse(responseText)
                }
              } catch (e) {
                console.error("Error parsing SSE:", e)
              }
            }
          }
        }

        // Add the complete response as a message
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: responseText,
          timestamp: new Date(),
        }

        setMessages((prev) => [...prev, assistantMessage])
        setStreamedResponse("")
      } catch (error) {
        console.error("API call failed:", error)

        // Fallback to simulated response if API call fails
        await simulateStreamingResponse(userInput)
      }
    } finally {
      setIsGenerating(false)
    }
  }

  // Fallback function to simulate streaming when the API is not available
  const simulateStreamingResponse = async (userInput: string) => {
    let response = ""

    // Generate a contextual response based on the input
    if (userInput.toLowerCase().includes("hello") || userInput.toLowerCase().includes("hi")) {
      response =
        "Hello! I'm running as a simulated local LLM since I couldn't connect to your Llama 3 instance. How can I help you today?"
    } else if (userInput.toLowerCase().includes("help")) {
      response =
        "I'm here to help! You can ask me questions, request information, or use prompts to guide our conversation. Try typing '/prompt' to access your saved prompts. Note: I'm currently running in simulation mode since I couldn't connect to your local LLM."
    } else if (userInput.toLowerCase().includes("llama") || userInput.toLowerCase().includes("model")) {
      response =
        "Llama 3 is Meta's latest open language model. To use the actual model instead of this simulation, you'll need to run Llama 3 locally using a framework like llama.cpp or through an API server, then configure the endpoint in the settings."
    } else if (userInput.toLowerCase().includes("prompt")) {
      response =
        "I see you're interested in prompts! You can access your saved prompts by typing '/prompt' or '/p' followed by the prompt name. You can also press Ctrl+Space to open the prompt sidebar."
    } else {
      response =
        "I'm currently running in simulation mode since I couldn't connect to your local LLM. To use the actual Llama 3 model, please make sure it's running locally and configure the endpoint in settings. What else would you like to know?"
    }

    // Simulate streaming by revealing the response character by character
    let currentResponse = ""
    for (let i = 0; i < response.length; i++) {
      currentResponse += response[i]
      setStreamedResponse(currentResponse)
      // Random delay between 10-30ms per character for realistic typing effect
      await new Promise((resolve) => setTimeout(resolve, Math.random() * 20 + 10))
    }

    // Add the complete response as a message
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: response,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, assistantMessage])
    setStreamedResponse("")
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Send message on Enter without Shift
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      if (!showPromptSuggestions && !isGenerating) {
        handleSendMessage()
      }
    }

    // Open prompt sidebar with keyboard shortcut (Ctrl+Space)
    if (e.key === " " && e.ctrlKey) {
      e.preventDefault()
      setShowPromptSidebar(true)
    }

    // Navigate through suggestions with arrow keys
    if (showPromptSuggestions && (e.key === "ArrowUp" || e.key === "ArrowDown")) {
      e.preventDefault()
      // This would be implemented to navigate through suggestions
    }

    // Close suggestions with Escape
    if (e.key === "Escape") {
      setShowPromptSuggestions(false)
      setShowPromptSidebar(false)
    }
  }

  const insertPrompt = (promptContent: string) => {
    // Replace trigger text with prompt content
    const triggerRegex = /\/prompt\s*.*$|\/p\s*.*$/
    const newInput = input.replace(triggerRegex, promptContent)

    setInput(newInput)
    setShowPromptSuggestions(false)

    // Focus back on input
    setTimeout(() => {
      inputRef.current?.focus()
    }, 0)
  }

  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const updateModelConfig = (newConfig: ModelConfig) => {
    setModelConfig(newConfig)
    setShowModelSettings(false)
    toast({
      title: "Settings updated",
      description: `Model endpoint set to ${newConfig.endpoint}`,
    })
  }

  return (
    <main className="flex min-h-screen flex-col bg-gray-50">
      <div className="bg-white p-4 border-b flex items-center">
        <Link href="/">
          <Button variant="ghost" size="icon" className="mr-2">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-xl font-semibold">Local LLM Chat</h1>
        <div className="ml-auto flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={() => setShowModelSettings(true)}>
            <Settings className="h-4 w-4 mr-2" />
            Model Settings
          </Button>
          <Button variant="outline" size="sm" onClick={() => setShowPromptSidebar(!showPromptSidebar)}>
            <Sparkles className="h-4 w-4 mr-2" />
            Prompts
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 flex flex-col">
          <ScrollArea className="flex-1 p-4">
            <div className="max-w-3xl mx-auto">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex mb-4 ${message.role === "assistant" ? "justify-start" : "justify-end"}`}
                >
                  {message.role === "assistant" && (
                    <Avatar className="h-8 w-8 mr-2">
                      <Bot className="h-5 w-5" />
                    </Avatar>
                  )}

                  <div
                    className={`max-w-[80%] ${message.role === "assistant" ? "bg-white" : "bg-blue-500 text-white"} rounded-lg p-3 shadow-sm`}
                  >
                    <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                    <div className={`text-xs mt-1 ${message.role === "assistant" ? "text-gray-500" : "text-blue-100"}`}>
                      {formatTimestamp(message.timestamp)}
                    </div>
                  </div>

                  {message.role === "user" && (
                    <Avatar className="h-8 w-8 ml-2 bg-blue-500">
                      <User className="h-5 w-5" />
                    </Avatar>
                  )}
                </div>
              ))}

              {/* Streaming response */}
              {streamedResponse && (
                <div className="flex mb-4 justify-start">
                  <Avatar className="h-8 w-8 mr-2">
                    <Bot className="h-5 w-5" />
                  </Avatar>
                  <div className="max-w-[80%] bg-white rounded-lg p-3 shadow-sm">
                    <div className="text-sm whitespace-pre-wrap">{streamedResponse}</div>
                  </div>
                </div>
              )}

              {/* Loading indicator */}
              {isGenerating && !streamedResponse && (
                <div className="flex mb-4 justify-start">
                  <Avatar className="h-8 w-8 mr-2">
                    <Bot className="h-5 w-5" />
                  </Avatar>
                  <div className="max-w-[80%] bg-white rounded-lg p-3 shadow-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 rounded-full bg-gray-300 animate-pulse"></div>
                      <div className="w-2 h-2 rounded-full bg-gray-300 animate-pulse delay-150"></div>
                      <div className="w-2 h-2 rounded-full bg-gray-300 animate-pulse delay-300"></div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          <div className="p-4 border-t bg-white relative">
            <div className="max-w-3xl mx-auto relative">
              <Textarea
                ref={inputRef}
                placeholder="Type a message... (try typing '/prompt' or '/p')"
                className="pr-10 min-h-[60px] resize-none"
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                disabled={isGenerating}
              />
              <Button
                size="icon"
                className="absolute right-2 bottom-2 h-8 w-8"
                onClick={handleSendMessage}
                disabled={!input.trim() || isGenerating}
              >
                <Send className="h-4 w-4" />
              </Button>

              {showPromptSuggestions && (
                <PromptSuggestions
                  searchQuery={triggerText}
                  onSelectPrompt={insertPrompt}
                  onClose={() => setShowPromptSuggestions(false)}
                />
              )}
            </div>
          </div>
        </div>

        {showPromptSidebar && (
          <div className="w-80 border-l bg-white flex flex-col h-full">
            <div className="p-3 border-b flex items-center justify-between">
              <h2 className="font-semibold">Saved Prompts</h2>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setShowPromptSidebar(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <PromptSidebar onSelectPrompt={insertPrompt} />
          </div>
        )}

        <ModelSettings
          open={showModelSettings}
          onOpenChange={setShowModelSettings}
          modelConfig={modelConfig}
          onSave={updateModelConfig}
        />
      </div>
    </main>
  )
}

