import React from 'react'
import { useAgentStore } from '../store/agentStore'
import { PixelAvatar } from './PixelAvatar'
import { 
  TrendingUp, Users, Activity, 
  Cpu, Brain, Timer, Target, BarChart3, Circle
} from 'lucide-react'

// 格式化数字
const formatNumber = (num: number): string => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
  return num.toString()
}

// 格式化时间
const formatTime = (seconds: number): string => {
  if (seconds >= 3600) {
    const hours = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    return `${hours}h ${mins}m`
  }
  if (seconds >= 60) {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}m ${secs}s`
  }
  return `${seconds}s`
}

// 格式化时间戳
const formatLastActive = (timestamp: number): string => {
  const diff = Date.now() - timestamp
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  
  if (minutes < 1) return '刚刚'
  if (minutes < 60) return `${minutes}分钟前`
  if (hours < 24) return `${hours}小时前`
  return `${Math.floor(hours / 24)}天前`
}

export const Dashboard: React.FC = () => {
  const { agents, tasks } = useAgentStore()
  
  // 总计统计
  const totalStats = agents.reduce((acc, agent) => ({
    totalTokens: acc.totalTokens + agent.stats.totalTokens,
    inputTokens: acc.inputTokens + agent.stats.inputTokens,
    outputTokens: acc.outputTokens + agent.stats.outputTokens,
    totalTasks: acc.totalTasks + agent.stats.totalTasks,
    completedTasks: acc.completedTasks + agent.stats.completedTasks,
    failedTasks: acc.failedTasks + agent.stats.failedTasks,
    totalRuntime: acc.totalRuntime + agent.stats.totalRuntime,
    totalSessions: acc.totalSessions + agent.stats.totalSessions
  }), { totalTokens: 0, inputTokens: 0, outputTokens: 0, totalTasks: 0, completedTasks: 0, failedTasks: 0, totalRuntime: 0, totalSessions: 0 })
  
  const completionRate = totalStats.totalTasks > 0 
    ? Math.round((totalStats.completedTasks / totalStats.totalTasks) * 100) 
    : 0
  
  // 任务状态分布
  const taskStats = {
    pending: tasks.filter(t => t.status === 'pending').length,
    in_progress: tasks.filter(t => t.status === 'in_progress').length,
    completed: tasks.filter(t => t.status === 'completed').length
  }

  const statusConfig = {
    online: { label: '在线', color: 'text-green-400', bg: 'bg-green-500' },
    working: { label: '工作中', color: 'text-yellow-400', bg: 'bg-yellow-500' },
    offline: { label: '离线', color: 'text-gray-400', bg: 'bg-gray-500' }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Agent 控制台</h2>
            <p className="text-gray-400 text-sm">团队智能体监控面板</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Circle className="w-3 h-3 fill-green-500 text-green-500" />
          <span>系统正常运行</span>
        </div>
      </div>
      
      {/* 总体统计卡片 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#1a1a2e] rounded-xl p-4 border border-gray-800">
          <div className="flex items-center gap-2 mb-2">
            <Brain className="w-4 h-4 text-purple-400" />
            <span className="text-gray-400 text-sm">总 Token</span>
          </div>
          <p className="text-2xl font-bold text-white">{formatNumber(totalStats.totalTokens)}</p>
          <div className="flex gap-3 mt-2 text-xs">
            <span className="text-blue-400">↑ {formatNumber(totalStats.inputTokens)}</span>
            <span className="text-green-400">↓ {formatNumber(totalStats.outputTokens)}</span>
          </div>
        </div>
        
        <div className="bg-[#1a1a2e] rounded-xl p-4 border border-gray-800">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-green-400" />
            <span className="text-gray-400 text-sm">任务完成率</span>
          </div>
          <p className="text-2xl font-bold text-white">{completionRate}%</p>
          <div className="flex gap-3 mt-2 text-xs">
            <span className="text-green-400">✓ {totalStats.completedTasks}</span>
            <span className="text-red-400">✗ {totalStats.failedTasks}</span>
          </div>
        </div>
        
        <div className="bg-[#1a1a2e] rounded-xl p-4 border border-gray-800">
          <div className="flex items-center gap-2 mb-2">
            <Timer className="w-4 h-4 text-yellow-400" />
            <span className="text-gray-400 text-sm">总运行时长</span>
          </div>
          <p className="text-2xl font-bold text-white">{formatTime(totalStats.totalRuntime)}</p>
          <div className="text-xs text-gray-500 mt-2">
            {totalStats.totalSessions} 次会话
          </div>
        </div>
        
        <div className="bg-[#1a1a2e] rounded-xl p-4 border border-gray-800">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-blue-400" />
            <span className="text-gray-400 text-sm">Agent 数量</span>
          </div>
          <p className="text-2xl font-bold text-white">{agents.length}</p>
          <div className="flex gap-2 mt-2">
            <span className="text-green-400 text-xs">{agents.filter(a => a.status === 'online').length} 在线</span>
            <span className="text-yellow-400 text-xs">{agents.filter(a => a.status === 'working').length} 工作</span>
          </div>
        </div>
      </div>
      
      {/* 任务状态分布 */}
      <div className="bg-[#1a1a2e] rounded-xl p-4 border border-gray-800">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-purple-400" />
          任务状态分布
        </h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-[#0f0f1a] rounded-lg">
            <div className="text-3xl font-bold text-gray-400">{taskStats.pending}</div>
            <div className="text-gray-500 text-sm mt-1">待处理</div>
            <div className="h-1 mt-2 bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-gray-500" style={{ width: `${(taskStats.pending / tasks.length) * 100}%` }} />
            </div>
          </div>
          <div className="text-center p-4 bg-[#0f0f1a] rounded-lg">
            <div className="text-3xl font-bold text-yellow-400">{taskStats.in_progress}</div>
            <div className="text-gray-500 text-sm mt-1">进行中</div>
            <div className="h-1 mt-2 bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-yellow-500" style={{ width: `${(taskStats.in_progress / tasks.length) * 100}%` }} />
            </div>
          </div>
          <div className="text-center p-4 bg-[#0f0f1a] rounded-lg">
            <div className="text-3xl font-bold text-green-400">{taskStats.completed}</div>
            <div className="text-gray-500 text-sm mt-1">已完成</div>
            <div className="h-1 mt-2 bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-green-500" style={{ width: `${(taskStats.completed / tasks.length) * 100}%` }} />
            </div>
          </div>
        </div>
      </div>
      
      {/* Agent 详细信息列表 */}
      <div className="bg-[#1a1a2e] rounded-xl p-4 border border-gray-800">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <Cpu className="w-5 h-5 text-blue-400" />
          Agent 详细信息
        </h3>
        
        <div className="space-y-3">
          {agents.map(agent => {
            const agentTasks = tasks.filter(t => t.assignedTo.includes(agent.id))
            const agentTaskStats = {
              pending: agentTasks.filter(t => t.status === 'pending').length,
              in_progress: agentTasks.filter(t => t.status === 'in_progress').length,
              completed: agentTasks.filter(t => t.status === 'completed').length
            }
            const successRate = agent.stats.totalTasks > 0 
              ? Math.round((agent.stats.completedTasks / agent.stats.totalTasks) * 100) 
              : 0
            
            return (
              <div 
                key={agent.id}
                className="p-4 bg-[#0f0f1a] rounded-xl border border-gray-800 hover:border-gray-700 transition-colors"
              >
                {/* Agent 头部信息 */}
                <div className="flex items-start gap-4 mb-4">
                  <PixelAvatar emoji={agent.avatar} size="md" color={agent.color} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-white font-semibold">{agent.name}</h4>
                      <span className={`px-2 py-0.5 rounded-full text-xs ${statusConfig[agent.status].bg} text-white`}>
                        {statusConfig[agent.status].label}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm">{agent.role}</p>
                    <p className="text-gray-500 text-xs mt-1">最后活跃: {formatLastActive(agent.stats.lastActive)}</p>
                  </div>
                </div>
                
                {/* 统计网格 */}
                <div className="grid grid-cols-4 gap-3">
                  {/* Token 消耗 */}
                  <div className="p-3 bg-[#1a1a2e] rounded-lg">
                    <div className="flex items-center gap-1 text-gray-400 text-xs mb-1">
                      <Brain className="w-3 h-3" />
                      Token
                    </div>
                    <p className="text-white font-bold">{formatNumber(agent.stats.totalTokens)}</p>
                    <div className="flex justify-between text-xs mt-1">
                      <span className="text-blue-400">↑{formatNumber(agent.stats.inputTokens)}</span>
                      <span className="text-green-400">↓{formatNumber(agent.stats.outputTokens)}</span>
                    </div>
                  </div>
                  
                  {/* 任务统计 */}
                  <div className="p-3 bg-[#1a1a2e] rounded-lg">
                    <div className="flex items-center gap-1 text-gray-400 text-xs mb-1">
                      <Target className="w-3 h-3" />
                      任务
                    </div>
                    <p className="text-white font-bold">{agent.stats.totalTasks}</p>
                    <div className="flex justify-between text-xs mt-1">
                      <span className="text-green-400">✓{agentTaskStats.completed}</span>
                      <span className="text-yellow-400">→{agentTaskStats.in_progress}</span>
                    </div>
                  </div>
                  
                  {/* 成功率 */}
                  <div className="p-3 bg-[#1a1a2e] rounded-lg">
                    <div className="flex items-center gap-1 text-gray-400 text-xs mb-1">
                      <Activity className="w-3 h-3" />
                      成功率
                    </div>
                    <p className="text-white font-bold">{successRate}%</p>
                    <div className="h-1 mt-2 bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-green-500 to-emerald-500" 
                        style={{ width: `${successRate}%` }} 
                      />
                    </div>
                  </div>
                  
                  {/* 运行时长 */}
                  <div className="p-3 bg-[#1a1a2e] rounded-lg">
                    <div className="flex items-center gap-1 text-gray-400 text-xs mb-1">
                      <Timer className="w-3 h-3" />
                      运行时间
                    </div>
                    <p className="text-white font-bold">{formatTime(agent.stats.totalRuntime)}</p>
                    <div className="text-xs text-gray-500 mt-1">
                      {agent.stats.totalSessions} 会话
                    </div>
                  </div>
                </div>
                
                {/* 任务进度条 */}
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>任务进度</span>
                    <span>{agentTaskStats.completed}/{agentTasks.length}</span>
                  </div>
                  <div className="h-2 bg-gray-700 rounded-full overflow-hidden flex">
                    <div 
                      className="h-full bg-green-500"
                      style={{ width: `${(agentTaskStats.completed / Math.max(agentTasks.length, 1)) * 100}%` }}
                    />
                    <div 
                      className="h-full bg-yellow-500"
                      style={{ width: `${(agentTaskStats.in_progress / Math.max(agentTasks.length, 1)) * 100}%` }}
                    />
                    <div 
                      className="h-full bg-gray-500"
                      style={{ width: `${(agentTaskStats.pending / Math.max(agentTasks.length, 1)) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
