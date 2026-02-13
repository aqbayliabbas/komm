"use client";

import { Handle, Position } from "@xyflow/react";
import { Cpu, Settings, X } from "lucide-react";
import { useReactFlow } from "@xyflow/react";
import { useState } from "react";

export function ModelNode({ id, data }: any) {
    const { deleteElements } = useReactFlow();
    const [model, setModel] = useState("nano-banana");

    return (
        <div className="min-w-[240px] glass-panel inner-glow animate-in fade-in zoom-in duration-300">
            <div className="node-header flex items-center justify-between premium-gradient-emerald">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-emerald-500/10 rounded-lg">
                        <Cpu size={16} className="text-emerald-400" />
                    </div>
                    <div>
                        <span className="text-[10px] font-black uppercase tracking-wider text-white">AI Model Engine</span>
                        <p className="text-[8px] text-zinc-400 font-bold uppercase tracking-tight">Neural Processing Unit</p>
                    </div>
                </div>
                <button
                    onClick={() => deleteElements({ nodes: [{ id }] })}
                    className="text-zinc-500 hover:text-white transition-colors p-1.5 hover:bg-white/5 rounded-full"
                >
                    <X size={14} />
                </button>
            </div>
            <div className="node-content flex flex-col gap-4">
                <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-zinc-300 uppercase tracking-widest pl-1">Inference Engine</label>
                    <select
                        value={model}
                        onChange={(e) => setModel(e.target.value)}
                        className="w-full rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-emerald-500/50 appearance-none cursor-default font-medium"
                    >
                        <option value="nano-banana">Nano Banana 🍌</option>
                    </select>
                </div>

                <div className="flex items-center gap-2 px-3 py-2 bg-emerald-500/5 border border-emerald-500/10 rounded-xl">
                    <div className="relative">
                        <Settings size={14} className={data.isProcessing ? "text-emerald-400 animate-spin" : "text-emerald-400/40 animate-spin-slow"} />
                        <div className="absolute inset-x-0 bottom-0 top-0 bg-emerald-400 blur-md opacity-20 animate-pulse"></div>
                    </div>
                    <span className="text-[10px] text-emerald-400/90 font-black uppercase tracking-tight">
                        {data.isProcessing ? "Synthesizing Architecture..." : "Engine Ready"}
                    </span>
                </div>


                <button
                    onClick={() => data.onRun?.()}
                    disabled={data.isProcessing || data.isGenerating}
                    className="w-full mt-2 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-zinc-800 disabled:text-zinc-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.2)] active:scale-95 transition-all flex items-center justify-center gap-2 group"
                >
                    {(data.isProcessing || data.isGenerating) ? (
                        <div className="relative">
                            <Settings size={14} className="animate-spin" />
                        </div>
                    ) : (
                        <Cpu size={14} className="group-hover:rotate-12 transition-transform" />
                    )}
                    {(data.isProcessing || data.isGenerating) ? "Initializing..." : "Run Nano Banana"}
                </button>
            </div>

            {/* Inputs from Prompt, Reference, Art Direction */}
            <Handle
                type="target"
                position={Position.Left}
                id="input-all"
                className="!bg-emerald-500 !w-3 !h-3 !border-2 !border-[#080808]"
            />

            {/* Output to Result */}
            <Handle
                type="source"
                position={Position.Right}
                id="output-result"
                className="!bg-emerald-500 !w-3 !h-3 !border-2 !border-[#080808]"
            />

            <style jsx>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
        </div>
    );
}
