'use client';
import { useEffect, useState, useRef } from 'react';
import { AuthHeader } from '../../../components/auth-header'; // Make sure this path is correct
import { UserCircle } from 'lucide-react';
import { useAuthStore } from '../../../store/useAuthStore';

interface Option {
  id: string;
  label: string;
  nextId: string | null;
  next?: Question | null;
}

interface Question {
  id: string;
  text: string;
  options: Option[];
}

interface Message {
  type: 'bot' | 'user';
  content: string;
}

export default function ChatScreen() {
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const { token } = useAuthStore();

  // Auto-scroll to bottom when new messages appear
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    fetchRootQuestion();
  }, [fetchRootQuestion]);

  const fetchRootQuestion = async () => {
    try {
      const response = await fetch('/api/admin/questions/tree', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data && data.length > 0) {
        setCurrentQuestion(data[0]);
        setMessages([{
          type: 'bot',
          content: data[0].text
        }]);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching root question:', error);
      setLoading(false);
    }
  };

  const handleOptionClick = async (option: Option) => {
    if (!currentQuestion) return;

    setMessages(prev => [...prev, {
      type: 'user',
      content: option.label // Make sure we're using option.text here
    }]);

    setLoading(true);
    
    try {
      if (option.nextId) {
        const response = await fetch(`/api/admin/questions/${option.nextId}/children`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const children = await response.json();
        
        const nextQuestion = children.find((q: Question) => q.id === option.nextId);
        
        if (nextQuestion) {
          setCurrentQuestion(nextQuestion);
          setMessages(prev => [...prev, {
            type: 'bot',
            content: nextQuestion.text
          }]);
        } else if (option.next) {
          setCurrentQuestion(option.next);
          setMessages(prev => [...prev, {
            type: 'bot',
            content: option.next.text
          }]);
        } else {
          setCurrentQuestion(null);
          setMessages(prev => [...prev, {
            type: 'bot',
            content: "Thank you for your responses! How can I help you further?"
          }]);
        }
      } else if (option.next) {
        setCurrentQuestion(option.next);
        setMessages(prev => [...prev, {
          type: 'bot',
          content: option.next.text
        }]);
      } else {
        setCurrentQuestion(null);
        setMessages(prev => [...prev, {
          type: 'bot',
          content: "Thank you for your responses! How can I help you further?"
        }]);
      }
    } catch (error) {
      console.error('Error fetching next question:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <AuthHeader />
      <div className="flex justify-center items-start pt-20 px-4">
        <div className="flex flex-col h-[calc(100vh-120px)] w-full max-w-[800px] bg-zinc-900/95 rounded-xl shadow-xl backdrop-blur-sm">
          {/* Chat Header */}
          <div className="p-4 border-b border-zinc-800 flex items-center gap-3">
            <div className="bg-emerald-600 p-2 rounded-lg">
              <UserCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-zinc-100">Nutrition Assistant</h2>
              <p className="text-xs text-zinc-400">AI-powered nutrition guidance</p>
            </div>
          </div>

          {/* Chat Messages */}
          <div 
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent"
          >
            {messages.map((message, index) => (
              <div 
                key={index}
                className={`flex items-end gap-2 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.type === 'bot' && (
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center">
                    <UserCircle className="w-5 h-5 text-white" />
                  </div>
                )}
                <div 
                  className={`relative max-w-[80%] p-3 rounded-2xl ${
                    message.type === 'user' 
                      ? 'bg-emerald-600 text-zinc-100 rounded-tr-none' 
                      : 'bg-zinc-800 text-zinc-100 rounded-tl-none'
                  } shadow-sm`}
                >
                  <p className="text-sm">{message.content}</p>
                </div>
                {message.type === 'user' && (
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center">
                    <UserCircle className="w-5 h-5 text-zinc-300" />
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex items-end gap-2">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center">
                  <UserCircle className="w-5 h-5 text-white" />
                </div>
                <div className="bg-zinc-800 text-zinc-300 p-3 rounded-2xl rounded-tl-none">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce delay-100"></span>
                    <span className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce delay-200"></span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Options/Answers */}
          {!loading && currentQuestion && currentQuestion.options && (
            <div className="p-4 border-t border-zinc-800 space-y-3">
              <div className="flex flex-col gap-2">
                {currentQuestion.options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleOptionClick(option)}
                    className="w-full p-3 text-left text-sm text-zinc-100 bg-zinc-800 rounded-xl
                             hover:bg-zinc-700 transition-all focus:outline-none 
                             focus:ring-2 focus:ring-emerald-500 shadow-sm hover:shadow-md"
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Disabled Input Section */}
          <div className="p-4 border-t border-zinc-800">
            <div className="flex items-center gap-3 bg-zinc-800/50 rounded-xl p-3">
              <input 
                type="text" 
                disabled 
                placeholder="You can't type in this chat - please select an option above" 
                className="w-full bg-transparent text-zinc-400 text-sm placeholder:text-zinc-600 focus:outline-none cursor-not-allowed"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
