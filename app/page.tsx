"use client";

import React, { useCallback, useRef, useState, useEffect } from "react";
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  Panel,
  useReactFlow,
  ReactFlowProvider,
  BackgroundVariant
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { Sidebar } from "@/components/Sidebar";
import { RightSidebar } from "@/components/RightSidebar";
import { PromptNode } from "@/components/nodes/PromptNode";
import { ReferenceNode } from "@/components/nodes/ReferenceNode";
import { CreativeDirectionNode } from "@/components/nodes/CreativeDirectionNode";
import { ResultNode } from "@/components/nodes/ResultNode";
import { ModelNode } from "@/components/nodes/ModelNode";
import { TextInfoNode } from "@/components/nodes/TextInfoNode";
import { ProductDescriptionNode } from "@/components/nodes/ProductDescriptionNode";
import { GoalCampaignNode } from "@/components/nodes/GoalCampaignNode";
import { RatioNode } from "@/components/nodes/RatioNode";

const nodeTypes = {
  prompt: PromptNode,
  reference: ReferenceNode,
  direction: CreativeDirectionNode,
  textinfo: TextInfoNode,
  product_description: ProductDescriptionNode,
  goal: GoalCampaignNode,
  ratio: RatioNode,
  model: ModelNode,
  result: ResultNode,
};

const STORAGE_KEY_NODES = "nano-banana-nodes";
const STORAGE_KEY_EDGES = "nano-banana-edges";
const STORAGE_KEY_PROJECTS = "nano-banana-projects";

const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];

