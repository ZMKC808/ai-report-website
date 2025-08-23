"use client";
import Link from "next/link";
import { useState } from "react";

export default function ToolsPage() {
  const [selectedCategory, setSelectedCategory] = useState("全部工具");

  const tools = [
    {
      id: 1,
      name: "微信群聊分析器",
      description: "智能分析微信群聊数据，生成详细的活动报告和统计图表",
      category: "数据分析",
      tags: ["微信", "数据分析", "报告生成"],
      status: "运行中",
      gradient: "bg-gradient-to-br from-[#23243a]/80 to-[#23243a]/60"
    },
    {
      id: 2,
      name: "AI内容总结器", 
      description: "基于大模型的智能内容总结工具，支持多种格式文档处理",
      category: "AI工具",
      tags: ["AI", "文本处理", "自动总结"],
      status: "运行中",
      gradient: "bg-gradient-to-br from-[#23243a]/80 to-[#23243a]/60"
    },
    {
      id: 3,
      name: "报告模板生成器",
      description: "快速生成各种业务报告模板，支持自定义样式和格式",
      category: "文档工具",
      tags: ["模板", "报告", "自动化"],
      status: "运行中",
      gradient: "bg-gradient-to-br from-[#23243a]/80 to-[#23243a]/60"
    },
    {
      id: 4,
      name: "图表可视化工具",
      description: "将数据转换为精美图表，支持多种图表类型和交互功能",
      category: "可视化",
      tags: ["图表", "可视化", "数据"],
      status: "开发中",
      gradient: "bg-gradient-to-br from-[#23243a]/80 to-[#23243a]/60"
    },
    {
      id: 5,
      name: "自动化部署助手",
      description: "一键部署工具，支持多平台自动化部署和持续集成",
      category: "DevOps",
      tags: ["部署", "自动化", "CI/CD"],
      status: "测试中",
      gradient: "bg-gradient-to-br from-[#23243a]/80 to-[#23243a]/60"
    },
    {
      id: 6,
      name: "API接口管理器",
      description: "统一管理各种API接口，提供测试、监控和文档功能",
      category: "开发工具",
      tags: ["API", "管理", "测试"],
      status: "运行中",
      gradient: "bg-gradient-to-br from-[#23243a]/80 to-[#23243a]/60"
    }
  ];

  const categories = ["全部工具", "数据分析", "AI工具", "文档工具", "可视化", "DevOps", "开发工具"];

  const filteredTools = selectedCategory === "全部工具" 
    ? tools 
    : tools.filter(tool => tool.category === selectedCategory);

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
          <Link href="/tools" className="text-white">
            应用工具
          </Link>
          <Link href="/prompts" className="text-gray-300 hover:text-white transition-colors">
            AI提示词
          </Link>
        </div>
        <button className="bg-white text-black px-4 py-2 rounded-lg text-sm hover:bg-gray-100 transition-colors">
          登录
        </button>
      </nav>

      {/* 页面标题 */}
      <div className="text-center py-16">
        <h1 className="text-4xl font-bold mb-4">应用工具</h1>
        <p className="text-gray-400 text-lg">强大的自动化工具集合，提升您的工作效率</p>
        
        {/* 分类筛选 */}
        <div className="flex justify-center items-center gap-4 mt-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-lg text-sm transition-colors ${
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

      {/* 工具卡片网格 - 简洁低饱和度风格 */}
      <div className="max-w-6xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-3 gap-8">
          {filteredTools.map((tool) => (
            <Link key={tool.id} href={`/tool/${tool.id}`}>
              <div className="cursor-pointer group rounded-2xl overflow-hidden shadow-xl border border-[#23243a] bg-[#181926]/70 transition-all hover:scale-[1.025]">
                {/* 卡片头部 - 低调渐变色 */}
                <div className={`${tool.gradient} p-7 pb-4`}> 
                  <div className="flex justify-between items-start mb-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      tool.status === "运行中" ? "bg-green-500/80" :
                      tool.status === "开发中" ? "bg-yellow-500/80" :
                      "bg-blue-500/80"
                    } text-white`}>{tool.status}</span>
                  </div>
                  <div className="text-white">
                    <div className="text-xl font-bold mb-1">{tool.name}</div>
                    <div className="text-sm opacity-80">{tool.category}</div>
                  </div>
                </div>
                {/* 卡片底部 - 半透明深色内容区域 */}
                <div className="bg-[#181926]/80 border-t border-[#23243a] rounded-b-2xl px-7 py-6 group-hover:bg-[#23243a]/80 transition-colors">
                  <p className="text-gray-200 text-sm mb-4 leading-relaxed">{tool.description}</p>
                  {/* 标签 */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {tool.tags.map((tag, index) => (
                      <span key={index} className="bg-[#23243a]/80 text-gray-300 text-xs px-2 py-1 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                  {/* 操作按钮 */}
                  <div className="flex gap-2">
                    <button className="flex-1 bg-[#23243a]/80 hover:bg-[#23243a]/90 text-white py-2 rounded-lg text-sm transition-colors shadow">
                      使用工具
                    </button>
                    <button className="px-3 bg-[#23243a]/60 hover:bg-[#23243a]/80 text-gray-300 py-2 rounded-lg text-sm transition-colors">
                      详情
                    </button>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}