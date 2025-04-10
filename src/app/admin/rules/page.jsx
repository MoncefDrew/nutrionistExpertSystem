"use client";

import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import axios from "axios";
import { PlusCircle, Trash2, ChevronRight, ChevronDown } from "lucide-react";
import DecisionTreeFlow from "../../../components/DecisionTreeFlow";
import { Handle } from 'reactflow';

// TreeNode Component
const TreeNode = ({ node, level = 0, onSelect }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="ml-4">
      <div 
        className={`flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-[#2D2D2D] ${
          level === 0 ? 'ml-0' : 'ml-4'
        }`}
        onClick={() => {
          setIsExpanded(!isExpanded);
          onSelect(node);
        }}
      >
        {node.options?.length > 0 && (
          <button className="text-emerald-500">
            {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
        )}
        <div className="flex-1">
          <div className="text-white">{node.text}</div>
          {node.isFinal && (
            <span className="text-xs bg-emerald-600 text-white px-2 py-0.5 rounded-full ml-2">
              Final
            </span>
          )}
        </div>
      </div>

      {isExpanded && node.options?.length > 0 && (
        <div className="border-l border-[#2D2D2D] ml-2">
          {node.options.map((option) => (
            <div key={option.id} className="ml-4 mt-2">
              <div className="flex items-center gap-2">
                <div className="w-4 h-px bg-[#2D2D2D]"></div>
                <div className="bg-[#242424] p-2 rounded text-[#B4B4B4] flex-1">
                  {option.label}
                </div>
              </div>
              {option.next && (
                <TreeNode 
                  node={option.next} 
                  level={level + 1}
                  onSelect={onSelect}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Custom Node Components
const QuestionNode = ({ data }) => (
  <div className="bg-[#1C1C1C] border border-[#2D2D2D] rounded-lg p-4 min-w-[200px]">
    <div className="text-white text-sm">{data.text}</div>
    {data.isFinal && (
      <span className="text-xs bg-emerald-600 text-white px-2 py-0.5 rounded-full mt-2 inline-block">
        Final
      </span>
    )}
    <Handle type="target" position={Position.Top} className="!bg-[#2D2D2D]" />
    <Handle type="source" position={Position.Bottom} className="!bg-[#2D2D2D]" />
  </div>
);

const OptionNode = ({ data }) => (
  <div className="bg-[#242424] border border-[#2D2D2D] rounded p-2 min-w-[150px]">
    <div className="text-[#B4B4B4] text-sm">{data.label}</div>
    <Handle type="target" position={Position.Top} className="!bg-[#2D2D2D]" />
    <Handle type="source" position={Position.Bottom} className="!bg-[#2D2D2D]" />
  </div>
);



const RulesPage = () => {
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [newQuestion, setNewQuestion] = useState({
    text: "",
    isFinal: false,
    parentOptionId: null,
    options: []
  });
  const [currentOption, setCurrentOption] = useState({
    label: "",
    nextId: null
  });

  // Add state for linking questions
  const [availableQuestions, setAvailableQuestions] = useState([]);

  // Fetch questions with full tree structure
  const { data: questionsTree, refetch: refetchTree } = useQuery({
    queryKey: ['questionsTree'],
    queryFn: async () => {
      const response = await axios.get('/api/admin/questions/tree');
      return response.data;
    }
  });

  // Fetch all questions with their options for linking
  const { data: allQuestionsWithOptions } = useQuery({
    queryKey: ['allQuestionsWithOptions'],
    queryFn: async () => {
      const response = await axios.get('/api/admin/questions');
      return response.data;
    }
  });

  // Flatten options from all questions for easier selection
  const allOptions = allQuestionsWithOptions?.flatMap(question => 
    question.options.map(option => ({
      ...option,
      questionText: question.text
    }))
  ) || [];

  useEffect(() => {
    if (allQuestionsWithOptions) {
      setAvailableQuestions(allQuestionsWithOptions);
    }
  }, [allQuestionsWithOptions]);

  // Add new question with options
  const addQuestionMutation = useMutation({
    mutationFn: async (data) => {
      const response = await axios.post('/api/expert-node', {
        text: data.text,
        parentOptionId: data.parentOptionId,
        isFinal: data.isFinal,
        options: data.options
      });
      return response.data;
    },
    onSuccess: () => {
      toast.success("Question and options added successfully");
      setNewQuestion({ text: "", isFinal: false, parentOptionId: null, options: [] });
      refetchTree();
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || "Failed to add question");
    }
  });

  const addOptionToNewQuestion = () => {
    if (!currentOption.label.trim()) return;
    
    setNewQuestion(prev => ({
      ...prev,
      options: [...prev.options, { ...currentOption }]
    }));
    setCurrentOption({ label: "", nextId: null });
  };

  const removeOptionFromNewQuestion = (index) => {
    setNewQuestion(prev => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="min-h-screen bg-[#171717] mt-12 p-8">
      <div className="max-w-[90vw] mx-auto">
        <h1 className="text-3xl font-normal text-white mb-8">Nutrition Assessment Rules</h1>

        <div className="grid grid-cols-[400px_1fr] gap-8">
          {/* Left Panel - Question Form and Details */}
          <div className="space-y-8">
            <div className="bg-[#1C1C1C] p-6 rounded-lg border border-[#2D2D2D]">
              <h2 className="text-xl text-white mb-6">Add New Question</h2>
              
              <div className="space-y-4">
                {/* Parent Answer Selection - Replaced parent question selection */}
                <div>
                  <label className="text-[#B4B4B4] text-sm mb-2 block">
                    Parent Answer (Optional)
                  </label>
                  <select
                    value={newQuestion.parentOptionId || ""}
                    onChange={(e) => {
                      const selectedOption = allOptions.find(opt => opt.id === e.target.value);
                      setNewQuestion(prev => ({
                        ...prev,
                        parentOptionId: e.target.value || null
                      }));
                    }}
                    className="w-full bg-[#242424] border border-[#2D2D2D] text-white rounded px-4 py-2"
                  >
                    <option value="">No parent (Root question)</option>
                    {allOptions?.map(option => (
                      <option key={option.id} value={option.id}>
                        {option.questionText} → {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Question Text */}
                <div>
                  <label className="text-[#B4B4B4] text-sm mb-2 block">Question Text</label>
                  <input
                    type="text"
                    value={newQuestion.text}
                    onChange={(e) => setNewQuestion(prev => ({ 
                      ...prev, 
                      text: e.target.value 
                    }))}
                    placeholder="Enter question text"
                    className="w-full bg-[#242424] border border-[#2D2D2D] text-white rounded px-4 py-2"
                  />
                </div>

                {/* Is Final */}
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isFinal"
                    checked={newQuestion.isFinal}
                    onChange={(e) => setNewQuestion(prev => ({ 
                      ...prev, 
                      isFinal: e.target.checked 
                    }))}
                    className="rounded border-[#2D2D2D] bg-[#242424] text-emerald-500 focus:ring-0"
                  />
                  <label htmlFor="isFinal" className="text-[#B4B4B4]">Is final question</label>
                </div>

                {/* Add Options */}
                <div className="space-y-2">
                  <h3 className="text-white text-sm font-medium">Options</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-[#B4B4B4] text-sm mb-2 block">Option Text</label>
                      <input
                        type="text"
                        value={currentOption.label}
                        onChange={(e) => setCurrentOption(prev => ({ 
                          ...prev, 
                          label: e.target.value 
                        }))}
                        placeholder="Enter option text"
                        className="w-full bg-[#242424] border border-[#2D2D2D] text-white rounded px-4 py-2"
                      />
                    </div>

                    <div>
                      <label className="text-[#B4B4B4] text-sm mb-2 block">Next Question (Optional)</label>
                      <select
                        value={currentOption.nextId || ""}
                        onChange={(e) => setCurrentOption(prev => ({ 
                          ...prev, 
                          nextId: e.target.value || null 
                        }))}
                        className="w-full bg-[#242424] border border-[#2D2D2D] text-white rounded px-4 py-2"
                      >
                        <option value="">No next question</option>
                        {allQuestionsWithOptions?.map(q => (
                          <option key={q.id} value={q.id}>
                            {q.text}
                          </option>
                        ))}
                      </select>
                    </div>

                    <button
                      onClick={() => {
                        if (currentOption.label.trim()) {
                          setNewQuestion(prev => ({
                            ...prev,
                            options: [...prev.options, { ...currentOption }]
                          }));
                          setCurrentOption({ label: "", nextId: null });
                        }
                      }}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded"
                    >
                      Add Option
                    </button>
                  </div>

                  {/* Options List */}
                  <div className="space-y-2 mt-4">
                    {newQuestion.options.map((option, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-[#242424] p-2 rounded"
                      >
                        <div className="text-[#B4B4B4]">
                          <span>{option.label}</span>
                          {option.nextId && (
                            <span className="text-xs bg-emerald-600 text-white px-2 py-0.5 rounded-full ml-2">
                              Linked
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => {
                            setNewQuestion(prev => ({
                              ...prev,
                              options: prev.options.filter((_, i) => i !== index)
                            }));
                          }}
                          className="text-red-500 hover:text-red-400"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => addQuestionMutation.mutate(newQuestion)}
                  disabled={!newQuestion.text.trim() || newQuestion.options.length === 0}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded transition text-sm disabled:opacity-50"
                >
                  {addQuestionMutation.isPending ? "Adding..." : "Add Question with Options"}
                </button>
              </div>
            </div>

            {/* Question Details (moved from right panel) */}
            {selectedQuestion && (
              <div className="bg-[#1C1C1C] p-6 rounded-lg border border-[#2D2D2D]">
                <h2 className="text-xl text-white mb-6">
                  Question Details: {selectedQuestion.text}
                </h2>
                <div className="space-y-4">
                  <div className="bg-[#242424] p-4 rounded">
                    <h3 className="text-white text-sm font-medium mb-2">Options</h3>
                    <div className="space-y-2">
                      {selectedQuestion.options?.map((option) => (
                        <div
                          key={option.id}
                          className="flex items-center justify-between bg-[#1C1C1C] p-2 rounded"
                        >
                          <span className="text-[#B4B4B4]">{option.label}</span>
                          {option.nextId && (
                            <span className="text-xs bg-emerald-600 text-white px-2 py-1 rounded">
                              Linked
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Panel - Tree Visualization */}
          <div className="bg-[#1C1C1C] rounded-lg border border-[#2D2D2D] ">
            <DecisionTreeFlow questions={questionsTree} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RulesPage;

