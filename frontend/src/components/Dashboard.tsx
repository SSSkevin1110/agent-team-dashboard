import React from 'react'
import { useAgentStore } from '../store/agentStore'
import { Users, CheckCircle, Clock, AlertTriangle, TrendingUp } from 'lucide-react'

export const Dashboard: React.FC = () => {
  const { agents, tasks } = useAgentStore()
  
  const totalTasks = tasks.length
  const completedTasks = tasks.filter(t => t.status === 'completed').length
  const inProgressTasks = tasks.filter(t => t.status === 'in_progress').length
  const pendingTasks = tasks.filter(t => t.status === 'pending').length
  
  const onlineAgents = agents.filter(a => a.status === 'online').length
  const workingAgents = agents.filter(a => a.status === 'working').length
  
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
      icon: <TrendingUp className="w-5 h-5" />,
      color: 'text-yellow-400'
    }
  ]

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
                <span className={`text-${stat.glow === 'blue' ? 'blue' : stat.glow === 'green' ? 'green' : stat.glow === 'orange' ? 'yellow' : 'purple'}-400`}>
                  {stat.icon}
                </span>
              </div>
              <p className="text-3xl font-bold text-white">{stat.value}</p>
            </div>
          </div>
        ))}
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
            <span className="text-green-400">{Math.round(((onlineAgents + workingAgents) / agents.length) * 100)}%</span>
          </div>
          <div className="h-2 bg-[#0f0f1a] rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-500"
              style={{ width: `${((onlineAgents + workingAgents) / agents.length) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
