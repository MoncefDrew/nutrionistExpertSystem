import React, { useState, useRef, useEffect } from 'react';

const ChatInterface = ({ onAnswerSelected }) => {
  const [messages, setMessages] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [options, setOptions] = useState([]);
  const chatContainerRef = useRef(null);

  // Auto-scroll to bottom when new messages appear
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Handle option selection
  const handleOptionClick = (answer) => {
    // Add user's answer to chat
    setMessages(prev => [...prev, {
      type: 'user',
      content: answer
    }]);

    // Notify parent component about the selection
    onAnswerSelected(answer);
  };

  return (
    <div className="flex flex-col h-[600px] w-[400px] bg-gray-900 rounded-lg">
      {/* Chat Messages */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4"
      >
        {messages.map((message, index) => (
          <div 
            key={index}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[80%] p-3 rounded-lg ${
                message.type === 'user' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-700 text-white'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
      </div>

      {/* Options/Answers */}
      {options.length > 0 && (
        <div className="p-4 border-t border-gray-700">
          <div className="flex flex-col gap-2">
            {options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleOptionClick(option)}
                className="w-full p-3 text-left text-white bg-gray-700 rounded-lg 
                         hover:bg-gray-600 transition-colors"
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatInterface; 