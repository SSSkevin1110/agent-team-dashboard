import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type AgentStatus = 'online' | 'offline' | 'working'

export interface Agent {
  id: string
  name: string
  role: string
  avatar: string
  color: string
  description: string
  status: AgentStatus
  // 统计信息
  stats: {
    totalTokens: number
    inputTokens: number
    outputTokens: number
    totalTasks: number
    completedTasks: number
    failedTasks: number
    totalRuntime: number // 秒
    totalSessions: number
    lastActive: number // timestamp
  }
}

export interface Task {
  id: string
  title: string
  description: string
  assignedTo: string[]
  status: 'pending' | 'in_progress' | 'completed'
  priority: 'low' | 'medium' | 'high'
}

interface AgentStore {
  agents: Agent[]
  tasks: Task[]
  addAgent: (agent: Omit<Agent, 'id' | 'stats'>) => void
  updateAgent: (id: string, agent: Partial<Agent>) => void
  deleteAgent: (id: string) => void
  addTask: (task: Omit<Task, 'id'>) => void
  updateTask: (id: string, task: Partial<Task>) => void
  deleteTask: (id: string) => void
  // 更新 Agent 统计
  updateAgentStats: (id: string, stats: Partial<Agent['stats']>) => void
}

// 预置的一些 Agent
const defaultAgents: Agent[] = [
  {
    id: '1',
    name: 'Pixel Master',
    role: '前端工程师',
    avatar: '🎨',
    color: '#8b5cf6',
    description: '擅长像素艺术和前端开发',
    status: 'online',
    stats: {
      totalTokens: 125000,
      inputTokens: 45000,
      outputTokens: 80000,
      totalTasks: 24,
      completedTasks: 21,
      failedTasks: 1,
      totalRuntime: 3600,
      totalSessions: 18,
      lastActive: Date.now()
    }
  },
  {
    id: '2',
    name: 'Logic Core',
    role: '后端工程师',
    avatar: '⚙️',
    color: '#3b82f6',
    description: '擅长逻辑和后端架构',
    status: 'working',
    stats: {
      totalTokens: 98000,
      inputTokens: 38000,
      outputTokens: 60000,
      totalTasks: 18,
      completedTasks: 16,
      failedTasks: 0,
      totalRuntime: 2800,
      totalSessions: 14,
      lastActive: Date.now()
    }
  },
  {
    id: '3',
    name: 'Bug Hunter',
    role: '测试工程师',
    avatar: '🔍',
    color: '#22c55e',
    description: '找 Bug 小能手',
    status: 'online',
    stats: {
      totalTokens: 45000,
      inputTokens: 18000,
      outputTokens: 27000,
      totalTasks: 12,
      completedTasks: 10,
      failedTasks: 2,
      totalRuntime: 1500,
      totalSessions: 8,
      lastActive: Date.now() - 3600000
    }
  },
  {
    id: '4',
    name: 'Design Bot',
    role: 'UI/UX 设计师',
    avatar: '✨',
    color: '#ec4899',
    description: '追求完美的设计',
    status: 'online',
    stats: {
      totalTokens: 67000,
      inputTokens: 25000,
      outputTokens: 42000,
      totalTasks: 15,
      completedTasks: 14,
      failedTasks: 0,
      totalRuntime: 2100,
      totalSessions: 12,
      lastActive: Date.now()
    }
  }
]

const defaultTasks: Task[] = [
  {
    id: '1',
    title: '搭建 Agent Dashboard',
    description: '创建任务台基础框架',
    assignedTo: ['1', '2'],
    status: 'in_progress',
    priority: 'high'
  },
  {
    id: '2',
    title: '设计像素工牌',
    description: '为每个 Agent 设计独特的像素风格工牌',
    assignedTo: ['4'],
    status: 'completed',
    priority: 'medium'
  },
  {
    id: '3',
    title: '实现任务分配',
    description: '开发任务分配给 Agent 的功能',
    assignedTo: ['2'],
    status: 'completed',
    priority: 'high'
  },
  {
    id: '4',
    title: '优化塔防游戏',
    description: '增加连击系统和波次系统',
    assignedTo: ['1', '2'],
    status: 'pending',
    priority: 'medium'
  },
  {
    id: '5',
    title: '编写测试用例',
    description: '为新功能编写单元测试',
    assignedTo: ['3'],
    status: 'pending',
    priority: 'low'
  }
]

export const useAgentStore = create<AgentStore>()(
  persist(
    (set) => ({
      agents: defaultAgents,
      tasks: defaultTasks,
      addAgent: (agent) => set((state) => ({
        agents: [...state.agents, { 
          ...agent, 
          id: Date.now().toString(),
          stats: {
            totalTokens: 0,
            inputTokens: 0,
            outputTokens: 0,
            totalTasks: 0,
            completedTasks: 0,
            failedTasks: 0,
            totalRuntime: 0,
            totalSessions: 0,
            lastActive: Date.now()
          }
        }]
      })),
      updateAgent: (id, agent) => set((state) => ({
        agents: state.agents.map((a) => a.id === id ? { ...a, ...agent } : a)
      })),
      deleteAgent: (id) => set((state) => ({
        agents: state.agents.filter((a) => a.id !== id)
      })),
      addTask: (task) => set((state) => ({
        tasks: [...state.tasks, { ...task, id: Date.now().toString() }]
      })),
      updateTask: (id, task) => set((state) => ({
        tasks: state.tasks.map((t) => t.id === id ? { ...t, ...task } : t)
      })),
      deleteTask: (id) => set((state) => ({
        tasks: state.tasks.filter((t) => t.id !== id)
      })),
      updateAgentStats: (id, stats) => set((state) => ({
        agents: state.agents.map((a) => a.id === id ? { 
          ...a, 
          stats: { ...a.stats, ...stats, lastActive: Date.now() }
        } : a)
      }))
    }),
    {
      name: 'agent-team-storage'
    }
  )
)
