"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import { X, Eraser, Paintbrush, Check, Trash2, Maximize2, Minimize2 } from "lucide-react";

interface MaskEditorProps {
    imageUrl: string;
    onSave: (maskBase64: string, prompt: string) => void;
    onCancel: () => void;
    initialPrompt?: string;
}

export function MaskEditor({ imageUrl, onSave, onCancel, initialPrompt = "" }: MaskEditorProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [brushSize, setBrushSize] = useState(40);
    const [tool, setTool] = useState<"brush" | "eraser">("brush");
    const [prompt, setPrompt] = useState(initialPrompt);
    const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

    useEffect(() => {
        const updateSize = () => {
            if (containerRef.current) {
                const { width, height } = containerRef.current.getBoundingClientRect();
                // Maintain 3:4 aspect ratio if possible, or use image ratio
                const img = new Image();
                img.src = imageUrl;
                img.onload = () => {
                    const imgRatio = img.width / img.height;
                    let canvasW = width;
                    let canvasH = width / imgRatio;

                    if (canvasH > height * 0.8) {
                        canvasH = height * 0.8;
                        canvasW = canvasH * imgRatio;
                    }

                    setCanvasSize({ width: canvasW, height: canvasH });
                };
            }
        };

        updateSize();
        window.addEventListener("resize", updateSize);
        return () => window.removeEventListener("resize", updateSize);
    }, [imageUrl]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || canvasSize.width === 0) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Initialize canvas as transparent
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Setup brush style
        ctx.lineJoin = "round";
        ctx.lineCap = "round";
    }, [canvasSize]);

    const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
        setIsDrawing(true);
        draw(e);
    };

    const stopDrawing = () => {
        setIsDrawing(false);
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext("2d");
            if (ctx) ctx.beginPath(); // Reset path
        }
    };

    const draw = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDrawing) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const rect = canvas.getBoundingClientRect();
        let clientX, clientY;

        if ("touches" in e) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = e.clientX;
            clientY = e.clientY;
        }

        const x = clientX - rect.left;
        const y = clientY - rect.top;

        ctx.lineWidth = brushSize;

        if (tool === "brush") {
            ctx.globalCompositeOperation = "source-over";
            ctx.strokeStyle = "rgba(255, 255, 255, 0.8)"; // For visual feedback
        } else {
            ctx.globalCompositeOperation = "destination-out";
            ctx.strokeStyle = "rgba(0,0,0,1)";
        }

        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x, y);
    };

    const handleClear = () => {
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext("2d");
            if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    };

    const handleSave = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Create a temporary canvas to generate the binary mask
        const tempCanvas = document.createElement("canvas");
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;
        const tempCtx = tempCanvas.getContext("2d");
        if (!tempCtx) return;

        // Draw everything from original canvas as solid white on black background
        tempCtx.fillStyle = "black";
        tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

        // We need to copy the pixels. source-over white.
        tempCtx.globalCompositeOperation = "source-over";
        tempCtx.drawImage(canvas, 0, 0);

        // Ensure all non-transparent pixels become white
        const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
            if (data[i + 3] > 0) { // If alpha > 0
                data[i] = 255;   // R
                data[i + 1] = 255; // G
                data[i + 2] = 255; // B
                data[i + 3] = 255; // A
            }
        }
        tempCtx.putImageData(imageData, 0, 0);

        const maskBase64 = tempCanvas.toDataURL("image/png");
        onSave(maskBase64, prompt);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-xl animate-in fade-in duration-300">
            <div ref={containerRef} className="relative w-full max-w-5xl h-[90vh] flex flex-col gap-6 p-6">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                        <h2 className="text-xl font-black text-white uppercase tracking-tighter">Éditeur de Masque</h2>
                        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Dessinez la zone à modifier</p>
                    </div>
                    <button
                        onClick={onCancel}
                        className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors text-zinc-400 hover:text-white"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="flex-1 flex gap-6 overflow-hidden">
                    {/* Main Editor Area */}
                    <div className="flex-1 relative glass-panel rounded-3xl overflow-hidden border border-white/10 bg-black/40 flex items-center justify-center select-none cursor-crosshair">
                        <img
                            src={imageUrl}
                            alt="To Edit"
                            className="absolute pointer-events-none object-contain"
                            style={{ width: canvasSize.width, height: canvasSize.height }}
                        />
                        <canvas
                            ref={canvasRef}
                            width={canvasSize.width}
                            height={canvasSize.height}
                            onMouseDown={startDrawing}
                            onMouseMove={draw}
                            onMouseUp={stopDrawing}
                            onMouseLeave={stopDrawing}
                            onTouchStart={startDrawing}
                            onTouchMove={draw}
                            onTouchEnd={stopDrawing}
                            className="relative z-10 touch-none"
                            style={{
                                cursor: tool === "brush" ? "crosshair" : "cell",
                                filter: "drop-shadow(0 0 10px rgba(255,255,255,0.3))"
                            }}
                        />
                    </div>

                    {/* Controls Panel */}
                    <div className="w-80 flex flex-col gap-4">
                        <div className="glass-panel p-5 space-y-6">
                            {/* Tools */}
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Outils</label>
                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        onClick={() => setTool("brush")}
                                        className={`flex items-center justify-center gap-2 p-3 rounded-xl border transition-all ${tool === "brush"
                                                ? "bg-blue-500 border-blue-400 text-white shadow-lg shadow-blue-500/20"
                                                : "bg-white/5 border-white/10 text-zinc-400 hover:bg-white/10"
                                            }`}
                                    >
                                        <Paintbrush size={18} />
                                        <span className="text-xs font-bold">Pinceau</span>
                                    </button>
                                    <button
                                        onClick={() => setTool("eraser")}
                                        className={`flex items-center justify-center gap-2 p-3 rounded-xl border transition-all ${tool === "eraser"
                                                ? "bg-blue-500 border-blue-400 text-white shadow-lg shadow-blue-500/20"
                                                : "bg-white/5 border-white/10 text-zinc-400 hover:bg-white/10"
                                            }`}
                                    >
                                        <Eraser size={18} />
                                        <span className="text-xs font-bold">Gomme</span>
                                    </button>
                                </div>
                            </div>

                            {/* Brush Size */}
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Taille du pinceau</label>
                                    <span className="text-[10px] font-mono text-blue-400">{brushSize}px</span>
                                </div>
                                <input
                                    type="range"
                                    min="5"
                                    max="150"
                                    value={brushSize}
                                    onChange={(e) => setBrushSize(parseInt(e.target.value))}
                                    className="w-full accent-blue-500 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer"
                                />
                            </div>

                            <button
                                onClick={handleClear}
                                className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500/20 transition-all text-xs font-bold uppercase"
                            >
                                <Trash2 size={16} />
                                Effacer tout
                            </button>
                        </div>

                        {/* Refinement Prompt */}
                        <div className="grow glass-panel p-5 flex flex-col gap-3">
                            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Directive de Modification</label>
                            <textarea
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="Que voulez-vous modifier dans la zone masquée ? (ex: 'Remplacer par un bouton de rose', 'Changer la couleur en bleu')"
                                className="flex-1 w-full bg-black/40 border border-white/10 rounded-xl p-4 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-500/50 transition-all resize-none font-medium leading-relaxed"
                            />
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                            <button
                                onClick={onCancel}
                                className="flex-1 p-4 rounded-xl bg-white/5 border border-white/10 text-zinc-400 hover:bg-white/10 transition-all text-xs font-bold uppercase tracking-widest"
                            >
                                Annuler
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={!prompt.trim()}
                                className="flex-[2] flex items-center justify-center gap-2 p-4 rounded-xl bg-blue-500 hover:bg-blue-600 text-white shadow-xl shadow-blue-500/20 transition-all text-xs font-black uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Check size={18} />
                                Appliquer
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
