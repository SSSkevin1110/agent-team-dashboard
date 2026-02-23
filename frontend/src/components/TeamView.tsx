import React from 'react'
import ReactFlow, {
  type Node,
  type Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  MarkerType,
  Handle,
  Position
} from 'reactflow'
import 'reactflow/dist/style.css'
import { useAgentStore, type Agent } from '../store/agentStore'

const AgentNode: React.FC<{ data: Agent }> = ({ data }) => {
  const statusColors = {
    online: '#22c55e',
    offline: '#6b7280',
    working: '#eab308'
  }
  
  return (
    <div className="relative">
      <div 
        className="w-32 p-3 rounded-xl bg-[#1a1a2e] border-2 transition-all duration-300 hover:scale-105"
        style={{ borderColor: data.color, boxShadow: `0 0 20px ${data.color}40` }}
      >
        <Handle type="target" position={Position.Top} className="!bg-gray-500" />
        
        {/* Avatar */}
        <div 
          className="w-14 h-14 mx-auto rounded-lg flex items-center justify-center text-2xl mb-2"
          style={{ background: `linear-gradient(135deg, ${data.color}30, ${data.color}60)` }}
        >
          {data.avatar}
        </div>
        
        {/* Name */}
        <p className="text-center font-bold text-white text-sm">{data.name}</p>
        <p className="text-center text-xs" style={{ color: data.color }}>{data.role}</p>
        
        {/* Status indicator */}
        <div 
          className="absolute top-2 right-2 w-3 h-3 rounded-full"
          style={{ backgroundColor: statusColors[data.status], boxShadow: `0 0 8px ${statusColors[data.status]}` }}
        />
        
        <Handle type="source" position={Position.Bottom} className="!bg-gray-500" />
      </div>
    </div>
  )
}

const nodeTypes = {
  agent: AgentNode
}

export const TeamView: React.FC = () => {
  const { agents, tasks } = useAgentStore()
  
  // Create nodes from agents
  const initialNodes: Node[] = agents.map((agent, index) => ({
    id: agent.id,
    type: 'agent',
    position: {
      x: 150 + (index % 4) * 200,
      y: 100 + Math.floor(index / 4) * 200
    },
    data: agent
  }))
  
  // Create edges based on task assignments
  const initialEdges: Edge[] = []
  tasks.forEach((task, taskIndex) => {
    if (task.assignedTo.length > 1) {
      // Connect agents working on the same task
      for (let i = 0; i < task.assignedTo.length - 1; i++) {
        initialEdges.push({
          id: `e${taskIndex}-${i}`,
          source: task.assignedTo[i],
          target: task.assignedTo[i + 1],
          animated: task.status === 'in_progress',
          style: { 
            stroke: '#8b5cf6',
            strokeWidth: 2
          },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: '#8b5cf6'
          },
          label: task.status === 'in_progress' ? '协作中' : '',
          labelStyle: { fill: '#8b5cf6', fontSize: 10 }
        })
      }
    }
  })
  
  const [nodes] = useNodesState(initialNodes)
  const [edges] = useEdgesState(initialEdges)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
          <span className="w-6 h-6 text-white">🤝</span>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">团队视图</h2>
          <p className="text-gray-400 text-sm">可视化智能体协作关系</p>
        </div>
      </div>
      
      {/* Flow Chart */}
      <div className="h-[500px] bg-[#0f0f1a] rounded-xl border border-gray-800 overflow-hidden">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          fitView
          attributionPosition="bottom-left"
        >
          <Background color="#1a1a2e" gap={20} />
          <Controls className="!bg-[#1a1a2e] !border-gray-700 !text-white" />
        </ReactFlow>
      </div>
      
      {/* Legend */}
      <div className="bg-[#1a1a2e] rounded-xl p-4 border border-gray-800">
        <h4 className="text-sm font-semibold text-white mb-3">图例</h4>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-gray-400 text-sm">在线</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-yellow-500" />
            <span className="text-gray-400 text-sm">工作中</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-gray-500" />
            <span className="text-gray-400 text-sm">离线</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-8 h-0.5 bg-purple-500" />
            <span className="text-gray-400 text-sm">协作关系</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TeamView
