export function processQuestionAndOptions(question, position) {
  const newNodes = [];
  const newEdges = [];

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

  // Process options
  if (question.options && question.options.length > 0) {
    question.options.forEach((option) => {
      const optionNode = {
        id: `option-${option.id}`,
        type: 'option',
        position: { x: 0, y: 0 },
        data: { 
          label: option.label
        }
      };
      newNodes.push(optionNode);

      newEdges.push({
        id: `q${question.id}-o${option.id}`,
        source: question.id,
        target: `option-${option.id}`,
        type: 'smoothstep',
        style: { 
          stroke: '#ffffff', 
          strokeWidth: 1,
          opacity: 0.8
        },
        markerEnd: {
          type: 'arrow',
          color: 'white',
        }
      });

      if (option.next) {
        const nextQuestionNodes = processQuestionAndOptions(
          option.next,
          { x: 0, y: 0 }
        );
        
        newNodes.push(...nextQuestionNodes.nodes);
        newEdges.push(...nextQuestionNodes.edges);

        newEdges.push({
          id: `o${option.id}-q${option.next.id}`,
          source: `option-${option.id}`,
          target: option.next.id,
          type: 'smoothstep',
          style: { 
            stroke: '#ffffff', 
            strokeWidth: 1,
            opacity: 0.8
          },
          markerEnd: {
            type: 'arrow',
            color: 'white',
          }
        });
      }
    });
  }

  return { nodes: newNodes, edges: newEdges };
} 