function NodeSpaceInner() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Persistence: Load on mount
  useEffect(() => {
    const savedNodes = localStorage.getItem(STORAGE_KEY_NODES);
    const savedEdges = localStorage.getItem(STORAGE_KEY_EDGES);

    if (savedNodes) {
      try {
        const parsedNodes = JSON.parse(savedNodes);
        if (Array.isArray(parsedNodes)) {
          setNodes(parsedNodes);
        }
      } catch (e) { console.error("Persistence Load Error (Nodes):", e); }
    }

    if (savedEdges) {
      try {
        const parsedEdges = JSON.parse(savedEdges);
        if (Array.isArray(parsedEdges)) {
          setEdges(parsedEdges);
        }
      } catch (e) { console.error("Persistence Load Error (Edges):", e); }
    }
  }, [setNodes, setEdges]);

  // Persistence: Save on change (Stripping heavy assets to avoid QuotaExceededError)
  useEffect(() => {
    try {
      const lightweightNodes = nodes.map(node => {
        if (node.type === 'reference') {
          return { ...node, data: { ...node.data, label: "" } }; // Strip heavy base64
        }
        if (node.type === 'result') {
          return { ...node, data: { ...node.data, images: [] } }; // Strip heavy generated images
        }
        return node;
      });
      localStorage.setItem(STORAGE_KEY_NODES, JSON.stringify(lightweightNodes));
    } catch (e) {
      console.warn("Storage Status: Persistence limit reached. Some assets were not saved.", e);
    }
  }, [nodes]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_EDGES, JSON.stringify(edges));
    } catch (e) {
      console.warn("Storage Status: Edge persistence failed.", e);
    }
  }, [edges]);

  // Reset Logic
  const handleReset = useCallback(() => {
    if (confirm("Reset the entire engine? This will delete all nodes and connections.")) {
      localStorage.removeItem(STORAGE_KEY_NODES);
      localStorage.removeItem(STORAGE_KEY_EDGES);
      setNodes(initialNodes);
      setEdges(initialEdges);
      window.location.reload(); // Hard refresh to clear any in-memory node local states
    }
  }, [setNodes, setEdges]);

  // Refs to always access latest state inside setTimeout/callbacks
  const nodesRef = useRef(nodes);
  const edgesRef = useRef(edges);
  useEffect(() => { nodesRef.current = nodes; }, [nodes]);
  useEffect(() => { edgesRef.current = edges; }, [edges]);
  const { screenToFlowPosition } = useReactFlow();

  // Project Management State
  const [projectName, setProjectName] = useState("New Campaign");
  const [projects, setProjects] = useState<any[]>([]);

  // Load projects on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PROJECTS);
    if (saved) {
      try {
        setProjects(JSON.parse(saved));
      } catch (e) { console.error("Failed to load projects", e); }
    }
  }, []);

  const saveProject = useCallback(() => {
    const newProject = {
      id: `proj-${Date.now()}`,
      name: projectName,
      date: new Date().toISOString(),
      nodes: nodes.map(n => {
        if (n.type === 'reference') return { ...n, data: { ...n.data, label: "" } };
        if (n.type === 'result') return { ...n, data: { ...n.data, images: [] } };
        return n;
      }),
      edges: edges
    };

    const updatedProjects = [newProject, ...projects].slice(0, 20); // Keep last 20
    setProjects(updatedProjects);
    localStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify(updatedProjects));
    alert("Project saved to workspace!");
  }, [nodes, edges, projectName, projects]);

  const loadProject = useCallback((id: string) => {
    const proj = projects.find(p => p.id === id);
    if (proj) {
      setNodes(proj.nodes);
      setEdges(proj.edges);
      setProjectName(proj.name);
    }
  }, [projects, setNodes, setEdges]);

  const exportJson = useCallback(() => {
    const dataStr = JSON.stringify({ name: projectName, nodes, edges }, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = `${projectName.replace(/\s+/g, '_')}_flow.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  }, [nodes, edges, projectName]);

  const deleteProject = useCallback((id: string) => {
    const updated = projects.filter(p => p.id !== id);
    setProjects(updated);
    localStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify(updated));
  }, [projects]);

  const importJson = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (data.nodes && data.edges) {
          setNodes(data.nodes);
          setEdges(data.edges);
          if (data.name) setProjectName(data.name);
          alert("Flow imported successfully!");
        }
      } catch (err) {
        alert("Invalid JSON file");
      }
    };
    reader.readAsText(file);
  }, [setNodes, setEdges, setProjectName]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({ ...params, animated: true }, eds)),
    [setEdges]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const rawData = event.dataTransfer.getData("application/reactflow");

      if (!rawData) return;

      let type = rawData;
      let data = {};

      try {
        const parsed = JSON.parse(rawData);
        type = parsed.type;
        data = parsed.data || {};
      } catch (e) {
        // Fallback for non-json data
      }

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      let finalData: any = { ...data };
      if (type === 'reference') {
        const refCount = nodes.filter(n => n.type === 'reference').length + 1;
        finalData.refName = `Reference ${String(refCount).padStart(2, '0')}`;
      }

      const newNode: Node = {
        id: `node-${Date.now()}`,
        type,
        position,
        data: { label: "", ...finalData },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [screenToFlowPosition, setNodes, nodes]
  );

  const addNode = useCallback((type: string, customData?: any) => {
    const id = `node-${Date.now()}`;
    let finalData: any = { ...customData };
    if (type === 'reference') {
      const refCount = nodes.filter(n => n.type === 'reference').length + 1;
      finalData.refName = `Reference ${String(refCount).padStart(2, '0')}`;
    }
    const newNode: Node = {
      id,
      type,
      position: {
        x: 400 + Math.random() * 100,
        y: 200 + Math.random() * 100
      },
      data: {
        label: "",
        ...finalData
      },
    };
    setNodes((nds) => nds.concat(newNode));
  }, [setNodes, nodes]);

  const performApiCall = useCallback(async (prompt: string, count: number, referenceImages: string[], ratio: string = "1:1", artDirection?: any) => {
    try {
      console.log("Nano Banana Engine: Inbound Request", { count, ratio, artDirection: !!artDirection });
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          count,
          referenceImages,
          ratio,
          artDirection,
          timestamp: Date.now() // Unique ID to prevent result caching
        }),
        cache: 'no-store'
      });

      const result = await response.json();

      if (result.images) {
        setNodes((nds) =>
          nds.map((node) => {
            if (node.type === 'result') {
              return {
                ...node,
                data: { ...node.data, isGenerating: false, images: result.images, ratio },
              };
            }
            return node;
          })
        );
      } else {
        throw new Error(result.error || "Generation failed");
      }
    } catch (error: any) {
      console.error("Inference Error:", error);
      setNodes((nds) =>
        nds.map((node) => {
          if (node.type === 'result') {
            return { ...node, data: { ...node.data, isGenerating: false } };
          }
          return node;
        })
      );
      alert(`Generation failed: ${error.message}`);
    }
  }, [setNodes]);

  const runArtAnalysis = useCallback(async (nodeId: string) => {
    // Use refs to always get the LATEST state
    const currentNodes = nodesRef.current;
    const currentEdges = edgesRef.current;

    const connectedEdges = currentEdges.filter(e => e.target === nodeId);
    const referenceNode = currentNodes.find(n => connectedEdges.some(e => e.source === n.id) && n.type === 'reference');
    const productNode = currentNodes.find(n => connectedEdges.some(e => e.source === n.id) && n.type === 'product_description');
    const goalNode = currentNodes.find(n => connectedEdges.some(e => e.source === n.id) && n.type === 'goal');

    const base64Image = (referenceNode?.data as any)?.label;
    const productContext = productNode ? {
      category: (productNode.data as any).category,
      detail: (productNode.data as any).detail
    } : null;
    const goalContext = goalNode ? {
      objective: (goalNode.data as any).objective,
      target: (goalNode.data as any).target
    } : null;

    if (!base64Image && !productContext) {
      alert("Please connect a Reference Image or Product Description node first.");
      return;
    }

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: 'analyze',
          image: base64Image,
          product: productContext,
          goal: goalContext
        }),
      });

      const result = await response.json();
      if (result.analysis) {
        setNodes(prev => prev.map(n => n.id === nodeId ? { ...n, data: { ...n.data, value: result.analysis } } : n));
      }
    } catch (err) {
      console.error("Analysis Error:", err);
    }
  }, [setNodes]);

  const runGeneration = useCallback(async () => {
    console.log("Nano Banana Flow: Run Sequence Started");

    // 1. Set processing locks
    setNodes((nds) =>
      nds.map((node) => {
        if (node.type === 'model') return { ...node, data: { ...node.data, isProcessing: true } };
        if (node.type === 'result') return { ...node, data: { ...node.data, isGenerating: true } };
        return node;
      })
    );

    // 2. Synthesis Phase (Small delay to show UI feedback)
    setTimeout(() => {
      // Use refs to always get the LATEST state (not stale closure)
      const currentNodes = nodesRef.current;
      const currentEdges = edgesRef.current;

      const modelNode = currentNodes.find(n => n.type === 'model');
      if (!modelNode) {
        console.warn("Synthesis Failed: No AI Model node in graph");
        setNodes(nds => nds.map(n => ({ ...n, data: { ...n.data, isProcessing: false, isGenerating: false } })));
        return;
      }

      const connectedEdges = currentEdges.filter(e => e.target === modelNode.id);
      const sourceNodes = connectedEdges.map(e => currentNodes.find(n => n.id === e.source)).filter(Boolean);

      const promptNode = sourceNodes.find(n => n?.type === 'prompt');
      const directionNode = sourceNodes.find(n => n?.type === 'direction');
      const referenceNodes = sourceNodes.filter(n => n?.type === 'reference');
      const textNode = sourceNodes.find(n => n?.type === 'textinfo');
      const descriptionNode = sourceNodes.find(n => n?.type === 'product_description');
      const goalNode = sourceNodes.find(n => n?.type === 'goal');
      const ratioNode = sourceNodes.find(n => n?.type === 'ratio');

      // --- Context Extraction ---
      const productType = (descriptionNode?.data as any)?.productType || "Apparel";
      const productDetails = descriptionNode?.data?.label || "";
      const campaignObjective = (goalNode?.data as any)?.objective || "Brand Awareness";
      const targetAudience = (goalNode?.data as any)?.audience || "";
      const selectedRatio = (ratioNode?.data as any)?.label || "3:4";

      const promptBase = promptNode?.data?.label || `A professional ${productType} product shot`;
      const d = (directionNode?.data?.value || {}) as any;
      const referenceImages = referenceNodes.map(n => (n?.data as any)?.label).filter(Boolean);

      // ═══ Debug: Log ALL extracted node data ═══
      console.log("═══ NODE INPUTS ═══");
      console.log("  Prompt:", promptBase);
      console.log("  Product:", productType, "|", String(productDetails || "").substring(0, 60));
      console.log("  Goal:", campaignObjective, "| Audience:", targetAudience);
      console.log("  Ratio:", selectedRatio);
      console.log("  Direction:", JSON.stringify(d));
      console.log("  References:", referenceImages.length, "images");
      console.log("  Text:", (textNode?.data as any)?.label || "(none)");
      console.log("═══════════════════");

      // --- Constraint Engineering (Absolute Product Integrity) ---
      const deformationConstraint = `CRITICAL: PIXEL-PERFECT TEXT INTEGRITY. The provided [ASSET] data is a FROZEN GEOMETRY. Do NOT "interpret" or "re-draw" any text, letters, or numbers on the product packaging. You must take the product exactly as it appears in the reference. ZERO TOLERANCE for warping, blurring, or deforming the fonts, brand names, or technical text on the ${productType}. Treat the product surface as an immutable layer.`;

      // --- Radical Realism Mandate (Anti-AI Integrity) ---
      const qualityMandate = `CORE QUALITY MANDATE: Photorealistic RAW documentary photography, shot on 35mm film or high-end DSLR, visible micro-grain, authentic lens texture. NO ARTIFICIAL POLISH. Skin: Authentic human skin with deep texture, visible pores, uneven pigmentation, natural sweat/oil (not waxy), and minor flaws. Lighting: Imperfect natural lighting, soft shadows, realistic light bounce, light leak artifacts. Physics: Realistic material interaction, gravity-aware fabric, authentic liquid physics.`.trim();
      const qualityExclusions = `MANDATORY EXCLUSIONS: plastic skin, waxy texture, "AI look", midjourney aesthetic, CGI render, 3D model look, airbrushed smoothness, perfect symmetry, porcelain doll finish, instagram filter, HDR artifacts, over-sharpening, artificial skin glow, digital smoothness, perfectly straight machine-edges.`.trim();

      // --- Creative Expansion ---
      const styleStr = d.style ? ` styled in a ${d.style} manner` : "";
      const lightingStr = d.lighting ? `, with ${d.lighting} lighting` : "";
      const textureStr = d.texture ? `, focusing on ${d.texture} details` : "";
      const framingStr = d.framing ? `, ${d.framing} composition` : "";
      const moodStr = d.mood ? `. Mood: ${d.mood}` : "";
      const colorsStr = d.colors ? `. Color palette: ${d.colors}` : "";
      const audienceContext = targetAudience ? ` targeted at ${targetAudience}` : "";

      const campaignStr = `. CAMPAIGN OBJECTIVE: This is for a ${campaignObjective} campaign${audienceContext}. Surround the product with a creatively composed environment that enhances its premium value without distracting from its form.`;

      let overlaysStr = "";
      if (textNode && (textNode.data as any).label) {
        const selectedFont = (textNode.data as any).font || "Inter";
        overlaysStr = `. POSTER DESIGN: Seamlessly integrate the text "${(textNode.data as any).label}" into the scene as high-quality commercial typography. ${(textNode.data as any).subtext ? `Include fine-print subtext: "${(textNode.data as any).subtext}"` : ""}. Typography should be bold, elegant, and positioned for maximum aesthetic impact. MANDATORY STYLE: Use the specialized aesthetic of the "${selectedFont}" Google Font for all lettering. Use white or gold lettering.`;
      } else {
        overlaysStr = ". NO EXTRA TEXT: Under no circumstances should the AI generate any additional text, letters, scrambled characters, or watermarks beyond what is provided in the branding assets.";
      }

      let logoStr = "";
      if (referenceNodes.length > 0) {
        const logoMappings = (referenceNodes as Node[]).map((n, idx) => {
          const name = (n.data as any).refName || `Reference ${idx + 1}`;
          return `[ASSET ${idx + 1}]: "${name}"`;
        }).join(", ");
        logoStr = `. PIXEL-PERFECT GRAPHIC REPLICATION: I have provided exactly ${referenceNodes.length} specific visual assets: ${logoMappings}. You MUST replicate these provided graphics exactly onto the product surface. Do NOT modify the graphics. Do NOT invent your own text, words, or logos. Treat the provided assets as the ONLY source of visual branding. Use high-precision material mapping.`;
      }

      const descriptionStr = productDetails ? `. PRODUCT SPECS: ${productDetails}` : "";
      const ratioStr = `. OUTPUT ASPECT RATIO: ${selectedRatio}`;

      const finalPrompt = `${qualityMandate}. CAMPAIGN STRATEGY: ${promptBase}. PRODUCT TYPE: ${productType}${descriptionStr}${logoStr}${campaignStr}${styleStr}${lightingStr}${textureStr}${framingStr}${moodStr}${colorsStr}${ratioStr}${overlaysStr}. ${deformationConstraint}. ${qualityExclusions}. NEGATIVE DIRECTIVE: No hallucinated text, no scrambled letters, no watermarks, no warped logos, no morphed shapes.`.trim();

      const connectedResultNode = currentNodes.find(rn => rn.type === 'result' && currentEdges.some(e => e.source === modelNode.id && e.target === rn.id)) || currentNodes.find(n => n.type === 'result');
      const targetCount = (connectedResultNode?.data as any)?.count || 4;

      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === modelNode.id) {
            return {
              ...node,
              data: { ...node.data, isProcessing: false, engineeredPrompt: finalPrompt },
            };
          }
          return node;
        })
      );

      const artDirectionData = directionNode ? (directionNode.data as any)?.value : undefined;
      console.log(`Nano Banana Engine: Stage 2 - Dispatching (Count: ${targetCount}, Ratio: ${selectedRatio}, ArtDirection: ${!!artDirectionData})`);
      performApiCall(finalPrompt, targetCount, referenceImages, selectedRatio, artDirectionData);
    }, 600);
  }, [performApiCall, setNodes]);

  // Inject handlers into nodes
  const nodesWithHandlers = React.useMemo(() => {
    return nodes.map(node => {
      // Logic to see if this model is currently "generating" via its children
      const isChildGenerating = node.type === 'model' && nodes.some(n =>
        n.type === 'result' &&
        edges.some(e => e.source === node.id && e.target === n.id) &&
        n.data.isGenerating
      );

      return {
        ...node,
        data: {
          ...node.data,
          onRun: node.type === 'model' ? runGeneration : undefined,
          onAnalyze: node.type === 'direction' ? runArtAnalysis : undefined,
          isGenerating: isChildGenerating || node.data.isGenerating,
          onChange: (val: any) => {
            setNodes((nds) =>
              nds.map((n) => n.id === node.id ? {
                ...n,
                data: { ...n.data, [node.type === 'direction' ? 'value' : 'label']: val }
              } : n)
            );
          },
          onChangeProductType: (val: any) => {
            setNodes((nds) =>
              nds.map((n) => n.id === node.id ? {
                ...n,
                data: { ...n.data, productType: val }
              } : n)
            );
          },
          onChangeObjective: (val: any) => {
            setNodes((nds) =>
              nds.map((n) => n.id === node.id ? {
                ...n,
                data: { ...n.data, objective: val }
              } : n)
            );
          },
          onChangeAudience: (val: any) => {
            setNodes((nds) =>
              nds.map((n) => n.id === node.id ? {
                ...n,
                data: { ...n.data, audience: val }
              } : n)
            );
          },
          onChangeSubtext: (val: any) => {
            setNodes((nds) =>
              nds.map((n) => n.id === node.id ? {
                ...n,
                data: { ...n.data, subtext: val }
              } : n)
            );
          },
          onChangeFont: (val: any) => {
            setNodes((nds) =>
              nds.map((n) => n.id === node.id ? {
                ...n,
                data: { ...n.data, font: val }
              } : n)
            );
          }
        },
      };
    });
  }, [nodes, edges, runGeneration, runArtAnalysis, setNodes]);

  return (
    <div className="flex w-full h-screen bg-[#080808] overflow-hidden font-sans selection:bg-blue-500/30">
      <Sidebar onAddNode={addNode} />

      <RightSidebar
        projectName={projectName}
        setProjectName={setProjectName}
        onSaveProject={saveProject}
        onExportJson={exportJson}
        onImportJson={importJson}
        projects={projects}
        onLoadProject={loadProject}
        onDeleteProject={deleteProject}
        onReset={handleReset}
      />

      <div className="flex-1 relative">
        <ReactFlow
          nodes={nodesWithHandlers}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDragOver={onDragOver}
          onDrop={onDrop}
          nodeTypes={nodeTypes}
          fitView
          colorMode="dark"
          defaultEdgeOptions={{
            style: { strokeWidth: 2, stroke: '#3b82f6' },
            animated: true,
          }}
          deleteKeyCode={["Delete", "Backspace"]}
        >
          <Background
            className="bg-[#050505]"
            variant={BackgroundVariant.Lines}
            gap={40}
            size={1}
            color="rgba(255,255,255,0.02)"
          />
          <Controls className="!bg-[#121212]/80 !border-white/10 !shadow-2xl backdrop-blur-md !fill-white" />
        </ReactFlow>
      </div>
    </div>
  );
}

export default function NodeSpace() {
  return (
    <ReactFlowProvider>
      <NodeSpaceInner />
    </ReactFlowProvider>
  );
}
