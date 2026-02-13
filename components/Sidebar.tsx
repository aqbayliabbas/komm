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
    FileText,
    Target,
    Maximize
} from "lucide-react";

interface SidebarProps {
    onAddNode: (type: string, data?: any) => void;
}

export function Sidebar({ onAddNode }: SidebarProps) {
    const tools = [
        {
            id: 'prompt',
            name: 'Add Prompt',
            icon: MessageSquareText,
            color: 'text-blue-400',
            description: 'Textual input for AI'
        },
        {
            id: 'reference',
            name: 'Add Reference',
            icon: ImageIcon,
            color: 'text-purple-400',
            description: 'Image upload node'
        },
        {
            id: 'direction',
            name: 'Add Art Direction',
            icon: Palette,
            color: 'text-orange-400',
            description: 'Strategic questions'
        },
        {
            id: 'model',
            name: 'Add AI Model',
            icon: Cpu,
            color: 'text-emerald-400',
            description: 'Select generation engine'
        },
        {
            id: 'textinfo',
            name: 'Add Text/Info',
            icon: Type,
            color: 'text-pink-400',
            description: 'Overlay text & info'
        },
        {
            id: 'product_description',
            name: 'Add Description',
            icon: FileText,
            color: 'text-cyan-400',
            description: 'Product details'
        },
        {
            id: 'goal',
            name: 'Campaign Goal',
            icon: Target,
            color: 'text-red-400',
            description: 'Define objectives'
        },
        {
            id: 'ratio',
            name: 'Frame Ratio',
            icon: Maximize,
            color: 'text-yellow-400',
            description: 'Set aspect ratio'
        },
    ];

    const results = [
        { id: 'result-1', count: 1, name: 'Result 1x' },
        { id: 'result-2', count: 2, name: 'Result 2x' },
        { id: 'result-4', count: 4, name: 'Result 4x' },
        { id: 'result-6', count: 6, name: 'Result 6x' },
        { id: 'result-10', count: 10, name: 'Result 10x' },
    ];

    const onDragStart = (event: React.DragEvent, nodeType: string, data?: any) => {
        event.dataTransfer.setData('application/reactflow', JSON.stringify({ type: nodeType, data }));
        event.dataTransfer.effectAllowed = 'move';
    };

    return (
        <aside className="fixed left-6 top-6 bottom-6 w-72 glass-panel inner-glow flex flex-col z-50">
            <div className="p-6 border-b border-white/5 bg-gradient-to-br from-white/[0.02] to-transparent">
                <div className="flex items-center gap-3">
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                        <div className="relative p-2 bg-black rounded-lg border border-white/10 shadow-xl">
                            <Box size={20} className="text-white" />
                        </div>
                    </div>
                    <div>
                        <h1 className="text-sm font-black text-white tracking-[0.2em] uppercase">Komm.ai</h1>
                        <p className="text-[8px] text-zinc-400 font-bold uppercase tracking-widest leading-tight">Neural Production Suite</p>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-hide">
                <div className="space-y-3">
                    <div className="flex items-center justify-between px-2">
                        <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                            <Layers size={10} />
                            Input Modules
                        </span>
                        <div className="h-[1px] flex-1 ml-4 bg-white/10" />
                    </div>

                    <div className="grid gap-2">
                        {tools.map((tool) => (
                            <button
                                key={tool.id}
                                onClick={() => onAddNode(tool.id)}
                                onDragStart={(event) => onDragStart(event, tool.id)}
                                draggable
                                className="group w-full p-3 rounded-xl bg-white/[0.05] border border-white/10 hover:bg-white/[0.08] hover:border-white/20 transition-all text-left flex items-start gap-4 relative overflow-hidden cursor-grab active:cursor-grabbing active:scale-[0.98]"
                            >
                                <div className={cn("mt-1 p-2 rounded-lg bg-black border border-white/10 transition-colors group-hover:border-white/20 shadow-lg", tool.color)}>
                                    <tool.icon size={16} />
                                </div>
                                <div className="flex flex-col flex-1 min-w-0">
                                    <span className="text-[11px] font-bold text-zinc-100 uppercase tracking-tight">{tool.name}</span>
                                    <p className="text-[9px] text-zinc-400 font-medium truncate group-hover:text-zinc-300 transition-colors">{tool.description}</p>
                                </div>
                                <div className="mt-1 opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-0.5">
                                    <ChevronRight size={12} className="text-zinc-500" />
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="flex items-center justify-between px-2">
                        <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                            <Zap size={10} className="text-yellow-500" />
                            Output Scale
                        </span>
                        <div className="h-[1px] flex-1 ml-4 bg-white/10" />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        {results.map((res) => (
                            <button
                                key={res.id}
                                onClick={() => onAddNode('result', { count: res.count })}
                                onDragStart={(event) => onDragStart(event, 'result', { count: res.count })}
                                draggable
                                className="group p-3 rounded-xl bg-white/[0.05] border border-white/10 hover:bg-yellow-500/10 hover:border-yellow-500/20 transition-all text-left flex flex-col items-center justify-center gap-2 cursor-grab active:cursor-grabbing active:scale-[0.95]"
                            >
                                <div className="p-2 rounded-lg bg-black group-hover:bg-yellow-500/20 transition-all text-yellow-500 shadow-md">
                                    <Zap size={14} fill="currentColor" />
                                </div>
                                <span className="text-[10px] font-black text-zinc-200 uppercase tracking-widest">{res.name}</span>
                            </button>
                        ))}
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
                            <span className="text-[9px] font-black text-zinc-300 uppercase tracking-widest leading-none mb-1">Engine Status</span>
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
