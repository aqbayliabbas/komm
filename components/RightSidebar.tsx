"use client";

import {
    Plus,
    FileText,
    Upload,
    Trash2,
    Settings2
} from "lucide-react";

interface RightSidebarProps {
    projectName: string;
    setProjectName: (val: string) => void;
    onSaveProject: () => void;
    onExportJson: () => void;
    onImportJson: (file: File) => void;
    projects: any[];
    onLoadProject: (id: string) => void;
    onDeleteProject: (id: string) => void;
    onReset: () => void;
}

export function RightSidebar({
    projectName,
    setProjectName,
    onSaveProject,
    onExportJson,
    onImportJson,
    projects,
    onLoadProject,
    onDeleteProject,
    onReset
}: RightSidebarProps) {
    return (
        <aside className="fixed right-6 top-6 bottom-6 w-72 glass-panel inner-glow flex flex-col z-50">
            <div className="p-6 border-b border-white/5 bg-gradient-to-br from-white/[0.02] to-transparent">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20 shadow-xl">
                        <Settings2 size={20} className="text-blue-400" />
                    </div>
                    <div>
                        <h1 className="text-sm font-black text-white tracking-[0.2em] uppercase">Workspace</h1>
                        <p className="text-[8px] text-zinc-400 font-bold uppercase tracking-widest leading-tight">Project Management</p>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-hide">
                <div className="space-y-4">
                    <div className="space-y-2 px-1">
                        <label className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.2em] block pl-1">Target Project</label>
                        <input
                            type="text"
                            placeholder="Set Name..."
                            value={projectName}
                            onChange={(e) => setProjectName?.(e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-[10px] font-bold text-white focus:outline-none focus:border-blue-500/50 transition-colors uppercase tracking-widest placeholder:text-zinc-700"
                        />
                        <div className="grid grid-cols-2 gap-2 pt-2">
                            <button
                                onClick={onSaveProject}
                                className="flex items-center justify-center gap-2 py-3 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 rounded-xl text-[9px] font-black text-blue-400 uppercase tracking-widest transition-all active:scale-95"
                            >
                                <Plus size={12} />
                                Save
                            </button>
                            <div className="relative overflow-hidden flex">
                                <button
                                    onClick={onExportJson}
                                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-l-xl text-[9px] font-black text-zinc-400 uppercase tracking-widest transition-all active:scale-95 border-r-0"
                                >
                                    <FileText size={12} />
                                    Exp
                                </button>
                                <label className="flex-1 flex items-center justify-center gap-2 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-r-xl text-[9px] font-black text-zinc-400 uppercase tracking-widest transition-all active:scale-95 cursor-pointer">
                                    <Upload size={12} />
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept=".json"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) onImportJson(file);
                                        }}
                                    />
                                </label>
                            </div>
                        </div>

                        {/* Reset Button */}
                        <button
                            onClick={onReset}
                            className="w-full mt-2 flex items-center justify-center gap-2 py-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-xl text-[9px] font-black text-red-500 uppercase tracking-[0.2em] transition-all active:scale-95"
                        >
                            <Trash2 size={12} />
                            Reset Current Flow
                        </button>
                    </div>

                    <div className="pt-4">
                        <div className="flex items-center justify-between px-2 mb-4">
                            <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Saved Flows</span>
                            <div className="h-[1px] flex-1 ml-4 bg-white/10" />
                        </div>

                        {projects && projects.length > 0 ? (
                            <div className="grid gap-2 overflow-y-auto max-h-[400px] pr-1 scrollbar-hide">
                                {projects.map((p: any) => (
                                    <div
                                        key={p.id}
                                        className="flex items-center justify-between group p-3 bg-white/[0.02] hover:bg-white/[0.05] rounded-xl border border-white/5 hover:border-white/10 transition-all cursor-pointer relative overflow-hidden"
                                    >
                                        <div className="flex flex-col flex-1 min-w-0" onClick={() => onLoadProject?.(p.id)}>
                                            <span className="text-[10px] font-bold text-zinc-200 uppercase truncate pr-2 group-hover:text-blue-400 transition-colors uppercase tracking-wider">{p.name || "Untitled"}</span>
                                            <span className="text-[7px] text-zinc-600 font-bold tracking-widest uppercase mt-1">{new Date(p.date).toLocaleDateString()} at {new Date(p.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onDeleteProject(p.id);
                                            }}
                                            className="opacity-0 group-hover:opacity-100 p-2 hover:bg-red-500/10 hover:text-red-500 text-zinc-600 rounded-lg transition-all"
                                        >
                                            <Trash2 size={12} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-12 flex flex-col items-center justify-center opacity-20 transform scale-75">
                                <FileText size={40} className="text-zinc-500 mb-4" />
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Archive Empty</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="p-6 bg-black/40 border-t border-white/10">
                <div className="flex items-center justify-center p-4 bg-white/[0.02] rounded-2xl border border-white/5 opacity-50">
                    <span className="text-[8px] text-zinc-500 font-black uppercase tracking-[0.4em]">Flow History System</span>
                </div>
            </div>
        </aside>
    );
}
