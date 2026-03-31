import { useState, useCallback, useRef } from "react";

export function useStreamChat() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  
  // 使用 ref 存储正在流式传输的内容，减少触发渲染的频率
  const streamingContentRef = useRef("");

  const sendMessage = useCallback(async (input) => {
    if (!input.trim() || loading) return;

    const userMsg = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);
    streamingContentRef.current = "";

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: input, 
          conversation_id: conversationId 
        }),
      });

      if (!response.ok) throw new Error("Failed to send message");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      
      // 先添加一个空的 AI 消息占位
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const dataStr = line.slice(6).trim();
            if (dataStr === "[DONE]") continue;
            
            try {
              const data = JSON.parse(dataStr);
              if (data.error) throw new Error(data.error);
              
              if (data.conversation_id && !conversationId) {
                setConversationId(data.conversation_id);
              }

              if (data.content) {
                streamingContentRef.current += data.content;
                // 仅在有内容时更新状态，并限制更新频率（可选）
                setMessages((prev) => {
                  const last = prev[prev.length - 1];
                  if (last && last.role === "assistant") {
                    return [...prev.slice(0, -1), { ...last, content: streamingContentRef.current }];
                  }
                  return prev;
                });
              }
            } catch (e) {
              console.error("Error parsing JSON chunk", e);
            }
          }
        }
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [...prev, { role: "system", content: `错误: ${error.message}` }]);
    } finally {
      setLoading(false);
    }
  }, [conversationId, loading]);

  return { messages, loading, sendMessage, conversationId };
}
