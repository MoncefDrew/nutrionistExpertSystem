import { useState, useCallback, useEffect } from 'react';
import ReactFlow, { 
  Handle, 
  Position, 
  Background,
  MarkerType,
  useNodesState,
  useEdgesState,
  Controls
} from 'reactflow';
import 'reactflow/dist/style.css';
import axios from 'axios';
import { toast } from 'sonner';

// Custom Node Components
const QuestionNode = ({ data }) => (
  <div 
    className="bg-[#1C1C1C] border border-[#2D2D2D] rounded-lg p-4 min-w-[250px]"
    onClick={data.onExpand}
  >
    <div className="text-white text-sm font-medium">{data.text}</div>
    {data.isFinal && (
      <span className="text-xs bg-emerald-600 text-white px-2 py-0.5 rounded-full mt-2 inline-block">
        Final
      </span>
    )}
    <Handle type="target" position={Position.Left} className="!bg-white w-2 h-2" />
    <Handle type="source" position={Position.Right} className="!bg-white w-2 h-2" />
  </div>
);

const OptionNode = ({ data }) => (
  <div 
    className="bg-[#242424] border border-[#2D2D2D] rounded p-3 min-w-[200px]"
    onClick={data.onExpand}
  >
    <div className="text-emerald-500 text-sm">Answer:</div>
    <div className="text-white text-sm mt-1">{data.label}</div>
    <Handle type="target" position={Position.Left} className="!bg-white w-2 h-2" />
    <Handle type="source" position={Position.Right} className="!bg-white w-2 h-2" />
  </div>
);

const nodeTypes = {
  question: QuestionNode,
  option: OptionNode,
};

const defaultEdgeOptions = {
  type: 'smoothstep',
  style: {
    stroke: 'white',
    strokeWidth: 1,
    opacity: 0.8,
  },
  markerEnd: {
    type: MarkerType.Arrow,
    color: 'white',
  }
};

const DecisionTreeFlow = ({ questions }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const processQuestionAndOptions = useCallback((question, position, level = 0) => {
    const newNodes = [];
    const newEdges = [];
    const horizontalSpacing = 400;
    const verticalSpacing = 150;

    // Add question node
    const questionNode = {
      id: question.id,
      type: 'question',
      position: position,
      data: { 
        text: question.text,
        isFinal: question.isFinal
      }
    };
    newNodes.push(questionNode);

    // Process options if they exist
    if (question.options && question.options.length > 0) {
      const totalOptionsHeight = (question.options.length - 1) * verticalSpacing;
      const startY = position.y - totalOptionsHeight / 2;

      question.options.forEach((option, index) => {
        // Add option node
        const optionX = position.x + horizontalSpacing;
        const optionY = startY + (index * verticalSpacing);
        
        const optionNode = {
          id: `option-${option.id}`,
          type: 'option',
          position: { x: optionX, y: optionY },
          data: { 
            label: option.label
          }
        };
        newNodes.push(optionNode);

        // Updated edge style
        newEdges.push({
          id: `q${question.id}-o${option.id}`,
          source: question.id,
          target: `option-${option.id}`,
          type: 'straight',
          style: { 
            stroke: '#ffffff', 
            strokeWidth: 1,
            opacity: 0.8
          }
        });

        // If option has a next question, process it recursively
        if (option.next) {
          const nextQuestionX = optionX + horizontalSpacing;
          const nextQuestionY = optionY;
          
          const nextQuestionNodes = processQuestionAndOptions(
            option.next,
            { x: nextQuestionX, y: nextQuestionY },
            level + 1
          );
          
          newNodes.push(...nextQuestionNodes.nodes);
          newEdges.push(...nextQuestionNodes.edges);

          // Updated edge style for next question connection
          newEdges.push({
            id: `o${option.id}-q${option.next.id}`,
            source: `option-${option.id}`,
            target: option.next.id,
            type: 'straight',
            style: { 
              stroke: '#ffffff', 
              strokeWidth: 1,
              opacity: 0.8
            }
          });
        }
      });
    }

    return { nodes: newNodes, edges: newEdges };
  }, []);

  // Initialize the flow with questions
  useEffect(() => {
    if (questions) {
      const allNodes = [];
      const allEdges = [];
      const verticalSpacing = 300;
      const startX = 50;

      questions.forEach((question, index) => {
        const questionY = (index * verticalSpacing) + 100;
        const { nodes: newNodes, edges: newEdges } = processQuestionAndOptions(
          question,
          { x: startX, y: questionY }
        );
        
        allNodes.push(...newNodes);
        allEdges.push(...newEdges);
      });

      setNodes(allNodes);
      setEdges(allEdges);
    }
  }, [questions, processQuestionAndOptions, setEdges, setNodes]);

  // Add this to ensure proper layout
  const layoutElements = {
    direction: 'LR',
    nodeSpacing: 100,
    rankSpacing: 300,
  };

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        className="bg-[#171717]"
        defaultEdgeOptions={defaultEdgeOptions}
        layoutElements={layoutElements}
        minZoom={0.1}
        maxZoom={1.5}
      >
        <Background color="#2D2D2D" gap={16} />
        <Controls />
      </ReactFlow>
    </div>
  );
};

export default DecisionTreeFlow; 