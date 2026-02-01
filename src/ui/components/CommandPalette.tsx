import { useEffect, useState, useCallback } from "react";
import { Command } from "cmdk";
import { useAppStore } from "../store/useAppStore";
import {
    Search,
    Plus,
    Settings,
    Moon,
    Sun,
    Laptop,
    MessageSquarePlus,
} from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";

export function CommandPalette() {
    const [open, setOpen] = useState(false);
    const [page, setPage] = useState<"root" | "prompts">("root");

    const setActiveSessionId = useAppStore((s) => s.setActiveSessionId);
    const setShowSettingsModal = useAppStore((s) => s.setShowSettingsModal);
    const setShowStartModal = useAppStore((s) => s.setShowStartModal);
    const setTheme = useAppStore((s) => s.setTheme);
    const prompts = useAppStore((s) => s.prompts);
    const setPrompt = useAppStore((s) => s.setPrompt);
    const prompt = useAppStore((s) => s.prompt);

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || e.key === "/") {
                e.preventDefault();
                setOpen((open) => !open);
                setPage("root");
            }
        };

        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);

    const runCommand = useCallback((command: () => void) => {
        setOpen(false);
        command();
    }, []);

    return (
        <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-ink-900/20 backdrop-blur-sm z-50" />
                <Dialog.Content className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-[640px] z-50">
                    <Command className="w-full overflow-hidden rounded-xl border border-ink-900/10 bg-surface shadow-2xl animate-in fade-in zoom-in-95 duration-100">
                        <div className="flex items-center border-b border-ink-900/5 px-3">
                            <Search className="mr-2 h-4 w-4 shrink-0 text-muted" />
                            <Command.Input
                                placeholder="Type a command or search..."
                                className="flex h-12 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted disabled:cursor-not-allowed disabled:opacity-50 text-ink-900"
                                autoFocus
                            />
                            <div className="flex items-center gap-1">
                                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-ink-900/10 bg-surface-secondary px-1.5 font-mono text-[10px] font-medium text-muted opacity-100">
                                    <span className="text-xs">ESC</span>
                                </kbd>
                            </div>
                        </div>

                        <Command.List className="max-h-[300px] overflow-y-auto overflow-x-hidden py-2 px-2 scrollbar-hide">
                            <Command.Empty className="py-6 text-center text-sm text-muted">
                                No results found.
                            </Command.Empty>

                            {page === "root" && (
                                <>
                                    <Command.Group heading="Main">
                                        <Command.Item
                                            onSelect={() => runCommand(() => {
                                                setActiveSessionId(null);
                                                setShowStartModal(true);
                                            })}
                                            className="relative flex cursor-pointer select-none items-center rounded-lg px-2 py-2 text-sm outline-none aria-selected:bg-accent aria-selected:text-white data-[disabled]:pointer-events-none data-[disabled]:opacity-50 transition-colors"
                                        >
                                            <Plus className="mr-2 h-4 w-4" />
                                            <span>New Task</span>

                                        </Command.Item>

                                        <Command.Item
                                            onSelect={() => setPage("prompts")}
                                            className="relative flex cursor-pointer select-none items-center rounded-lg px-2 py-2 text-sm outline-none aria-selected:bg-accent aria-selected:text-white data-[disabled]:pointer-events-none data-[disabled]:opacity-50 transition-colors"
                                        >
                                            <MessageSquarePlus className="mr-2 h-4 w-4" />
                                            <span>Insert Prompt...</span>
                                        </Command.Item>

                                        <Command.Item
                                            onSelect={() => runCommand(() => setShowSettingsModal(true))}
                                            className="relative flex cursor-pointer select-none items-center rounded-lg px-2 py-2 text-sm outline-none aria-selected:bg-accent aria-selected:text-white data-[disabled]:pointer-events-none data-[disabled]:opacity-50 transition-colors"
                                        >
                                            <Settings className="mr-2 h-4 w-4" />
                                            <span>Settings</span>
                                        </Command.Item>
                                    </Command.Group>

                                    <Command.Separator className="my-1.5 h-px bg-ink-900/5" />

                                    <Command.Group heading="Theme">
                                        <Command.Item
                                            onSelect={() => runCommand(() => setTheme("light"))}
                                            className="relative flex cursor-pointer select-none items-center rounded-lg px-2 py-2 text-sm outline-none aria-selected:bg-accent aria-selected:text-white data-[disabled]:pointer-events-none data-[disabled]:opacity-50 transition-colors"
                                        >
                                            <Sun className="mr-2 h-4 w-4" />
                                            <span>Light Mode</span>
                                        </Command.Item>
                                        <Command.Item
                                            onSelect={() => runCommand(() => setTheme("dark"))}
                                            className="relative flex cursor-pointer select-none items-center rounded-lg px-2 py-2 text-sm outline-none aria-selected:bg-accent aria-selected:text-white data-[disabled]:pointer-events-none data-[disabled]:opacity-50 transition-colors"
                                        >
                                            <Moon className="mr-2 h-4 w-4" />
                                            <span>Dark Mode</span>
                                        </Command.Item>
                                        <Command.Item
                                            onSelect={() => runCommand(() => setTheme("system"))}
                                            className="relative flex cursor-pointer select-none items-center rounded-lg px-2 py-2 text-sm outline-none aria-selected:bg-accent aria-selected:text-white data-[disabled]:pointer-events-none data-[disabled]:opacity-50 transition-colors"
                                        >
                                            <Laptop className="mr-2 h-4 w-4" />
                                            <span>System Theme</span>
                                        </Command.Item>
                                    </Command.Group>
                                </>
                            )}

                            {page === "prompts" && (
                                <Command.Group heading="Saved Prompts">
                                    <Command.Item
                                        onSelect={() => setPage("root")}
                                        className="relative flex cursor-pointer select-none items-center rounded-lg px-2 py-2 text-sm outline-none aria-selected:bg-accent aria-selected:text-white data-[disabled]:pointer-events-none data-[disabled]:opacity-50 transition-colors font-medium mb-1 text-muted"
                                    >
                                        ← Back
                                    </Command.Item>
                                    {prompts.length === 0 ? (
                                        <div className="px-4 py-2 text-sm text-muted italic">No saved prompts yet.</div>
                                    ) : (
                                        prompts.map((p) => (
                                            <Command.Item
                                                key={p.id}
                                                onSelect={() => runCommand(() => setPrompt(prompt ? `${prompt}\n${p.content}` : p.content))}
                                                className="relative flex cursor-pointer select-none items-center rounded-lg px-2 py-2 text-sm outline-none aria-selected:bg-accent aria-selected:text-white data-[disabled]:pointer-events-none data-[disabled]:opacity-50 transition-colors"
                                            >
                                                <div className="flex flex-col">
                                                    <span className="font-medium">{p.title}</span>
                                                    <span className="text-xs text-muted aria-selected:text-white/80 line-clamp-1">{p.content}</span>
                                                </div>
                                            </Command.Item>
                                        ))
                                    )}
                                </Command.Group>
                            )}
                        </Command.List>
                    </Command>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
