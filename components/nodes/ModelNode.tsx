"use client";

import React from "react";
import { Handle, Position, useReactFlow } from "@xyflow/react";
import { Cpu, X, Zap, Loader2, Settings2 } from "lucide-react";

export function ModelNode({ id, data }: any) {
    const { deleteElements, setNodes } = useReactFlow();

    const updateData = (key: string, value: any) => {
        setNodes((nds) =>
            nds.map((node) => {
                if (node.id === id) {
                    return { ...node, data: { ...node.data, [key]: value } };
                }
                return node;
            })
        );
    };

    const isGenerating = data.isGenerating;

    return (
        <div className="min-w-[280px] glass-panel inner-glow animate-in fade-in zoom-in duration-300">
            <div className="node-header flex items-center justify-between premium-gradient-emerald">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-emerald-500/10 rounded-lg">
                        <Cpu size={16} className="text-emerald-400" />
                    </div>
                    <div>
                        <span className="text-[10px] font-black uppercase tracking-wider text-white">Processeur Gemini</span>
                        <p className="text-[8px] text-zinc-400 font-bold uppercase tracking-tight">Centre d'Optimisation IA</p>
                    </div>
                </div>
                <button
                    onClick={() => deleteElements({ nodes: [{ id }] })}
                    className="text-zinc-500 hover:text-white transition-colors p-1.5 hover:bg-white/5 rounded-full"
                >
                    <X size={14} />
                </button>
            </div>

            <div className="node-content p-4 space-y-4">
                <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
                        <Settings2 size={10} className="text-zinc-500" />
                        Variations de Sortie
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                        {[1, 2, 4, 6].map((count) => (
                            <button
                                key={count}
                                onClick={() => updateData("generationCount", count)}
                                className={`py-2 rounded-lg text-[10px] font-bold border transition-all ${(data.generationCount || 4) === count
                                    ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400"
                                    : "bg-white/5 border-white/5 text-zinc-500 hover:bg-white/10 hover:border-white/10"
                                    }`}
                            >
                                {count}x
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-zinc-400 uppercase tracking-widest flex items-center justify-between">
                        Format d'Image
                        <span className="text-[8px] text-emerald-500/80 font-bold">MODE 3:4 ACTIF</span>
                    </label>
                    <div className="grid grid-cols-1 gap-2">
                        <button
                            key="3:4"
                            onClick={() => updateData("ratio", "3:4")}
                            className="py-2.5 rounded-lg text-[10px] font-black bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 transition-all flex items-center justify-center gap-2"
                        >
                            <div className="w-3 h-4 border-2 border-current rounded-sm opacity-50" />
                            3:4 (Portrait Premium)
                        </button>
                    </div>
                </div>

                <div className="pt-2">
                    <button
                        onClick={() => data.onRun?.()}
                        disabled={isGenerating}
                        className={`w-full py-3 rounded-xl flex items-center justify-center gap-2 group transition-all relative overflow-hidden ${isGenerating
                            ? "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                            : "bg-white text-black hover:bg-emerald-500 hover:text-white shadow-xl hover:shadow-emerald-500/20 active:scale-[0.98]"
                            }`}
                    >
                        {isGenerating ? (
                            <>
                                <Loader2 size={14} className="animate-spin" />
                                <span className="text-[10px] font-black uppercase tracking-widest">Génération...</span>
                            </>
                        ) : (
                            <>
                                <Zap size={14} className="transition-transform group-hover:scale-125 group-hover:rotate-12" fill="currentColor" />
                                <span className="text-[10px] font-black uppercase tracking-widest">Générer les Images</span>
                            </>
                        )}
                    </button>
                </div>


            </div>

            <Handle
                type="target"
                position={Position.Left}
                className="!bg-emerald-500 !w-3 !h-3 !border-2 !border-[#080808]"
            />
            <Handle
                type="source"
                position={Position.Right}
                className="!bg-emerald-500 !w-3 !h-3 !border-2 !border-[#080808]"
            />
        </div>
    );
}
