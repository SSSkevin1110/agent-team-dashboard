import React from 'react'
import { LayoutDashboard, Bot, CheckSquare, Network, Gamepad2, BookOpen, Settings } from 'lucide-react'

type Tab = 'dashboard' | 'agents' | 'tasks' | 'team' | 'game' | 'paper' | 'settings'

interface SidebarProps {
  activeTab: Tab
  onTabChange: (tab: Tab) => void
}

const tabs = [
  { id: 'dashboard', label: '控制台', icon: LayoutDashboard },
  { id: 'paper', label: '论文分析', icon: BookOpen },
  { id: 'agents', label: 'Agent 团队', icon: Bot },
  { id: 'tasks', label: '任务面板', icon: CheckSquare },
  { id: 'team', label: '团队视图', icon: Network },
  { id: 'game', label: '小游戏', icon: Gamepad2 },
  { id: 'settings', label: '设置', icon: Settings }
] as const

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  return (
    <aside className="w-56 bg-[#0f0f1a] border-r border-gray-800 flex flex-col">
      {/* Logo */}
      <div className="p-5 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-white">Agent Team</h1>
            <p className="text-xs text-gray-500">任务台 v1.0</p>
          </div>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-white border border-purple-500/30'
                  : 'text-gray-400 hover:bg-gray-800/50 hover:text-white'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-purple-400' : ''}`} />
              <span className="font-medium">{tab.label}</span>
            </button>
          )
        })}
      </nav>
      
      {/* Footer */}
      <div className="p-4 border-t border-gray-800">
        <div className="text-xs text-gray-500 text-center">
          <p>Powered by kevin</p>
          <p>🤖 AI Programmer</p>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
