import React, { useState } from 'react'
import { useAgentStore, type Paper } from '../store/agentStore'
import { 
  FileText, Link, Upload, Loader2, Trash2, Download, 
  CheckCircle, Clock, AlertCircle, Brain, Eye, Star, BookOpen,
  ArrowRight, Search, X
} from 'lucide-react'

// 模拟 AI 分析函数
const analyzePaper = async (): Promise<Paper['analysis']> => {
  // 模拟 API 调用延迟
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  return {
    researchGoal: '探索大规模语言模型在特定任务上的性能表现，研究如何通过提示工程提升模型效果。',
    methodology: '采用对比实验方法，在多个基准数据集上测试不同提示策略的效果，包括零样本、少样本和思维链提示。',
    contributions: [
      '提出了一种新的提示工程框架',
      '系统性地评估了不同提示策略的效果',
      '发现了模型规模与提示效果的非线性关系'
    ],
    results: '实验表明，思维链提示在数学推理任务上提升 15%，少样本学习在分类任务上提升 8%。',
    pros: [
      '实验设计严谨，样本量充足',
      '提供了详细的消融实验',
      '代码开源可复现'
    ],
    cons: [
      '仅测试了英文任务',
      '未考虑推理效率',
      '部分边界情况未覆盖'
    ],
    scores: {
      innovation: 7,
      completeness: 8,
      practicality: 9
    }
  }
}

