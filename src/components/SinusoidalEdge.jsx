import { BaseEdge } from 'reactflow';

function SinusoidalEdge({ sourceX, sourceY, targetX, targetY, ...props }) {
  const amplitude = 20; // Height of the wave
  const frequency = 2; // Number of waves
  const segments = 50; // Number of segments for smooth curve

  // Calculate the path
  let pathCommands = `M ${sourceX} ${sourceY}`;
  const dx = targetX - sourceX;
  const dy = targetY - sourceY;
  
  for (let i = 1; i <= segments; i++) {
    const t = i / segments;
    const x = sourceX + dx * t;
    const y = sourceY + dy * t + 
              amplitude * Math.sin(frequency * Math.PI * t);
    pathCommands += ` L ${x} ${y}`;
  }

  return (
    <BaseEdge 
      path={pathCommands}
      {...props}
    />
  );
}

export default SinusoidalEdge; 