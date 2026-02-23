import React from 'react'

// 预定义的像素风格头像图案（预留）
// const pixelAvatars = [
//   { emoji: '🤖', pattern: 'robot' },
//   { emoji: '👾', pattern: 'alien' },
//   ...
// ]

interface PixelAvatarProps {
  emoji: string
  size?: 'sm' | 'md' | 'lg'
  color?: string
}

const sizes = {
  sm: 40,
  md: 64,
  lg: 96
}

export const PixelAvatar: React.FC<PixelAvatarProps> = ({ 
  emoji, 
  size = 'md',
  color = '#8b5cf6'
}) => {
  const pixelSize = sizes[size]
  
  return (
    <div 
      className="relative pixelated"
      style={{
        width: pixelSize,
        height: pixelSize,
      }}
    >
      {/* 像素边框效果 */}
      <div 
        className="absolute inset-0 rounded-lg"
        style={{
          background: `linear-gradient(135deg, ${color}30, ${color}60)`,
          boxShadow: `
            inset 0 0 0 2px ${color}80,
            0 0 15px ${color}40
          `,
        }}
      />
      
      {/* 像素网格效果 */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(${color} 1px, transparent 1px),
            linear-gradient(90deg, ${color} 1px, transparent 1px)
          `,
          backgroundSize: `${pixelSize / 8}px ${pixelSize / 8}px`,
        }}
      />
      
      {/* Emoji 内容 */}
      <div 
        className="absolute inset-0 flex items-center justify-center"
        style={{
          fontSize: pixelSize * 0.5,
          textShadow: `0 0 10px ${color}`
        }}
      >
        {emoji}
      </div>
      
      {/* 扫描线效果 */}
      <div 
        className="absolute inset-0 overflow-hidden rounded-lg pointer-events-none"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px)'
        }}
      />
    </div>
  )
}

// 随机生成像素风格的名字
export const generatePixelName = (): string => {
  const prefixes = ['Pixel', 'Neo', 'Cyber', 'Digital', 'Crypto', 'Meta', 'Hex', 'Bit', 'Code', 'Data']
  const suffixes = ['Master', 'Bot', 'Core', 'Wave', 'Flow', 'Byte', 'Nexus', 'Spark', 'Pulse', 'Logic']
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)]
  const suffix = suffixes[Math.floor(Math.random() * suffixes.length)]
  return `${prefix} ${suffix}`
}

export default PixelAvatar
