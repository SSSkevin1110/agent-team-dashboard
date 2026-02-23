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
  stats: {
    totalTokens: number
    inputTokens: number
    outputTokens: number
    totalTasks: number
    completedTasks: number
    failedTasks: number
    totalRuntime: number
    totalSessions: number
    lastActive: number
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

// 论文分析相关类型
export interface Paper {
  id: string
  title: string
  authors: string[]
  abstract: string
  url?: string
  publishedDate?: string
  keywords: string[]
  // 分析结果
  analysis?: {
    researchGoal: string
    methodology: string
    contributions: string[]
    results: string
    pros: string[]
    cons: string[]
    scores: {
      innovation: number
      completeness: number
      practicality: number
    }
  }
  status: 'pending' | 'analyzing' | 'completed'
  createdAt: number
}

interface AgentStore {
  agents: Agent[]
  tasks: Task[]
  papers: Paper[]
  addAgent: (agent: Omit<Agent, 'id' | 'stats'>) => void
  updateAgent: (id: string, agent: Partial<Agent>) => void
  deleteAgent: (id: string) => void
  addTask: (task: Omit<Task, 'id'>) => void
  updateTask: (id: string, task: Partial<Task>) => void
  deleteTask: (id: string) => void
  updateAgentStats: (id: string, stats: Partial<Agent['stats']>) => void
  // 论文相关
  addPaper: (paper: Omit<Paper, 'id' | 'createdAt' | 'status'>) => void
  updatePaper: (id: string, paper: Partial<Paper>) => void
  deletePaper: (id: string) => void
}

// 论文分析 Agent 团队
const paperTeamAgents: Agent[] = [
  {
    id: '1',
    name: 'Paper Reader',
    role: '论文读取',
    avatar: '📖',
    color: '#8b5cf6',
    description: '负责读取论文内容，支持 PDF 和 URL',
    status: 'online',
    stats: { totalTokens: 25000, inputTokens: 15000, outputTokens: 10000, totalTasks: 5, completedTasks: 5, failedTasks: 0, totalRuntime: 500, totalSessions: 5, lastActive: Date.now() }
  },
  {
    id: '2',
    name: 'Analyzer',
    role: '深度分析',
    avatar: '🔬',
    color: '#3b82f6',
    description: '分析论文内容，提取关键信息',
    status: 'online',
    stats: { totalTokens: 45000, inputTokens: 20000, outputTokens: 25000, totalTasks: 4, completedTasks: 4, failedTasks: 0, totalRuntime: 800, totalSessions: 4, lastActive: Date.now() }
  },
  {
    id: '3',
    name: 'Critic',
    role: '质量评估',
    avatar: '⭐',
    color: '#f59e0b',
    description: '评估论文质量和创新点',
    status: 'online',
    stats: { totalTokens: 18000, inputTokens: 8000, outputTokens: 10000, totalTasks: 3, completedTasks: 3, failedTasks: 0, totalRuntime: 300, totalSessions: 3, lastActive: Date.now() }
  },
  {
    id: '4',
    name: 'Reporter',
    role: '报告生成',
    avatar: '📝',
    color: '#10b981',
    description: '生成结构化分析报告',
    status: 'online',
    stats: { totalTokens: 12000, inputTokens: 5000, outputTokens: 7000, totalTasks: 3, completedTasks: 3, failedTasks: 0, totalRuntime: 200, totalSessions: 3, lastActive: Date.now() }
  }
]

const defaultTasks: Task[] = [
  {
    id: '1',
    title: '搭建论文分析网页基础框架',
    description: '创建 React 项目结构，论文输入组件',
    assignedTo: ['1'],
    status: 'in_progress',
    priority: 'high'
  },
  {
    id: '2',
    title: '实现 PDF 和 URL 解析功能',
    description: '支持 arXiv 和 PDF 文件上传解析',
    assignedTo: ['1'],
    status: 'pending',
    priority: 'high'
  },
  {
    id: '3',
    title: '开发论文分析 UI 组件',
    description: '论文卡片、分析结果展示组件',
    assignedTo: ['2'],
    status: 'pending',
    priority: 'medium'
  },
  {
    id: '4',
    title: '实现深度分析功能',
    description: 'AI 分析论文结构和内容',
    assignedTo: ['2', '3'],
    status: 'pending',
    priority: 'high'
  },
  {
    id: '5',
    title: '添加报告导出功能',
    description: 'Markdown 报告生成和下载',
    assignedTo: ['4'],
    status: 'pending',
    priority: 'low'
  }
]

export const useAgentStore = create<AgentStore>()(
  persist(
    (set) => ({
      agents: paperTeamAgents,
      tasks: defaultTasks,
      papers: [],
      addAgent: (agent) => set((state) => ({
        agents: [...state.agents, { 
          ...agent, 
          id: Date.now().toString(),
          stats: { totalTokens: 0, inputTokens: 0, outputTokens: 0, totalTasks: 0, completedTasks: 0, failedTasks: 0, totalRuntime: 0, totalSessions: 0, lastActive: Date.now() }
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
        agents: state.agents.map((a) => a.id === id ? { ...a, stats: { ...a.stats, ...stats, lastActive: Date.now() }} : a)
      })),
      addPaper: (paper) => set((state) => ({
        papers: [...state.papers, { ...paper, id: Date.now().toString(), status: 'pending', createdAt: Date.now() }]
      })),
      updatePaper: (id, paper) => set((state) => ({
        papers: state.papers.map((p) => p.id === id ? { ...p, ...paper } : p)
      })),
      deletePaper: (id) => set((state) => ({
        papers: state.papers.filter((p) => p.id !== id)
      }))
    }),
    {
      name: 'agent-team-storage'
    }
  )
)
