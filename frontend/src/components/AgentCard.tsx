import React from 'react'
import type { Agent } from '../store/agentStore'

interface AgentCardProps {
  agent: Agent
  onClick?: () => void
}

const statusColors = {
  online: 'bg-green-500',
  offline: 'bg-gray-500',
  working: 'bg-yellow-500 animate-pulse'
}

const statusText = {
  online: '在线',
  offline: '离线',
  working: '工作中'
}

export const AgentCard: React.FC<AgentCardProps> = ({ agent, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="relative group cursor-pointer transform transition-all duration-300 hover:scale-105 hover:-translate-y-1"
    >
      {/* Pixel art border effect */}
      <div 
        className="absolute -inset-1 rounded-xl opacity-75 group-hover:opacity-100 transition-opacity duration-300"
        style={{ 
          background: `linear-gradient(135deg, ${agent.color}40, ${agent.color}80)`,
          filter: 'blur(8px)'
        }}
      />
      
      <div className="relative bg-[#1a1a2e] rounded-xl p-4 border-2 overflow-hidden" style={{ borderColor: agent.color }}>
        {/* Pixel pattern overlay */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='8' height='8' viewBox='0 0 8 8' xmlns='http://www.w3.org/2000/svg'%3E%3Crect fill='%23fff' width='1' height='1'/%3E%3C/svg%3E")`,
            imageRendering: 'pixelated'
          }}
        />
        
        {/* Content */}
        <div className="relative z-10">
          {/* Avatar */}
          <div className="flex justify-center mb-3">
            <div 
              className="w-20 h-20 rounded-lg flex items-center justify-center text-4xl"
              style={{ 
                background: `linear-gradient(135deg, ${agent.color}30, ${agent.color}60)`,
                boxShadow: `0 0 20px ${agent.color}40`
              }}
            >
              {agent.avatar}
            </div>
          </div>
          
          {/* Name */}
          <h3 className="text-center font-bold text-lg text-white mb-1">{agent.name}</h3>
          
          {/* Role */}
          <p className="text-center text-sm mb-3" style={{ color: agent.color }}>
            {agent.role}
          </p>
          
          {/* Status */}
          <div className="flex items-center justify-center gap-2">
            <span className={`w-2 h-2 rounded-full ${statusColors[agent.status]}`} />
            <span className="text-xs text-gray-400">{statusText[agent.status]}</span>
          </div>
        </div>
        
        {/* Bottom accent */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-1"
          style={{ background: agent.color }}
        />
      </div>
    </div>
  )
}

export default AgentCard
