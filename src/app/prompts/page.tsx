"use client";
import Link from "next/link";
import { useState } from "react";

export default function PromptsPage() {
  const [selectedCategory, setSelectedCategory] = useState("全部提示词");
  const [searchTerm, setSearchTerm] = useState("");

  const prompts = [
    {
      id: 1,
      title: "编程助手",
      description: "作为编程改进助手，你的任务是改进代码的拼写、语法、清晰度、简洁性...",
      category: "编程",
      tags: ["编程", "代码", "优化"],
      usage: "85K",
      rating: 4.9,
      bgColor: "bg-gradient-to-br from-orange-500 to-red-500",
      preview: "As a writing improvement assistant, your task is to improve the spelling, grammar, clarity, concision..."
    },
    {
      id: 2,
      title: "提示词 2",
      description: "高质量提示词示例，帮助您更好地使用AI工具。",
      category: "通用",
      tags: ["提示词", "AI", "工具"],
      usage: "83K",
      rating: 4.8,
      bgColor: "bg-gradient-to-br from-blue-500 to-purple-500",
      preview: "Professional prompt template for various use cases..."
    },
    {
      id: 3,
      title: "提示词 3",
      description: "高质量提示词示例，帮助您更好地使用AI工具。",
      category: "分析",
      tags: ["分析", "数据", "洞察"],
      usage: "9K",
      rating: 4.7,
      bgColor: "bg-gradient-to-br from-green-500 to-teal-500",
      preview: "Professional prompt template for various use cases..."
    },
    {
      id: 4,
      title: "提示词 4",
      description: "高质量提示词示例，帮助您更好地使用AI工具。",
      category: "创作",
      tags: ["创作", "内容", "文案"],
      usage: "56K",
      rating: 4.9,
      bgColor: "bg-gradient-to-br from-pink-500 to-purple-500",
      preview: "Professional prompt template for various use cases..."
    },
    {
      id: 5,
      title: "提示词 5",
      description: "高质量提示词示例，帮助您更好地使用AI工具。",
      category: "技术",
      tags: ["技术", "开发", "架构"],
      usage: "82K",
      rating: 4.6,
      bgColor: "bg-gradient-to-br from-indigo-500 to-blue-500",
      preview: "Professional prompt template for various use cases..."
    },
    {
      id: 6,
      title: "提示词 6",
      description: "高质量提示词示例，帮助您更好地使用AI工具。",
      category: "商业",
      tags: ["商业", "策略", "分析"],
      usage: "11K",
      rating: 4.5,
      bgColor: "bg-gradient-to-br from-yellow-500 to-orange-500",
      preview: "Professional prompt template for various use cases..."
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
      <div className="max-w-7xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-3 gap-6">
          {filteredPrompts.map((prompt) => (
            <Link key={prompt.id} href={`/prompt/${prompt.id}`}>
              <div className="cursor-pointer group bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:bg-gray-800 transition-colors">
                {/* 卡片头部信息 */}
                <div className="p-6 pb-4">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-white">
                      {prompt.title}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="bg-orange-500 text-white text-sm px-2 py-1 rounded font-medium">
                        {prompt.usage}
                      </span>
                      <button className="text-pink-400 hover:text-pink-300">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <button className="text-gray-400 hover:text-gray-300">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  
                  <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                    {prompt.description}
                  </p>
                  
                  <div className="bg-gray-800 rounded-lg p-3 mb-4">
                    <p className="text-gray-400 text-sm italic">
                      {prompt.preview}
                    </p>
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