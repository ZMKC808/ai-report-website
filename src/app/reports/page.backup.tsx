"use client";
import Link from "next/link";
import { useState, useEffect, useRef, useCallback } from "react";

// 定义API返回的报告数据接口
interface ApiReport {
  id: string | number;
  date: string;
  title: string;
  summary: string | string[];
  group_name: string;
  view_url?: string;
  image_api_url?: string;
  created_at?: string;
}

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
    { id: "communication", name: "沟通", description: "沟通交流群" },
    { id: "efficiency", name: "效率", description: "效率提升群" }
  ];

  const filteredGroups = allGroups.filter(group => 
    group.name.toLowerCase().includes(groupSearchQuery.toLowerCase()) ||
    group.description.toLowerCase().includes(groupSearchQuery.toLowerCase())
  );

  const [reports, setReports] = useState<Array<{
    id: number;
    date: string;
    title: string;
    summary: string | string[];
    group: string;
    gradient: string;
    rawDate?: string;
  }>>([]);
  const [loading, setLoading] = useState(true);

  // 根据群组名称获取渐变色
  const getGradientForGroup = (groupName: string) => {
    if (groupName?.includes('沟通')) {
      return "bg-gradient-to-br from-blue-500 via-purple-500 to-purple-600";
    } else if (groupName?.includes('效率')) {
      return "bg-gradient-to-br from-green-400 via-blue-500 to-blue-600";
    } else {
      return "bg-gradient-to-br from-gray-500 via-gray-600 to-gray-700";
    }
  };

  // 使用useCallback包装fetchReports函数
  const fetchReports = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/reports/list');
      if (response.ok) {
        const data = await response.json();
        console.log('API返回数据:', data); // 调试日志
        if (data.success) {
          // 转换API数据格式为前端期望的格式
          const formattedReports = (data.data || []).map((report: ApiReport) => ({
            id: report.id,
            date: report.date,
            title: report.title,
            summary: typeof report.summary === 'string' ? report.summary.split('\n').filter((s: string) => s.trim()).slice(0, 3) : report.summary.slice(0, 3),
            group: report.group_name,
            gradient: getGradientForGroup(report.group_name),
            rawDate: report.date
          }));
          setReports(formattedReports);
        }
      }
    } catch (error) {
      console.error('获取日报列表失败:', error);
      // 如果API失败，使用模拟数据
      setReports([
        {
          id: 1,
          date: "2025年8月22日",
          title: "今日讨论重点",
          summary: ["AI编程项目管理实践", "内容创作变现策略", "新兴开发工具对比"],
          group: "沟通",
          gradient: "bg-gradient-to-br from-blue-500 via-purple-500 to-purple-600"
        },
        {
          id: 2,
          date: "2025年8月21日", 
          title: "今日讨论重点",
          summary: ["时间管理技巧分享", "效率工具推荐", "团队协作最佳实践"],
          group: "效率",
          gradient: "bg-gradient-to-br from-green-400 via-blue-500 to-blue-600"
        }
      ]);
    } finally {
      setLoading(false);
    }
  }, []);
  
  // 页面加载时获取报告列表
  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

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

      {/* 日报卡片 - 一行三个，降低高度 */}
      <div className="max-w-6xl mx-auto px-6 pb-16">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-400">正在加载日报...</p>
            </div>
          </div>
        ) : reports.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">暂无日报数据</p>
            <p className="text-gray-500 text-sm mt-2">请先上传一些日报内容</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reports.map((report) => (
              <Link key={report.id} href={`/reports/${report.id}`}>
                <div className="cursor-pointer group rounded-xl overflow-hidden shadow-lg bg-[#181926]/80 border border-[#23243a] transition-all hover:scale-[1.02]">
                  {/* 卡片头部 - 渐变色 */}
                  <div className={`${report.gradient || 'bg-gradient-to-br from-blue-500 via-purple-500 to-purple-600'} p-4`}> 
                    <div className="flex justify-between items-center">
                      <span className="text-white text-sm opacity-90">{report.date}</span>
                      <div className="flex gap-2 text-lg">
                        {report.group?.includes('沟通') && (<><span>📄</span><span>💬</span><span>📈</span><span>✨</span></>)}
                        {report.group?.includes('效率') && (<><span>⏱️</span><span>📊</span><span>🚀</span><span>💼</span></>)}
                        {!report.group?.includes('沟通') && !report.group?.includes('效率') && (<><span>📄</span><span>💬</span><span>📈</span><span>✨</span></>)}
                      </div>
                    </div>
                    <div className="text-center mt-2">
                      <div className="text-3xl font-bold tracking-wider text-white drop-shadow-lg">
                        {(() => {
                          try {
                            const date = new Date(report.rawDate || report.date);
                            const month = date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
                            const day = date.getDate().toString().padStart(2, '0');
                            return `${month} ${day}`;
                          } catch {
                            return 'AUG 10';
                          }
                        })()}
                      </div>
                      <div className="text-lg font-bold tracking-widest text-white/90">
                        {(() => {
                          try {
                            const date = new Date(report.rawDate || report.date);
                            return date.getFullYear();
                          } catch {
                            return '2025';
                          }
                        })()}
                      </div>
                    </div>
                  </div>
                  {/* 卡片内容 - 只显示三行概况 */}
                  <div className="bg-[#181926]/80 p-4">
                    <h3 className="text-white font-bold text-lg mb-3">{report.title}</h3>
                    <div className="space-y-1 mb-3">
                      {Array.isArray(report.summary) ? report.summary.slice(0, 3).map((item: string, index: number) => (
                        <div key={index} className="text-gray-300 text-sm">
                          - {item}
                        </div>
                      )) : (
                        <div className="text-gray-300 text-sm">
                          {report.summary || '暂无摘要'}
                        </div>
                      )}
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="text-gray-400 text-sm">{report.group}</div>
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          // 这里可以添加下载图片的逻辑
                          console.log('下载日报图片:', report.id);
                        }}
                        className="bg-[#23243a]/80 hover:bg-[#23243a] text-white px-3 py-1 rounded-lg text-sm transition-colors"
                      >
                        下载
                      </button>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}