export const PaperAnalyzer: React.FC = () => {
  const { papers, addPaper, updatePaper } = useAgentStore()
  const [inputMode, setInputMode] = useState<'url' | 'pdf'>('url')
  const [inputValue, setInputValue] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [selectedPaper, setSelectedPaper] = useState<Paper | null>(null)
  
  // 提交论文进行分析
  const handleSubmit = async () => {
    if (!inputValue.trim()) return
    
    const newPaper: Omit<Paper, 'id' | 'createdAt' | 'status'> = {
      title: inputValue.includes('arxiv') ? 'arXiv 论文' : '论文分析',
      authors: [],
      abstract: '',
      url: inputValue.startsWith('http') ? inputValue : undefined,
      keywords: [],
      analysis: undefined
    }
    
    addPaper(newPaper)
    setInputValue('')
    
    // 开始分析
    setIsAnalyzing(true)
    const paperId = papers.length.toString()
    
    try {
      // 模拟分析过程
      const result = await analyzePaper()
      updatePaper(paperId, { 
        status: 'completed', 
        analysis: result,
        title: '大型语言模型的提示工程研究'
      })
    } catch (error) {
      console.error(error)
    } finally {
      setIsAnalyzing(false)
    }
  }
  
  // 模拟论文数据（如果没有真实论文）
  const demoPapers: Paper[] = papers.length > 0 ? papers : [
    {
      id: 'demo1',
      title: 'Attention Is All You Need',
      authors: ['Ashish Vaswani', 'Noam Shazeer', 'Niki Parmar', ' Jakob Uszkoreit'],
      abstract: 'The dominant sequence transduction models are based on complex recurrent or convolutional neural networks that include an encoder and a decoder. The best performing models also connect the encoder and the decoder through an attention mechanism.',
      url: 'https://arxiv.org/abs/1706.03762',
      publishedDate: '2017-06-12',
      keywords: ['transformer', 'attention', 'NLP'],
      status: 'completed',
      createdAt: Date.now() - 86400000,
      analysis: {
        researchGoal: '提出一种全新的序列转换架构，完全基于注意力机制，摒弃循环和卷积结构。',
        methodology: '采用 Transformer 架构，使用多头自注意力机制和位置编码，通过大规模预训练完成各种 NLP 任务。',
        contributions: [
          'Transformer 架构的发明',
          '多头注意力机制',
          '位置编码方法',
          '大规模预训练范式'
        ],
        results: '在 WMT 2014 英德翻译任务上达到 28.4 BLEU，超过了之前最佳结果。',
        pros: [
          '并行计算效率高',
          '可捕获长距离依赖',
          '架构简洁优雅',
          '迁移学习效果好'
        ],
        cons: [
          '内存占用随序列长度平方增长',
          '位置编码可能不够灵活',
          '训练成本高'
        ],
        scores: {
          innovation: 10,
          completeness: 9,
          practicality: 10
        }
      }
    }
  ]
  
  const statusConfig = {
    pending: { label: '待分析', icon: Clock, color: 'text-gray-400', bg: 'bg-gray-500' },
    analyzing: { label: '分析中', icon: Loader2, color: 'text-yellow-400', bg: 'bg-yellow-500' },
    completed: { label: '已完成', icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-500' }
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
          <BookOpen className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">论文分析</h2>
          <p className="text-gray-400 text-sm">AI 驱动的学术论文分析工具</p>
        </div>
      </div>
      
      {/* 输入区域 */}
      <div className="bg-[#1a1a2e] rounded-xl p-5 border border-gray-800">
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setInputMode('url')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              inputMode === 'url' 
                ? 'bg-blue-600 text-white' 
                : 'bg-[#0f0f1a] text-gray-400 hover:bg-gray-800'
            }`}
          >
            <Link className="w-4 h-4" />
            URL 链接
          </button>
          <button
            onClick={() => setInputMode('pdf')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              inputMode === 'pdf' 
                ? 'bg-blue-600 text-white' 
                : 'bg-[#0f0f1a] text-gray-400 hover:bg-gray-800'
            }`}
          >
            <Upload className="w-4 h-4" />
            PDF 文件
          </button>
        </div>
        
        {inputMode === 'url' ? (
          <div className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="输入论文 URL (arXiv, Google Scholar 等)..."
              className="flex-1 px-4 py-3 bg-[#0f0f1a] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            />
            <button
              onClick={handleSubmit}
              disabled={!inputValue.trim() || isAnalyzing}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isAnalyzing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
              分析
            </button>
          </div>
        ) : (
          <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center">
            <Upload className="w-12 h-12 mx-auto mb-4 text-gray-500" />
            <p className="text-gray-400 mb-2">拖拽 PDF 文件到此处或点击上传</p>
            <button className="px-4 py-2 bg-[#0f0f1a] text-gray-400 rounded-lg hover:bg-gray-800">
              选择文件
            </button>
          </div>
        )}
        
        {/* 支持的网站 */}
        <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
          <span>支持:</span>
          <span className="px-2 py-1 bg-[#0f0f1a] rounded">arXiv</span>
          <span className="px-2 py-1 bg-[#0f0f1a] rounded">Google Scholar</span>
          <span className="px-2 py-1 bg-[#0f0f1a] rounded">PDF</span>
        </div>
      </div>
      
      {/* 论文列表 */}
      <div className="grid md:grid-cols-2 gap-4">
        {demoPapers.map(paper => {
          const StatusIcon = statusConfig[paper.status].icon
          
          return (
            <div
              key={paper.id}
              onClick={() => setSelectedPaper(paper)}
              className="bg-[#1a1a2e] rounded-xl p-4 border border-gray-800 hover:border-blue-500 transition-all cursor-pointer"
            >
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-6 h-6 text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-semibold truncate">{paper.title}</h3>
                  <p className="text-gray-400 text-sm truncate">{paper.authors.slice(0, 2).join(', ')}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`flex items-center gap-1 text-xs ${statusConfig[paper.status].color}`}>
                      <StatusIcon className={`w-3 h-3 ${paper.status === 'analyzing' ? 'animate-spin' : ''}`} />
                      {statusConfig[paper.status].label}
                    </span>
                    {paper.publishedDate && (
                      <span className="text-xs text-gray-500">{paper.publishedDate}</span>
                    )}
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-500" />
              </div>
            </div>
          )
        })}
      </div>
      
      {/* 论文详情弹窗 */}
      {selectedPaper && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setSelectedPaper(null)} />
          <div className="relative w-full max-w-3xl max-h-[80vh] bg-[#1a1a2e] rounded-2xl border border-gray-800 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-800">
              <h3 className="text-xl font-bold text-white">论文分析结果</h3>
              <button onClick={() => setSelectedPaper(null)} className="text-gray-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(80vh-120px)]">
              {/* 基本信息 */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-400" />
                  基本信息
                </h4>
                <div className="bg-[#0f0f1a] rounded-lg p-4 space-y-2">
                  <p><span className="text-gray-400">标题:</span> <span className="text-white">{selectedPaper.title}</span></p>
                  <p><span className="text-gray-400">作者:</span> <span className="text-white">{selectedPaper.authors.join(', ')}</span></p>
                  {selectedPaper.publishedDate && (
                    <p><span className="text-gray-400">发表日期:</span> <span className="text-white">{selectedPaper.publishedDate}</span></p>
                  )}
                  {selectedPaper.url && (
                    <p><span className="text-gray-400">链接:</span> <a href={selectedPaper.url} className="text-blue-400 hover:underline">{selectedPaper.url}</a></p>
                  )}
                </div>
              </div>
              
              {/* 摘要 */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <Eye className="w-5 h-5 text-purple-400" />
                  摘要
                </h4>
                <p className="text-gray-300 bg-[#0f0f1a] rounded-lg p-4">
                  {selectedPaper.abstract || '暂无摘要'}
                </p>
              </div>
              
              {selectedPaper.analysis && (
                <>
                  {/* 研究目标 */}
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                      <Brain className="w-5 h-5 text-yellow-400" />
                      研究目标
                    </h4>
                    <p className="text-gray-300 bg-[#0f0f1a] rounded-lg p-4">
                      {selectedPaper.analysis.researchGoal}
                    </p>
                  </div>
                  
                  {/* 方法论 */}
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-green-400" />
                      方法论
                    </h4>
                    <p className="text-gray-300 bg-[#0f0f1a] rounded-lg p-4">
                      {selectedPaper.analysis.methodology}
                    </p>
                  </div>
                  
                  {/* 主要贡献 */}
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                      <Star className="w-5 h-5 text-orange-400" />
                      主要贡献
                    </h4>
                    <ul className="space-y-2">
                      {selectedPaper.analysis.contributions.map((c, i) => (
                        <li key={i} className="flex items-start gap-2 text-gray-300 bg-[#0f0f1a] rounded-lg p-3">
                          <span className="text-blue-400">•</span>
                          {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {/* 评分 */}
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                      <Star className="w-5 h-5 text-pink-400" />
                      评分
                    </h4>
                    <div className="grid grid-cols-3 gap-4">
                      {Object.entries(selectedPaper.analysis.scores).map(([key, value]) => (
                        <div key={key} className="bg-[#0f0f1a] rounded-lg p-4 text-center">
                          <p className="text-gray-400 text-sm mb-1">
                            {key === 'innovation' ? '创新性' : key === 'completeness' ? '完整性' : '实用性'}
                          </p>
                          <p className="text-3xl font-bold text-white">{value}</p>
                          <p className="text-gray-500 text-xs">/ 10</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* 优缺点 */}
                  <div className="grid md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-400" />
                        优点
                      </h4>
                      <ul className="space-y-2">
                        {selectedPaper.analysis.pros.map((pro, i) => (
                          <li key={i} className="flex items-start gap-2 text-gray-300 bg-[#0f0f1a] rounded-lg p-2">
                            <span className="text-green-400">✓</span>
                            {pro}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-red-400" />
                        缺点
                      </h4>
                      <ul className="space-y-2">
                        {selectedPaper.analysis.cons.map((con, i) => (
                          <li key={i} className="flex items-start gap-2 text-gray-300 bg-[#0f0f1a] rounded-lg p-2">
                            <span className="text-red-400">✗</span>
                            {con}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </>
              )}
            </div>
            
            {/* Footer */}
            <div className="flex justify-end gap-3 p-4 border-t border-gray-800">
              <button className="flex items-center gap-2 px-4 py-2 bg-[#0f0f1a] text-gray-400 rounded-lg hover:bg-gray-800">
                <Trash2 className="w-4 h-4" />
                删除
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg">
                <Download className="w-4 h-4" />
                导出报告
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PaperAnalyzer
