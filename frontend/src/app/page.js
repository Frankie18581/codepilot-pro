"use client";
import { useState } from "react";
import { useStreamChat } from "../hooks/useStreamChat";
import { ChatWindow } from "../components/ChatWindow";
import { InputArea } from "../components/InputArea";

export default function Home() {
  const [input, setInput] = useState("");
  const { messages, loading, sendMessage, conversationId } = useStreamChat();

  const handleSend = () => {
    if (!input.trim() || loading) return;
    sendMessage(input);
    setInput("");
  };

  return (
    <div className="flex flex-col h-screen bg-black text-gray-100 font-sans selection:bg-blue-500/30 selection:text-blue-200 antialiased overflow-hidden">
      <div className="flex flex-1 h-full">
        {/* 主界面 */}
        <div className="flex-1 flex flex-col min-w-0">
          <ChatWindow messages={messages} loading={loading} />
          <InputArea 
            input={input} 
            setInput={setInput} 
            onSend={handleSend} 
            loading={loading} 
          />
        </div>
      </div>
    </div>
  );
}
