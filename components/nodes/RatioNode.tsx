"use client";

import { Handle, Position } from "@xyflow/react";
import { Maximize, X } from "lucide-react";
import { useReactFlow } from "@xyflow/react";

export function RatioNode({ id, data }: any) {
    const { deleteElements } = useReactFlow();

    const ratios = [
        { label: "1:1 Square", value: "1:1" },
        { label: "16:9 Cinema", value: "16:9" },
        { label: "9:16 Portrait", value: "9:16" },
        { label: "4:3 Classic", value: "4:3" },
        { label: "3:2 Photo", value: "3:2" },
        { label: "21:9 Ultra", value: "21:9" },
    ];

    return (
        <div className="min-w-[200px] glass-panel inner-glow animate-in fade-in zoom-in duration-300">
            <div className="node-header flex items-center justify-between premium-gradient-orange">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-orange-500/10 rounded-lg">
                        <Maximize size={16} className="text-orange-400" />
                    </div>
                    <div>
                        <span className="text-[10px] font-black uppercase tracking-wider text-white">Aspect Ratio</span>
                        <p className="text-[8px] text-zinc-400 font-bold uppercase tracking-tight">Frame Dimensions</p>
                    </div>
                </div>
                <button
                    onClick={() => deleteElements({ nodes: [{ id }] })}
                    className="text-zinc-500 hover:text-white transition-colors p-1.5 hover:bg-white/5 rounded-full"
                >
                    <X size={14} />
                </button>
            </div>
            <div className="node-content space-y-4">
                <div className="grid grid-cols-2 gap-2">
                    {ratios.map((ratio) => (
                        <button
                            key={ratio.value}
                            onClick={() => data.onChange?.(ratio.value)}
                            className={`px-3 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${data.label === ratio.value
                                    ? "bg-orange-500 border-orange-400 text-black shadow-[0_0_20px_rgba(249,115,22,0.3)]"
                                    : "bg-black/40 border-white/10 text-zinc-400 hover:border-white/20 hover:bg-black/60"
                                }`}
                        >
                            {ratio.label}
                        </button>
                    ))}
                </div>
            </div>
            <Handle
                type="source"
                position={Position.Right}
                className="!bg-orange-500 !w-3 !h-3 !border-2 !border-[#080808]"
            />
        </div>
    );
}
