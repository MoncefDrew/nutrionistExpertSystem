import { useState, useCallback, useEffect } from "react";
import ReactFlow, {
  Handle,
  Position,
  Background,
  MarkerType,
  useNodesState,
  useEdgesState,
  Controls,
} from "reactflow";
import dagre from "dagre";
import SinusoidalEdge from "./SinusoidalEdge";
import "reactflow/dist/style.css";
import axios from "axios";
import { toast } from "sonner";

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
    <Handle
      type="target"
      position={Position.Top}
      className="!bg-white w-2 h-2"
    />
    <Handle
      type="source"
      position={Position.Bottom}
      className="!bg-white w-2 h-2"
    />
  </div>
);

const OptionNode = ({ data }) => (
  <div
    className="bg-[#242424] border border-[#2D2D2D] rounded p-3 min-w-[200px]"
    onClick={data.onExpand}
  >
    <div className="text-emerald-500 text-sm">Answer:</div>
    <div className="text-white text-sm mt-1">{data.label}</div>
    <Handle
      type="target"
      position={Position.Top}
      className="!bg-white w-2 h-2"
    />
    <Handle
      type="source"
      position={Position.Bottom}
      className="!bg-white w-2 h-2"
    />
  </div>
);

const nodeTypes = {
  question: QuestionNode,
  option: OptionNode,
};

const edgeTypes = {
  sinusoidal: SinusoidalEdge,
};

// Dagre graph configuration
const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const nodeWidth = 250;
const nodeHeight = 80;

const getLayoutedElements = (nodes, edges, direction = "TB") => {
  const isHorizontal = direction === "LR";
  dagreGraph.setGraph({ rankdir: direction });

  // Clear the graph
  dagreGraph.nodes().forEach((node) => dagreGraph.removeNode(node));

  // Add nodes to the graph
  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  // Add edges to the graph
  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  // Apply layout
  dagre.layout(dagreGraph);

  // Get the layout results
  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    return {
      ...node,
      position: {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      },
    };
  });

  return { nodes: layoutedNodes, edges };
};

const DecisionTreeFlow = ({ questions }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const processQuestionAndOptions = useCallback((question) => {
    const newNodes = [];
    const newEdges = [];

    // Add question node
    const questionNode = {
      id: question.id,
      type: "question",
      data: {
        text: question.text,
        isFinal: question.isFinal,
      },
      position: { x: 0, y: 0 }, // Position will be calculated by dagre
    };
    newNodes.push(questionNode);

    // Process options if they exist
    if (question.options && question.options.length > 0) {
      question.options.forEach((option) => {
        const optionNode = {
          id: `option-${option.id}`,
          type: "option",
          data: { label: option.label },
          position: { x: 0, y: 0 },
        };
        newNodes.push(optionNode);

        // Add edge from question to option with sinusoidal type
        newEdges.push({
          id: `q${question.id}-o${option.id}`,
          source: question.id,
          target: `option-${option.id}`,
          type: "sinusoidal",
          style: {
            stroke: "#ffffff",
            strokeWidth: 1,
            opacity: 0.8,
          },
          markerEnd: {
            type: MarkerType.Arrow,
            color: "#ffffff",
          },
        });

        if (option.next) {
          const { nodes: childNodes, edges: childEdges } =
            processQuestionAndOptions(option.next);
          newNodes.push(...childNodes);
          newEdges.push(...childEdges);

          // Add edge from option to next question
          newEdges.push({
            id: `o${option.id}-q${option.next.id}`,
            source: `option-${option.id}`,
            target: option.next.id,
            type: "sinusoidal",
            style: {
              stroke: "#ffffff",
              strokeWidth: 1,
              opacity: 0.8,
            },
            markerEnd: {
              type: MarkerType.Arrow,
              color: "#ffffff",
            },
          });
        }
      });
    }

    return { nodes: newNodes, edges: newEdges };
  }, []);

  useEffect(() => {
    if (questions) {
      const allNodes = [];
      const allEdges = [];

      questions.forEach((question) => {
        const { nodes: newNodes, edges: newEdges } =
          processQuestionAndOptions(question);
        allNodes.push(...newNodes);
        allEdges.push(...newEdges);
      });

      // Apply layout with increased spacing
      dagreGraph.setGraph({
        rankdir: "TB",
        nodesep: 80, // Horizontal spacing between nodes
        ranksep: 120, // Vertical spacing between ranks
        edgesep: 40, // Minimum edge separation
      });

      const layouted = getLayoutedElements(allNodes, allEdges, "TB");

      setNodes(layouted.nodes);
      setEdges(layouted.edges);
    }
  }, [questions, processQuestionAndOptions, setEdges, setNodes]);

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        className="bg-[#171717]"
        defaultEdgeOptions={{
          type: "sinusoidal",
          style: {
            stroke: "#ffffff",
            strokeWidth: 1,
            opacity: 0.8,
          },
          markerEnd: {
            type: MarkerType.Arrow,
            color: "#ffffff",
          },
        }}
        minZoom={0.1}
        maxZoom={1.5}
        fitViewOptions={{
          padding: 0.2,
          includeHiddenNodes: true,
        }}
      >
        <Background color="#2D2D2D" gap={16} />
        <Controls />
      </ReactFlow>
    </div>
  );
};

export default DecisionTreeFlow;
