"use client";

import React, { useCallback, useRef, useState, useEffect } from "react";
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  useReactFlow,
  ReactFlowProvider,
  Background,
  BackgroundVariant,
  Controls
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { Sidebar } from "@/components/Sidebar";
import { RightSidebar } from "@/components/RightSidebar";
import { PromptNode } from "@/components/nodes/PromptNode";
import { ImageReferenceNode } from "@/components/nodes/ImageReferenceNode";
import { CreativeDirectionNode } from "@/components/nodes/CreativeDirectionNode";
import { ResultsNode } from "@/components/nodes/ResultsNode";
import { ModelNode } from "@/components/nodes/ModelNode";
import { StrategyNode } from "@/components/nodes/StrategyNode";
import { CloneNode } from "@/components/nodes/CloneNode";
import { SpecialDirectiveNode } from "@/components/nodes/SpecialDirectiveNode";

const nodeTypes = {
  prompt: PromptNode,
  imageReference: ImageReferenceNode,
  creativeDirection: CreativeDirectionNode,
  strategy: StrategyNode,
  model: ModelNode,
  results: ResultsNode,
  clone: CloneNode,
  specialDirective: SpecialDirectiveNode,
};

const STORAGE_KEY_NODES = "komm-nodes-v2";
const STORAGE_KEY_EDGES = "komm-edges-v2";
const STORAGE_KEY_PROJECTS = "komm-projects-v2";

