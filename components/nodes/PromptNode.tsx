"use client";

import { Handle, Position } from "@xyflow/react";
import { MessageSquareText, X, Sparkles } from "lucide-react";
import { useReactFlow } from "@xyflow/react";

export function PromptNode({ id, data }: any) {
    const { deleteElements, setNodes } = useReactFlow();

    return (
        <div className="min-w-[320px] glass-panel inner-glow animate-in fade-in zoom-in duration-300">
            <div className="node-header flex items-center justify-between premium-gradient-blue">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-blue-500/10 rounded-lg">
                        <MessageSquareText size={16} className="text-blue-400" />
                    </div>
                    <div>
                        <span className="text-[10px] font-black uppercase tracking-wider text-white">Brief du Prompt</span>
                        <p className="text-[8px] text-zinc-400 font-bold uppercase tracking-tight">Vision Créative</p>
                    </div>
                </div>
                <button
                    onClick={() => deleteElements({ nodes: [{ id }] })}
                    className="text-zinc-500 hover:text-white transition-colors p-1.5 hover:bg-white/5 rounded-full"
                >
                    <X size={14} />
                </button>
            </div>
            <div className="node-content p-4 space-y-3">
                <div className="flex items-center gap-1.5 pl-1">
                    <Sparkles size={10} className="text-blue-400" />
                    <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Concept de Campagne</span>
                </div>
                <textarea
                    className="w-full bg-white/5 rounded-xl p-3 text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-blue-500/30 border border-white/5 transition-all nodrag leading-relaxed scrollbar-hide resize-none"
                    placeholder="Décrivez votre idée de campagne principale, la direction visuelle et les messages clés..."
                    rows={6}
                    value={data.basePrompt || ""}
                    onChange={(evt) => {
                        setNodes(nds => nds.map(n => n.id === id ? { ...n, data: { ...n.data, basePrompt: evt.target.value } } : n));
                    }}
                />
            </div>
            <Handle
                type="source"
                position={Position.Right}
                className="!bg-blue-500 !w-3 !h-3 !border-2 !border-[#080808]"
            />
        </div>
    );
}
