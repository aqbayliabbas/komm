"use client";

import React, { useState } from "react";
import { Handle, Position, useReactFlow } from "@xyflow/react";
import { Zap, X, Copy, Download, Clock, Image as ImageIcon, ChevronLeft, ChevronRight, Edit3 } from "lucide-react";

export function ResultsNode({ id, data }: any) {
    const { deleteElements } = useReactFlow();
    const [activeBatchIndex, setActiveBatchIndex] = useState(0);

    const images = data.images || [];
    const isGenerating = data.isGenerating;

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        alert("Prompt copié dans le presse-papiers !");
    };

    const downloadImage = (url: string, filename: string) => {
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleEdit = (imageUrl: string) => {
        if (data.onEditImage) {
            data.onEditImage(imageUrl, id);
        }
    };

    return (
        <div className="min-w-[400px] glass-panel inner-glow animate-in fade-in zoom-in duration-300">
            <div className="node-header flex items-center justify-between premium-gradient-blue">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-blue-500/10 rounded-lg">
                        <ImageIcon size={16} className="text-blue-400" />
                    </div>
                    <div>
                        <span className="text-[10px] font-black uppercase tracking-wider text-white">Résultats de Génération</span>
                        <p className="text-[8px] text-zinc-400 font-bold uppercase tracking-tight">Contenus de Campagne</p>
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
                {isGenerating ? (
                    <div className="h-64 flex flex-col items-center justify-center gap-4 border-2 border-dashed border-white/5 rounded-2xl bg-black/20">
                        <div className="relative">
                            <div className="w-12 h-12 rounded-full border-2 border-blue-500/20 border-t-blue-500 animate-spin" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Zap size={16} className="text-blue-500" />
                            </div>
                        </div>
                        <div className="text-center">
                            <p className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Traitement de la Requête</p>
                            <p className="text-[8px] text-zinc-500 font-bold uppercase tracking-widest mt-1">Création de votre campagne...</p>
                        </div>
                    </div>
                ) : images.length > 0 ? (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                            {images.map((img: any, idx: number) => (
                                <div key={img.id || idx} className="relative group aspect-[3/4] rounded-xl overflow-hidden border border-white/10 bg-black/40">
                                    <img src={img.url} alt="Generated" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2 gap-2">
                                        <button
                                            onClick={() => handleEdit(img.url)}
                                            className="p-2 bg-white/10 hover:bg-white/20 rounded-lg backdrop-blur-md border border-white/10 transition-all text-white"
                                            title="Edit with Mask"
                                        >
                                            <Edit3 size={12} />
                                        </button>
                                        <button
                                            onClick={() => copyToClipboard(data.engineeredPrompt || data.prompt)}
                                            className="p-2 bg-white/10 hover:bg-white/20 rounded-lg backdrop-blur-md border border-white/10 transition-all text-white"
                                            title="Copy Prompt"
                                        >
                                            <Copy size={12} />
                                        </button>
                                        <button
                                            onClick={() => downloadImage(img.url, `campaign-asset-${idx}.png`)}
                                            className="p-2 bg-blue-500/80 hover:bg-blue-500 rounded-lg backdrop-blur-md border border-white/10 transition-all text-white flex-1 flex items-center justify-center gap-2"
                                        >
                                            <Download size={12} />
                                            <span className="text-[8px] font-black uppercase">Sauvegarder</span>
                                        </button>
                                    </div>
                                    <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-black/60 backdrop-blur-md rounded border border-white/10 text-[7px] font-black text-white uppercase tracking-widest">
                                        V-{idx + 1}
                                    </div>
                                </div>
                            ))}
                        </div>


                    </div>
                ) : (
                    <div className="h-48 flex flex-col items-center justify-center gap-4 border-2 border-dashed border-white/5 rounded-2xl bg-black/20 text-zinc-600">
                        <ImageIcon size={32} strokeWidth={1} />
                        <p className="text-[9px] font-black uppercase tracking-[0.2em]">En Attente de Génération</p>
                    </div>
                )}
            </div>

            <Handle
                type="target"
                position={Position.Left}
                className="!bg-blue-500 !w-3 !h-3 !border-2 !border-[#080808]"
            />
        </div>
    );
}
