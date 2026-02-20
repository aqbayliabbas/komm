"use client";

import React from "react";
import { Handle, Position, useReactFlow } from "@xyflow/react";
import { ShieldAlert, X, AlignLeft } from "lucide-react";

export function SpecialDirectiveNode({ id, data }: any) {
    const { deleteElements, setNodes } = useReactFlow();

    const updateData = (value: string) => {
        setNodes((nds) =>
            nds.map((node) => {
                if (node.id === id) {
                    return { ...node, data: { ...node.data, directive: value } };
                }
                return node;
            })
        );
    };

    return (
        <div className="min-w-[300px] glass-panel inner-glow animate-in fade-in zoom-in duration-300">
            <div className="node-header flex items-center justify-between premium-gradient-red">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-red-500/10 rounded-lg">
                        <ShieldAlert size={16} className="text-red-400" />
                    </div>
                    <div>
                        <span className="text-[10px] font-black uppercase tracking-wider text-white">Directives Spéciales</span>
                        <p className="text-[8px] text-zinc-400 font-bold uppercase tracking-tight">Priorités & Contraintes</p>
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
                    <AlignLeft size={10} className="text-red-400" />
                    <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Instructions Strictes</span>
                </div>
                <textarea
                    className="w-full bg-white/5 rounded-xl p-3 text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-red-500/30 border border-white/5 transition-all nodrag leading-relaxed scrollbar-hide resize-none"
                    placeholder="Entrez des instructions impératives (ex: Ne pas inclure de reflets, Utiliser uniquement du noir et blanc, etc...)"
                    rows={4}
                    value={data.directive || ""}
                    onChange={(e) => updateData(e.target.value)}
                />
                <p className="text-[7px] text-zinc-500 font-bold uppercase tracking-widest italic px-1">
                    * Ces directives priment sur les autres paramètres.
                </p>
            </div>

            <Handle
                type="source"
                position={Position.Right}
                className="!bg-red-500 !w-3 !h-3 !border-2 !border-[#080808]"
            />
        </div>
    );
}
