import { useState, useCallback } from "react";

export function useStreamChat() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = useCallback(async (input, history = []) => {
    if (!input.trim()) return;

    const userMsg = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input, history }),
      });

      if (!response.ok) throw new Error("Failed to send message");

      const contentType = response.headers.get("content-type");
      
      if (contentType && contentType.includes("text/event-stream")) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let aiContent = "";
        
        // 先添加一个空的 AI 消息占位
        setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const dataStr = line.slice(6);
              if (dataStr === "[DONE]") break;
              
              try {
                const data = JSON.parse(dataStr);
                aiContent += data.content;
                setMessages((prev) => {
                  const last = prev[prev.length - 1];
                  return [...prev.slice(0, -1), { ...last, content: aiContent }];
                });
              } catch (e) {
                console.error("Error parsing JSON chunk", e);
              }
            }
          }
        }
      } else {
        // 处理非流式响应 (如 HIC 追问)
        const data = await response.json();
        setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [...prev, { role: "system", content: "发生错误，请检查网络或后端状态。" }]);
    } finally {
      setLoading(false);
    }
  }, []);

  return { messages, setMessages, loading, sendMessage };
}
