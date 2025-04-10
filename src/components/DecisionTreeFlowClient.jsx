'use client';
import { useState, useCallback, useEffect } from 'react';
import ReactFlow, { 
  Handle, 
  Position, 
  Background,
  MarkerType,
  useNodesState,
  useEdgesState,
  Controls,
  Panel
} from 'reactflow';
import dynamic from 'next/dynamic';
import 'reactflow/dist/style.css';

// Custom Node Components
const QuestionNode = ({ data }) => (
  <div className="bg-[#1C1C1C] border border-[#2D2D2D] rounded-lg p-4 min-w-[250px]">
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
  <div className="bg-[#242424] border border-[#2D2D2D] rounded p-3 min-w-[200px]">
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

function DecisionTreeFlowClient({ initialNodes, initialEdges }) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [elk, setElk] = useState(null);

  useEffect(() => {
    import('elkjs/lib/elk.bundled.js').then((ELK) => {
      setElk(new ELK.default());
    });
  }, []);

  const getLayoutedElements = useCallback(async (options = {}) => {
    if (!elk || !nodes.length) return;

    const elkNodes = nodes.map((node) => ({
      id: node.id,
      width: 250,
      height: 80,
      x: node.position.x,
      y: node.position.y,
    }));

    const elkEdges = edges.map((edge) => ({
      id: edge.id,
      sources: [edge.source],
      targets: [edge.target],
    }));

    const elkGraph = {
      id: 'root',
      layoutOptions: {
        'elk.algorithm': 'layered',
        'elk.direction': 'DOWN',
        'elk.spacing.nodeNode': '80',
        'elk.layered.spacing.nodeNodeBetweenLayers': '100',
        'elk.edgeRouting': 'ORTHOGONAL',
        ...options,
      },
      children: elkNodes,
      edges: elkEdges,
    };

    try {
      const layoutedGraph = await elk.layout(elkGraph);
      const layoutedNodes = nodes.map((node) => {
        const elkNode = layoutedGraph.children.find((n) => n.id === node.id);
        if (elkNode) {
          return {
            ...node,
            position: {
              x: elkNode.x,
              y: elkNode.y,
            },
          };
        }
        return node;
      });

      setNodes(layoutedNodes);
    } catch (error) {
      console.error('Layout calculation failed:', error);
    }
  }, [nodes, edges, setNodes, elk]);

  useEffect(() => {
    if (elk) {
      getLayoutedElements();
    }
  }, [elk, getLayoutedElements]);

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
        minZoom={0.1}
        maxZoom={1.5}
      >
        <Background color="#2D2D2D" gap={16} />
        <Controls />
        <Panel position="top-right">
          <button
            onClick={() => getLayoutedElements({ 'elk.direction': 'DOWN' })}
            className="bg-zinc-800 text-white px-4 py-2 rounded hover:bg-zinc-700"
          >
            Vertical Layout
          </button>
        </Panel>
      </ReactFlow>
    </div>
  );
}

export default dynamic(() => Promise.resolve(DecisionTreeFlowClient), {
  ssr: false
}); 