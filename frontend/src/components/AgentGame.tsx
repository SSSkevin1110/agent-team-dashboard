import React, { useState, useEffect } from 'react'
import { useAgentStore } from '../store/agentStore'
import { PixelAvatar } from './PixelAvatar'
import { Target, Play, Pause, RotateCcw } from 'lucide-react'

interface GameEntity {
  id: string
  x: number
  y: number
  type: 'agent' | 'bug'
  agentId?: string
  hp: number
  maxHp: number
  damage: number
  speed: number
}

interface Projectile {
  id: string
  x: number
  y: number
  targetX: number
  targetY: number
  damage: number
  color: string
  agentId: string
}

// 简单的 Agent 塔防游戏
export const AgentGame: React.FC = () => {
  const { agents } = useAgentStore()
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'paused' | 'gameover'>('idle')
  const [score, setScore] = useState(0)
  const [wave, setWave] = useState(1)
  const [entities, setEntities] = useState<GameEntity[]>([])
  const [projectiles, setProjectiles] = useState<Projectile[]>([])
  const [money, setMoney] = useState(100)
  const [selectedAgents, setSelectedAgents] = useState<string[]>([])
  
  // 游戏循环
  useEffect(() => {
    if (gameState !== 'playing') return
    
    const interval = setInterval(() => {
      // 生成敌人
      if (Math.random() < 0.02 * wave) {
        const newBug: GameEntity = {
          id: `bug-${Date.now()}`,
          x: Math.random() * 360 + 20,
          y: 520,
          type: 'bug',
          hp: 20 + wave * 10,
          maxHp: 20 + wave * 10,
          damage: 5 + wave * 2,
          speed: 0.5 + wave * 0.1
        }
        setEntities(prev => [...prev, newBug])
      }
      
      // 移动敌人
      setEntities(prev => prev.map(e => {
        if (e.type === 'bug') {
          return { ...e, y: e.y - e.speed }
        }
        return e
      }).filter(e => {
        // 检查敌人是否到达底部
        if (e.type === 'bug' && e.y < 0) {
          setGameState('gameover')
          return false
        }
        return true
      }))
      
      // 敌人攻击
      entities.forEach(entity => {
        if (entity.type === 'bug') {
          // 找到最近的 Agent
          const agents = entities.filter(e => e.type === 'agent')
          if (agents.length > 0) {
            const nearest = agents.reduce((nearest, agent) => {
              const dist = Math.abs(agent.x - entity.x) + Math.abs(agent.y - entity.y)
              const nearestDist = Math.abs(nearest.x - entity.x) + Math.abs(nearest.y - entity.y)
              return dist < nearestDist ? agent : nearest
            })
            
            if (Math.abs(nearest.x - entity.x) + Math.abs(nearest.y - entity.y) < 50) {
              // 攻击 Agent
              setEntities(prev => prev.map(a => {
                if (a.id === nearest.id) {
                  return { ...a, hp: a.hp - entity.damage }
                }
                return a
              }).filter(a => a.hp > 0))
            }
          }
        }
      })
      
      // 移除死亡的实体
      setEntities(prev => prev.filter(e => e.hp > 0))
      
      // 移动子弹
      setProjectiles(prev => prev.map(p => {
        const dx = p.targetX - p.x
        const dy = p.targetY - p.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 10) return null
        
        return {
          ...p,
          x: p.x + (dx / dist) * 8,
          y: p.y + (dy / dist) * 8
        }
      }).filter(Boolean) as Projectile[])
      
      // 子弹击中检测
      setProjectiles(prev => {
        const hitIds: string[] = []
        const hitBugIds: string[] = []
        
        prev.forEach(p => {
          entities.forEach(e => {
            if (e.type === 'bug') {
              const dist = Math.sqrt((e.x - p.x) ** 2 + (e.y - p.y) ** 2)
              if (dist < 20) {
                hitIds.push(p.id)
                hitBugIds.push(e.id)
                setScore(s => s + 10)
                setMoney(m => m + 5)
              }
            }
          })
        })
        
        // 扣血
        if (hitBugIds.length > 0) {
          const projectile = prev.find(p => p.id === hitBugIds[0])
          const damage = projectile?.damage || 0
          setEntities(prev => prev.map(e => {
            if (hitBugIds.includes(e.id)) {
              return { ...e, hp: e.hp - damage }
            }
            return e
          }))
        }
        
        return prev.filter(p => !hitIds.includes(p.id))
      })
      
    }, 50)
    
    return () => clearInterval(interval)
  }, [gameState, wave, entities])
  
  const startGame = () => {
    // 放置选中的 Agent
    const gameAgents: GameEntity[] = selectedAgents.map((id, index) => {
      return {
        id: `game-${id}`,
        x: 60 + index * 100,
        y: 80,
        type: 'agent',
        agentId: id,
        hp: 100,
        maxHp: 100,
        damage: 10,
        speed: 0
      }
    })
    
    setEntities(gameAgents)
    setProjectiles([])
    setScore(0)
    setWave(1)
    setMoney(100)
    setGameState('playing')
  }
  
  const shoot = (agentId: string) => {
    if (gameState !== 'playing') return
    
    const agent = entities.find(e => e.agentId === agentId)
    if (!agent) return
    
    // 找到最近的敌人
    const bugs = entities.filter(e => e.type === 'bug')
    if (bugs.length === 0) return
    
    const target = bugs.reduce((nearest, bug) => {
      const dist = Math.sqrt((bug.x - agent.x) ** 2 + (bug.y - agent.y) ** 2)
      const nearestDist = Math.sqrt((nearest.x - agent.x) ** 2 + (nearest.y - agent.y) ** 2)
      return dist < nearestDist ? bug : nearest
    })
    
    const agentData = agents.find(a => a.id === agentId)
    
    const projectile: Projectile = {
      id: `proj-${Date.now()}`,
      x: agent.x,
      y: agent.y,
      targetX: target.x,
      targetY: target.y,
      damage: 10,
      color: agentData?.color || '#8b5cf6',
      agentId
    }
    
    setProjectiles(prev => [...prev, projectile])
  }
  
  const toggleAgentSelection = (agentId: string) => {
    setSelectedAgents(prev => 
      prev.includes(agentId) 
        ? prev.filter(id => id !== agentId)
        : [...prev, agentId]
    )
  }
  
  // 渲染游戏区域
  const renderGame = () => (
    <div 
      className="relative bg-[#0f0f1a] rounded-xl overflow-hidden"
      style={{ width: 400, height: 560 }}
    >
      {/* 游戏区域背景 */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(#8b5cf6 1px, transparent 1px),
            linear-gradient(90deg, #8b5cf6 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px'
        }}
      />
      
      {/* 实体 */}
      {entities.map(entity => (
        <div
          key={entity.id}
          className="absolute transform -translate-x-1/2 -translate-y-1/2"
          style={{ left: entity.x, top: entity.y }}
        >
          {entity.type === 'agent' ? (
            <div 
              className="cursor-pointer transition-transform hover:scale-110"
              onClick={() => shoot(entity.agentId!)}
            >
              <PixelAvatar 
                emoji={agents.find(a => a.id === entity.agentId)?.avatar || '🤖'} 
                size="md"
                color={agents.find(a => a.id === entity.agentId)?.color}
              />
              {/* 血条 */}
              <div className="absolute -bottom-1 left-0 right-0 h-1 bg-gray-700 rounded">
                <div 
                  className="h-full bg-green-500 rounded"
                  style={{ width: `${(entity.hp / entity.maxHp) * 100}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="text-3xl">🐛</div>
          )}
        </div>
      ))}
      
      {/* 子弹 */}
      {projectiles.map(p => (
        <div
          key={p.id}
          className="absolute w-3 h-3 rounded-full"
          style={{
            left: p.x,
            top: p.y,
            backgroundColor: p.color,
            boxShadow: `0 0 10px ${p.color}`,
            transform: 'translate(-50%, -50%)'
          }}
        />
      ))}
      
      {/* 游戏状态 */}
      {gameState === 'gameover' && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
          <div className="text-center">
            <p className="text-4xl mb-4">💀</p>
            <p className="text-white text-xl font-bold">游戏结束</p>
            <p className="text-gray-400">得分: {score}</p>
          </div>
        </div>
      )}
      
      {/* 底部状态栏 */}
      <div className="absolute bottom-0 left-0 right-0 bg-[#1a1a2e] p-3 flex justify-between items-center">
        <div className="text-green-400 font-bold">💰 {money}</div>
        <div className="text-purple-400 font-bold">波次: {wave}</div>
        <div className="text-yellow-400 font-bold">⭐ {score}</div>
      </div>
    </div>
  )
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
          <span className="text-2xl">🎮</span>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Agent 塔防</h2>
          <p className="text-gray-400 text-sm">选择 Agent 参与游戏</p>
        </div>
      </div>
      
      {/* Agent 选择 */}
      <div className="bg-[#1a1a2e] rounded-xl p-4 border border-gray-800">
        <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
          <Target className="w-4 h-4 text-purple-400" />
          选择参战 Agent
        </h3>
        <div className="grid grid-cols-4 gap-2">
          {agents.map(agent => (
            <div
              key={agent.id}
              onClick={() => toggleAgentSelection(agent.id)}
              className={`cursor-pointer rounded-lg p-2 transition-all ${
                selectedAgents.includes(agent.id)
                  ? 'bg-purple-600/30 border-2 border-purple-500'
                  : 'bg-[#0f0f1a] border-2 border-transparent hover:border-gray-700'
              }`}
            >
              <PixelAvatar emoji={agent.avatar} size="sm" color={agent.color} />
              <p className="text-white text-xs text-center mt-1 truncate">{agent.name}</p>
            </div>
          ))}
        </div>
      </div>
      
      {/* 游戏控制 */}
      <div className="flex justify-center gap-4">
        {gameState === 'idle' && (
          <button
            onClick={startGame}
            disabled={selectedAgents.length === 0}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Play className="w-5 h-5" />
            开始游戏
          </button>
        )}
        
        {gameState === 'playing' && (
          <button
            onClick={() => setGameState('paused')}
            className="flex items-center gap-2 px-6 py-3 bg-yellow-500 text-white rounded-xl font-bold"
          >
            <Pause className="w-5 h-5" />
            暂停
          </button>
        )}
        
        {gameState === 'paused' && (
          <button
            onClick={() => setGameState('playing')}
            className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-xl font-bold"
          >
            <Play className="w-5 h-5" />
            继续
          </button>
        )}
        
        {(gameState === 'paused' || gameState === 'gameover') && (
          <button
            onClick={() => setGameState('idle')}
            className="flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-xl font-bold"
          >
            <RotateCcw className="w-5 h-5" />
            重新开始
          </button>
        )}
      </div>
      
      {/* 游戏区域 */}
      <div className="flex justify-center">
        {renderGame()}
      </div>
      
      {/* 说明 */}
      <div className="bg-[#1a1a2e] rounded-xl p-4 border border-gray-800">
        <h4 className="text-white font-semibold mb-2">🎯 游戏说明</h4>
        <ul className="text-gray-400 text-sm space-y-1">
          <li>• 选择 1-4 个 Agent 参与游戏</li>
          <li>• 点击 Agent 可以发射攻击</li>
          <li>• 阻止 Bug 到达底部</li>
          <li>• 击杀 Bug 获得金币和分数</li>
          <li>• 波次越高，敌人越强</li>
        </ul>
      </div>
    </div>
  )
}

export default AgentGame
