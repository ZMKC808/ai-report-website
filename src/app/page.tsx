"use client";
import { useState } from "react";
import Link from "next/link";

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("最新");
  const [selectedGroup, setSelectedGroup] = useState("全部社群");
  const [selectedCategory, setSelectedCategory] = useState("全部分类");
  const [showPromptModal, setShowPromptModal] = useState(false);
  const [promptText, setPromptText] = useState("");

  const mockReports = [
    {
      id: 1,
      title: "AI编程互助会日报",
      date: "2025年1月19日",
      summary: ["特朗普发币引发讨论", "Cursor工具使用技巧分享", "iOS开发文档资源整合"],
      group: "AI编程互助会"
    },
    {
      id: 2,
      title: "AI编程互助会日报", 
      date: "2025年1月18日",
      summary: ["Cursor与VSCode Copilot使用体验对比", "AI辅助工具在开发中的角色与价值探讨"],
      group: "AI编程互助会"
    },
    {
      id: 3,
      title: "AI编程互助会日报",
      date: "2025年1月17日", 
      summary: ["AI算法备案材料申请教程分享", "独立开发者产品推广与运营经验交流"],
      group: "AI编程互助会"
    }
  ];

  const categories = ["全部分类", "Agent", "AI工具", "AI编程", "Cursor", "DeepSeek", "MCP", "产品开发", "内容创作", "大模型", "提示词", "社群生态", "行业洞察"];

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* 侧边栏 */}
      <div className="fixed left-0 top-0 w-80 h-full bg-slate-800/50 p-6 overflow-y-auto">
        {/* 搜索框 */}
        <div className="mb-8">
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m21 21-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="搜索日报标题、作者或摘要"
              className="w-full bg-slate-700/50 border border-slate-600 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* 排序方式 */}
        <div className="mb-8">
          <h3 className="text-white font-medium mb-4">排序方式</h3>
          <div className="flex gap-2">
            {["最新", "最热"].map((sort) => (
              <button
                key={sort}
                onClick={() => setSortBy(sort)}
                className={`px-4 py-2 rounded-lg text-sm transition-all ${
                  sortBy === sort
                    ? "bg-blue-600 text-white"
                    : "bg-slate-700/50 border border-slate-600 hover:bg-slate-600"
                }`}
              >
                {sort}
              </button>
            ))}
          </div>
        </div>

        {/* 按社群筛选 */}
        <div className="mb-8">
          <h3 className="text-white font-medium mb-4">按社群筛选</h3>
          <div className="relative">
            <select
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
              className="w-full bg-slate-700/50 border border-slate-600 rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none cursor-pointer"
            >
              <option value="全部社群">全部社群</option>
              <option value="AI编程互助会">AI编程互助会</option>
              <option value="业务脑袋">业务脑袋</option>
            </select>
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m19 9-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* 按分类筛选 */}
        <div className="mb-8">
          <h3 className="text-white font-medium mb-4">按分类筛选</h3>
          <div className="grid grid-cols-2 gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-2 rounded-lg text-sm text-left transition-all ${
                  selectedCategory === category
                    ? "bg-blue-600 text-white"
                    : "bg-slate-700/50 border border-slate-600 hover:bg-slate-600"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 主内容区域 */}
      <div className="ml-80 p-8">
        {/* AI提示词输入框 */}
        <div className="mb-8">
          <button
            onClick={() => setShowPromptModal(true)}
            className="w-full bg-slate-800/50 border border-slate-600 rounded-xl p-4 text-left text-slate-400 hover:bg-slate-700/50 transition-colors"
          >
            请输入您的AI提示词...
          </button>
        </div>

        {/* 日报卡片网格 */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          {mockReports.map((report) => (
            <Link key={report.id} href={`/report/${report.id}`}>
              <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-6 cursor-pointer hover:scale-105 transition-transform duration-200 h-80">
                <div className="flex justify-between items-start mb-4">
                  <div className="text-sm text-indigo-200">{report.date}</div>
                  <div className="flex gap-2 text-indigo-200">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                    </svg>
                  </div>
                </div>

                <div className="text-2xl font-bold text-white mb-4">
                  {report.date.split("年")[1].split("月")[0].padStart(2, "0")}
                  <div className="text-lg font-normal">
                    {report.date.split("年")[0]} Daily Report
                  </div>
                </div>

                <div className="text-indigo-100 space-y-1 text-sm">
                  {report.summary.map((item, index) => (
                    <div key={index}> {item}</div>
                  ))}
                </div>

                <div className="absolute bottom-6 left-6 flex items-center text-orange-300">
                  <div className="w-6 h-6 bg-orange-500 rounded-full mr-2 flex items-center justify-center text-xs font-bold text-white">
                    AI
                  </div>
                  {report.group}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* 分页 */}
        <div className="flex justify-center items-center gap-2">
          <button className="px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg hover:bg-slate-600 transition-colors">
            上一页
          </button>
          <button className="px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg hover:bg-slate-600 transition-colors">
            1
          </button>
          <span className="px-2 text-slate-400">...</span>
          <button className="px-3 py-2 bg-purple-600 text-white rounded-lg">
            24
          </button>
          <button className="px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg hover:bg-slate-600 transition-colors">
            下一页
          </button>
        </div>
      </div>

      {/* AI提示词模态框 */}
      {showPromptModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-2xl p-6 w-full max-w-2xl mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">AI提示词输入</h3>
              <button
                onClick={() => setShowPromptModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <textarea
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              placeholder="请输入您的AI提示词..."
              className="w-full h-40 bg-slate-700/50 border border-slate-600 rounded-xl p-4 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            />
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setShowPromptModal(false)}
                className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
              >
                取消
              </button>
              <button
                onClick={() => setShowPromptModal(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors"
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}