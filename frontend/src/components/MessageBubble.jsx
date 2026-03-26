import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { CodeBlock } from "./CodeBlock";
import { cn } from "@/lib/utils";
import { User, Cpu, ShieldAlert } from "lucide-react";

export function MessageBubble({ role, content }) {
  const isUser = role === "user";
  const isHIC = content.includes("[HIC 介入]");
  const isSystem = role === "system";

  return (
    <div className={cn("flex w-full mb-6 animate-in fade-in slide-in-from-bottom-2", isUser ? "justify-end" : "justify-start")}>
      <div className={cn("flex max-w-[85%] md:max-w-[75%]", isUser ? "flex-row-reverse" : "flex-row")}>
        {/* 头像 */}
        <div className={cn("flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center", 
          isUser ? "ml-3 bg-blue-600" : (isSystem ? "mr-3 bg-red-900" : "mr-3 bg-gray-700"))}>
          {isUser ? <User size={18} /> : (isSystem ? <ShieldAlert size={18} /> : <Cpu size={18} />)}
        </div>

        {/* 气泡 */}
        <div className={cn("relative p-4 rounded-2xl text-sm leading-relaxed shadow-sm", 
          isUser ? "bg-blue-600 text-white rounded-tr-none" : 
          (isSystem ? "bg-red-900/50 text-red-200 border border-red-800" : "bg-gray-800 text-gray-100 border border-gray-700 rounded-tl-none"),
          isHIC && "border-yellow-500/50 bg-yellow-900/20 shadow-yellow-500/10")}>
          
          {isHIC && <div className="flex items-center gap-2 mb-2 text-yellow-500 text-xs font-bold uppercase tracking-wider">
            <ShieldAlert size={14} /> HIC Controller
          </div>}

          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || "");
                return !inline && match ? (
                  <CodeBlock
                    language={match[1]}
                    value={String(children).replace(/\n$/, "")}
                  />
                ) : (
                  <code className={cn("px-1 py-0.5 rounded bg-gray-700 text-gray-200 font-mono text-xs", className)} {...props}>
                    {children}
                  </code>
                );
              },
              p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
              ul: ({ children }) => <ul className="list-disc pl-4 mb-2">{children}</ul>,
              ol: ({ children }) => <ol className="list-decimal pl-4 mb-2">{children}</ol>,
              blockquote: ({ children }) => <blockquote className="border-l-4 border-gray-600 pl-4 italic my-2">{children}</blockquote>,
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
