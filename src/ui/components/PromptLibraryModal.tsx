import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useAppStore, SavedPrompt } from "../store/useAppStore";
import { Plus, Trash2, Edit2, X } from "lucide-react";

interface PromptLibraryModalProps {
    onClose: () => void;
}

export function PromptLibraryModal({ onClose }: PromptLibraryModalProps) {
    const prompts = useAppStore((s) => s.prompts);
    const addPrompt = useAppStore((s) => s.addPrompt);
    const removePrompt = useAppStore((s) => s.removePrompt);
    const updatePrompt = useAppStore((s) => s.updatePrompt);

    const [editingId, setEditingId] = useState<string | null>(null);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [isCreating, setIsCreating] = useState(false);

    const resetForm = () => {
        setTitle("");
        setContent("");
        setEditingId(null);
        setIsCreating(false);
    };

    const handleSave = () => {
        if (!title.trim() || !content.trim()) return;

        if (editingId) {
            updatePrompt(editingId, { title, content });
        } else {
            addPrompt({ title, content });
        }
        resetForm();
    };

    const startEdit = (p: SavedPrompt) => {
        setEditingId(p.id);
        setTitle(p.title);
        setContent(p.content);
        setIsCreating(true);
    };

    return (
        <Dialog.Root open={true} onOpenChange={onClose}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-ink-900/40 backdrop-blur-sm z-50" />
                <Dialog.Content className="fixed left-1/2 top-1/2 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-0 shadow-xl z-50 flex flex-col max-h-[85vh]">
                    <div className="flex items-center justify-between border-b border-ink-900/10 px-6 py-4">
                        <Dialog.Title className="text-lg font-semibold text-ink-900">
                            Prompt Library
                        </Dialog.Title>
                        <Dialog.Close asChild>
                            <button className="rounded-full p-2 text-ink-500 hover:bg-ink-900/5 transition-colors">
                                <X className="h-5 w-5" />
                            </button>
                        </Dialog.Close>
                    </div>

                    <div className="flex flex-1 overflow-hidden">
                        {/* Sidebar list */}
                        <div className="w-1/3 border-r border-ink-900/10 bg-surface-cream overflow-y-auto p-3 flex flex-col gap-2">
                            <button
                                onClick={() => {
                                    resetForm();
                                    setIsCreating(true);
                                }}
                                className="flex items-center justify-center gap-2 w-full rounded-xl border border-dashed border-ink-900/20 py-3 text-sm font-medium text-ink-600 hover:bg-surface-secondary hover:border-ink-900/30 transition-all"
                            >
                                <Plus className="h-4 w-4" />
                                New Prompt
                            </button>

                            {prompts.map((p) => (
                                <div
                                    key={p.id}
                                    onClick={() => startEdit(p)}
                                    className={`group relative flex cursor-pointer flex-col gap-1 rounded-xl p-3 text-left transition-all ${editingId === p.id
                                            ? "bg-white shadow-sm ring-1 ring-ink-900/10"
                                            : "hover:bg-white/50"
                                        }`}
                                >
                                    <span className="font-medium text-ink-900">{p.title}</span>
                                    <span className="text-xs text-muted line-clamp-2">{p.content}</span>

                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (confirm("Delete this prompt?")) removePrompt(p.id);
                                            if (editingId === p.id) resetForm();
                                        }}
                                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-error hover:bg-error-light transition-all"
                                    >
                                        <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Editor Area */}
                        <div className="flex-1 bg-surface p-6 flex flex-col">
                            {isCreating || editingId ? (
                                <div className="flex flex-col h-full gap-4 animate-in fade-in duration-200">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs font-medium text-muted">Title</label>
                                        <input
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            placeholder="e.g. Refactor Code"
                                            className="w-full rounded-xl border border-ink-900/10 bg-white px-4 py-2.5 text-sm text-ink-900 outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 transition-all placeholder:text-black/20"
                                            autoFocus
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2 flex-1">
                                        <label className="text-xs font-medium text-muted">Prompt Content</label>
                                        <textarea
                                            value={content}
                                            onChange={(e) => setContent(e.target.value)}
                                            placeholder="Enter the prompt text..."
                                            className="w-full h-full resize-none rounded-xl border border-ink-900/10 bg-white px-4 py-3 text-sm text-ink-900 outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 transition-all font-mono leading-relaxed placeholder:text-black/20"
                                        />
                                    </div>
                                    <div className="flex justify-end gap-3 pt-2">
                                        <button
                                            onClick={resetForm}
                                            className="rounded-lg px-4 py-2 text-sm font-medium text-ink-600 hover:bg-ink-900/5 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleSave}
                                            disabled={!title.trim() || !content.trim()}
                                            className="rounded-lg bg-ink-900 px-6 py-2 text-sm font-medium text-white shadow-sm hover:bg-ink-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                        >
                                            {editingId ? "Update Prompt" : "Save Prompt"}
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-center text-muted select-none opacity-60">
                                    <div className="w-16 h-16 rounded-2xl bg-ink-900/5 flex items-center justify-center mb-4">
                                        <Edit2 className="h-8 w-8 text-ink-300" />
                                    </div>
                                    <p className="text-sm font-medium text-ink-600">Select a prompt to edit</p>
                                    <p className="text-xs mt-1">or create a new one to get started</p>
                                </div>
                            )}
                        </div>
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
