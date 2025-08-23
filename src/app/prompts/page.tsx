"use client";
import Link from "next/link";
import { useState } from "react";

export default function PromptsPage() {
  const [selectedCategory, setSelectedCategory] = useState("全部提示词");
  const [searchTerm, setSearchTerm] = useState("");

  const prompts = [
    {
      id: 1,
      title: "社群日报生成提示词",
      description: "专门用于生成高质量社群日报的AI提示词模板",
      category: "报告生成",
      tags: ["日报", "社群", "总结"],
      usage: 1250,
      rating: 4.9,
      bgColor: "from-blue-500 to-blue-600",
      preview: "请根据以下微信群聊记录，生成一份专业的社群日报..."
    },
    {
      id: 2,
      title: "商业分析提示词",
      description: "深度分析商业模式、市场趋势的专业提示词",
      category: "商业分析",
      tags: ["商业", "分析", "策略"],
      usage: 890,
      rating: 4.8,
      bgColor: "from-green-500 to-green-600",
      preview: "作为一名资深商业分析师，请对以下业务数据进行深入分析..."
    },
    {
      id: 3,
      title: "技术文档写作助手",
      description: "帮助生成清晰、专业的技术文档和API说明",
      category: "技术写作",
      tags: ["文档", "技术", "API"],
      usage: 670,
      rating: 4.7,
      bgColor: "from-purple-500 to-purple-600",
      preview: "请帮我编写一份详细的API接口文档，包含以下功能..."
    },
    {
      id: 4,
      title: "创意内容策划",
      description: "激发创意思维，生成优质内容策划方案",
      category: "内容创作",
      tags: ["创意", "策划", "营销"],
      usage: 1100,
      rating: 4.9,
      bgColor: "from-orange-500 to-orange-600",
      preview: "我需要为品牌策划一场创新的营销活动，目标受众是..."
    },
    {
      id: 5,
      title: "代码审查助手",
      description: "专业的代码质量检查和优化建议提示词",
      category: "代码审查",
      tags: ["代码", "审查", "优化"],
      usage: 780,
      rating: 4.6,
      bgColor: "from-red-500 to-red-600",
      preview: "请仔细审查以下代码，从性能、安全性、可维护性角度..."
    },
    {
      id: 6,
      title: "数据可视化设计",
      description: "指导数据可视化图表设计和优化的提示词",
      category: "数据可视化",
      tags: ["数据", "可视化", "图表"],
      usage: 520,
      rating: 4.5,
      bgColor: "from-teal-500 to-teal-600",
      preview: "基于以下数据集，请设计最适合的可视化方案..."
    }
  ];

  const categories = ["全部提示词", "报告生成", "商业分析", "技术写作", "内容创作", "代码审查", "数据可视化"];

  const filteredPrompts = prompts.filter(prompt => {
    const matchesCategory = selectedCategory === "全部提示词" || prompt.category === selectedCategory;
    const matchesSearch = prompt.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         prompt.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prompt.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

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

      {/* 页面标题和搜索 */}
      <div className="text-center py-16">
        <h1 className="text-4xl font-bold mb-4">AI提示词库</h1>
        <p className="text-gray-400 text-lg mb-8">精选高质量提示词，释放AI的无限潜能</p>
        
        {/* 搜索框 */}
        <div className="max-w-md mx-auto mb-12">
          <div className="relative">
            <input
              type="text"
              placeholder="搜索提示词..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 pl-10 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              
            </div>
          </div>
        </div>
        
        {/* 分类筛选 */}
        <div className="flex justify-center items-center gap-4 flex-wrap">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                selectedCategory === category 
                  ? "bg-blue-600 text-white" 
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* 提示词卡片网格 */}
      <div className="max-w-6xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-2 gap-8">
          {filteredPrompts.map((prompt) => (
            <Link key={prompt.id} href={`/prompt/${prompt.id}`}>
              <div className="cursor-pointer group">
                {/* 卡片头部 - 彩色渐变区域 */}
                <div className={`bg-gradient-to-r ${prompt.bgColor} p-6 rounded-t-2xl`}>
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-white text-sm bg-white bg-opacity-20 px-2 py-1 rounded">
                      {prompt.category}
                    </span>
                    <div className="flex items-center gap-4 text-white text-sm">
                      <div className="flex items-center gap-1">
                        <span></span>
                        <span>{prompt.rating}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span></span>
                        <span>{prompt.usage}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-white">
                    <h3 className="text-xl font-bold mb-2">
                      {prompt.title}
                    </h3>
                    <p className="text-sm opacity-90">
                      {prompt.description}
                    </p>
                  </div>
                </div>

                {/* 卡片底部 - 黑色内容区域 */}
                <div className="bg-gray-900 border border-gray-800 border-t-0 rounded-b-2xl p-6 group-hover:bg-gray-800 transition-colors">
                  {/* 预览内容 */}
                  <div className="bg-gray-800 rounded-lg p-4 mb-4">
                    <p className="text-gray-300 text-sm italic">
                      &quot;{prompt.preview}...&quot;
                    </p>
                  </div>
                  
                  {/* 标签 */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {prompt.tags.map((tag, index) => (
                      <span key={index} className="bg-gray-800 text-gray-300 text-xs px-2 py-1 rounded">
                        #{tag}
                      </span>
                    ))}
                  </div>
                  
                  {/* 操作按钮 */}
                  <div className="flex gap-2">
                    <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm transition-colors">
                      使用提示词
                    </button>
                    <button className="px-3 bg-gray-800 hover:bg-gray-700 text-gray-300 py-2 rounded-lg text-sm transition-colors">
                      收藏
                    </button>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* 空状态 */}
        {filteredPrompts.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4"></div>
            <h3 className="text-xl font-bold mb-2">没有找到相关提示词</h3>
            <p className="text-gray-400">尝试调整搜索关键词或选择不同的分类</p>
          </div>
        )}
      </div>
    </div>
  );
}