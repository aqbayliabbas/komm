"use client";

import { Handle, Position } from "@xyflow/react";
import { MessageSquareText, X } from "lucide-react";
import { useReactFlow } from "@xyflow/react";

export function PromptNode({ id, data }: any) {
    const { deleteElements } = useReactFlow();

    return (
        <div className="min-w-[300px] glass-panel inner-glow animate-in fade-in zoom-in duration-300">
            <div className="node-header flex items-center justify-between premium-gradient-blue">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-blue-500/10 rounded-lg">
                        <MessageSquareText size={16} className="text-blue-400" />
                    </div>
                    <div>
                        <span className="text-[10px] font-black uppercase tracking-wider text-white">Creative Prompt</span>
                        <p className="text-[8px] text-zinc-400 font-bold uppercase tracking-tight">Direct Text Injection</p>
                    </div>
                </div>
                <button
                    onClick={() => deleteElements({ nodes: [{ id }] })}
                    className="text-zinc-500 hover:text-white transition-colors p-1.5 hover:bg-white/5 rounded-full"
                >
                    <X size={14} />
                </button>
            </div>
            <div className="node-content">
                <textarea
                    className="w-full rounded-xl p-3 text-sm text-zinc-200 placeholder:text-white/20 focus:outline-none transition-colors nodrag font-light leading-relaxed scrollbar-hide"
                    placeholder="Describe your subject and its main features..."
                    rows={5}
                    defaultValue={data.label}
                    onChange={(evt) => data.onChange?.(evt.target.value)}
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
