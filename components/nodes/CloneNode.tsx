"use client";

import React, { useRef } from "react";
import { Handle, Position, useReactFlow } from "@xyflow/react";
import { Copy, X, Upload, Image as ImageIcon, Sparkles } from "lucide-react";

export function CloneNode({ id, data }: any) {
    const { deleteElements, setNodes } = useReactFlow();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64 = reader.result as string;
                updateData("cloneReference", base64);
            };
            reader.readAsDataURL(file);
        }
    };

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

    return (
        <div className="min-w-[300px] glass-panel inner-glow animate-in fade-in zoom-in duration-300">
            <div className="node-header flex items-center justify-between premium-gradient-purple">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-purple-500/10 rounded-lg">
                        <Copy size={16} className="text-purple-400" />
                    </div>
                    <div>
                        <span className="text-[10px] font-black uppercase tracking-wider text-white">Clone de Design</span>
                        <p className="text-[8px] text-zinc-400 font-bold uppercase tracking-tight">Reciblage de Style</p>
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
                <p className="text-[9px] text-zinc-400 leading-relaxed italic">
                    Téléverser une image de référence. Nous remplacerons le produit dans cette image par le nôtre tout en conservant le décor et le style.
                </p>

                <div
                    onClick={() => fileInputRef.current?.click()}
                    className={`relative aspect-video rounded-xl border-2 border-dashed transition-all cursor-pointer overflow-hidden flex flex-col items-center justify-center gap-2 ${data.cloneReference
                        ? "border-purple-500/50 bg-purple-500/5"
                        : "border-white/5 bg-black/20 hover:border-purple-500/30 hover:bg-purple-500/5"
                        }`}
                >
                    {data.cloneReference ? (
                        <>
                            <img src={data.cloneReference} alt="Clone Ref" className="absolute inset-0 w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                <Upload size={20} className="text-white" />
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="p-3 rounded-full bg-white/5">
                                <ImageIcon size={20} className="text-zinc-500" />
                            </div>
                            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Téléverser la Référence</span>
                        </>
                    )}
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={onFileChange}
                        accept="image/*"
                        className="hidden"
                    />
                </div>

                <div className="flex items-center gap-2 p-2 bg-purple-500/5 rounded-lg border border-purple-500/10">
                    <Sparkles size={12} className="text-purple-400" />
                    <span className="text-[8px] font-bold text-purple-300 uppercase tracking-widest italic">
                        "Remplacer leur produit par le nôtre"
                    </span>
                </div>
            </div>

            <Handle
                type="source"
                position={Position.Right}
                className="!bg-purple-500 !w-3 !h-3 !border-2 !border-[#080808]"
            />
        </div>
    );
}
