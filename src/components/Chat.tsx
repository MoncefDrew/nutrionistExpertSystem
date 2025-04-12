import { useState, useRef, useEffect } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { ChatMessage } from "./ChatMessage";
import { useExpertSession } from "../store/useExpertSession";
import { SendHorizonal, Mic } from "lucide-react";
import { generateReply } from "./InferenceEngine";

export function Chat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<
    { message: string; isUser?: boolean }[]
  >([]);
  const { healthDetails } = useExpertSession();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { message: input, isUser: true }];
    setMessages(newMessages);
    setInput("");

    setTimeout(() => {
      const reply = generateReply(input, healthDetails);
      setMessages([...newMessages, { message: reply }]);
    }, 500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };


  return (
    <div className="w-full h-full flex flex-col bg-[#0f0f0f]">
      {/* Chat Header */}
      <div className="p-4 border-b border-[#222] flex items-center bg-[#0f0f0f]">
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-[#333] flex items-center justify-center">
            <span className="text-white font-bold">AI</span>
          </div>
          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-[#0f0f0f]"></div>
        </div>
        <div className="ml-3">
          <h3 className="text-white font-medium">Nutrition Assistant</h3>
          <p className="text-xs text-[#777]">Online</p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#0f0f0f]">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-[#777]">
            <div className="w-16 h-16 rounded-full bg-[#222] flex items-center justify-center mb-4">
              <span className="text-2xl text-[#555]">AI</span>
            </div>
            <h3 className="text-xl font-medium text-white mb-2">
              How can I help you today?
            </h3>
            <p className="max-w-md">
              Ask me about diet plans, nutrition advice, or health conditions.
            </p>
          </div>
        ) : (
          messages.map((msg, i) => (
            <ChatMessage key={i} message={msg.message} isUser={msg.isUser} />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-[#222] bg-[#0f0f0f]">
        <div className="relative flex gap-2">
          {/* @ts-ignore */}
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="flex-1 pr-10 bg-[#222] text-white placeholder-[#555] border-[#333] focus:border-[#555]"
          />
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-[#777] hover:text-white"
            >
              <Mic className="h-4 w-4" />
            </Button>
            {/* @ts-ignore */}
            <Button
              onClick={sendMessage}
              size="icon"
              className="h-8 w-8 bg-[#333] hover:bg-[#444]"
              disabled={!input.trim()}
            >
              <SendHorizonal className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <p className="text-xs text-[#555] mt-2 text-center">
          Nutrition Assistant may produce inaccurate information.
        </p>
      </div>
    </div>
  );
}

