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
      summary: ["深入观察度交流", "李想创业智慧解读", "房产投资观察"],
      group: "业务脑袋群",
      gradient: "bg-[linear-gradient(120deg,_#2ec0f9_0%,_#7b5cff_100%)]"
    },
    {
      id: 2,
      date: "2025年8月21日",
      title: "今日讨论重点",
      summary: ["AI Agent开发实战", "Kimi API集成技巧", "自动化部署方案"],
      group: "AI编程互助会",
      gradient: "bg-[linear-gradient(120deg,_#1fd1a6_0%,_#1fa2ff_100%)]"
    },
    {
      id: 3,
      date: "2025年8月20日",
      title: "今日讨论重点",
      summary: ["产品策略深度分析", "技术架构优化", "市场洞察分享"],
      group: "创业交流群",
      gradient: "bg-[linear-gradient(120deg,_#ff61d2_0%,_#fe9090_100%)]"
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
                className={`px-6 py-2 rounded-xl text-base font-medium transition-all shadow-sm border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-400/60 ${
                  sortBy === "最新"
                    ? "bg-blue-500 text-white shadow-lg"
                    : "bg-white/10 text-white/80 hover:bg-white/20"
                }`}
              >
                最新
              </button>
              <button
                onClick={() => setSortBy("最热")}
                className={`px-6 py-2 rounded-xl text-base font-medium transition-all shadow-sm border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-400/60 ${
                  sortBy === "最热"
                    ? "bg-blue-500 text-white shadow-lg"
                    : "bg-white/10 text-white/80 hover:bg-white/20"
                }`}
              >
                最热
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 日报卡片 - 高级渐变风格 */}
      <div className="max-w-6xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-3 gap-8">
          {mockReports.map((report, idx) => (
            <Link key={report.id} href={`/report/${report.id}`}>
              <div className="cursor-pointer group rounded-2xl overflow-hidden shadow-xl bg-[#181926]/80 border border-[#23243a] transition-all hover:scale-[1.025]">
                {/* 卡片头部 - 高级渐变色 */}
                <div className={`${report.gradient} p-8 pb-4 !bg-[linear-gradient(120deg,_#2ec0f9_0%,_#7b5cff_100%)]`}> 
                  <div className="flex flex-col items-center justify-center">
                    <span className="text-white text-lg opacity-90 mb-2">{report.date}</span>
                    <div className="text-5xl font-extrabold tracking-wider mb-1 drop-shadow-lg">AUG {report.date.split("月")[0].split("年")[1].padStart(2, "0")}</div>
                    <div className="text-2xl font-bold mb-2 tracking-widest">2025</div>
                    {/* 图标区 */}
                    <div className="flex gap-4 text-2xl justify-center mb-2">
                      {idx === 0 && (<><span>🧠</span><span>👥</span><span>⭐</span><span>📝</span></>)}
                      {idx === 1 && (<><span>🤖</span><span>💡</span><span>🔥</span><span>⚡</span></>)}
                      {idx === 2 && (<><span>🎯</span><span>📊</span><span>🚀</span><span>💼</span></>)}
                    </div>
                  </div>
                </div>
                {/* 卡片底部 - 半透明黑色内容区域 */}
                <div className="bg-[#181926]/80 px-8 py-6">
                  <h3 className="text-white font-bold text-xl mb-4">{report.title}</h3>
                  <div className="space-y-2 mb-6">
                    {report.summary.map((item, index) => (
                      <div key={index} className="text-gray-200 text-base">
                        - {item}
                      </div>
                    ))}
                  </div>
                  <div className="text-gray-400 text-base mb-2">{report.group}</div>
                  {/* 下载按钮 */}
                  <div className="flex justify-end">
                    <button className="bg-[#23243a]/80 hover:bg-[#23243a]/90 text-white px-6 py-2 rounded-lg text-base transition-colors shadow">
                      下载
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