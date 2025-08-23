"use client";
import Link from "next/link";
import { useState } from "react";

export default function ReportsPage() {
  const [selectedGroup, setSelectedGroup] = useState("全部社群");
  const [sortBy, setSortBy] = useState("最新");

  const mockReports = [
    {
      id: 1,
      date: "2025年8月22日",
      title: "今日讨论重点",
      summary: ["深入观察经济", "季初创业智慧解读", "房产投资观察"],
      group: "业务脑袋群",
      bgColor: "from-blue-500 to-blue-600"
    },
    {
      id: 2,
      date: "2025年8月21日", 
      title: "今日讨论重点",
      summary: ["AI Agent开发实践", "Kimi API集成技巧", "自动化部署方案"],
      group: "AI编程互助会",
      bgColor: "from-green-500 to-green-600"
    },
    {
      id: 3,
      date: "2025年8月20日",
      title: "今日讨论重点", 
      summary: ["产品策略深度分析", "技术架构优化", "市场洞察分享"],
      group: "创业交流群",
      bgColor: "from-purple-500 to-purple-600"
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* 顶部导航 */}
      <nav className="flex items-center justify-between p-6 border-b border-gray-800">
        <div className="flex items-center space-x-8">
          <Link href="/" className="text-xl font-bold">
            AI社群日报平台
          </Link>
          <Link href="/reports" className="text-white">
            社群日报
          </Link>
          <Link href="/tools" className="text-gray-300 hover:text-white transition-colors">
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
        <h1 className="text-4xl font-bold mb-8">社群日报</h1>
        
        {/* 筛选控件 */}
        <div className="flex justify-center items-center gap-6 mb-12">
          <div className="flex items-center gap-2">
            <span className="text-gray-400">社群筛选:</span>
            <select
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
              className="bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white"
            >
              <option value="全部社群">全部社群</option>
              <option value="AI编程互助会">AI编程互助会</option>
              <option value="业务脑袋群">业务脑袋群</option>
              <option value="创业交流群">创业交流群</option>
            </select>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-gray-400">排序:</span>
            <div className="flex gap-2">
              <button
                onClick={() => setSortBy("最新")}
                className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                  sortBy === "最新" 
                    ? "bg-blue-600 text-white" 
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
              >
                最新
              </button>
              <button
                onClick={() => setSortBy("最热")}
                className={`px-4 py-2 rounded-lg text-sm transition-colors ${
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
      </div>

      {/* 日报卡片 */}
      <div className="max-w-6xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-3 gap-8">
          {mockReports.map((report) => (
            <Link key={report.id} href={`/report/${report.id}`}>
              <div className="cursor-pointer group">
                {/* 卡片头部 - 彩色渐变区域 */}
                <div className={`bg-gradient-to-r ${report.bgColor} p-6 rounded-t-2xl`}>
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-white text-sm opacity-90">{report.date}</span>
                    <div className="flex gap-2 text-white opacity-90">
                      <div className="w-6 h-6 flex items-center justify-center"></div>
                      <div className="w-6 h-6 flex items-center justify-center"></div>
                      <div className="w-6 h-6 flex items-center justify-center"></div>
                      <div className="w-6 h-6 flex items-center justify-center"></div>
                    </div>
                  </div>
                  
                  <div className="text-white">
                    <div className="text-2xl font-bold">
                      AUG {report.date.split("月")[0].split("年")[1].padStart(2, "0")}
                    </div>
                    <div className="text-lg opacity-90">
                      {report.date.split("年")[0]}
                    </div>
                  </div>
                </div>

                {/* 卡片底部 - 黑色内容区域 */}
                <div className="bg-gray-900 border border-gray-800 border-t-0 rounded-b-2xl p-6 group-hover:bg-gray-800 transition-colors">
                  <h3 className="text-white font-bold mb-4">{report.title}</h3>
                  <div className="space-y-2 mb-6">
                    {report.summary.map((item, index) => (
                      <div key={index} className="text-gray-300 text-sm">
                        - {item}
                      </div>
                    ))}
                  </div>
                  <div className="text-gray-500 text-sm">{report.group}</div>
                  
                  {/* 下载按钮 */}
                  <button className="w-full mt-4 bg-gray-800 hover:bg-gray-700 text-white py-2 rounded-lg text-sm transition-colors">
                    下载
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}