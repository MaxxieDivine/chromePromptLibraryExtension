# Prompt Manager

<p align="center">
  <img src="public/images/logo.png" alt="Prompt Manager Logo" width="200" />
</p>

A Chrome extension for managing, organizing, and quickly inserting AI prompts across any website with AI chat interfaces.

## Table of Contents

- [Product Overview](#product-overview)
  - [The Problem](#the-problem)
  - [Our Solution](#our-solution)
  - [Key Features](#key-features)
  - [Use Cases](#use-cases)
- [Technical Documentation](#technical-documentation)
  - [Architecture](#architecture)
  - [Technology Stack](#technology-stack)
  - [Extension Structure](#extension-structure)
  - [Local LLM Integration](#local-llm-integration)
  - [Development Setup](#development-setup)
  - [Customization](#customization)
- [Contributing](#contributing)
- [License](#license)

## Product Overview

### The Problem

As AI tools become increasingly integrated into our daily workflows, users face several challenges:

1. **Prompt Repetition**: Frequently retyping the same complex prompts across different AI platforms
2. **Inconsistent Results**: Slight variations in prompts lead to inconsistent AI outputs
3. **Knowledge Management**: Difficulty organizing and retrieving effective prompts
4. **Context Switching**: Lost productivity when switching between prompt storage and AI interfaces
5. **Collaboration Barriers**: Teams struggle to share and standardize effective prompts

These challenges result in wasted time, reduced productivity, and inconsistent AI outputs.

### Our Solution

Prompt Manager is a Chrome extension that serves as your personal prompt library, accessible wherever you use AI tools. It allows you to:

- Save, categorize, and organize your most effective prompts
- Insert prompts into any text field with keyboard shortcuts or triggers
- Share prompt collections with team members
- Customize prompts with variables before insertion
- Work with both cloud-based and local LLMs

### Key Features

- **Prompt Library**: Organize prompts with folders and tags
- **Quick Insertion**: Type `/prompt` or use keyboard shortcuts to access your prompts
- **Variable Replacement**: Define placeholders in prompts that can be filled in before use
- **Dark Mode & Themes**: Customize the interface with multiple color themes
- **Local LLM Support**: Use with local models like Llama 3 or stay in demo mode
- **Cross-site Compatibility**: Works on ChatGPT, Claude, Bard, and any other text-based AI interface

### Use Cases

#### Content Creation
Store templates for blog outlines, social media posts, and email responses that can be quickly inserted and customized.

#### Software Development
Maintain a library of code review prompts, documentation templates, and debugging strategies that produce consistent results.

#### Research
Save complex research methodology prompts that can be reused across different research topics with variable substitution.

#### Customer Support
Standardize response templates that can be customized for individual customer inquiries, ensuring consistent tone and quality.

#### Education
Create prompt templates for generating quizzes, explanations, and learning materials that can be adapted to different subjects.

## Technical Documentation

### Architecture

Prompt Manager is built as a Chrome extension with a React-based UI and a background service for cross-site functionality. The architecture consists of:

1. **Popup Interface**: The main management dashboard for organizing prompts
2. **Content Scripts**: Detect text fields and implement trigger detection
3. **Background Service**: Handles storage and cross-tab communication
4. **Local LLM Connector**: Optional integration with locally-running LLMs

<p align="center">
  <img src="public/images/architecture.png" alt="Architecture Diagram" width="600" />
</p>

### Technology Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **State Management**: React Context API
- **UI Components**: shadcn/ui component library
- **Storage**: Chrome Extension Storage API
- **LLM Integration**: REST API for local model communication

### Extension Structure

```
prompt-manager/
├── app/                      # Next.js app structure
│   ├── page.tsx              # Main prompt management interface
│   ├── chatbot-demo/         # Demo chatbot interface
│   └── layout.tsx            # Shared layout with theme provider
├── components/               # React components
│   ├── sidebar.tsx           # Navigation sidebar
│   ├── prompt-list.tsx       # Prompt card grid view
│   ├── create-prompt-dialog.tsx  # Prompt creation modal
│   ├── prompt-detail-dialog.tsx  # Prompt viewing/editing modal
│   ├── prompt-suggestions.tsx    # Trigger-based prompt selector
│   ├── prompt-sidebar.tsx        # Sidebar prompt browser
│   ├── theme-switcher.tsx        # Theme selection dropdown
│   ├── model-settings.tsx        # LLM configuration dialog
│   └── ui/                   # shadcn/ui components
├── public/                   # Static assets
├── manifest.json             # Chrome extension manifest
└── background.js             # Extension background script
```

### Local LLM Integration

Prompt Manager can connect to locally running LLM servers that implement the OpenAI-compatible API format:

1. **API Compatibility**: Works with servers exposing an OpenAI-compatible `/chat/completions` endpoint
2. **Supported Frameworks**: Compatible with llama.cpp, text-generation-webui, LM Studio, and similar tools
3. **Demo Mode**: Fallback simulation mode when no LLM is available
4. **Configuration**: Customizable endpoint, API key, and model selection

The integration uses streaming responses for real-time feedback and handles connection failures gracefully.

### Development Setup

#### Prerequisites

- Node.js 18+ and npm/yarn
- Chrome browser for testing

#### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/prompt-manager.git
   cd prompt-manager