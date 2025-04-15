"use client";

import { PaperclipIcon, Plus, SendHorizonal, SmileIcon, Star, X } from "lucide-react";
import { ChatMessage } from "./ChatMessage";
import { useEffect, useRef, useState } from "react";
import { generateReply } from "./InferenceEngine";
import axios from "axios";
import { useAuthStore } from "../store/useAuthStore";

export function Chat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<
    { message: string; isUser?: boolean }[]
  >([]);
  const [isTyping, setIsTyping] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [rating, setRating] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { user } = useAuthStore();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Show feedback section after 60 seconds
  useEffect(() => {
    if (messages.length > 0) {
      const timer = setTimeout(() => {
        setShowFeedback(true);
      }, 15000);
      
      return () => clearTimeout(timer);
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { message: input, isUser: true }];
    setMessages(newMessages);
    setInput("");

    if (inputRef.current) {
      inputRef.current.focus();
    }

    setIsTyping(true);

    try {
      const reply = await generateReply(input);
      setIsTyping(false);
      setMessages([...newMessages, { message: reply }]);
    } catch (error) {
      setIsTyping(false);
      setMessages([
        ...newMessages,
        {
          message: "Sorry, I couldn't process your request. Please try again.",
        },
      ]);
    }
  };

  const handleSubmitFeedback = async () => {
    if (!feedbackMessage.trim() || rating === 0) return;
    
    try {
      await axios.post("/api/client/feedback/create", {
        message: feedbackMessage,
        rating,
        userId: user.id,
        username: user.username
      });
      
      // Hide feedback after submission
      setShowFeedback(false);
      setFeedbackMessage("");
      setRating(0);
    } catch (err) {
      console.error("Feedback submission error:", err);
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

    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = `${Math.min(
        inputRef.current.scrollHeight,
        120
      )}px`;
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-zinc-900">
      {/* Chat Header */}
      <div className="p-4 border-b border-zinc-700 flex items-center justify-between bg-zinc-800 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-violet-600 to-blue-500 flex items-center justify-center shadow-lg">
              <span className="text-white font-bold">NA</span>
            </div>
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-zinc-800 animate-pulse"></div>
          </div>
          <div className="ml-3">
            <h3 className="text-white font-medium">Nutrition Assistant</h3>
            <p className="text-xs text-zinc-400">Online • Powered by AI</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-full hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 12H6" />
            </svg>
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-zinc-900 to-zinc-950">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center mb-5 shadow-lg shadow-indigo-500/20">
              <span className="text-2xl text-white font-bold">NA</span>
            </div>
            <h3 className="text-xl font-medium text-white mb-3">
              How can I help with your nutrition today?
            </h3>
            <p className="max-w-md text-zinc-400 mb-6">
              Ask me about meal plans, nutritional advice, or dietary recommendations
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2 w-full max-w-md">
              <button className="p-4 bg-zinc-800/50 hover:bg-zinc-800 text-left rounded-xl border border-zinc-700 transition-all hover:scale-105 hover:shadow-lg hover:shadow-purple-500/10 group">
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center mr-2 group-hover:bg-indigo-500/40 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <p className="text-white text-sm font-medium">Generate meal plan</p>
                </div>
                <p className="text-zinc-400 text-xs pl-10">For your specific dietary needs</p>
              </button>
              <button className="p-4 bg-zinc-800/50 hover:bg-zinc-800 text-left rounded-xl border border-zinc-700 transition-all hover:scale-105 hover:shadow-lg hover:shadow-blue-500/10 group">
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center mr-2 group-hover:bg-blue-500/40 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                    </svg>
                  </div>
                  <p className="text-white text-sm font-medium">Calculate macros</p>
                </div>
                <p className="text-zinc-400 text-xs pl-10">Based on your fitness goals</p>
              </button>
              <button className="p-4 bg-zinc-800/50 hover:bg-zinc-800 text-left rounded-xl border border-zinc-700 transition-all hover:scale-105 hover:shadow-lg hover:shadow-green-500/10 group">
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center mr-2 group-hover:bg-green-500/40 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <p className="text-white text-sm font-medium">Recipe ideas</p>
                </div>
                <p className="text-zinc-400 text-xs pl-10">Quick and healthy options</p>
              </button>
              <button className="p-4 bg-zinc-800/50 hover:bg-zinc-800 text-left rounded-xl border border-zinc-700 transition-all hover:scale-105 hover:shadow-lg hover:shadow-purple-500/10 group">
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center mr-2 group-hover:bg-purple-500/40 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-white text-sm font-medium">Nutritional analysis</p>
                </div>
                <p className="text-zinc-400 text-xs pl-10">Review your current diet</p>
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

      {/* Feedback Section - conditionally rendered */}
      {showFeedback && (
        <div className="px-4 py-3 border-t border-zinc-700 bg-zinc-800/90 backdrop-blur-sm transition-all duration-300 ease-in-out">
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-sm text-white font-medium">How helpful was this conversation?</h4>
            <button 
              onClick={() => setShowFeedback(false)}
              className="text-zinc-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <div className="flex items-center gap-1 mb-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className={`text-yellow-400 hover:scale-110 transition-transform ${
                  rating >= star ? "opacity-100" : "opacity-40"
                }`}
              >
                <Star className="w-5 h-5 fill-current" />
              </button>
            ))}
          </div>
          
          <textarea
            value={feedbackMessage}
            onChange={(e) => setFeedbackMessage(e.target.value)}
            placeholder="Share your thoughts on this conversation..."
            className="w-full p-3 rounded-lg bg-zinc-700/50 text-white placeholder-zinc-400 text-sm border border-zinc-600 mb-3 resize-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
            rows={2}
          />
          
          <button
            onClick={handleSubmitFeedback}
            disabled={!feedbackMessage.trim() || rating === 0}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Submit Feedback
          </button>
        </div>
      )}

      {/* Input Area */}
      <div className="p-4 border-t border-zinc-700 bg-zinc-800/90 backdrop-blur-sm sticky bottom-0 z-10">
        <div className="relative flex flex-col">
          <div className="flex items-center gap-2 mb-2">
            <button className="p-2 rounded-full bg-zinc-700/70 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-all hover:shadow-md">
              <Plus className="h-4 w-4" />
            </button>
            <button className="p-2 rounded-full bg-zinc-700/70 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-all hover:shadow-md">
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
                className="w-full py-3 px-4 pr-12 bg-zinc-700/70 text-white placeholder-zinc-500 border border-zinc-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors rounded-xl resize-none shadow-inner"
              />
              <button className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1.5 rounded-full text-zinc-400 hover:text-white transition-colors">
                <SmileIcon className="h-5 w-5" />
              </button>
            </div>
            <button
              onClick={sendMessage}
              disabled={!input.trim()}
              className="p-3 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-700/20 hover:shadow-blue-700/40"
            >
              <SendHorizonal className="h-5 w-5" />
            </button>
          </div>
          <p className="text-xs text-zinc-500 text-center">
            Nutrition Assistant may produce inaccurate information. Always
            consult healthcare professionals.
          </p>
        </div>
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex gap-3 justify-start">
      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-violet-600 to-blue-500 flex-shrink-0 flex items-center justify-center shadow-md">
        <span className="text-white text-sm font-bold">NA</span>
      </div>
      <div className="bg-zinc-800/70 text-white rounded-xl rounded-bl-none border border-zinc-700 p-3 max-w-[80%] shadow-md">
        <div className="flex space-x-1.5">
          <div
            className="w-2 h-2 rounded-full bg-blue-400 animate-bounce"
            style={{ animationDelay: "0ms" }}
          ></div>
          <div
            className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce"
            style={{ animationDelay: "150ms" }}
          ></div>
          <div
            className="w-2 h-2 rounded-full bg-violet-400 animate-bounce"
            style={{ animationDelay: "300ms" }}
          ></div>
        </div>
      </div>
    </div>
  );
}