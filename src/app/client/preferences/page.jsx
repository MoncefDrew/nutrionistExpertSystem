"use client";

import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useAuthStore } from '../../../store/useAuthStore';

const PreferencesPage = () => {
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const { token } = useAuthStore();

  // Fetch the first question (root of the decision tree)
  const { data: initialQuestion, isLoading } = useQuery({
    queryKey: ['question', 'root'],
    queryFn: async () => {
      const response = await axios.get('/api/questions/root', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    }
  });

  // Set initial question when data is loaded
  useEffect(() => {
    if (initialQuestion) {
      setCurrentQuestion(initialQuestion);
    }
  }, [initialQuestion]);

  // Handle answer selection and get next question
  const answerMutation = useMutation({
    mutationFn: async ({ questionId, optionId }) => {
      const response = await axios.post('/api/questions/next', {
        questionId,
        optionId
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    },
    onSuccess: (data) => {
      // Add the answer to history
      setAnswers(prev => [...prev, {
        question: currentQuestion.text,
        answer: currentQuestion.options.find(opt => opt.id === data.selectedOptionId).label
      }]);

      if (data.nextQuestion) {
        setCurrentQuestion(data.nextQuestion);
      } else {
        // No more questions, show results
        toast.success("Assessment completed!");
        router.push('/client/results');
      }
    },
    onError: (error) => {
      toast.error("Failed to process your answer. Please try again.");
    }
  });

  const handleOptionSelect = (optionId) => {
    answerMutation.mutate({
      questionId: currentQuestion.id,
      optionId
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#171717] flex items-center justify-center">
        <div className="text-white">Loading questions...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#171717] py-12">
      <div className="max-w-3xl mx-auto px-4">
        {/* Progress Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-normal text-white mb-2">Nutrition Assessment</h1>
          <p className="text-[#B4B4B4]">Answer questions to get your personalized nutrition plan</p>
        </div>

        {/* Previous Answers */}
        {answers.length > 0 && (
          <div className="mb-8 bg-[#1C1C1C] p-6 rounded-lg border border-[#2D2D2D]">
            <h2 className="text-xl text-white mb-4">Your Answers</h2>
            <div className="space-y-2">
              {answers.map((answer, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <span className="text-emerald-500">✓</span>
                  <div>
                    <p className="text-[#B4B4B4]">{answer.question}</p>
                    <p className="text-white">{answer.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Current Question */}
        {currentQuestion && (
          <div className="bg-[#1C1C1C] p-6 rounded-lg border border-[#2D2D2D]">
            <h2 className="text-xl text-white mb-6">{currentQuestion.text}</h2>
            <div className="space-y-3">
              {currentQuestion.options.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleOptionSelect(option.id)}
                  disabled={answerMutation.isPending}
                  className="w-full bg-[#242424] hover:bg-[#2D2D2D] text-white p-4 rounded-lg text-left transition duration-200 disabled:opacity-50"
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="mt-6 flex justify-between">
          <button
            onClick={() => router.push('/')}
            className="text-[#B4B4B4] hover:text-white transition"
          >
            Cancel Assessment
          </button>
          {answers.length > 0 && (
            <button
              onClick={() => {
                setAnswers(prev => prev.slice(0, -1));
                // You'll need to implement logic to go back to the previous question
              }}
              className="text-emerald-500 hover:text-emerald-400 transition"
            >
              ← Previous Question
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PreferencesPage;
