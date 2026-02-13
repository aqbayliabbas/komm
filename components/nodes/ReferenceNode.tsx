"use client";

import { Handle, Position } from "@xyflow/react";
import { Image as ImageIcon, Upload, X } from "lucide-react";
import { useReactFlow } from "@xyflow/react";
import { useState } from "react";

export function ReferenceNode({ id, data }: any) {
    const { deleteElements } = useReactFlow();
    const [image, setImage] = useState<string | null>(data.label || null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const base64 = e.target?.result as string;
                setImage(base64);
                data.onChange?.(base64);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="min-w-[200px] glass-panel inner-glow animate-in fade-in zoom-in duration-300">
            <div className="node-header flex items-center justify-between premium-gradient-blue">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-purple-500/10 rounded-lg">
                        <ImageIcon size={16} className="text-purple-400" />
                    </div>
                    <div>
                        <span className="text-[10px] font-black uppercase tracking-wider text-white">{data.refName || "Reference Asset"}</span>
                        <p className="text-[8px] text-zinc-400 font-bold uppercase tracking-tight">Source Material</p>
                    </div>
                </div>
                <button
                    onClick={() => deleteElements({ nodes: [{ id }] })}
                    className="text-zinc-500 hover:text-white transition-colors p-1.5 hover:bg-white/5 rounded-full"
                >
                    <X size={14} />
                </button>
            </div>
            <div className="node-content flex flex-col items-center justify-center gap-3">
                {image ? (
                    <div className="relative group w-32 h-32 rounded-xl overflow-hidden border border-white/10 shadow-xl">
                        <img src={image} alt="Reference" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <label className="cursor-pointer p-3 bg-purple-500 rounded-full hover:bg-purple-600 shadow-lg shadow-purple-500/20 active:scale-90 transition-all">
                                <Upload size={16} className="text-white" />
                                <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
                            </label>
                        </div>
                    </div>
                ) : (
                    <label className="w-32 h-32 flex flex-col items-center justify-center gap-2 border-2 border-dashed border-white/5 rounded-xl hover:border-purple-500/30 hover:bg-purple-500/5 hover:shadow-2xl hover:shadow-purple-500/5 transition-all cursor-pointer group">
                        <div className="p-3 bg-white/5 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                            <Upload size={20} className="text-zinc-400 group-hover:text-purple-400 transition-colors" />
                        </div>
                        <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest group-hover:text-zinc-300">Upload Asset</span>
                        <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
                    </label>
                )}
            </div>
            <Handle
                type="source"
                position={Position.Right}
                className="!bg-purple-500 !w-3 !h-3 !border-2 !border-[#080808]"
            />
        </div>
    );
}
