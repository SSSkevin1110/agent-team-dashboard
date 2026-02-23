import React, { useState } from 'react'
import { Sidebar } from './components/Sidebar'
import { Dashboard } from './components/Dashboard'
import { AgentManager } from './components/AgentManager'
import { TaskPanel } from './components/TaskPanel'
import { TeamView } from './components/TeamView'
import { AgentGame } from './components/AgentGame'
import { PaperAnalyzer } from './components/PaperAnalyzer'

type Tab = 'dashboard' | 'agents' | 'tasks' | 'team' | 'game' | 'paper' | 'settings'

const ComingSoon: React.FC<{ title: string }> = ({ title }) => (
  <div className="flex flex-col items-center justify-center h-full text-center">
    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center mb-6">
      <span className="text-5xl">🚧</span>
    </div>
    <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
    <p className="text-gray-400 max-w-md">
      该功能正在紧张开发中，敬请期待...
    </p>
  </div>
)

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('paper')

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />
      case 'agents':
        return <AgentManager />
      case 'tasks':
        return <TaskPanel />
      case 'team':
        return <TeamView />
      case 'game':
        return <AgentGame />
      case 'paper':
        return <PaperAnalyzer />
      case 'settings':
        return <ComingSoon title="设置" />
      default:
        return <Dashboard />
    }
  }

  return (
    <div className="flex h-screen bg-[#0a0a0f]">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto p-8">
          {renderContent()}
        </div>
      </main>
    </div>
  )
}

export default App
