import React, { useState } from 'react'
import { useAgentStore, type Task } from '../store/agentStore'
import { Plus, Clock, CheckCircle, AlertTriangle, MoreVertical } from 'lucide-react'

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

const priorityColors = {
  low: 'text-gray-400 bg-gray-800',
  medium: 'text-yellow-400 bg-yellow-400/20',
  high: 'text-red-400 bg-red-400/20'
}

const statusConfig = {
  pending: { label: '待处理', icon: <Clock className="w-4 h-4" />, color: 'text-gray-400' },
  in_progress: { label: '进行中', icon: <AlertTriangle className="w-4 h-4" />, color: 'text-yellow-400' },
  completed: { label: '已完成', icon: <CheckCircle className="w-4 h-4" />, color: 'text-green-400' }
}

export const TaskPanel: React.FC = () => {
  const { tasks, agents, addTask, updateTask, deleteTask } = useAgentStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignedTo: [] as string[],
    priority: 'medium' as Task['priority'],
    status: 'pending' as Task['status']
  })

  const handleOpenModal = (task?: Task) => {
    if (task) {
      setEditingTask(task)
      setFormData({
        title: task.title,
        description: task.description,
        assignedTo: task.assignedTo,
        priority: task.priority,
        status: task.status
      })
    } else {
      setEditingTask(null)
      setFormData({
        title: '',
        description: '',
        assignedTo: [],
        priority: 'medium',
        status: 'pending'
      })
    }
    setIsModalOpen(true)
  }

  const handleSubmit = () => {
    if (editingTask) {
      updateTask(editingTask.id, formData)
    } else {
      addTask(formData)
    }
    setIsModalOpen(false)
  }

  const toggleAgent = (agentId: string) => {
    const newAssigned = formData.assignedTo.includes(agentId)
      ? formData.assignedTo.filter(id => id !== agentId)
      : [...formData.assignedTo, agentId]
    setFormData({ ...formData, assignedTo: newAssigned })
  }

  const getAgentById = (id: string) => agents.find(a => a.id === id)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
            <CheckCircle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">任务面板</h2>
            <p className="text-gray-400 text-sm">分配和追踪任务</p>
          </div>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:opacity-90 transition-opacity"
        >
          <Plus className="w-5 h-5" />
          添加任务
        </button>
      </div>
      
      {/* Task List */}
      <div className="space-y-3">
        {tasks.map((task) => (
          <div 
            key={task.id}
            className="bg-[#1a1a2e] rounded-xl p-4 border border-gray-800 hover:border-gray-700 transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-white">{task.title}</h3>
                  <span className={`px-2 py-0.5 rounded text-xs ${priorityColors[task.priority]}`}>
                    {task.priority === 'high' ? '高' : task.priority === 'medium' ? '中' : '低'}
                  </span>
                </div>
                <p className="text-gray-400 text-sm">{task.description}</p>
              </div>
              <div className={`flex items-center gap-1 ${statusConfig[task.status].color}`}>
                {statusConfig[task.status].icon}
                <span className="text-xs">{statusConfig[task.status].label}</span>
              </div>
            </div>
            
            {/* Assigned Agents */}
            <div className="flex items-center justify-between">
              <div className="flex -space-x-2">
                {task.assignedTo.map(agentId => {
                  const agent = getAgentById(agentId)
                  if (!agent) return null
                  return (
                    <div
                      key={agentId}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-lg border-2 border-[#1a1a2e]"
                      style={{ backgroundColor: agent.color + '40' }}
                      title={agent.name}
                    >
                      {agent.avatar}
                    </div>
                  )
                })}
                {task.assignedTo.length === 0 && (
                  <span className="text-gray-500 text-sm">未分配</span>
                )}
              </div>
              <button 
                onClick={() => handleOpenModal(task)}
                className="text-gray-400 hover:text-white p-1"
              >
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
        
        {tasks.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <CheckCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>暂无任务</p>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="bg-[#1a1a2e] rounded-xl p-6 border border-gray-800 max-h-[80vh] overflow-y-auto">
          <h3 className="text-xl font-bold text-white mb-6">
            {editingTask ? '编辑任务' : '添加新任务'}
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-gray-400 text-sm mb-2">任务标题</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full px-4 py-2 bg-[#0f0f1a] border border-gray-700 rounded-lg text-white focus:border-green-500 focus:outline-none"
                placeholder="任务名称"
              />
            </div>
            
            <div>
              <label className="block text-gray-400 text-sm mb-2">描述</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full px-4 py-2 bg-[#0f0f1a] border border-gray-700 rounded-lg text-white focus:border-green-500 focus:outline-none resize-none"
                rows={3}
                placeholder="任务描述..."
              />
            </div>
            
            <div>
              <label className="block text-gray-400 text-sm mb-2">分配给</label>
              <div className="flex flex-wrap gap-2">
                {agents.map(agent => (
                  <button
                    key={agent.id}
                    onClick={() => toggleAgent(agent.id)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all ${
                      formData.assignedTo.includes(agent.id)
                        ? 'ring-2 ring-offset-2 ring-offset-[#1a1a2e]'
                        : 'bg-[#0f0f1a] hover:bg-gray-800'
                    }`}
                    style={{ 
                      backgroundColor: formData.assignedTo.includes(agent.id) ? agent.color + '30' : undefined
                    }}
                  >
                    <span>{agent.avatar}</span>
                    <span className="text-sm text-white">{agent.name}</span>
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-gray-400 text-sm mb-2">优先级</label>
              <div className="flex gap-3">
                {(['low', 'medium', 'high'] as const).map(priority => (
                  <button
                    key={priority}
                    onClick={() => setFormData({...formData, priority})}
                    className={`flex-1 py-2 rounded-lg transition-all ${
                      formData.priority === priority 
                        ? priorityColors[priority]
                        : 'bg-[#0f0f1a] text-gray-400 hover:bg-gray-800'
                    }`}
                  >
                    {priority === 'high' ? '高' : priority === 'medium' ? '中' : '低'}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-gray-400 text-sm mb-2">状态</label>
              <div className="flex gap-3">
                {(['pending', 'in_progress', 'completed'] as const).map(status => (
                  <button
                    key={status}
                    onClick={() => setFormData({...formData, status})}
                    className={`flex-1 py-2 rounded-lg transition-all ${
                      formData.status === status 
                        ? 'bg-green-600 text-white' 
                        : 'bg-[#0f0f1a] text-gray-400 hover:bg-gray-800'
                    }`}
                  >
                    {statusConfig[status].label}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <div className="flex gap-3 mt-6">
            {editingTask && (
              <button 
                onClick={() => { deleteTask(editingTask.id); setIsModalOpen(false); }}
                className="py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                删除
              </button>
            )}
            <button 
              onClick={() => setIsModalOpen(false)}
              className="flex-1 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
            >
              取消
            </button>
            <button 
              onClick={handleSubmit}
              className="flex-1 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:opacity-90"
            >
              {editingTask ? '保存' : '添加'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default TaskPanel
