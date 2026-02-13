"use client";

import { Handle, Position, useReactFlow } from "@xyflow/react";
import { Zap, Loader2, X, Download, Maximize2, ExternalLink } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function ResultNode({ id, data }: any) {
    const { deleteElements } = useReactFlow();
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [thumbnails, setThumbnails] = useState<Record<string, string>>({});
    const loading = data.isGenerating;
    const count = data.count || 4;
    const ratio = data.ratio || "1:1";

    // Map ratio string to CSS aspect-ratio value
    const ratioMap: Record<string, string> = {
        "1:1": "1/1",
        "16:9": "16/9",
        "9:16": "9/16",
        "4:3": "4/3",
        "3:2": "3/2",
        "21:9": "21/9",
    };
    const cssAspect = ratioMap[ratio] || "3/4";

    // Client-side thumbnail generation to keep the canvas light
    useEffect(() => {
        if (data.images && data.images.length > 0) {
            data.images.forEach((img: any) => {
                if (img.url && !thumbnails[img.id]) {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    const image = new Image();
                    image.onload = () => {
                        // thumbnail size
                        const MAX_WIDTH = 200;
                        const scale = MAX_WIDTH / image.width;
                        canvas.width = MAX_WIDTH;
                        canvas.height = image.height * scale;
                        ctx?.drawImage(image, 0, 0, canvas.width, canvas.height);
                        setThumbnails(prev => ({ ...prev, [img.id]: canvas.toDataURL('image/jpeg', 0.7) }));
                    };
                    image.src = img.url;
                }
            });
        }
    }, [data.images]);

    const handleDownload = (imageUrl: string, index: number) => {
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = `komm-variant-${index + 1}-FULL-RES.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <>
            <div className="min-w-[300px] glass-panel inner-glow animate-in fade-in zoom-in duration-500">
                <div className="node-header flex items-center justify-between premium-gradient-yellow">
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-yellow-500/10 rounded-lg">
                            <Zap size={16} className="text-yellow-400 fill-yellow-400" />
                        </div>
                        <div>
                            <span className="text-[10px] font-black uppercase tracking-wider text-white">Campaign Export</span>
                            <div className="flex items-center gap-2">
                                <p className="text-[8px] text-zinc-400 font-bold uppercase tracking-tight">Multi-Variation Results</p>
                                <span className="text-[7px] font-black uppercase tracking-wider bg-orange-500/20 text-orange-400 px-1.5 py-0.5 rounded-md">{ratio}</span>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={() => deleteElements({ nodes: [{ id }] })}
                        className="text-zinc-500 hover:text-white transition-colors p-1.5 hover:bg-white/5 rounded-full"
                    >
                        <X size={14} />
                    </button>
                </div>

                <div className="node-content">
                    {loading ? (
                        <div className="h-[200px] flex flex-col items-center justify-center gap-4 bg-black/40 rounded-2xl border border-dashed border-white/5 shadow-inner">
                            <div className="relative">
                                <Loader2 size={30} className="text-yellow-500 animate-spin" />
                                <div className="absolute inset-0 blur-xl bg-yellow-500/20 rounded-full" />
                            </div>
                            <div className="text-center space-y-1">
                                <span className="text-[9px] text-white font-black uppercase tracking-widest animate-pulse">Neural Rendering...</span>
                                <p className="text-[7px] text-zinc-400 uppercase font-bold tracking-tight">Synthesizing High-Resolution Masters</p>
                            </div>
                        </div>
                    ) : (
                        <div className={cn(
                            "grid gap-3",
                            count === 1 ? "grid-cols-1" : (count === 2 || count === 4) ? "grid-cols-2" : count === 6 ? "grid-cols-3" : "grid-cols-5"
                        )}>
                            {(data.images || Array.from({ length: count })).map((img: any, i: number) => (
                                <div key={i} className="flex flex-col gap-2 group/card">
                                    <div style={{ aspectRatio: cssAspect }} className="bg-white/5 rounded-xl border border-white/5 overflow-hidden relative group shadow-2xl cursor-pointer">
                                        {/* Reference actual content for match */}
                                        {img?.url ? (
                                            <>
                                                <img
                                                    src={thumbnails[img.id] || img.url}
                                                    alt={`Variation ${i + 1}`}
                                                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:blur-[1px]"
                                                />
                                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center gap-2">
                                                    <button
                                                        onClick={() => setPreviewImage(img.url)}
                                                        className="w-8 h-8 flex items-center justify-center bg-white text-black rounded-full hover:bg-yellow-400 transition-all shadow-xl scale-90 group-hover:scale-100 duration-300 active:scale-95"
                                                        title="Launch Preview"
                                                    >
                                                        <Maximize2 size={12} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDownload(img.url, i)}
                                                        className="px-3 py-1.5 flex items-center gap-1.5 bg-yellow-500 text-black text-[8px] font-black rounded-full hover:bg-yellow-400 transition-all shadow-xl scale-125 group-hover:scale-100 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 duration-300"
                                                    >
                                                        <Download size={10} />
                                                        EXPORT 4K
                                                    </button>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-zinc-900/50">
                                                <div className="relative">
                                                    <div className="w-10 h-10 rounded-full border-2 border-dashed border-white/5 animate-spin-slow opacity-20" />
                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                        <div className="w-1 h-1 bg-white opacity-20 rounded-full"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex justify-between items-center px-1.5">
                                        <div className="flex flex-col">
                                            <span className="text-[7px] text-zinc-400 font-bold uppercase tracking-tight">Variant</span>
                                            <span className="text-[9px] text-white/60 font-mono tracking-tighter">V{String(i + 1).padStart(2, '0')}</span>
                                        </div>
                                        <div className="h-4 w-[1px] bg-white/5" />
                                        <div className="flex flex-col items-end">
                                            <span className="text-[7px] text-yellow-500/90 font-black uppercase tracking-widest text-right">
                                                {img?.scenarioName || "VARIANT"}
                                            </span>
                                            <span className="text-[6px] text-zinc-500 font-bold uppercase tracking-tighter">HD MASTER</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <Handle
                    type="target"
                    position={Position.Left}
                    className="!bg-yellow-500 !w-3 !h-3 !border-2 !border-[#080808]"
                />
            </div>

            {/* Lightbox / Preview Overlay */}
            <AnimatePresence>
                {previewImage && (
                    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-8 lg:p-12 pointer-events-auto">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setPreviewImage(null)}
                            className="absolute inset-0 bg-black/95 backdrop-blur-xl cursor-zoom-out"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative max-w-full max-h-full rounded-2xl overflow-hidden shadow-[0_0_100px_rgba(0,0,0,1)] border border-white/10 group bg-zinc-900"
                            style={{ aspectRatio: cssAspect }}
                        >
                            <img
                                src={previewImage}
                                alt="Full Resolution Master"
                                className="w-full h-full object-contain"
                            />

                            {/* Actions bar */}
                            <div className="absolute top-6 right-6 flex items-center gap-3">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDownload(previewImage, 0);
                                    }}
                                    className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-black text-xs font-black rounded-full hover:bg-yellow-400 transition-all active:scale-95 shadow-2xl"
                                >
                                    <Download size={14} />
                                    DOWNLOAD TAILLE RÉELLE (4K)
                                </button>
                                <button
                                    onClick={() => setPreviewImage(null)}
                                    className="w-10 h-10 flex items-center justify-center bg-white/10 text-white rounded-full hover:bg-red-500 transition-all backdrop-blur-lg border border-white/10 shadow-2xl"
                                >
                                    <X size={18} />
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}

function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(' ');
}
