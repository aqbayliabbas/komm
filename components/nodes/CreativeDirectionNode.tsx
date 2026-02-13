"use client";

import { Handle, Position, useReactFlow } from "@xyflow/react";
import { Palette, X, Zap, Loader2, Sparkles } from "lucide-react";
import { useState } from "react";

const QUESTIONS = [
    {
        label: "Visual Style",
        key: "style",
        options: ["Editorial", "Cinematic", "Minimalist", "Cyberpunk", "Vogue Style", "Retro-Futurism", "Surrealist", "Hyper-Modern", "Baroque Luxury", "Pop Art"]
    },
    {
        label: "Color Palette",
        key: "colors",
        options: ["Midnight & Silver", "Crimson & Gold", "Pastel Sorbet", "Monochrome Noir", "Cyber Neon", "Earthy Organic", "Vibrant Pop", "Deep Forest", "High-Contrast B&W", "Golden Hour Glow"]
    },
    {
        label: "Lighting",
        key: "lighting",
        options: ["Cinematic Rim", "Hard Dramatic Shadow", "Soft Diffused Glow", "Volumetric God-Rays", "Golden Hour Sun", "Studio Strobe", "Neon Highlights", "Natural Daylight", "Mood Blue"]
    },
    {
        label: "Materiality",
        key: "texture",
        options: ["Brushed Steel", "Polished Marble", "Liquid Chrome", "Raw Concrete", "Velvet & Silk", "Frosted Glass", "Matte Tech Polymer", "Gold Leaf", "Carbon Fiber", "Natural Wood"]
    },
    {
        label: "Framing",
        key: "framing",
        options: ["Extreme Close-up", "Macro Detail", "Wide Angle", "Bird's Eye View", "Low Angle Hero", "Panoramic", "Symmetrical Center", "Shallow Depth of Field"]
    },
    {
        label: "Mood",
        key: "mood",
        options: ["Epic & Grand", "Ethereal & Airy", "Sophisticated", "Mysterious", "Aggressive & Dark", "Zen & Calm", "Nostalgic", "Fast & Futuristic"]
    }
];

export function CreativeDirectionNode({ id, data }: any) {
    const { deleteElements } = useReactFlow();
    const currentValues = data.value || {};
    const [isAnalyzingLocal, setIsAnalyzingLocal] = useState(false);

    const handleBrainstorm = async () => {
        setIsAnalyzingLocal(true);
        try {
            await data.onAnalyze?.(id);
        } finally {
            setIsAnalyzingLocal(false);
        }
    };

    return (
        <div className="min-w-[340px] glass-panel inner-glow animate-in fade-in slide-in-from-left-4 duration-500">
            <div className="node-header flex items-center justify-between premium-gradient-orange">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-orange-500/10 rounded-lg">
                        <Palette size={16} className="text-orange-400" />
                    </div>
                    <div>
                        <span className="text-[10px] font-black uppercase tracking-wider text-white">Art Direction Studio</span>
                        <p className="text-[8px] text-zinc-400 font-bold uppercase tracking-tight">Tailored Visual Identity</p>
                    </div>
                </div>
                <button
                    onClick={() => deleteElements({ nodes: [{ id }] })}
                    className="text-zinc-500 hover:text-white transition-colors p-1.5 hover:bg-white/5 rounded-full"
                >
                    <X size={14} />
                </button>
            </div>

            <div className="node-content space-y-5">
                <div className="grid grid-cols-2 gap-x-4 gap-y-4">
                    {QUESTIONS.map((q) => (
                        <div key={q.key} className="space-y-1.5 relative group">
                            <label className="text-[9px] font-black text-zinc-300 uppercase tracking-widest pl-1">
                                {q.label}
                            </label>
                            <div className="relative">
                                <select
                                    className="w-full rounded-xl px-3 py-2 text-[10px] text-zinc-100 focus:outline-none transition-all nodrag font-medium bg-black/40 border border-white/10 appearance-none cursor-pointer hover:bg-black/60"
                                    value={currentValues[q.key] || ""}
                                    onChange={(evt) => {
                                        const newValue = { ...currentValues, [q.key]: evt.target.value };
                                        data.onChange?.(newValue);
                                    }}
                                >
                                    <option value="" disabled>Select {q.label}...</option>
                                    {q.options.map(opt => (
                                        <option key={opt} value={opt}>{opt}</option>
                                    ))}
                                    {currentValues[q.key] && !q.options.includes(currentValues[q.key]) && (
                                        <option value={currentValues[q.key]}>{currentValues[q.key]} (Custom)</option>
                                    )}
                                </select>
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-40 group-hover:opacity-100 transition-opacity">
                                    <Sparkles size={10} className="text-orange-500" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="pt-2">
                    <button
                        onClick={handleBrainstorm}
                        disabled={isAnalyzingLocal}
                        className="w-full flex items-center justify-center gap-2 py-2.5 bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/20 rounded-xl transition-all group active:scale-[0.98] disabled:opacity-50"
                    >
                        {isAnalyzingLocal ? (
                            <Loader2 size={14} className="animate-spin text-orange-400" />
                        ) : (
                            <Sparkles size={14} className="text-orange-400 group-hover:rotate-12 transition-transform" />
                        )}
                        <span className="text-[10px] font-black text-orange-400 uppercase tracking-widest">
                            Analyze & Brainstorm
                        </span>
                    </button>
                    <p className="mt-2 text-[7px] text-zinc-500 uppercase font-bold tracking-tight text-center">
                        AI will suggest directions based on connected product details
                    </p>
                </div>
            </div>

            <Handle
                type="source"
                position={Position.Right}
                className="!bg-orange-500 !w-3 !h-3 !border-2 !border-[#080808]"
            />
        </div>
    );
}
