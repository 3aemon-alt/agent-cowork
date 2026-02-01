import { useState } from "react";
import { Copy, Check, Download } from "lucide-react";

interface CodeBlockProps extends React.HTMLAttributes<HTMLPreElement> {
    children?: React.ReactNode;
}

export function CodeBlock({ children, className, ...props }: CodeBlockProps) {
    const [copied, setCopied] = useState(false);

    // Extract content from children (React Element)
    const extractText = (node: React.ReactNode): string => {
        if (typeof node === "string") return node;
        if (Array.isArray(node)) return node.map(extractText).join("");
        if (typeof node === "object" && node && "props" in node) {
            return extractText((node as any).props.children);
        }
        return "";
    };

    const content = extractText(children);

    const handleCopy = () => {
        navigator.clipboard.writeText(content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleSave = async () => {
        try {
            await window.electron.saveFile(content, "snippet.txt");
        } catch (e) {
            console.error("Failed to save snippet", e);
        }
    };

    return (
        <div className="relative group my-4 rounded-xl border border-ink-900/10 bg-surface-secondary overflow-hidden">
            <div className="flex items-center justify-between px-3 py-1.5 bg-surface-tertiary border-b border-ink-900/5">
                <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-ink-900/20" />
                    <div className="w-2.5 h-2.5 rounded-full bg-ink-900/20" />
                    <div className="w-2.5 h-2.5 rounded-full bg-ink-900/20" />
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={handleCopy}
                        className="p-1 rounded-md text-ink-500 hover:text-ink-900 hover:bg-ink-900/5 transition-colors"
                        title="Copy code"
                    >
                        {copied ? <Check className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5" />}
                    </button>
                    <button
                        onClick={handleSave}
                        className="p-1 rounded-md text-ink-500 hover:text-ink-900 hover:bg-ink-900/5 transition-colors"
                        title="Download as file"
                    >
                        <Download className="h-3.5 w-3.5" />
                    </button>
                </div>
            </div>
            <div className="p-3 overflow-x-auto text-sm">
                <pre {...props} className={`!m-0 !p-0 !bg-transparent ${className || ""}`}>
                    {children}
                </pre>
            </div>
        </div>
    );
}
