"use client";

import React from "react";
import { Handle, Position, useReactFlow } from "@xyflow/react";
import { Target, X, Users, Goal, Package, MessageSquareQuote } from "lucide-react";

const InputField = ({ icon: Icon, label, placeholder, value, onChange, rows = 2 }: any) => (
    <div className="space-y-1.5 nodrag">
        <label className="text-[9px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
            <Icon size={10} className="text-zinc-500" />
            {label}
        </label>
        <textarea
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            rows={rows}
            className="w-full bg-white/5 border border-white/5 rounded-lg p-2 text-xs text-zinc-300 placeholder:text-zinc-600 focus:outline-none focus:border-red-500/30 transition-colors resize-none scrollbar-hide nodrag"
        />
    </div>
);

export function StrategyNode({ id, data }: any) {
    const { deleteElements, setNodes } = useReactFlow();

    const updateData = (key: string, value: string) => {
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
        <div className="min-w-[320px] glass-panel inner-glow animate-in fade-in zoom-in duration-300">
            <div className="node-header flex items-center justify-between premium-gradient-red">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-red-500/10 rounded-lg">
                        <Target size={16} className="text-red-400" />
                    </div>
                    <div>
                        <span className="text-[10px] font-black uppercase tracking-wider text-white">Contexte Stratégique</span>
                        <p className="text-[8px] text-zinc-400 font-bold uppercase tracking-tight">Alignement Commercial</p>
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
                <InputField
                    icon={Users}
                    label="Public Cible"
                    placeholder="Pour qui est-ce ? (ex: professionnels passionnés de technologie, 25-40 ans)"
                    value={data.targetAudience}
                    onChange={(val: string) => updateData("targetAudience", val)}
                />
                <InputField
                    icon={Goal}
                    label="Objectif de Campagne"
                    placeholder="Quel est l'objectif ? (ex: notoriété de la marque, soldes saisonnières)"
                    value={data.campaignGoal}
                    onChange={(val: string) => updateData("campaignGoal", val)}
                />
                <InputField
                    icon={Package}
                    label="Description du Produit"
                    placeholder="Décrivez le produit et ses caractéristiques principales..."
                    value={data.productDescription}
                    onChange={(val: string) => updateData("productDescription", val)}
                    rows={3}
                />
                <InputField
                    icon={MessageSquareQuote}
                    label="Messages Clés"
                    placeholder="Messages principaux à communiquer (un par ligne)..."
                    value={data.keyMessages}
                    onChange={(val: string) => updateData("keyMessages", val)}
                />
            </div>

            <Handle
                type="source"
                position={Position.Right}
                className="!bg-red-500 !w-3 !h-3 !border-2 !border-[#080808]"
            />
        </div>
    );
}
