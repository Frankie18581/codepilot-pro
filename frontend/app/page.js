"use client";
import { useState } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { role: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      // 指向我们的 FastAPI 后端
      // 注意：如果在 Docker 内部运行，可能需要调整 URL，本地调试先用 localhost
      const res = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      if (!res.ok) throw new Error("Backend error");
      
      const data = await res.json();
      const aiMsg = { role: "ai", text: data.reply };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (error) {
      setMessages((prev) => [...prev, { role: "system", text: "错误：无法连接后端 (请检查后端是否启动)" }]);
      console.error(error);
    } finally {
      setLoading(false);
      setInput("");
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white font-mono">
      {/* 头部 */}
      <header className="p-4 border-b border-gray-700 bg-gray-800 shadow-md">
        <h1 className="text-xl font-bold tracking-wider">🚀 CodePilot Pro <span className="text-xs text-green-400 ml-2">(Lean Production)</span></h1>
      </header>

      {/* 消息区域 */}
      <main className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 mt-20">
            <p className="text-lg">准备好编写代码了吗？</p>
            <p className="text-sm mt-2">试试输入："帮我写个爬虫"</p>
          </div>
        )}
        
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-4 rounded-lg shadow-sm text-sm leading-relaxed ${
              m.role === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 
              m.role === 'system' ? 'bg-red-900/50 text-red-200 border border-red-800' : 'bg-gray-700 text-gray-100 rounded-bl-none'
            }`}>
              <p className="whitespace-pre-wrap">{m.text}</p>
            </div>
          </div>
        ))}
        
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-700 p-4 rounded-lg rounded-bl-none animate-pulse text-gray-400 text-sm">
              CodePilot 正在思考...
            </div>
          </div>
        )}
      </main>

      {/* 输入区域 */}
      <footer className="p-4 border-t border-gray-700 bg-gray-800">
        <div className="flex gap-3 max-w-4xl mx-auto">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="输入自然语言需求 (例如：写一个 Python 爬虫)..."
            className="flex-1 bg-gray-900 border border-gray-600 rounded-md px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors text-white placeholder-gray-500"
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-3 rounded-md font-bold transition-colors shadow-lg"
          >
            发送
          </button>
        </div>
        <div className="text-center text-xs text-gray-500 mt-2">
          Powered by FastAPI + Next.js + LLM
        </div>
      </footer>
    </div>
  );
}