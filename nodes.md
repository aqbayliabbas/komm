# Campaign Image Generator - Node System

This document outlines all available nodes in the Campaign Image Generator application and their specific functions.

## Overview

The application uses a node-based workflow where each node serves a specific purpose in the image generation pipeline. Nodes can be connected to pass data through the system, culminating in AI-powered image generation.

---

## Nodes

### 1. Prompt Brief Node

**Type:** `prompt`  
**File:** `PromptNode.tsx`  
**Output Handle:** Right

**Purpose:**
The Prompt Brief node serves as the foundation of your campaign. It captures the core creative concept and vision that will drive the entire image generation process.

**Input Fields:**
- **Campaign Concept** (textarea) - Describe your main campaign idea, visual direction, and key messaging. This is the primary input that defines what the generated images should convey.

**Data Stored:**
- `basePrompt` - The campaign concept text

**Function:**
Acts as the starting point for prompt optimization. The text entered here is combined with data from other nodes to create detailed, context-aware image generation prompts.

---

### 2. Image References Node

**Type:** `imageReference`  
**File:** `ImageReferenceNode.tsx`  
**Output Handle:** Right  
**Border Color:** Purple

**Purpose:**
The Image References node allows you to upload visual inspiration and annotate specific elements you want to carry through to the generated images.

**Input Fields:**
- **Upload Images** (file input) - Upload one or multiple reference images
- **Notes** (textarea per image) - Add annotations describing what's important about each reference image (e.g., color palette, composition, mood)

**Data Stored:**
- `images` array containing:
  - `id` - Unique identifier
  - `url` - Base64 encoded image data
  - `comments` - User annotations for that image

**Function:**
The system analyzes uploaded images and their descriptions to understand visual preferences. This information is incorporated into the prompt optimization to ensure generated images align with the visual direction established by the references.

---

### 3. Creative Direction Node

**Type:** `creativeDirection`  
**File:** `CreativeDirectionNode.tsx`  
**Output Handle:** Right

**Purpose:**
The Creative Direction node provides granular control over visual aesthetics and artistic direction through pre-configured sliders and dropdown menus.

**Input Fields:**

**Sliders (1-10 scale):**
- **Energy** - Controls visual dynamism and movement (Low = calm and serene, High = dynamic and bold)
- **Sophistication** - Defines visual refinement level (Low = approachable and friendly, High = premium and refined)
- **Warmth** - Sets color temperature bias (Low = cool tones, High = warm tones)
- **Contrast** - Controls visual intensity (Low = soft and subtle, High = bold and striking)

**Dropdowns:**
- **Camera Angle** - Options: Wide Shot, Medium Shot, Close-Up, Overhead, Low Angle, Profile, Macro
- **Lighting** - Options: Natural, Golden Hour, Studio, Moody
- **Mood** - Various mood options to set emotional tone
- **Art Style** - Options: Photography, Illustration, 3D, Watercolor, Digital, Sketch, Vector, Mixed Media
- **Color Palette** (text input) - Describe desired colors (e.g., "vibrant blues and oranges", "monochrome")

**Data Stored:**
- `feelings` - Object containing slider values
- `cameraAngle`, `lighting`, `mood`, `style` - Selected dropdown values
- `colorPalette` - Text description of color scheme

**Function:**
Transforms qualitative design preferences into specific visual parameters that the prompt optimizer uses to guide image generation. These settings ensure consistency with the desired artistic direction.

---

### 4. Strategy Node

**Type:** `strategy`  
**File:** `StrategyNode.tsx`  
**Output Handle:** Right

**Purpose:**
The Strategy node captures business and marketing context that informs how the campaign should be positioned and targeted.

**Input Fields:**
- **Target Audience** (textarea) - Describe who the campaign is for (demographics, interests, values, etc.)
- **Campaign Goal** (textarea) - Define the primary objective (awareness, conversion, engagement, etc.)
- **Product Description** (textarea) - Describe what's being marketed and its key features
- **Key Messages** (textarea) - List the core messages you want the visuals to communicate

**Data Stored:**
- `targetAudience` - Target audience description
- `campaignGoal` - Campaign objective
- `productDescription` - Product details
- `keyMessages` - Key messaging points

**Function:**
Provides strategic context to the prompt optimizer. The system analyzes this information to understand audience expectations, campaign intent, and product positioning, then generates prompts that align the visual output with strategic goals.

---

### 5. Gemini Processor Node (Generate)

**Type:** `model`  
**File:** `ModelNode.tsx`  
**Input Handle:** Left  
**Output Handle:** Right  
**Border Color:** Purple

**Purpose:**
The Gemini Processor node is the orchestration hub. It collects data from all connected input nodes, optimizes them into detailed prompts, and processes image generation requests.

**Input Fields:**
- **Generation Count** (automatic from dropdown) - Number of image variations to generate (1x, 2x, 4x, 6x)
- **Generate Images Button** - Triggers the generation pipeline

**Data Stored:**
- `generationCount` - Number of variations requested

**Workflow:**
1. Collects data from all available input nodes (Prompt, Image References, Creative Direction, Strategy)
2. Runs data through the Prompt Optimization Engine
3. Validates that all required inputs are present
4. Sends optimized prompts to Google Gemini API
5. Processes responses and routes them to the Results node

**Function:**
Acts as the processing core that intelligently synthesizes all input node data into professional-grade image generation prompts. The optimization engine ensures context awareness across all inputs to produce coherent, on-brand campaign visuals.

---

### 6. Results Node

**Type:** `results`  
**File:** `ResultsNode.tsx`  
**Input Handle:** Left

**Purpose:**
The Results node displays all generated images, their associated prompts, and provides download/copy functionality.

**Features:**
- **Tabbed Interface** - Each generation batch appears as a separate tab
- **Prompt Display** - Shows the optimized prompt used for each batch
- **Image Grid** - Displays generated images with metadata
- **Actions per Image:**
  - **Copy** button - Copies the image prompt to clipboard
  - **Download** button - Downloads the image as PNG

**Data Displayed:**
- `metadata.generatedAt` - Timestamp of generation
- `metadata.prompt` - The final optimized prompt sent to the model
- `images[]` - Array of generated images with:
  - `id` - Unique image identifier
  - `prompt` - The specific prompt variation used
  - `imageUrl` - URL/path to the generated image

**Function:**
Serves as the output visualization and management center. Allows users to review generated images, understand what prompts produced them, and export assets for campaign use.

---

## Node Connections & Data Flow

**Typical Workflow:**
```
Prompt Brief ──┐
              ├──→ Gemini Processor ──→ Results
Image Refs   ─┤
Creative Dir ─┤
Strategy ────┘
```

All input nodes (Prompt, Image References, Creative Direction, Strategy) feed into the Gemini Processor, which optimizes their combined data and sends it to the Results node.


This ensures that generated images are coherent, strategically aligned, and visually consistent with the campaign direction.
