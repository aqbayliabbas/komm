"use client";

import { Handle, Position } from "@xyflow/react";
import { Target, X } from "lucide-react";
import { useReactFlow } from "@xyflow/react";

export function GoalCampaignNode({ id, data }: any) {
    const { deleteElements } = useReactFlow();

    return (
        <div className="min-w-[280px] glass-panel inner-glow animate-in fade-in zoom-in duration-300">
            <div className="node-header flex items-center justify-between premium-gradient-red">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-red-500/10 rounded-lg">
                        <Target size={16} className="text-red-400" />
                    </div>
                    <div>
                        <span className="text-[10px] font-black uppercase tracking-wider text-white">Campaign Strategy</span>
                        <p className="text-[8px] text-zinc-400 font-bold uppercase tracking-tight">Market Positioning</p>
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
                    <label className="text-[9px] font-black text-zinc-300 uppercase tracking-widest pl-1">Primary Objective</label>
                    <select
                        className="w-full rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none transition-colors nodrag font-medium bg-black/40 border border-white/10 appearance-none cursor-pointer hover:bg-black/60"
                        value={data.objective || "Brand Awareness"}
                        onChange={(evt) => data.onChangeObjective?.(evt.target.value)}
                    >
                        <option value="Brand Awareness & Lifestyle">Brand Awareness & Lifestyle</option>
                        <option value="Direct Sales / Marketplace">Direct Sales / Marketplace</option>
                        <option value="New Product Launch">New Product Launch</option>
                        <option value="Social Media & Viral">Social Media & Viral</option>
                        <option value="Editorial / High-Fashion">Editorial / High-Fashion</option>
                        <option value="Minimalist / Clean Studio">Minimalist / Clean Studio</option>
                        <option value="OOH / Billboard / Poster">OOH / Billboard / Poster</option>
                        <option value="Holiday & Seasonal Promo">Holiday & Seasonal Promo</option>
                        <option value="Influencer / Creator Style">Influencer / Creator Style</option>
                        <option value="User Generated Content (UGC)">User Generated Content (UGC)</option>
                        <option value="E-commerce / Catalog">E-commerce / Catalog</option>
                        <option value="Avant-garde / Artistic">Avant-garde / Artistic</option>
                        <option value="Retro / Vintage Aesthetic">Retro / Vintage Aesthetic</option>
                        <option value="Eco-friendly / Sustainable">Eco-friendly / Sustainable</option>
                    </select>
                </div>
                <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-zinc-300 uppercase tracking-widest pl-1">Target Audience</label>
                    <input
                        className="w-full rounded-xl px-3 py-2 text-xs text-zinc-200 placeholder:text-white/20 focus:outline-none transition-colors nodrag font-medium"
                        placeholder="e.g. Gen Z Urbanites"
                        defaultValue={data.audience || ""}
                        onChange={(evt) => data.onChangeAudience?.(evt.target.value)}
                    />
                </div>
            </div>
            <Handle
                type="source"
                position={Position.Right}
                className="!bg-red-500 !w-3 !h-3 !border-2 !border-[#080808]"
            />
        </div>
    );
}
