"use client";

import React, { useRef } from "react";
import { Handle, Position, useReactFlow } from "@xyflow/react";
import { Image as ImageIcon, X, Plus, MessageSquare } from "lucide-react";

export function ImageReferenceNode({ id, data }: any) {
    const { deleteElements, setNodes } = useReactFlow();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        const newImages = [...(data.images || [])];

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const reader = new FileReader();

            const imageData = await new Promise<string>((resolve) => {
                reader.onload = (e) => resolve(e.target?.result as string);
                reader.readAsDataURL(file);
            });

            newImages.push({
                id: Math.random().toString(36).substring(7),
                url: imageData,
                comments: ""
            });
        }

        setNodes((nds) =>
            nds.map((node) => {
                if (node.id === id) {
                    return { ...node, data: { ...node.data, images: newImages } };
                }
                return node;
            })
        );
    };

    const removeImage = (imgId: string) => {
        setNodes((nds) =>
            nds.map((node) => {
                if (node.id === id) {
                    const currentImages = Array.isArray(node.data.images) ? node.data.images : [];
                    return {
                        ...node,
                        data: {
                            ...node.data,
                            images: currentImages.filter((img: any) => img.id !== imgId)
                        }
                    };
                }
                return node;
            })
        );
    };

    const updateComment = (imgId: string, comment: string) => {
        setNodes((nds) =>
            nds.map((node) => {
                if (node.id === id) {
                    const currentImages = Array.isArray(node.data.images) ? node.data.images : [];
                    return {
                        ...node,
                        data: {
                            ...node.data,
                            images: currentImages.map((img: any) =>
                                img.id === imgId ? { ...img, comments: comment } : img
                            )
                        }
                    };
                }
                return node;
            })
        );
    };

    return (
        <div className="min-w-[320px] max-w-[400px] glass-panel inner-glow animate-in fade-in zoom-in duration-300">
            <div className="node-header flex items-center justify-between premium-gradient-purple">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-purple-500/10 rounded-lg">
                        <ImageIcon size={16} className="text-purple-400" />
                    </div>
                    <div>
                        <span className="text-[10px] font-black uppercase tracking-wider text-white">Références d'Images</span>
                        <p className="text-[8px] text-zinc-400 font-bold uppercase tracking-tight">Inspiration Visuelle</p>
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
                <div className="grid grid-cols-2 gap-3">
                    {(data.images || []).map((img: any) => (
                        <div key={img.id} className="relative group aspect-square rounded-xl overflow-hidden border border-white/10 bg-black/40">
                            <img src={img.url} alt="Reference" className="w-full h-full object-cover" />
                            <button
                                onClick={() => removeImage(img.id)}
                                className="absolute top-2 right-2 p-1 bg-black/60 hover:bg-red-500/80 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <X size={12} />
                            </button>
                            <div className="absolute inset-x-0 bottom-0 p-2 bg-black/80 translate-y-full group-hover:translate-y-0 transition-transform">
                                <textarea
                                    className="w-full bg-transparent text-[9px] text-white placeholder:text-zinc-500 focus:outline-none resize-none scrollbar-hide nodrag"
                                    placeholder="Ajouter des notes..."
                                    rows={2}
                                    value={img.comments}
                                    onChange={(e) => updateComment(img.id, e.target.value)}
                                />
                            </div>
                        </div>
                    ))}
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="aspect-square rounded-xl border-2 border-dashed border-white/5 hover:border-purple-500/40 hover:bg-purple-500/5 transition-all flex flex-col items-center justify-center gap-2 text-zinc-500 hover:text-purple-400 group nodrag"
                    >
                        <div className="p-2 rounded-full bg-white/5 group-hover:bg-purple-500/10 transition-colors">
                            <Plus size={20} />
                        </div>
                        <span className="text-[9px] font-bold uppercase tracking-widest">Téléverser</span>
                    </button>
                </div>

                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={onFileChange}
                    multiple
                    accept="image/*"
                    className="hidden"
                />

                {(data.images || []).length > 0 && (
                    <div className="pt-2 border-t border-white/5">
                        <p className="text-[8px] text-zinc-500 font-bold uppercase tracking-widest mb-2 flex items-center gap-1.5">
                            <MessageSquare size={10} />
                            Annotations Globales
                        </p>
                        <textarea
                            className="w-full bg-white/5 rounded-lg p-2 text-xs text-zinc-300 placeholder:text-zinc-600 focus:outline-none border border-white/5 focus:border-purple-500/30 transition-colors resize-none mb-4 nodrag"
                            placeholder="Direction visuelle générale pour toutes les images ci-dessus..."
                            rows={2}
                            value={data.globalNotes || ""}
                            onChange={(e) => {
                                setNodes(nds => nds.map(n => n.id === id ? { ...n, data: { ...n.data, globalNotes: e.target.value } } : n));
                            }}
                        />
                    </div>
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
