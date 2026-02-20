"use client";

import { cn } from "@/lib/utils";
import {
    MessageSquareText,
    Image as ImageIcon,
    Palette,
    Zap,
    Box,
    Layers,
    Settings2,
    ChevronRight,
    Cpu,
    Type,
    Target,
    Maximize,
    Copy,
    ShieldAlert
} from "lucide-react";

interface SidebarProps {
    onAddNode: (type: string, data?: any) => void;
}

export function Sidebar({ onAddNode }: SidebarProps) {
    const coreNodes = [
        {
            id: 'prompt',
            name: 'Brief du Prompt',
            icon: MessageSquareText,
            color: 'text-blue-400',
            description: 'Concept créatif principal'
        },
        {
            id: 'strategy',
            name: 'Nœud de Stratégie',
            icon: Target,
            color: 'text-red-400',
            description: 'Contexte marketing'
        },
        {
            id: 'specialDirective',
            name: 'Directives Spéciales',
            icon: ShieldAlert,
            color: 'text-red-500',
            description: 'Instructions strictes'
        },
    ];

    const visualNodes = [
        {
            id: 'imageReference',
            name: 'Références d\'Images',
            icon: ImageIcon,
            color: 'text-purple-400',
            description: 'Inspiration visuelle'
        },
        {
            id: 'creativeDirection',
            name: 'Direction Créative',
            icon: Palette,
            color: 'text-orange-400',
            description: 'Style et paramètres'
        },
        {
            id: 'clone',
            name: 'Clone de Design',
            icon: Copy,
            color: 'text-purple-500',
            description: 'Remplacement de produit'
        },
    ];

    const engineNodes = [
        {
            id: 'model',
            name: 'Processeur Gemini',
            icon: Cpu,
            color: 'text-emerald-400',
            description: 'Centre d\'optimisation IA'
        },
    ];

    const outputNodes = [
        {
            id: 'results',
            name: 'Nœud de Résultats',
            icon: Zap,
            color: 'text-yellow-400',
            description: 'Unité d\'affichage visuel'
        },
    ];

    const onDragStart = (event: React.DragEvent, nodeType: string, data?: any) => {
        event.dataTransfer.setData('application/reactflow', JSON.stringify({ type: nodeType, data }));
        event.dataTransfer.effectAllowed = 'move';
    };

    const NodeButton = ({ node }: any) => (
        <button
            key={node.id}
            onClick={() => onAddNode(node.id, node.data)}
            onDragStart={(event) => onDragStart(event, node.id, node.data)}
            draggable
            className="group w-full p-3 rounded-xl bg-white/[0.05] border border-white/10 hover:bg-white/[0.08] hover:border-white/20 transition-all text-left flex items-start gap-4 relative overflow-hidden cursor-grab active:cursor-grabbing active:scale-[0.98]"
        >
            <div className={cn("mt-1 p-2 rounded-lg bg-black border border-white/10 transition-colors group-hover:border-white/20 shadow-lg", node.color)}>
                <node.icon size={16} />
            </div>
            <div className="flex flex-col flex-1 min-w-0">
                <span className="text-[11px] font-bold text-zinc-100 uppercase tracking-tight">{node.name}</span>
                <p className="text-[9px] text-zinc-400 font-medium truncate group-hover:text-zinc-300 transition-colors">{node.description}</p>
            </div>
            <div className="mt-1 opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-0.5">
                <ChevronRight size={12} className="text-zinc-500" />
            </div>
        </button>
    );

    return (
        <aside className="fixed left-6 top-6 bottom-6 w-72 glass-panel inner-glow flex flex-col z-50">
            <div className="p-6 border-b border-white/5 bg-gradient-to-br from-white/[0.01] to-transparent">
                <div className="flex items-center gap-3">
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg blur opacity-10 group-hover:opacity-30 transition duration-1000"></div>
                        <div className="relative p-2 bg-black rounded-lg border border-white/10 shadow-xl">
                            <Box size={20} className="text-white" />
                        </div>
                    </div>
                    <div>
                        <h1 className="text-sm font-black text-white tracking-[0.2em] uppercase">Komm.ai</h1>
                        <p className="text-[8px] text-zinc-500 font-bold uppercase tracking-widest leading-tight">Suite de Production Neurale</p>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-8 scrollbar-hide py-6">
                <div className="space-y-3">
                    <div className="flex items-center justify-between px-2">
                        <span className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.15em]">Cœur de Campagne</span>
                        <div className="h-[1px] w-8 bg-white/5" />
                    </div>
                    <div className="grid gap-2">
                        {coreNodes.map((node) => <NodeButton key={node.id} node={node} />)}
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="flex items-center justify-between px-2">
                        <span className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.15em]">Design Visuel</span>
                        <div className="h-[1px] w-8 bg-white/5" />
                    </div>
                    <div className="grid gap-2">
                        {visualNodes.map((node) => <NodeButton key={node.id} node={node} />)}
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="flex items-center justify-between px-2">
                        <span className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.15em]">Moteur de Processus</span>
                        <div className="h-[1px] w-8 bg-white/5" />
                    </div>
                    <div className="grid gap-2">
                        {engineNodes.map((node) => <NodeButton key={node.id} node={node} />)}
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="flex items-center justify-between px-2">
                        <span className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.15em]">Livraison</span>
                        <div className="h-[1px] w-8 bg-white/5" />
                    </div>
                    <div className="grid gap-2">
                        {outputNodes.map((node) => <NodeButton key={node.id} node={node} />)}
                    </div>
                </div>
            </div>

            <div className="p-6 bg-black/40 border-t border-white/10">
                <div className="flex items-center justify-between p-3 bg-white/[0.03] rounded-xl border border-white/10 group hover:bg-white/5 transition-colors cursor-help">
                    <div className="flex items-center gap-3">
                        <div className="p-1.5 bg-zinc-800 rounded-lg group-hover:bg-zinc-700 transition-colors text-zinc-300">
                            <Settings2 size={12} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[9px] font-black text-zinc-300 uppercase tracking-widest leading-none mb-1">Statut du Moteur</span>
                            <span className="text-[8px] text-zinc-500 font-bold uppercase tracking-tight">V1.0.4-PREMIUM</span>
                        </div>
                    </div>
                    <div className="relative">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.5)] animate-pulse" />
                        <div className="absolute inset-0 w-2 h-2 rounded-full bg-emerald-500 blur-sm opacity-50" />
                    </div>
                </div>
            </div>
        </aside>
    );
}
