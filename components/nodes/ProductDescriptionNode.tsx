"use client";

import { Handle, Position } from "@xyflow/react";
import { FileText, X } from "lucide-react";
import { useReactFlow } from "@xyflow/react";

export function ProductDescriptionNode({ id, data }: any) {
    const { deleteElements } = useReactFlow();

    return (
        <div className="min-w-[300px] glass-panel inner-glow animate-in fade-in zoom-in duration-300">
            <div className="node-header flex items-center justify-between premium-gradient-cyan">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-cyan-500/10 rounded-lg">
                        <FileText size={16} className="text-cyan-400" />
                    </div>
                    <div>
                        <span className="text-[10px] font-black uppercase tracking-wider text-white">Product Spec</span>
                        <p className="text-[8px] text-zinc-400 font-bold uppercase tracking-tight">Technical Identification</p>
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
                    <label className="text-[9px] font-black text-zinc-300 uppercase tracking-widest pl-1">Target Category</label>
                    <select
                        className="w-full rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none transition-colors nodrag font-medium bg-black/40 border border-white/10 appearance-none cursor-pointer hover:bg-black/60"
                        value={data.productType || "Apparel"}
                        onChange={(evt) => data.onChangeProductType?.(evt.target.value)}
                    >
                        <option value="Apparel & Fashion">Apparel & Fashion</option>
                        <option value="Footwear & Sneakers">Footwear & Sneakers</option>
                        <option value="CPG / Fast Moving Goods">CPG / Fast Moving Goods</option>
                        <option value="Beverage / Cans / Bottles">Beverage / Cans / Bottles</option>
                        <option value="Cosmetics & Beauty">Cosmetics & Beauty</option>
                        <option value="Skincare & Wellness">Skincare & Wellness</option>
                        <option value="Fragrance & Perfume">Fragrance & Perfume</option>
                        <option value="Electronics & Tech">Electronics & Tech</option>
                        <option value="Luxury Watch & Jewelry">Luxury Watch & Jewelry</option>
                        <option value="Eyewear & Sunglasses">Eyewear & Sunglasses</option>
                        <option value="Bags & Accessories">Bags & Accessories</option>
                        <option value="Furniture & Home Decor">Furniture & Home Decor</option>
                        <option value="Automotive & Transport">Automotive & Transport</option>
                        <option value="Sports & Outdoors">Sports & Outdoors</option>
                        <option value="Food & Culinary">Food & Culinary</option>
                        <option value="Health & Supplements">Health & Supplements</option>
                        <option value="Packaging & Box Mockups">Packaging & Box Mockups</option>
                        <option value="Toys & Collectibles">Toys & Collectibles</option>
                        <option value="Industrial & Tools">Industrial & Tools</option>
                    </select>
                </div>
                <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-zinc-300 uppercase tracking-widest pl-1">Detailed Description</label>
                    <textarea
                        className="w-full rounded-xl p-3 text-sm text-zinc-200 placeholder:text-white/20 focus:outline-none transition-colors nodrag font-light leading-relaxed scrollbar-hide"
                        placeholder="Describe materials, texture, colors..."
                        rows={5}
                        defaultValue={data.label}
                        onChange={(evt) => data.onChange?.(evt.target.value)}
                    />
                </div>
            </div>
            <Handle
                type="source"
                position={Position.Right}
                className="!bg-cyan-500 !w-3 !h-3 !border-2 !border-[#080808]"
            />
        </div>
    );
}
