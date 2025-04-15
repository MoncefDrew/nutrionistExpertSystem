"use client";

import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import axios from "axios";
import { PlusCircle, Trash2, ChevronRight, ChevronDown, Leaf, Plus, Info } from "lucide-react";
import DecisionTreeFlow from "../../../components/DecisionTreeFlow";
import { Handle } from 'reactflow';
import { motion } from "framer-motion";

// TreeNode Component
const TreeNode = ({ node, level = 0, onSelect }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="ml-4">
      <div 
        className={`flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-zinc-800/70 transition-colors ${
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
            <span className="text-xs bg-gradient-to-r from-emerald-600 to-green-500 text-white px-2 py-0.5 rounded-full ml-2">
              Final
            </span>
          )}
        </div>
      </div>

      {isExpanded && node.options?.length > 0 && (
        <div className="border-l border-zinc-700/50 ml-2">
          {node.options.map((option) => (
            <div key={option.id} className="ml-4 mt-2">
              <div className="flex items-center gap-2">
                <div className="w-4 h-px bg-zinc-700/50"></div>
                <div className="bg-zinc-800/70 backdrop-blur-sm p-2 rounded text-zinc-300 flex-1">
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
  <div className="bg-zinc-900/80 backdrop-blur-lg border border-zinc-800 rounded-lg p-4 min-w-[200px] shadow-lg">
    <div className="text-white text-sm">{data.text}</div>
    {data.isFinal && (
      <span className="text-xs bg-gradient-to-r from-emerald-600 to-green-500 text-white px-2 py-0.5 rounded-full mt-2 inline-block">
        Final
      </span>
    )}
    <Handle type="target" position="top" className="!bg-emerald-500" />
    <Handle type="source" position="bottom" className="!bg-emerald-500" />
  </div>
);

const OptionNode = ({ data }) => (
  <div className="bg-zinc-800/70 backdrop-blur-sm border border-zinc-700 rounded p-2 min-w-[150px] shadow-md">
    <div className="text-zinc-300 text-sm">{data.label}</div>
    <Handle type="target" position="top" className="!bg-emerald-500" />
    <Handle type="source" position="bottom" className="!bg-emerald-500" />
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
  const [activeTab, setActiveTab] = useState("add"); // "add" or "details"

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

  // Handle question selection
  const handleSelectQuestion = (question) => {
    setSelectedQuestion(question);
    setActiveTab("details");
  };

  return (
    <div className="min-h-screen pt-5 bg-black relative overflow-hidden">
      {/* Animated background blurs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-emerald-700/15 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/3 w-64 h-64 rounded-full bg-blue-700/10 blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/3 right-1/4 w-80 h-80 rounded-full bg-green-700/10 blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>
      
      <div className="relative z-10 pt-16 p-8">
        <div className="max-w-[90vw] mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-green-600 mb-2">
                Nutrition Assessment Rules
              </h1>
              <p className="text-zinc-400">Create and manage the decision tree for personalized nutrition assessments</p>
            </div>
            
            {/* Action buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => refetchTree()}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-800/70 backdrop-blur-sm text-zinc-200 hover:bg-zinc-700/70 transition-colors"
              >
                <fILETR className="w-4 h-4" />
                <span>Refresh Tree</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-8">
            {/* Left Panel - Question Form and Details */}
            <div className="space-y-6">
              {/* Tab Navigation */}
              <div className="flex bg-zinc-800/50 backdrop-blur-sm p-1 rounded-full">
                <button
                  onClick={() => setActiveTab("add")}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-full transition-all ${
                    activeTab === "add" 
                      ? "bg-gradient-to-r from-emerald-600 to-green-500 text-white" 
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Question</span>
                </button>
                <button
                  onClick={() => setActiveTab("details")}
                  disabled={!selectedQuestion}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-full transition-all ${
                    activeTab === "details" 
                      ? "bg-gradient-to-r from-emerald-600 to-green-500 text-white" 
                      : "text-zinc-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  }`}
                >
                  <Info className="w-4 h-4" />
                  <span>Question Details</span>
                </button>
              </div>

              {/* Add Question Form */}
              {activeTab === "add" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-zinc-900/80 backdrop-blur-lg rounded-2xl border border-zinc-800 shadow-xl p-6"
                >
                  <h2 className="text-xl font-semibold text-white mb-6">Add New Question</h2>
                  
                  <div className="space-y-4">
                    {/* Parent Answer Selection */}
                    <div>
                      <label className="text-zinc-400 text-sm mb-2 block">
                        Parent Answer (Optional)
                      </label>
                      <select
                        value={newQuestion.parentOptionId || ""}
                        onChange={(e) => {
                          setNewQuestion(prev => ({
                            ...prev,
                            parentOptionId: e.target.value || null
                          }));
                        }}
                        className="w-full bg-zinc-800/70 backdrop-blur-sm border border-zinc-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
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
                      <label className="text-zinc-400 text-sm mb-2 block">Question Text</label>
                      <input
                        type="text"
                        value={newQuestion.text}
                        onChange={(e) => setNewQuestion(prev => ({ 
                          ...prev, 
                          text: e.target.value 
                        }))}
                        placeholder="Enter question text"
                        className="w-full bg-zinc-800/70 backdrop-blur-sm border border-zinc-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
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
                        className="rounded border-zinc-700 bg-zinc-800/70 text-emerald-500 focus:ring-emerald-500/50"
                      />
                      <label htmlFor="isFinal" className="text-zinc-400">Is final question</label>
                    </div>

                    {/* Add Options */}
                    <div className="space-y-3 pt-2">
                      <h3 className="text-white text-sm font-medium border-b border-zinc-700/50 pb-2">Options</h3>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="text-zinc-400 text-sm mb-2 block">Option Text</label>
                          <input
                            type="text"
                            value={currentOption.label}
                            onChange={(e) => setCurrentOption(prev => ({ 
                              ...prev, 
                              label: e.target.value 
                            }))}
                            placeholder="Enter option text"
                            className="w-full bg-zinc-800/70 backdrop-blur-sm border border-zinc-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                          />
                        </div>

                        <div>
                          <label className="text-zinc-400 text-sm mb-2 block">Next Question (Optional)</label>
                          <select
                            value={currentOption.nextId || ""}
                            onChange={(e) => setCurrentOption(prev => ({ 
                              ...prev, 
                              nextId: e.target.value || null 
                            }))}
                            className="w-full bg-zinc-800/70 backdrop-blur-sm border border-zinc-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
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
                          onClick={addOptionToNewQuestion}
                          className="w-full bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-700 hover:to-green-600 text-white py-2 rounded-lg transition-colors"
                        >
                          Add Option
                        </button>
                      </div>

                      {/* Options List */}
                      <div className="space-y-2 mt-4">
                        {newQuestion.options.map((option, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between bg-zinc-800/70 backdrop-blur-sm p-3 rounded-lg"
                          >
                            <div className="text-zinc-300">
                              <span>{option.label}</span>
                              {option.nextId && (
                                <span className="text-xs bg-gradient-to-r from-emerald-600 to-green-500 text-white px-2 py-0.5 rounded-full ml-2">
                                  Linked
                                </span>
                              )}
                            </div>
                            <button
                              onClick={() => removeOptionFromNewQuestion(index)}
                              className="text-red-400 hover:text-red-300 transition-colors"
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
                      className="w-full bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-700 hover:to-green-600 text-white py-3 rounded-lg transition-all text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                    >
                      {addQuestionMutation.isPending ? "Adding..." : "Add Question with Options"}
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Question Details */}
              {activeTab === "details" && selectedQuestion && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-zinc-900/80 backdrop-blur-lg rounded-2xl border border-zinc-800 shadow-xl p-6"
                >
                  <h2 className="text-xl font-semibold text-white mb-4">
                    {selectedQuestion.text}
                  </h2>
                  
                  {selectedQuestion.isFinal && (
                    <div className="mb-4">
                      <span className="inline-block bg-gradient-to-r from-emerald-600 to-green-500 text-white px-3 py-1 rounded-full text-sm">
                        Final Question
                      </span>
                    </div>
                  )}
                  
                  <div className="space-y-4">
                    <div className="bg-zinc-800/70 backdrop-blur-sm p-4 rounded-lg">
                      <h3 className="text-white text-sm font-medium mb-3 border-b border-zinc-700/50 pb-2">Question Options</h3>
                      <div className="space-y-3">
                        {selectedQuestion.options?.length > 0 ? (
                          selectedQuestion.options.map((option) => (
                            <div
                              key={option.id}
                              className="flex items-center justify-between bg-zinc-900/80 p-3 rounded-lg"
                            >
                              <span className="text-zinc-300">{option.label}</span>
                              {option.nextId && (
                                <span className="text-xs bg-gradient-to-r from-emerald-600 to-green-500 text-white px-2 py-1 rounded-full">
                                  Linked
                                </span>
                              )}
                            </div>
                          ))
                        ) : (
                          <p className="text-zinc-400 text-sm italic">No options defined for this question</p>
                        )}
                      </div>
                    </div>
                    
                    {/* Additional question details can be added here */}
                  </div>
                </motion.div>
              )}
              
              {activeTab === "details" && !selectedQuestion && (
                <div className="bg-zinc-900/80 backdrop-blur-lg rounded-2xl border border-zinc-800 shadow-xl p-6">
                  <div className="flex flex-col items-center justify-center py-6">
                    <p className="text-zinc-400 text-center">Select a question from the tree to view details</p>
                  </div>
                </div>
              )}
            </div>

            {/* Right Panel - Tree Visualization */}
            <div className="bg-zinc-900/80 backdrop-blur-lg rounded-2xl border border-zinc-800 shadow-xl relative overflow-hidden">
              {questionsTree && questionsTree.length > 0 ? (
                <DecisionTreeFlow questions={questionsTree} />
              ) : (
                <div className="flex flex-col items-center justify-center py-20">
                  <p className="text-zinc-400 text-center mb-2">No questions in the tree yet</p>
                  <p className="text-zinc-500 text-center text-sm max-w-md">
                    Start by adding a root question using the form on the left panel
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RulesPage;