function NodeSpaceInner() {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [projectName, setProjectName] = useState("Nouvelle Campagne");
  const [projects, setProjects] = useState<any[]>([]);

  const nodesRef = useRef(nodes);
  const edgesRef = useRef(edges);
  useEffect(() => { nodesRef.current = nodes; }, [nodes]);
  useEffect(() => { edgesRef.current = edges; }, [edges]);

  const { screenToFlowPosition } = useReactFlow();

  // Persistence
  useEffect(() => {
    const savedNodes = localStorage.getItem(STORAGE_KEY_NODES);
    const savedEdges = localStorage.getItem(STORAGE_KEY_EDGES);
    const savedProjects = localStorage.getItem(STORAGE_KEY_PROJECTS);

    if (savedNodes) {
      try { setNodes(JSON.parse(savedNodes)); } catch (e) { console.error(e); }
    }
    if (savedEdges) {
      try { setEdges(JSON.parse(savedEdges)); } catch (e) { console.error(e); }
    }
    if (savedProjects) {
      try { setProjects(JSON.parse(savedProjects)); } catch (e) { console.error(e); }
    }
  }, [setNodes, setEdges]);

  useEffect(() => {
    const lightweightNodes = nodes.map(node => {
      if (node.type === 'imageReference') return { ...node, data: { ...node.data, images: [] } };
      if (node.type === 'results') return { ...node, data: { ...node.data, images: [] } };
      return node;
    });
    localStorage.setItem(STORAGE_KEY_NODES, JSON.stringify(lightweightNodes));
    localStorage.setItem(STORAGE_KEY_EDGES, JSON.stringify(edges));
  }, [nodes, edges]);

  const handleReset = useCallback(() => {
    if (confirm("Réinitialiser tout le moteur ?")) {
      setNodes([]);
      setEdges([]);
      localStorage.removeItem(STORAGE_KEY_NODES);
      localStorage.removeItem(STORAGE_KEY_EDGES);
    }
  }, [setNodes, setEdges]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({ ...params, animated: true, style: { strokeWidth: 2, stroke: '#3b82f6' } }, eds)),
    [setEdges]
  );

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const rawData = event.dataTransfer.getData("application/reactflow");
      if (!rawData) return;

      try {
        const { type, data } = JSON.parse(rawData);
        const position = screenToFlowPosition({ x: event.clientX, y: event.clientY });
        const newNode: Node = {
          id: `node-${Date.now()}`,
          type,
          position,
          data: { ...data },
        };
        setNodes((nds) => nds.concat(newNode));
      } catch (e) { console.error(e); }
    },
    [screenToFlowPosition, setNodes]
  );

  const addNode = useCallback((type: string, data?: any) => {
    const newNode: Node = {
      id: `node-${Date.now()}`,
      type,
      position: { x: 400 + Math.random() * 100, y: 200 + Math.random() * 100 },
      data: { ...data },
    };
    setNodes((nds) => nds.concat(newNode));
  }, [setNodes]);

  const performApiCall = useCallback(async (prompt: string, count: number, referenceImages: string[], artDirection: any, ratio: string = "1:1") => {
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, count, referenceImages, artDirection, ratio }),
      });

      const result = await response.json();
      if (result.images) {
        setNodes((nds) =>
          nds.map((node) => {
            if (node.type === 'results') {
              return { ...node, data: { ...node.data, isGenerating: false, images: result.images } };
            }
            return node;
          })
        );
      } else {
        throw new Error(result.error || "Échec de la génération");
      }
    } catch (error: any) {
      console.error(error);
      setNodes((nds) => nds.map((n) => n.type === 'results' ? { ...n, data: { ...n.data, isGenerating: false } } : n));
      alert(error.message);
    }
  }, [setNodes]);

  const runGeneration = useCallback(async () => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.type === 'model') return { ...node, data: { ...node.data, isProcessing: true } };
        if (node.type === 'results') return { ...node, data: { ...node.data, isGenerating: true } };
        return node;
      })
    );

    setTimeout(() => {
      const currentNodes = nodesRef.current;
      const currentEdges = edgesRef.current;

      const modelNode = currentNodes.find(n => n.type === 'model');
      if (!modelNode) {
        setNodes(nds => nds.map(n => ({ ...n, data: { ...n.data, isProcessing: false, isGenerating: false } })));
        return;
      }

      const connectedEdges = currentEdges.filter(e => e.target === modelNode.id);
      const sourceNodes = connectedEdges.map(e => currentNodes.find(n => n.id === e.source)).filter(Boolean);

      const promptNode = sourceNodes.find(n => n?.type === 'prompt');
      const directionNode = sourceNodes.find(n => n?.type === 'creativeDirection');
      const referenceNodes = sourceNodes.filter(n => n?.type === 'imageReference');
      const strategyNode = sourceNodes.find(n => n?.type === 'strategy');
      const cloneNode = sourceNodes.find(n => n?.type === 'clone');
      const specialDirectiveNode = sourceNodes.find(n => n?.type === 'specialDirective');

      const promptBase = promptNode?.data?.basePrompt || "";
      const targetAudience = strategyNode?.data?.targetAudience || "";
      const campaignGoal = strategyNode?.data?.campaignGoal || "";
      const productDescription = strategyNode?.data?.productDescription || "";
      const keyMessages = strategyNode?.data?.keyMessages || "";
      const cloneRef = (cloneNode?.data as any)?.cloneReference;
      const specialDirective = (specialDirectiveNode?.data as any)?.directive || "";

      const d = (directionNode?.data || {}) as any;
      const feelings = d.feelings || { energy: 5, sophistication: 5, warmth: 5, contrast: 5 };

      const referenceImages = referenceNodes.flatMap(n => {
        const images = (n?.data as any)?.images;
        return Array.isArray(images) ? images.map((img: any) => img.url) : [];
      });

      // Special handling for CloneNode: prepend to reference images if exists
      const allReferenceImages = cloneRef ? [cloneRef, ...referenceImages] : referenceImages;

      const referenceComments = referenceNodes.flatMap(n => {
        const images = (n?.data as any)?.images;
        return Array.isArray(images) ? images.map((img: any) => img.comments) : [];
      }).filter(Boolean);
      const globalNotes = referenceNodes.map(n => (n?.data as any)?.globalNotes).filter(Boolean).join(". ");

      const qualityMandate = `Photographie commerciale de très haut niveau. Réalisme radical. Texture de peau naturelle, pores visibles, pas de lissage. Éclairage cinématographique.`.trim();
      const strategyStr = `Contexte Stratégique : ${campaignGoal}. Audience : ${targetAudience}. Produit : ${productDescription}.`.trim();

      let cloneStr = "";
      if (cloneRef) {
        if (referenceImages.length > 0) {
          cloneStr = `TÂCHE CRITIQUE (CLONE DESIGN) : Utilisez l'image [ASSET 1] UNIQUEMENT comme modèle de COMPOSITION, d'ANGLE de caméra et d'ENVIRONNEMENT. REMPLACEZ le produit présent dans [ASSET 1] par NOTRE PRODUIT représenté dans [ASSET 2]. Gardez la même pose et le même éclairage que [ASSET 1], mais les pixels du produit doivent provenir de [ASSET 2]. Ignorez logos/textes de [ASSET 1].`;
        } else {
          cloneStr = `TÂCHE CRITIQUE (CLONE COMPOSITION) : Utilisez l'image [ASSET 1] comme modèle de structure/composition. Recréez cette scène avec le produit ${productDescription}.`;
        }
      }

      const visualRefStr = `Inspiration visuelle : ${globalNotes}. Détails techniques : ${referenceComments.join(", ")}.`.trim();
      const feelingsStr = `Paramètres : Énergie ${feelings.energy}/10, Sophistication ${feelings.sophistication}/10, Chaleur ${feelings.warmth}/10, Contraste ${feelings.contrast}/10.`.trim();
      const directionStr = `Direction : ${d.style}, ${d.lighting}, ${d.mood}, ${d.cameraAngle}. Couleur : ${d.colorPalette}.`.trim();
      const specialStr = specialDirective ? `DIRECTIVE STRICTE : ${specialDirective}` : "";

      const finalPrompt = `${specialStr}\n${qualityMandate}\n${strategyStr}\n${cloneStr}\nConcept : ${promptBase}\n${visualRefStr}\n${feelingsStr}\n${directionStr}\nMessages : ${keyMessages}`.trim();

      const resultsNode = currentNodes.find(n => n.type === 'results');
      const targetCount = (modelNode.data as any).generationCount || (resultsNode?.data as any).count || 4;
      const targetRatio = (modelNode.data as any).ratio || "1:1";

      setNodes(nds => nds.map(n => n.id === modelNode.id ? { ...n, data: { ...n.data, isProcessing: false, engineeredPrompt: finalPrompt } } : n));
      performApiCall(finalPrompt, targetCount, allReferenceImages, d, targetRatio);
    }, 500);
  }, [performApiCall, setNodes]);

  const nodesWithHandlers = React.useMemo(() => {
    return nodes.map(node => ({
      ...node,
      data: {
        ...node.data,
        onRun: node.type === 'model' ? runGeneration : undefined,
        isGenerating: node.type === 'model' ? nodes.some(n => n.type === 'results' && n.data.isGenerating) : node.data.isGenerating,
      }
    }));
  }, [nodes, runGeneration]);

  return (
    <div className="flex w-full h-screen bg-[#080808] overflow-hidden font-sans">
      <Sidebar onAddNode={addNode} />
      <RightSidebar
        projectName={projectName}
        setProjectName={setProjectName}
        onSaveProject={() => { }}
        onExportJson={() => { }}
        onImportJson={() => { }}
        projects={projects}
        onLoadProject={() => { }}
        onDeleteProject={() => { }}
        onReset={handleReset}
      />
      <div className="flex-1 relative">
        <ReactFlow
          nodes={nodesWithHandlers}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragOver={(e) => e.preventDefault()}
          nodeTypes={nodeTypes}
          fitView
          colorMode="dark"
        >
          <Background variant={BackgroundVariant.Lines} gap={40} color="rgba(255,255,255,0.02)" />
          <Controls className="!bg-[#121212]/80 !border-white/10" />
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
