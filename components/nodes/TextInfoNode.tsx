"use client";

import { Handle, Position } from "@xyflow/react";
import { Type, X } from "lucide-react";
import { useReactFlow } from "@xyflow/react";

export function TextInfoNode({ id, data }: any) {
    const { deleteElements } = useReactFlow();

    return (
        <div className="min-w-[280px] glass-panel inner-glow animate-in fade-in zoom-in duration-300">
            <div className="node-header flex items-center justify-between premium-gradient-pink">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-pink-500/10 rounded-lg">
                        <Type size={16} className="text-pink-400" />
                    </div>
                    <div>
                        <span className="text-[10px] font-black uppercase tracking-wider text-white">Ad Typography</span>
                        <p className="text-[8px] text-zinc-400 font-bold uppercase tracking-tight">Post-Production Overlays</p>
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
                <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-zinc-300 uppercase tracking-widest pl-1">Primary Headline</label>
                    <input
                        className="w-full rounded-xl px-3 py-2 text-xs text-zinc-200 placeholder:text-white/20 focus:outline-none transition-colors nodrag font-medium"
                        placeholder="e.g. 50% OFF"
                        defaultValue={data.label || ""}
                        onChange={(evt) => data.onChange?.(evt.target.value)}
                    />
                </div>
                <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-zinc-300 uppercase tracking-widest pl-1">Aesthetic Typeface</label>
                    <select
                        className="w-full rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none transition-all cursor-pointer nodrag font-medium appearance-none"
                        defaultValue={data.font || "Inter"}
                        onChange={(evt) => data.onChangeFont?.(evt.target.value)}
                    >
                        <option value="Inter">Inter — Clean Modern</option>
                        <option value="Montserrat">Montserrat — Geometric Pop</option>
                        <option value="Playfair Display">Playfair Display — Luxury Serif</option>
                        <option value="Bebas Neue">Bebas Neue — Kinetic Bold</option>
                        <option value="Cinzel">Cinzel — Classical Heritage</option>
                        <option value="Outfit">Outfit — Tech Minimalist</option>
                        <option value="Space Grotesk">Space Grotesk — Avante-Garde</option>
                        <option value="Cormorant Garamond">Cormorant Garamond — Old World</option>
                    </select>
                </div>
                <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-zinc-300 uppercase tracking-widest pl-1">Campaign Narrative</label>
                    <textarea
                        className="w-full rounded-xl px-3 py-2 text-xs text-zinc-200 placeholder:text-white/20 focus:outline-none transition-colors nodrag font-light leading-relaxed scrollbar-hide"
                        placeholder="Describe features or CTA details..."
                        rows={2}
                        defaultValue={data.subtext || ""}
                        onChange={(evt) => data.onChangeSubtext?.(evt.target.value)}
                    />
                </div>
            </div>
            <Handle
                type="source"
                position={Position.Right}
                className="!bg-pink-500 !w-3 !h-3 !border-2 !border-[#080808]"
            />
        </div>
    );
}
