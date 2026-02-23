import React from 'react'
import { useAgentStore } from '../store/agentStore'
import { CheckCircle, Clock, AlertTriangle, TrendingUp, Users, Activity } from 'lucide-react'

export const Dashboard: React.FC = () => {
  const { agents, tasks } = useAgentStore()
  
  const totalTasks = tasks.length
  const completedTasks = tasks.filter(t => t.status === 'completed').length
  const inProgressTasks = tasks.filter(t => t.status === 'in_progress').length
  const pendingTasks = tasks.filter(t => t.status === 'pending').length
  
  const onlineAgents = agents.filter(a => a.status === 'online').length
  const workingAgents = agents.filter(a => a.status === 'working').length
  
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
  
  // 模拟一些统计数据
  const stats = [
    {
      label: '总任务',
      value: totalTasks,
      icon: <CheckCircle className="w-6 h-6" />,
      color: 'from-blue-500 to-blue-600',
      glow: 'blue'
    },
    {
      label: '进行中',
      value: inProgressTasks,
      icon: <Clock className="w-6 h-6" />,
      color: 'from-yellow-500 to-yellow-600',
      glow: 'orange'
    },
    {
      label: '已完成',
      value: completedTasks,
      icon: <CheckCircle className="w-6 h-6" />,
      color: 'from-green-500 to-green-600',
      glow: 'green'
    },
    {
      label: '待处理',
      value: pendingTasks,
      icon: <AlertTriangle className="w-6 h-6" />,
      color: 'from-purple-500 to-purple-600',
      glow: 'purple'
    }
  ]
  
  const agentStats = [
    {
      label: '在线 Agent',
      value: onlineAgents,
      total: agents.length,
      icon: <Users className="w-5 h-5" />,
      color: 'text-green-400'
    },
    {
      label: '工作中',
      value: workingAgents,
      total: agents.length,
      icon: <Activity className="w-5 h-5" />,
      color: 'text-yellow-400'
    }
  ]
  
  // 任务优先级分布
  const priorityDist = {
    high: tasks.filter(t => t.priority === 'high').length,
    medium: tasks.filter(t => t.priority === 'medium').length,
    low: tasks.filter(t => t.priority === 'low').length
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
          <TrendingUp className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">仪表盘</h2>
          <p className="text-gray-400 text-sm">团队任务概览</p>
        </div>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div 
            key={i}
            className="relative group"
          >
            <div className={`absolute -inset-0.5 rounded-xl opacity-50 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br ${stat.color}`} />
            <div className="relative bg-[#1a1a2e] rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">{stat.label}</span>
                <span className={stat.glow === 'blue' ? 'text-blue-400' : stat.glow === 'green' ? 'text-green-400' : stat.glow === 'orange' ? 'text-yellow-400' : 'text-purple-400'}>
                  {stat.icon}
                </span>
              </div>
              <p className="text-3xl font-bold text-white">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>
      
      {/* Progress & Agent Status */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Completion Progress */}
        <div className="bg-[#1a1a2e] rounded-xl p-5 border border-gray-800">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-400" />
            任务完成率
          </h3>
          
          {/* Circle Progress */}
          <div className="flex items-center justify-center mb-4">
            <div className="relative w-32 h-32">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  fill="none"
                  stroke="#0f0f1a"
                  strokeWidth="12"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  fill="none"
                  stroke="url(#gradient)"
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray={`${completionRate * 3.52} 352`}
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#3b82f6" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-white">{completionRate}%</span>
                <span className="text-gray-400 text-xs">完成率</span>
              </div>
            </div>
          </div>
          
          {/* Priority Distribution */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">优先级分布</span>
            </div>
            <div className="flex gap-2">
              <div className="flex-1">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-red-400">高</span>
                  <span className="text-gray-500">{priorityDist.high}</span>
                </div>
                <div className="h-2 bg-[#0f0f1a] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-red-500"
                    style={{ width: `${totalTasks > 0 ? (priorityDist.high / totalTasks) * 100 : 0}%` }}
                  />
                </div>
              </div>
              <div className="flex-1">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-yellow-400">中</span>
                  <span className="text-gray-500">{priorityDist.medium}</span>
                </div>
                <div className="h-2 bg-[#0f0f1a] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-yellow-500"
                    style={{ width: `${totalTasks > 0 ? (priorityDist.medium / totalTasks) * 100 : 0}%` }}
                  />
                </div>
              </div>
              <div className="flex-1">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-400">低</span>
                  <span className="text-gray-500">{priorityDist.low}</span>
                </div>
                <div className="h-2 bg-[#0f0f1a] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gray-500"
                    style={{ width: `${totalTasks > 0 ? (priorityDist.low / totalTasks) * 100 : 0}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Agent Status */}
        <div className="bg-[#1a1a2e] rounded-xl p-5 border border-gray-800">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-400" />
            Agent 状态
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {agentStats.map((stat, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-[#0f0f1a] rounded-lg">
                <div className="flex items-center gap-3">
                  <span className={stat.color}>{stat.icon}</span>
                  <span className="text-gray-400">{stat.label}</span>
                </div>
                <span className="text-2xl font-bold text-white">
                  {stat.value}
                  <span className="text-gray-500 text-sm font-normal">/{stat.total}</span>
                </span>
              </div>
            ))}
          </div>
          
          {/* Progress bar */}
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-400">团队活跃度</span>
              <span className="text-green-400">{Math.round(((onlineAgents + workingAgents) / Math.max(agents.length, 1)) * 100)}%</span>
            </div>
            <div className="h-2 bg-[#0f0f1a] rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-500"
                style={{ width: `${((onlineAgents + workingAgents) / Math.max(agents.length, 1)) * 100}%` }}
              />
            </div>
          </div>
          
          {/* Agent List Preview */}
          <div className="mt-4 space-y-2">
            {agents.slice(0, 3).map(agent => (
              <div key={agent.id} className="flex items-center gap-2 p-2 bg-[#0f0f1a] rounded-lg">
                <span className="text-lg">{agent.avatar}</span>
                <span className="text-white text-sm flex-1">{agent.name}</span>
                <span className={`w-2 h-2 rounded-full ${
                  agent.status === 'online' ? 'bg-green-500' : 
                  agent.status === 'working' ? 'bg-yellow-500 animate-pulse' : 'bg-gray-500'
                }`} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
