"use client";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";

export default function ReportsPage() {
  const [selectedGroup, setSelectedGroup] = useState("全部社群");
  const [sortBy, setSortBy] = useState("最新");
  const [searchQuery, setSearchQuery] = useState("");
  const [showGroupDropdown, setShowGroupDropdown] = useState(false);
  const [groupSearchQuery, setGroupSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowGroupDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const allGroups = [
    { id: "all", name: "全部社群", description: "" },
    { id: "ai-coding", name: "AI编程互助会", description: "欢迎加入AI编程互助群！..." },
    { id: "business", name: "业务脑袋群", description: "商业思维交流群" },
    { id: "startup", name: "创业交流群", description: "创业者交流平台" },
    { id: "finance", name: "【戴巍生财优质文...】", description: "欢迎加入戴巍老师创办的..." }
  ];

  const filteredGroups = allGroups.filter(group => 
    group.name.toLowerCase().includes(groupSearchQuery.toLowerCase()) ||
    group.description.toLowerCase().includes(groupSearchQuery.toLowerCase())
  );

  const mockReports = [
    {
      id: 1,
      date: "2025年8月22日",
      title: "今日讨论重点",
      summary: ["深入观察度交流", "李想创业智慧解读", "房产投资观察"],
      group: "业务脑袋群",
      gradient: "bg-gradient-to-br from-blue-500 via-purple-500 to-purple-600"
    },
    {
      id: 2,
      date: "2025年8月21日",
      title: "今日讨论重点",
      summary: ["AI Agent开发实战", "Kimi API集成技巧", "自动化部署方案"],
      group: "AI编程互助会",
      gradient: "bg-gradient-to-br from-green-400 via-blue-500 to-blue-600"
    },
    {
      id: 3,
      date: "2025年8月20日",
      title: "今日讨论重点",
      summary: ["产品策略深度分析", "技术架构优化", "市场洞察分享"],
      group: "创业交流群",
      gradient: "bg-gradient-to-br from-pink-500 via-purple-500 to-purple-600"
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
        
        {/* 搜索框 */}
        <div className="flex justify-center mb-8">
          <div className="relative w-full max-w-2xl">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="搜索日报标题、作者或摘要"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* 筛选控件 */}
        <div className="flex justify-center items-center gap-6 mb-12">
          <div className="flex items-center gap-2">
            <span className="text-gray-400">社群筛选:</span>
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowGroupDropdown(!showGroupDropdown)}
                className="bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 pr-8 text-white flex items-center gap-2 min-w-[200px] justify-between"
              >
                <span>{selectedGroup}</span>
                <svg className={`w-4 h-4 text-gray-400 transition-transform ${showGroupDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {showGroupDropdown && (
                <div className="absolute top-full left-0 mt-2 w-80 bg-gray-800 border border-gray-600 rounded-xl shadow-xl z-50">
                  {/* 搜索框 */}
                  <div className="p-4 border-b border-gray-700">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="搜索社群..."
                        value={groupSearchQuery}
                        onChange={(e) => setGroupSearchQuery(e.target.value)}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 pl-10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                  </div>
                  
                  {/* 全选按钮 */}
                  <div className="p-2">
                    <button
                      onClick={() => {
                        setSelectedGroup("全部社群");
                        setShowGroupDropdown(false);
                        setGroupSearchQuery("");
                      }}
                      className="w-full text-left px-3 py-2 text-blue-400 hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      全选
                    </button>
                  </div>
                  
                  {/* 社群列表 */}
                  <div className="max-h-60 overflow-y-auto">
                    {filteredGroups.slice(1).map((group) => (
                      <div key={group.id} className="p-2">
                        <button
                          onClick={() => {
                            setSelectedGroup(group.name);
                            setShowGroupDropdown(false);
                            setGroupSearchQuery("");
                          }}
                          className="w-full text-left px-3 py-3 hover:bg-gray-700 rounded-lg transition-colors flex items-center gap-3"
                        >
                          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                            {group.name.charAt(0)}
                          </div>
                          <div className="flex-1">
                            <div className="text-white font-medium">{group.name}</div>
                            {group.description && (
                              <div className="text-gray-400 text-sm truncate">{group.description}</div>
                            )}
                          </div>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
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
                <div className={`${report.gradient} p-6 pb-3`}> 
                  <div className="flex flex-col items-center justify-center">
                    <span className="text-white text-sm opacity-90 mb-1">{report.date}</span>
                    <div className="text-4xl font-extrabold tracking-wider mb-1 drop-shadow-lg">AUG {report.date.split("月")[0].split("年")[1].padStart(2, "0")}</div>
                    <div className="text-xl font-bold mb-2 tracking-widest">2025</div>
                    {/* 图标区 */}
                    <div className="flex gap-3 text-xl justify-center mb-1">
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