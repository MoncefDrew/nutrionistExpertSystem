
"use client"


import { PaperclipIcon, Plus, SendHorizonal, SmileIcon } from "lucide-react";
import { ChatMessage } from "./ChatMessage";
import { useEffect, useRef, useState } from "react";
import { generateReply } from "./InferenceEngine";

export function Chat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<
    { message: string; isUser?: boolean }[]
  >([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { message: input, isUser: true }];
    setMessages(newMessages);
    setInput("");
    
    // Focus back on input after sending
    if (inputRef.current) {
      inputRef.current.focus();
    }

    // Show typing indicator
    setIsTyping(true);
    
    try {
      const reply = await generateReply(input);
      setIsTyping(false);
      setMessages([...newMessages, { message: reply }]);
    } catch (error) {
      setIsTyping(false);
      setMessages([
        ...newMessages,
        { message: "Sorry, I couldn't process your request. Please try again." }
      ]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    
    // Auto-resize textarea
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 120)}px`;
    }
  };

  return (
    <div className="w-full h-full flex flex-col">
      {/* Chat Header */}
      <div className="p-4 border-b border-zinc-700 flex items-center bg-zinc-800/80 backdrop-blur-sm">
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center">
            <span className="text-white font-bold">NA</span>
          </div>
          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-zinc-800"></div>
        </div>
        <div className="ml-3">
          <h3 className="text-white font-medium">Nutrition Assistant</h3>
          <p className="text-xs text-zinc-400">Online • Powered by AI</p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-zinc-900/80">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center mb-4">
              <span className="text-2xl text-white font-bold">NA</span>
            </div>
            <h3 className="text-xl font-medium text-white mb-2">
              How can I help with your nutrition today?
            </h3>
            <p className="max-w-md text-zinc-400">
              Ask me about meal plans, nutritional advice, or dietary recommendations
            </p>
            <div className="grid grid-cols-2 gap-3 mt-6 w-full max-w-md">
              <button className="p-3 bg-zinc-800/50 hover:bg-zinc-800 text-left rounded-lg border border-zinc-700 transition-colors">
                <p className="text-white text-sm font-medium mb-1">Generate meal plan</p>
                <p className="text-zinc-400 text-xs">For your specific dietary needs</p>
              </button>
              <button className="p-3 bg-zinc-800/50 hover:bg-zinc-800 text-left rounded-lg border border-zinc-700 transition-colors">
                <p className="text-white text-sm font-medium mb-1">Calculate macros</p>
                <p className="text-zinc-400 text-xs">Based on your fitness goals</p>
              </button>
              <button className="p-3 bg-zinc-800/50 hover:bg-zinc-800 text-left rounded-lg border border-zinc-700 transition-colors">
                <p className="text-white text-sm font-medium mb-1">Recipe ideas</p>
                <p className="text-zinc-400 text-xs">Quick and healthy options</p>
              </button>
              <button className="p-3 bg-zinc-800/50 hover:bg-zinc-800 text-left rounded-lg border border-zinc-700 transition-colors">
                <p className="text-white text-sm font-medium mb-1">Nutritional analysis</p>
                <p className="text-zinc-400 text-xs">Review your current diet</p>
              </button>
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg, i) => (
              <ChatMessage key={i} message={msg.message} isUser={msg.isUser} />
            ))}
            {isTyping && <TypingIndicator />}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-zinc-700 bg-zinc-800/80 backdrop-blur-sm">
        <div className="relative flex flex-col">
          <div className="flex items-center gap-2 mb-2">
            <button className="p-2 rounded-full bg-zinc-700/50 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors">
              <Plus className="h-4 w-4" />
            </button>
            <button className="p-2 rounded-full bg-zinc-700/50 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors">
              <PaperclipIcon className="h-4 w-4" />
            </button>
            <div className="relative flex-1">
              <textarea
                ref={inputRef}
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                rows={1}
                className="w-full py-3 px-4 pr-12 bg-zinc-700/50 text-white placeholder-zinc-500 border border-zinc-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors rounded-lg resize-none"
              />
              <button 
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full text-zinc-400 hover:text-white transition-colors"
              >
                <SmileIcon className="h-5 w-5" />
              </button>
            </div>
            <button
              onClick={sendMessage}
              disabled={!input.trim()}
              className="p-3 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <SendHorizonal className="h-5 w-5" />
            </button>
          </div>
          <p className="text-xs text-zinc-500 text-center">
            Nutrition Assistant may produce inaccurate information. Always consult healthcare professionals.
          </p>
        </div>
      </div>
    </div>
  );
}




function TypingIndicator  () {
  return (
    <div className="flex gap-3 justify-start">
      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex-shrink-0 flex items-center justify-center">
        <span className="text-white text-sm font-bold">NA</span>
      </div>
      <div className="bg-zinc-800/50 text-white rounded-lg rounded-bl-none border border-zinc-700 p-4 max-w-[80%]">
        <div className="flex space-x-1">
          <div className="w-2 h-2 rounded-full bg-zinc-400 animate-bounce" style={{animationDelay: '0ms'}}></div>
          <div className="w-2 h-2 rounded-full bg-zinc-400 animate-bounce" style={{animationDelay: '150ms'}}></div>
          <div className="w-2 h-2 rounded-full bg-zinc-400 animate-bounce" style={{animationDelay: '300ms'}}></div>
        </div>
      </div>
    </div>
  );
}
