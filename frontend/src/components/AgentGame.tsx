import React, { useState, useEffect } from 'react'
import { useAgentStore } from '../store/agentStore'
import { PixelAvatar } from './PixelAvatar'
import { Target, Play, Pause, RotateCcw, Zap, Star, Award } from 'lucide-react'

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

interface FloatingText {
  id: string
  x: number
  y: number
  text: string
  color: string
  vy: number
}

// 增强版 Agent 塔防游戏
export const AgentGame: React.FC = () => {
  const { agents } = useAgentStore()
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'paused' | 'gameover'>('idle')
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem('agentGameHighScore') || '0')
  })
  const [wave, setWave] = useState(1)
  const [entities, setEntities] = useState<GameEntity[]>([])
  const [projectiles, setProjectiles] = useState<Projectile[]>([])
  const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([])
  const [money, setMoney] = useState(100)
  const [selectedAgents, setSelectedAgents] = useState<string[]>([])
  const [combo, setCombo] = useState(0)
  const [lastKillTime, setLastKillTime] = useState(0)
  
  // 保存最高分
  useEffect(() => {
    if (score > highScore) {
      setHighScore(score)
      localStorage.setItem('agentGameHighScore', score.toString())
    }
  }, [score, highScore])
  
  // 游戏循环
  useEffect(() => {
    if (gameState !== 'playing') return
    
    const interval = setInterval(() => {
      const now = Date.now()
      
      // 生成敌人
      if (Math.random() < 0.02 * (1 + wave * 0.15)) {
        const newBug: GameEntity = {
          id: `bug-${Date.now()}-${Math.random()}`,
          x: Math.random() * 340 + 30,
          y: 560,
          type: 'bug',
          hp: 15 + wave * 10,
          maxHp: 15 + wave * 10,
          damage: 3 + wave * 2,
          speed: 0.5 + wave * 0.1
        }
        setEntities(prev => [...prev, newBug])
      }
      
      // 移动实体
      setEntities(prev => prev.map(e => {
        if (e.type === 'bug') {
          return { ...e, y: e.y - e.speed }
        }
        return e
      }).filter(e => {
        if (e.type === 'bug' && e.y < -20) {
          if (e.hp > 0) {
            setGameState('gameover')
          }
          return false
        }
        return true
      }))
      
      // 敌人攻击 Agent
      const bugs = entities.filter(e => e.type === 'bug')
      const gameAgents = entities.filter(e => e.type === 'agent')
      
      bugs.forEach(bug => {
        gameAgents.forEach(agent => {
          const dist = Math.sqrt((agent.x - bug.x) ** 2 + (agent.y - bug.y) ** 2)
          if (dist < 40 && bug.hp > 0) {
            setEntities(prev => prev.map(a => {
              if (a.id === agent.id) {
                const newHp = a.hp - bug.damage
                return { ...a, hp: newHp }
              }
              return a
            }).filter(a => a.hp > 0))
            
            const floatText: FloatingText = {
              id: `dmg-${Date.now()}`,
              x: agent.x,
              y: agent.y - 30,
              text: `-${bug.damage}`,
              color: '#ef4444',
              vy: -1
            }
            setFloatingTexts(prev => [...prev, floatText])
          }
        })
      })
      
      // 移动子弹
      setProjectiles(prev => prev.map(p => {
        const dx = p.targetX - p.x
        const dy = p.targetY - p.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 10) return null
        
        return {
          ...p,
          x: p.x + (dx / dist) * 10,
          y: p.y + (dy / dist) * 10
        }
      }).filter(Boolean) as Projectile[])
      
      // 子弹击中检测
      setProjectiles(prev => {
        const hitIds: string[] = []
        const hitBugIds: string[] = []
        
        prev.forEach(p => {
          entities.forEach(e => {
            if (e.type === 'bug' && e.hp > 0) {
              const dist = Math.sqrt((e.x - p.x) ** 2 + (e.y - p.y) ** 2)
              if (dist < 18) {
                hitIds.push(p.id)
                hitBugIds.push(e.id)
                
                if (now - lastKillTime < 1500) {
                  setCombo(c => c + 1)
                } else {
                  setCombo(1)
                }
                setLastKillTime(now)
                
                const baseScore = 10
                const comboBonus = Math.min(combo * 2, 20)
                const waveBonus = wave * 2
                const totalScore = baseScore + comboBonus + waveBonus
                
                setScore(s => s + totalScore)
                setMoney(m => m + 3 + Math.floor(combo / 3))
                
                const floatText: FloatingText = {
                  id: `score-${Date.now()}`,
                  x: e.x,
                  y: e.y,
                  text: `+${totalScore}`,
                  color: combo > 3 ? '#fbbf24' : '#22c55e',
                  vy: -1.5
                }
                setFloatingTexts(prev => [...prev, floatText])
              }
            }
          })
        })
        
        if (hitBugIds.length > 0) {
          setEntities(prev => prev.map(e => {
            if (hitBugIds.includes(e.id)) {
              const proj = prev.find(p => hitIds.includes(p.id))
              const damage = proj?.damage || 10
              return { ...e, hp: e.hp - damage }
            }
            return e
          }))
        }
        
        return prev.filter(p => !hitIds.includes(p.id))
      })
      
      setFloatingTexts(prev => prev.map(t => ({
        ...t,
        y: t.y + t.vy
      })).filter(t => t.y > -30))
      
      setEntities(prev => prev.filter(e => e.hp > 0))
      
    }, 33)
    
    return () => clearInterval(interval)
  }, [gameState, wave, entities, combo, lastKillTime])
  
  useEffect(() => {
    if (gameState !== 'playing') return
    
    const waveInterval = setInterval(() => {
      setWave(w => w + 1)
    }, 30000)
    
    return () => clearInterval(waveInterval)
  }, [gameState])
  
  const startGame = () => {
    const gameAgents: GameEntity[] = selectedAgents.map((id, index) => {
      return {
        id: `game-${id}`,
        x: 60 + index * (340 / Math.max(selectedAgents.length, 1)),
        y: 60,
        type: 'agent' as const,
        agentId: id,
        hp: 100,
        maxHp: 100,
        damage: 12,
        speed: 0
      }
    })
    
    setEntities(gameAgents)
    setProjectiles([])
    setFloatingTexts([])
    setScore(0)
    setWave(1)
    setMoney(100)
    setCombo(0)
    setGameState('playing')
  }
  
  const shoot = (agentId: string) => {
    if (gameState !== 'playing') return
    
    const agent = entities.find(e => e.agentId === agentId)
    if (!agent) return
    
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
    if (gameState !== 'idle') return
    setSelectedAgents(prev => 
      prev.includes(agentId) 
        ? prev.filter(id => id !== agentId)
        : prev.length < 4 ? [...prev, agentId] : prev
    )
  }
  
  const renderGame = () => (
    <div 
      className="relative bg-[#0f0f1a] rounded-xl overflow-hidden"
      style={{ width: 400, height: 600 }}
    >
      <div 
        className="absolute inset-0 opacity-15"
        style={{
          backgroundImage: `
            linear-gradient(#8b5cf6 1px, transparent 1px),
            linear-gradient(90deg, #8b5cf6 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px'
        }}
      />
      
      {Array.from({ length: 30 }).map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            opacity: Math.random() * 0.5 + 0.3,
            animationDelay: `${Math.random() * 2}s`
          }}
        />
      ))}
      
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
              <div className="absolute -bottom-1 left-0 right-0 h-1.5 bg-gray-700 rounded">
                <div 
                  className="h-full bg-green-500 rounded transition-all"
                  style={{ width: `${(entity.hp / entity.maxHp) * 100}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="text-3xl filter drop-shadow-lg">🐛</div>
          )}
        </div>
      ))}
      
      {projectiles.map(p => (
        <div
          key={p.id}
          className="absolute w-3 h-3 rounded-full"
          style={{
            left: p.x,
            top: p.y,
            backgroundColor: p.color,
            boxShadow: `0 0 12px ${p.color}, 0 0 4px ${p.color}`,
            transform: 'translate(-50%, -50%)'
          }}
        />
      ))}
      
      {floatingTexts.map(t => (
        <div
          key={t.id}
          className="absolute font-bold text-sm pointer-events-none"
          style={{
            left: t.x,
            top: t.y,
            color: t.color,
            textShadow: `0 0 10px ${t.color}`
          }}
        >
          {t.text}
        </div>
      ))}
      
      {gameState === 'gameover' && (
        <div className="absolute inset-0 bg-black/85 flex items-center justify-center">
          <div className="text-center">
            <p className="text-5xl mb-4">💀</p>
            <p className="text-white text-2xl font-bold mb-2">游戏结束</p>
            <p className="text-gray-400 mb-1">得分: <span className="text-yellow-400">{score}</span></p>
            <p className="text-gray-500 text-sm">最高分: {highScore}</p>
            {score >= highScore && score > 0 && (
              <p className="text-yellow-400 mt-2">🎉 新纪录!</p>
            )}
          </div>
        </div>
      )}
      
      {gameState === 'paused' && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <div className="text-center">
            <p className="text-4xl mb-4">⏸️</p>
            <p className="text-white text-xl font-bold">暂停中</p>
          </div>
        </div>
      )}
      
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#1a1a2e] to-transparent p-3 pt-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1 text-green-400 font-bold">
            <Star className="w-4 h-4" /> {money}
          </div>
          <div className="flex items-center gap-1 text-purple-400 font-bold">
            <Target className="w-4 h-4" /> 波次 {wave}
          </div>
          <div className="flex items-center gap-1 text-yellow-400 font-bold">
            <Zap className="w-4 h-4" /> {score}
          </div>
          {combo > 2 && (
            <div className="flex items-center gap-1 text-orange-400 font-bold animate-pulse">
              <Award className="w-4 h-4" /> x{combo}
            </div>
          )}
        </div>
      </div>
    </div>
  )
  
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
          <span className="text-2xl">🎮</span>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Agent 塔防</h2>
          <p className="text-gray-400 text-sm">最高分: {highScore}</p>
        </div>
      </div>
      
      <div className="bg-[#1a1a2e] rounded-xl p-4 border border-gray-800">
        <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
          <Target className="w-4 h-4 text-purple-400" />
          选择参战 Agent (最多4个)
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
              } ${gameState !== 'idle' ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <PixelAvatar emoji={agent.avatar} size="sm" color={agent.color} />
              <p className="text-white text-xs text-center mt-1 truncate">{agent.name}</p>
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex justify-center gap-3">
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
            onClick={() => { setGameState('idle'); setSelectedAgents([]); }}
            className="flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-xl font-bold"
          >
            <RotateCcw className="w-5 h-5" />
            重新选择
          </button>
        )}
      </div>
      
      <div className="flex justify-center">
        {renderGame()}
      </div>
      
      <div className="bg-[#1a1a2e] rounded-xl p-4 border border-gray-800">
        <h4 className="text-white font-semibold mb-2">🎯 游戏说明</h4>
        <ul className="text-gray-400 text-sm space-y-1">
          <li>• 选择 1-4 个 Agent 参与游戏</li>
          <li>• 点击 Agent 发射攻击</li>
          <li>• 阻止 Bug 到达底部</li>
          <li>• 连续击杀获得连击加分</li>
          <li>• 波次越高，敌人越强</li>
        </ul>
      </div>
    </div>
  )
}

export default AgentGame
