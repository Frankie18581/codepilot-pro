import { Send, Terminal } from "lucide-react";
import { cn } from "@/lib/utils";

export function InputArea({ input, setInput, onSend, loading }) {
  return (
    <div className="relative p-6 bg-gray-900 border-t border-gray-800 shadow-xl">
      <div className="flex gap-4 max-w-5xl mx-auto items-center">
        <div className="relative flex-1 group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500 transition-colors">
            <Terminal size={18} />
          </div>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSend()}
            placeholder="输入自然语言需求 (例如：写一个 Python 爬虫)..."
            className="w-full bg-gray-950 border border-gray-800 rounded-xl px-12 py-4 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-white placeholder-gray-600 shadow-inner"
            disabled={loading}
          />
          <button
            onClick={onSend}
            disabled={loading || !input.trim()}
            className={cn(
              "absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-all shadow-md",
              loading || !input.trim() 
                ? "bg-gray-800 text-gray-500 cursor-not-allowed" 
                : "bg-blue-600 hover:bg-blue-700 text-white"
            )}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
      <div className="text-center text-[10px] text-gray-700 mt-4 uppercase tracking-[0.2em] font-bold">
        Powered by CodePilot Pro Engine
      </div>
    </div>
  );
}
