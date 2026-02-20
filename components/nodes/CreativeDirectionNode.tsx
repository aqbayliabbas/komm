"use client";

import React from "react";
import { Handle, Position, useReactFlow } from "@xyflow/react";
import { Palette, X, Sliders as SlidersIcon, Camera, Sun, Smile, Brush } from "lucide-react";

const CAMERA_ANGLES = ["Plan Large", "Plan Moyen", "Gros Plan", "Vue de Dessus", "Angle Bas", "Profil", "Macro"];
const LIGHTING_OPTIONS = ["Naturel", "Golden Hour", "Studio", "Sombre"];
const MOOD_OPTIONS = ["Professionnel", "Élégant", "Énergique", "Minimaliste", "Audacieux", "Doux", "Sombre", "Vibrant"];
const ART_STYLES = ["Photographie", "Illustration", "3D", "Aquarelle", "Digital", "Croquis", "Vecteur", "Techniques Mixtes"];

const Slider = ({ label, value, onChange, low, high }: any) => (
    <div className="space-y-1.5 nodrag">
        <div className="flex justify-between items-center px-0.5">
            <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">{label}</span>
            <span className="text-[9px] font-black text-blue-400">{value}</span>
        </div>
        <input
            type="range"
            min="1"
            max="10"
            value={value}
            onChange={(e) => onChange(parseInt(e.target.value))}
            onPointerDown={(e) => e.stopPropagation()}
            className="w-full h-1.5 bg-white/5 rounded-lg appearance-none cursor-pointer accent-blue-500 nodrag"
        />
        <div className="flex justify-between text-[7px] text-zinc-500 font-bold uppercase tracking-tighter">
            <span>{low}</span>
            <span>{high}</span>
        </div>
    </div>
);

const Select = ({ icon: Icon, label, options, value, onChange }: any) => (
    <div className="space-y-1.5 nodrag">
        <label className="text-[9px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
            <Icon size={10} className="text-zinc-500" />
            {label}
        </label>
        <select
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            className="w-full bg-white/5 border border-white/5 rounded-lg px-2 py-1.5 text-xs text-zinc-300 focus:outline-none focus:border-blue-500/30 transition-colors nodrag"
        >
            <option value="" disabled>Sélectionner {label}</option>
            {options.map((opt: string) => (
                <option key={opt} value={opt} className="bg-[#121212]">{opt}</option>
            ))}
        </select>
    </div>
);

export function CreativeDirectionNode({ id, data }: any) {
    const { deleteElements, setNodes } = useReactFlow();

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

    const updateFeeling = (key: string, value: number) => {
        const feelings = { ...(data.feelings || { energy: 5, sophistication: 5, warmth: 5, contrast: 5 }) };
        feelings[key] = value;
        updateData("feelings", feelings);
    };

    const feelings = data.feelings || { energy: 5, sophistication: 5, warmth: 5, contrast: 5 };

    return (
        <div className="min-w-[320px] glass-panel inner-glow animate-in fade-in zoom-in duration-300">
            <div className="node-header flex items-center justify-between premium-gradient-orange">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-orange-500/10 rounded-lg">
                        <Palette size={16} className="text-orange-400" />
                    </div>
                    <div>
                        <span className="text-[10px] font-black uppercase tracking-wider text-white">Direction Créative</span>
                        <p className="text-[8px] text-zinc-400 font-bold uppercase tracking-tight">Style & Paramètres</p>
                    </div>
                </div>
                <button
                    onClick={() => deleteElements({ nodes: [{ id }] })}
                    className="text-zinc-500 hover:text-white transition-colors p-1.5 hover:bg-white/5 rounded-full"
                >
                    <X size={14} />
                </button>
            </div>

            <div className="node-content p-4 space-y-6">
                <div className="space-y-4">
                    <Slider
                        label="Énergie"
                        value={feelings.energy}
                        onChange={(val: any) => updateFeeling("energy", val)}
                        low="Calme" high="Dynamique"
                    />
                    <Slider
                        label="Sophistication"
                        value={feelings.sophistication}
                        onChange={(val: any) => updateFeeling("sophistication", val)}
                        low="Amical" high="Premium"
                    />
                    <Slider
                        label="Chaleur"
                        value={feelings.warmth}
                        onChange={(val: any) => updateFeeling("warmth", val)}
                        low="Froid" high="Chaud"
                    />
                    <Slider
                        label="Contraste"
                        value={feelings.contrast}
                        onChange={(val: any) => updateFeeling("contrast", val)}
                        low="Doux" high="Saisissant"
                    />
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                    <Select
                        icon={Camera}
                        label="Angle"
                        options={CAMERA_ANGLES}
                        value={data.cameraAngle}
                        onChange={(val: any) => updateData("cameraAngle", val)}
                    />
                    <Select
                        icon={Sun}
                        label="Éclairage"
                        options={LIGHTING_OPTIONS}
                        value={data.lighting}
                        onChange={(val: any) => updateData("lighting", val)}
                    />
                    <Select
                        icon={Smile}
                        label="Ambiance"
                        options={MOOD_OPTIONS}
                        value={data.mood}
                        onChange={(val: any) => updateData("mood", val)}
                    />
                    <Select
                        icon={Brush}
                        label="Style"
                        options={ART_STYLES}
                        value={data.style}
                        onChange={(val: any) => updateData("style", val)}
                    />
                </div>

                <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Palette de Couleurs</label>
                    <input
                        type="text"
                        placeholder="ex: bleus vibrants, accents néon..."
                        value={data.colorPalette || ""}
                        onChange={(e) => updateData("colorPalette", e.target.value)}
                        className="w-full bg-white/5 border border-white/5 rounded-lg px-3 py-2 text-xs text-zinc-300 placeholder:text-zinc-600 focus:outline-none focus:border-orange-500/30 transition-colors nodrag"
                    />
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
