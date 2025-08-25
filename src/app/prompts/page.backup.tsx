"use client";
import { useState } from 'react';
import Link from 'next/link';

// 定义提示词类型
interface Prompt {
  id: number;
  title: string;
  description: string;
  category: string;
  tags: string[];
  content: string;
  author: string;
  likes: number;
  downloads: number;
  created_at: string;
  updated_at: string;
}

export default function PromptsPage() {
  const [activeCategory, setActiveCategory] = useState('全部');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('最新');
  
  // 模拟提示词数据
  const prompts: Prompt[] = [
    {
      id: 1,
      title: "高效代码审查助手",
      description: "帮助开发者进行代码审查，提供改进建议和最佳实践指导",
      category: "开发工具",
      tags: ["代码审查", "最佳实践", "重构建议"],
      content: "你是一位经验丰富的高级软件工程师，专注于代码审查。请审查以下代码，并提供：\n1. 潜在的bug和逻辑错误\n2. 性能优化建议\n3. 代码可读性和可维护性改进\n4. 安全隐患\n5. 符合行业最佳实践的重构建议\n\n请保持专业、具体且建设性，并说明每个建议的理由。",
      author: "CodeMaster",
      likes: 245,
      downloads: 1289,
      created_at: "2025-07-15",
      updated_at: "2025-08-01"
    },
    {
      id: 2,
      title: "产品需求文档生成器",
      description: "根据简单描述生成详细的产品需求文档，包括用户故事、功能规格和验收标准",
      category: "产品管理",
      tags: ["PRD", "需求分析", "用户故事"],
      content: "作为一名经验丰富的产品经理，请根据以下产品概念创建一份详细的产品需求文档(PRD)：\n\n[在此处插入产品概念]\n\n请包含以下部分：\n1. 产品概述和目标\n2. 用户角色和用例\n3. 详细功能需求和规格\n4. 用户界面要求和线框图描述\n5. 非功能性需求(性能、安全、可扩展性)\n6. 验收标准\n7. 开发里程碑和优先级\n\n对于每个功能，请使用用户故事格式(作为[角色]，我想要[功能]，以便[好处])，并添加详细的验收标准。",
      author: "ProductGuru",
      likes: 189,
      downloads: 876,
      created_at: "2025-08-05",
      updated_at: "2025-08-05"
    },
    {
      id: 3,
      title: "技术博客文章生成器",
      description: "帮助开发者创建高质量的技术博客文章，包括代码示例和最佳实践",
      category: "内容创作",
      tags: ["技术写作", "博客", "教程"],
      content: "你是一位专业的技术内容创作者，精通软件开发和技术写作。请根据以下主题创建一篇高质量的技术博客文章：\n\n[在此处插入技术主题]\n\n请包含以下内容：\n1. 引人入胜的标题和简介，解释为什么这个主题很重要\n2. 主题的背景和上下文\n3. 核心概念的清晰解释\n4. 实用的代码示例(带有详细注释)\n5. 最佳实践和常见陷阱\n6. 性能考虑和优化技巧\n7. 实际应用场景和用例\n8. 总结和进一步学习资源\n\n文章应该既适合初学者理解，又能为有经验的开发者提供价值。使用清晰的标题、小标题和列表来组织内容，确保代码示例准确且遵循最佳实践。",
      author: "TechBlogger",
      likes: 312,
      downloads: 1567,
      created_at: "2025-07-28",
      updated_at: "2025-08-10"
    },
    {
      id: 4,
      title: "AI产品创意生成器",
      description: "基于现有技术趋势和市场需求，生成创新的AI产品创意和商业模式",
      category: "创新思维",
      tags: ["AI创新", "产品创意", "商业模式"],
      content: "作为一位AI产品战略专家，请根据以下行业或问题领域，生成3-5个创新的AI产品创意：\n\n[在此处插入行业/问题领域]\n\n对于每个创意，请提供：\n1. 产品名称和简洁的一句话描述\n2. 目标用户和核心痛点\n3. 关键AI技术和实现方式\n4. 独特价值主张\n5. 潜在商业模式\n6. 市场机会和竞争分析\n7. 实施挑战和解决方案\n8. 成功指标\n\n创意应该既有技术可行性，又有商业潜力，并能解决真实的用户问题。请确保创意具有创新性，而不仅仅是现有解决方案的简单变体。",
      author: "InnovationMind",
      likes: 278,
      downloads: 943,
      created_at: "2025-08-12",
      updated_at: "2025-08-15"
    },
    {
      id: 5,
      title: "数据分析报告生成器",
      description: "将原始数据转化为结构化的数据分析报告，包括见解和可视化描述",
      category: "数据分析",
      tags: ["数据报告", "数据分析", "商业智能"],
      content: "作为一名专业的数据分析师，请根据以下数据集创建一份全面的数据分析报告：\n\n[在此处描述数据集或插入数据]\n\n请包含以下部分：\n1. 执行摘要，突出显示关键发现和建议\n2. 数据概述(来源、结构、质量评估)\n3. 探索性数据分析结果\n   - 描述性统计\n   - 分布分析\n   - 相关性和模式\n4. 深入分析和见解\n   - 关键趋势和异常\n   - 细分分析\n   - 假设检验结果(如适用)\n5. 数据可视化描述(图表类型和展示内容)\n6. 业务影响和建议\n7. 方法论和限制\n\n请使用清晰、专业的语言，避免过度技术性术语，并确保见解具有可操作性和业务相关性。",
      author: "DataWizard",
      likes: 156,
      downloads: 723,
      created_at: "2025-07-20",
      updated_at: "2025-08-08"
    },
    {
      id: 6,
      title: "用户研究访谈指南",
      description: "生成结构化的用户研究访谈问题和指南，帮助产品团队获取有价值的用户洞察",
      category: "用户研究",
      tags: ["用户访谈", "用户体验", "产品研究"],
      content: "作为一名经验丰富的用户研究员，请为以下产品/功能创建一份详细的用户研究访谈指南：\n\n[在此处插入产品/功能描述]\n\n请包含以下部分：\n1. 研究目标和关键问题\n2. 目标受访者标准和招募建议\n3. 访谈介绍脚本(包括知情同意和保密说明)\n4. 热身问题(3-5个)\n5. 主要研究问题，分为以下几个部分：\n   - 当前行为和痛点(5-7个问题)\n   - 产品/功能相关体验(7-10个问题)\n   - 需求和期望(5-7个问题)\n   - 反应测试问题(如适用)\n6. 总结问题(2-3个)\n7. 后续步骤说明\n8. 访谈技巧和提示\n\n问题应该是开放式的，避免引导性问题，并包括适当的跟进提示。整个访谈应设计为45-60分钟完成。",
      author: "UXResearcher",
      likes: 134,
      downloads: 612,
      created_at: "2025-08-03",
      updated_at: "2025-08-14"
    }
  ];

  // 过滤和排序提示词
  const filteredPrompts = prompts
    .filter(prompt => 
      (activeCategory === '全部' || prompt.category === activeCategory) &&
      (searchQuery === '' || 
        prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prompt.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prompt.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    )
    .sort((a, b) => {
      if (sortBy === '最新') {
        return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
      } else if (sortBy === '最热') {
        return b.downloads - a.downloads;
      }
      return 0;
    });

  // 所有类别
  const categories = ['全部', '开发工具', '产品管理', '内容创作', '创新思维', '数据分析', '用户研究'];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* 顶部导航 */}
      <nav className="flex items-center justify-between p-6 border-b border-gray-800">
        <div className="flex items-center space-x-8">
          <Link href="/" className="text-xl font-bold">
            AI社群日报平台
          </Link>
          <Link href="/reports" className="text-gray-300 hover:text-white transition-colors">
            社群日报
          </Link>
          <Link href="/tools" className="text-gray-300 hover:text-white transition-colors">
            应用工具
          </Link>
          <Link href="/prompts" className="text-white">
            AI提示词
          </Link>
        </div>
        <button className="bg-white text-black px-4 py-2 rounded-lg text-sm hover:bg-gray-100 transition-colors">
          登录
        </button>
      </nav>

      {/* 页面标题 */}
      <div className="text-center py-16">
        <h1 className="text-4xl font-bold mb-4">AI提示词库</h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          发现和分享高效的AI提示词，提升你的工作效率和创造力
        </p>
        
        {/* 搜索框 */}
        <div className="flex justify-center mt-8 mb-12">
          <div className="relative w-full max-w-2xl">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="搜索提示词标题、描述或标签..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* 主内容区域 */}
      <div className="max-w-6xl mx-auto px-6 pb-16">
        {/* 类别和排序控件 */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          {/* 类别选择 */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeCategory === category
                    ? "bg-blue-600 text-white"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* 排序选择 */}
          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-sm">排序:</span>
            <div className="flex gap-2">
              <button
                onClick={() => setSortBy("最新")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  sortBy === "最新"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
              >
                最新
              </button>
              <button
                onClick={() => setSortBy("最热")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  sortBy === "最热"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
              >
                最热
              </button>
            </div>
          </div>
        </div>

        {/* 提示词卡片网格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPrompts.map((prompt) => (
            <div
              key={prompt.id}
              className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-blue-500 transition-all hover:shadow-lg hover:shadow-blue-500/10"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-white">{prompt.title}</h3>
                  <span className="bg-blue-900/50 text-blue-300 text-xs px-2 py-1 rounded">
                    {prompt.category}
                  </span>
                </div>
                <p className="text-gray-300 mb-4 line-clamp-2">
                  {prompt.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {prompt.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                  <div className="flex items-center">
                    <span className="mr-1">作者:</span>
                    <span className="text-blue-400">{prompt.author}</span>
                  </div>
                  <div>
                    {new Date(prompt.updated_at).toLocaleDateString('zh-CN')}
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center">
                      <svg
                        className="w-4 h-4 text-red-400 mr-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-gray-400">{prompt.likes}</span>
                    </div>
                    <div className="flex items-center">
                      <svg
                        className="w-4 h-4 text-blue-400 mr-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-gray-400">{prompt.downloads}</span>
                    </div>
                  </div>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                    复制提示词
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 添加新提示词按钮 */}
        <div className="mt-12 text-center">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors inline-flex items-center">
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            添加新提示词
          </button>
        </div>
      </div>
    </div>
  );
}