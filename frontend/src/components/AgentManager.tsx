import React, { useState } from 'react'
import { useAgentStore, type Agent } from '../store/agentStore'
import { AgentCard } from './AgentCard'
import { Plus, X, Edit2, Trash2 } from 'lucide-react'

const avatarOptions = ['🎨', '⚙️', '🔍', '✨', '🚀', '💡', '🎮', '🧠', '🔧', '📦', '🎯', '💎']
const roleOptions = ['前端工程师', '后端工程师', '测试工程师', 'UI/UX 设计师', '产品经理', 'DevOps工程师', '数据工程师', '算法工程师']
const colorOptions = ['#8b5cf6', '#3b82f6', '#22c55e', '#ec4899', '#f97316', '#14b8a6', '#eab308', '#ef4444']

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg mx-4">
        {children}
      </div>
    </div>
  )
}

export const AgentManager: React.FC = () => {
  const { agents, addAgent, updateAgent, deleteAgent } = useAgentStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null)
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null)
  
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    avatar: '🎨',
    color: '#8b5cf6',
    description: '',
    status: 'online' as Agent['status']
  })

  const handleOpenModal = (agent?: Agent) => {
    if (agent) {
      setEditingAgent(agent)
      setFormData({
        name: agent.name,
        role: agent.role,
        avatar: agent.avatar,
        color: agent.color,
        description: agent.description,
        status: agent.status
      })
    } else {
      setEditingAgent(null)
      setFormData({
        name: '',
        role: '',
        avatar: '🎨',
        color: '#8b5cf6',
        description: '',
        status: 'online'
      })
    }
    setIsModalOpen(true)
  }

  const handleSubmit = () => {
    if (editingAgent) {
      updateAgent(editingAgent.id, formData)
    } else {
      addAgent(formData)
    }
    setIsModalOpen(false)
  }

  const handleDelete = (id: string) => {
    if (confirm('确定要删除这个 Agent 吗？')) {
      deleteAgent(id)
      setSelectedAgent(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center">
            <span className="text-2xl">🤖</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Agent 团队</h2>
            <p className="text-gray-400 text-sm">管理你的智能体团队</p>
          </div>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:opacity-90 transition-opacity"
        >
          <Plus className="w-5 h-5" />
          添加 Agent
        </button>
      </div>
      
      {/* Agent Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {agents.map((agent) => (
          <AgentCard 
            key={agent.id} 
            agent={agent} 
            onClick={() => setSelectedAgent(agent)}
          />
        ))}
      </div>

      {/* Agent Detail Modal */}
      <Modal isOpen={!!selectedAgent} onClose={() => setSelectedAgent(null)}>
        {selectedAgent && (
          <div className="bg-[#1a1a2e] rounded-xl p-6 border border-gray-800">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                <div 
                  className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl"
                  style={{ 
                    background: `linear-gradient(135deg, ${selectedAgent.color}30, ${selectedAgent.color}60)`,
                    boxShadow: `0 0 20px ${selectedAgent.color}40`
                  }}
                >
                  {selectedAgent.avatar}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{selectedAgent.name}</h3>
                  <p style={{ color: selectedAgent.color }}>{selectedAgent.role}</p>
                </div>
              </div>
              <button onClick={() => setSelectedAgent(null)} className="text-gray-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <p className="text-gray-300 mb-6">{selectedAgent.description}</p>
            
            <div className="flex gap-3">
              <button 
                onClick={() => { setSelectedAgent(null); handleOpenModal(selectedAgent); }}
                className="flex-1 flex items-center justify-center gap-2 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Edit2 className="w-4 h-4" />
                编辑
              </button>
              <button 
                onClick={() => handleDelete(selectedAgent.id)}
                className="flex-1 flex items-center justify-center gap-2 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                <Trash2 className="w-4 h-4" />
                删除
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Add/Edit Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="bg-[#1a1a2e] rounded-xl p-6 border border-gray-800">
          <h3 className="text-xl font-bold text-white mb-6">
            {editingAgent ? '编辑 Agent' : '添加新 Agent'}
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-gray-400 text-sm mb-2">名字</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-4 py-2 bg-[#0f0f1a] border border-gray-700 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                placeholder="Agent 名称"
              />
            </div>
            
            <div>
              <label className="block text-gray-400 text-sm mb-2">职责</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value})}
                className="w-full px-4 py-2 bg-[#0f0f1a] border border-gray-700 rounded-lg text-white focus:border-purple-500 focus:outline-none"
              >
                <option value="">选择职责</option>
                {roleOptions.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-gray-400 text-sm mb-2">头像</label>
              <div className="flex flex-wrap gap-2">
                {avatarOptions.map(avatar => (
                  <button
                    key={avatar}
                    onClick={() => setFormData({...formData, avatar})}
                    className={`w-10 h-10 rounded-lg text-xl flex items-center justify-center transition-all ${
                      formData.avatar === avatar 
                        ? 'bg-purple-600 scale-110' 
                        : 'bg-[#0f0f1a] hover:bg-gray-800'
                    }`}
                  >
                    {avatar}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-gray-400 text-sm mb-2">代表色</label>
              <div className="flex flex-wrap gap-2">
                {colorOptions.map(color => (
                  <button
                    key={color}
                    onClick={() => setFormData({...formData, color})}
                    className={`w-8 h-8 rounded-lg transition-all ${
                      formData.color === color 
                        ? 'ring-2 ring-white ring-offset-2 ring-offset-[#1a1a2e] scale-110' 
                        : ''
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-gray-400 text-sm mb-2">描述</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full px-4 py-2 bg-[#0f0f1a] border border-gray-700 rounded-lg text-white focus:border-purple-500 focus:outline-none resize-none"
                rows={3}
                placeholder="描述这个 Agent 的职责和能力..."
              />
            </div>
            
            <div>
              <label className="block text-gray-400 text-sm mb-2">状态</label>
              <div className="flex gap-3">
                {(['online', 'working', 'offline'] as const).map(status => (
                  <button
                    key={status}
                    onClick={() => setFormData({...formData, status})}
                    className={`flex-1 py-2 rounded-lg transition-all ${
                      formData.status === status 
                        ? 'bg-purple-600 text-white' 
                        : 'bg-[#0f0f1a] text-gray-400 hover:bg-gray-800'
                    }`}
                  >
                    {status === 'online' ? '在线' : status === 'working' ? '工作中' : '离线'}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <div className="flex gap-3 mt-6">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="flex-1 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
            >
              取消
            </button>
            <button 
              onClick={handleSubmit}
              className="flex-1 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:opacity-90"
            >
              {editingAgent ? '保存' : '添加'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default AgentManager
