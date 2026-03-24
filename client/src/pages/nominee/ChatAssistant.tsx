import { useState } from "react";
import { PageTransition, PressableButton } from "@/components/PageTransition";
import { chatMessages, suggestedQuestions } from "@/lib/mockData";
import { ArrowLeft, Send, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  id: string;
  role: "ai" | "user";
  text: string;
}

const ChatAssistant = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>(chatMessages);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { id: Date.now().toString(), role: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setTyping(true);

    setTimeout(() => {
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        text: "That's a great question. Based on the documents in the vault, I'd recommend starting with the bank account notifications as they are most time-sensitive. I can walk you through the exact steps for each institution.",
      };
      setMessages((prev) => [...prev, aiMsg]);
      setTyping(false);
    }, 1500);
  };

  return (
    <PageTransition>
      <div className="flex flex-col h-screen app-container">
        <div className="p-4 border-b border-border flex items-center gap-3">
          <button onClick={() => navigate(-1)}><ArrowLeft size={20} className="text-muted-foreground" /></button>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-foreground">GriefOS Assistant</span>
              <span className="w-2 h-2 rounded-full bg-secondary" />
            </div>
            <p className="text-xs text-muted-foreground">Ask me anything about managing the estate.</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div className={`max-w-[85%] md:max-w-[60%] flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                {msg.role === "ai" && (
                  <div className="w-7 h-7 rounded-full bg-secondary/20 flex items-center justify-center shrink-0 mt-1">
                    <Shield size={14} className="text-secondary" />
                  </div>
                )}
                <div className={`rounded-xl px-4 py-3 text-sm ${msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-card text-foreground border border-border"}`}>
                  {msg.text}
                </div>
              </div>
            </motion.div>
          ))}

          {typing && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-secondary/20 flex items-center justify-center">
                <Shield size={14} className="text-secondary" />
              </div>
              <div className="bg-card border border-border rounded-xl px-4 py-3 flex gap-1">
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className="w-2 h-2 rounded-full bg-muted-foreground"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {messages.length === 1 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {suggestedQuestions.map((q) => (
                <PressableButton
                  key={q}
                  onClick={() => sendMessage(q)}
                  className="px-3 py-2 rounded-full text-xs bg-muted text-muted-foreground border border-border"
                >
                  {q}
                </PressableButton>
              ))}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-border flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
            placeholder="Type your question..."
            className="flex-1 bg-input border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground"
          />
          <PressableButton
            onClick={() => sendMessage(input)}
            className="w-12 h-12 bg-secondary text-secondary-foreground rounded-lg flex items-center justify-center"
          >
            <Send size={18} />
          </PressableButton>
        </div>
      </div>
    </PageTransition>
  );
};

export default ChatAssistant;
