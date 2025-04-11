import React, { useState, useEffect, useCallback } from 'react';
import ChatInterface from './ChatInterface';

export default function ChatContainer() {
  const [currentNode, setCurrentNode] = useState(null);
  
  // Example decision tree structure
  const decisionTree = {
    initial: {
      question: "hey how you doing?",
      options: ["im fine", "im not"],
      next: {
        "im fine": "purpose",
        "im not": "end"
      }
    },
    purpose: {
      question: "Good to hear that, why do you want to use this app?",
      options: ["i want to gain weight", "i want to lose weight"],
      next: {
        "i want to gain weight": "gain_weight",
        "i want to lose weight": "lose_weight"
      }
    },
    // Add more nodes as needed
  };

  // Initialize chat
  const handleStartChat = useCallback(() => {
    setCurrentNode('initial');
    updateChatInterface('initial');
  }, [updateChatInterface]);

  useEffect(() => {
    handleStartChat();
  }, [handleStartChat]);

  const updateChatInterface = (nodeId) => {
    const node = decisionTree[nodeId];
    if (node) {
      // Update chat interface with new question and options
      setChatMessages(prev => [...prev, {
        type: 'bot',
        content: node.question
      }]);
      setCurrentOptions(node.options);
    }
  };

  const handleAnswerSelected = (answer) => {
    const node = decisionTree[currentNode];
    if (node && node.next[answer]) {
      const nextNodeId = node.next[answer];
      setCurrentNode(nextNodeId);
      updateChatInterface(nextNodeId);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <ChatInterface
        onAnswerSelected={handleAnswerSelected}
      />
    </div>
  );
} 