import { MessageBubble } from "./MessageBubble";
import { useEffect, useRef } from "react";
import { Terminal, ShieldCheck } from "lucide-react";

export function ChatWindow({ messages, loading }) {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  return (
    <div className="flex-1 flex flex-col bg-gray-950 overflow-hidden relative">
      {/* 顶部状态栏 */}
      <div className="flex items-center justify-between px-6 py-4 bg-gray-900 border-b border-gray-800 shadow-lg z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600 rounded-lg shadow-blue-500/20 shadow-lg">
            <Terminal size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-gray-100">🚀 CodePilot Pro</h1>
            <p className="text-[10px] text-green-500 font-bold uppercase tracking-widest">System Online</p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-xs text-gray-400 font-medium">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-800 rounded-full border border-gray-700">
            <ShieldCheck size={14} className="text-green-500" /> DB Persistent
          </div>
        </div>
      </div>

      {/* 消息区域 */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-2 scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent"
      >
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-6 animate-in fade-in zoom-in duration-700">
            <div className="p-6 bg-gray-900 rounded-3xl border border-gray-800 shadow-2xl">
              <Terminal size={48} className="text-blue-500 mb-4 mx-auto opacity-50" />
              <p className="text-xl font-bold text-gray-200">准备好编写代码了吗？</p>
              <p className="text-sm text-gray-500 max-w-xs mt-3 leading-relaxed">
                我是您的结对编程伙伴，基于数据库和 LangGraph 实现持久化对话。
              </p>
            </div>
          </div>
        )}
        
        {messages.map((m, i) => (
          <MessageBubble key={i} {...m} />
        ))}
        
        {loading && (
          <div className="flex justify-start animate-in fade-in slide-in-from-left-2 duration-300">
            <div className="flex items-center gap-2 text-blue-500 text-xs font-bold tracking-widest uppercase bg-blue-500/5 px-4 py-3 rounded-full border border-blue-500/20">
              <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-ping"></span>
              Thinking...
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
