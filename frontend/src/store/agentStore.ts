import { create } from 'zustand'

export type AgentStatus = 'online' | 'offline' | 'working'

export interface Agent {
  id: string
  name: string
  role: string
  avatar: string
  color: string
  description: string
  status: AgentStatus
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
  addAgent: (agent: Omit<Agent, 'id'>) => void
  updateAgent: (id: string, agent: Partial<Agent>) => void
  deleteAgent: (id: string) => void
  addTask: (task: Omit<Task, 'id'>) => void
  updateTask: (id: string, task: Partial<Task>) => void
  deleteTask: (id: string) => void
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
    status: 'online'
  },
  {
    id: '2',
    name: 'Logic Core',
    role: '后端工程师',
    avatar: '⚙️',
    color: '#3b82f6',
    description: '擅长逻辑和后端架构',
    status: 'online'
  },
  {
    id: '3',
    name: 'Bug Hunter',
    role: '测试工程师',
    avatar: '🔍',
    color: '#22c55e',
    description: '找 Bug 小能手',
    status: 'working'
  },
  {
    id: '4',
    name: 'Design Bot',
    role: 'UI/UX 设计师',
    avatar: '✨',
    color: '#ec4899',
    description: '追求完美的设计',
    status: 'online'
  }
]

export const useAgentStore = create<AgentStore>((set) => ({
  agents: defaultAgents,
  tasks: [
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
      status: 'pending',
      priority: 'medium'
    },
    {
      id: '3',
      title: '实现任务分配',
      description: '开发任务分配给 Agent 的功能',
      assignedTo: ['2'],
      status: 'pending',
      priority: 'high'
    }
  ],
  addAgent: (agent) => set((state) => ({
    agents: [...state.agents, { ...agent, id: Date.now().toString() }]
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
  }))
}))
