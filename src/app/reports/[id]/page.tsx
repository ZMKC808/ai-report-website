'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

export default function ReportDetailPage() {
  const params = useParams();
  const [report, setReport] = useState<{
    id: string;
    title: string;
    date: string;
    group_name: string;
    summary: string;
    html_content: string;
    author?: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (params?.id) {
      fetchReportContent(params.id as string);
    }
  }, [params?.id]);

  const fetchReportContent = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/reports/${id}/content`);
      const data = await response.json();
      
      if (data.success) {
        setReport(data.data);
      } else {
        setError(data.error || '获取日报内容失败');
      }
    } catch (error) {
      console.error('获取日报内容失败:', error);
      setError('网络请求失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      return `${year}年${month}月${day}日`;
    } catch (error) {
      return dateStr || '未知日期';
    }
  };

  const downloadImage = async () => {
    if (!report) return;
    
    try {
      const response = await fetch(`/api/reports/${report.id}/share-image?include_qr=true&device_mode=mobile`);
      const data = await response.json();
      
      if (data.success && data.image_data) {
        const link = document.createElement('a');
        link.href = `data:image/png;base64,${data.image_data}`;
        link.download = `${report.title || '日报'}_${report.date}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        alert('图片生成失败，请稍后重试');
      }
    } catch (error) {
      console.error('下载图片失败:', error);
      alert('下载失败，请稍后重试');
    }
  };

  if (loading) {
    return (
      <>
        <script src="https://cdn.tailwindcss.com"></script>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
        <div className="min-h-screen bg-gray-50">
          {/* 页眉 */}
          <header className="w-full bg-white mb-8 shadow-sm">
            <div className="w-full max-w-3xl lg:max-w-[90%] mx-auto py-4 px-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <i className="fas fa-robot text-purple-600 text-xl"></i>
                  <div>
                    <h1 className="text-xl font-bold">AI社群日报平台</h1>
                    <p className="text-sm text-gray-600">探索AI编程新式生产力工作方式</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">加载中...</div>
                </div>
              </div>
            </div>
          </header>

          {/* 主内容 */}
          <main className="w-full max-w-3xl lg:max-w-[90%] mx-auto px-4 sm:px-6 py-8">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500 mx-auto mb-6"></div>
                <p className="text-gray-600 text-lg">正在加载日报内容...</p>
              </div>
            </div>
          </main>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <script src="https://cdn.tailwindcss.com"></script>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
        <div className="min-h-screen bg-gray-50">
          {/* 页眉 */}
          <header className="w-full bg-white mb-8 shadow-sm">
            <div className="w-full max-w-3xl lg:max-w-[90%] mx-auto py-4 px-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <i className="fas fa-robot text-purple-600 text-xl"></i>
                  <div>
                    <h1 className="text-xl font-bold">AI社群日报平台</h1>
                    <p className="text-sm text-gray-600">探索AI编程新式生产力工作方式</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">加载失败</div>
                </div>
              </div>
            </div>
          </header>

          {/* 主内容 */}
          <main className="w-full max-w-3xl lg:max-w-[90%] mx-auto px-4 sm:px-6 py-8">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center max-w-md">
                <div className="bg-red-50 border border-red-200 rounded-xl p-8">
                  <div className="text-red-500 text-5xl mb-4">⚠️</div>
                  <h2 className="text-xl font-bold text-red-600 mb-4">加载失败</h2>
                  <p className="text-gray-700 mb-6">{error}</p>
                  <div className="flex gap-4 justify-center">
                    <button
                      onClick={() => params?.id && fetchReportContent(params.id as string)}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors font-medium"
                    >
                      重新加载
                    </button>
                    <Link
                      href="/reports"
                      className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition-colors font-medium"
                    >
                      返回列表
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </>
    );
  }

  if (!report) {
    return (
      <>
        <script src="https://cdn.tailwindcss.com"></script>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
        <div className="min-h-screen bg-gray-50">
          {/* 页眉 */}
          <header className="w-full bg-white mb-8 shadow-sm">
            <div className="w-full max-w-3xl lg:max-w-[90%] mx-auto py-4 px-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <i className="fas fa-robot text-purple-600 text-xl"></i>
                  <div>
                    <h1 className="text-xl font-bold">AI社群日报平台</h1>
                    <p className="text-sm text-gray-600">探索AI编程新式生产力工作方式</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">日报不存在</div>
                </div>
              </div>
            </div>
          </header>

          {/* 主内容 */}
          <main className="w-full max-w-3xl lg:max-w-[90%] mx-auto px-4 sm:px-6 py-8">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <div className="text-gray-400 text-6xl mb-6">📄</div>
                <h2 className="text-2xl font-bold text-gray-600 mb-4">日报不存在</h2>
                <p className="text-gray-500 mb-6">请检查链接是否正确</p>
                <Link
                  href="/reports"
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors font-medium inline-block"
                >
                  返回日报列表
                </Link>
              </div>
            </div>
          </main>
        </div>
      </>
    );
  }

  return (
    <>
      <script src="https://cdn.tailwindcss.com"></script>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      <div className="min-h-screen bg-gray-50">
        {/* 页眉 */}
        <header className="w-full bg-white mb-8 shadow-sm">
          <div className="w-full max-w-3xl lg:max-w-[90%] mx-auto py-4 px-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <i className="fas fa-robot text-purple-600 text-xl"></i>
                <div>
                  <h1 className="text-xl font-bold">{report.group_name || 'AI社群日报平台'}</h1>
                  <p className="text-sm text-gray-600">探索AI编程新式生产力工作方式</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold text-gray-800">{formatDate(report.date)}</div>
              </div>
            </div>
          </div>
        </header>

        {/* 主内容 - 横向布局 */}
        <main className="w-full max-w-3xl lg:max-w-[90%] mx-auto px-4 sm:px-6 py-8">
          {/* 返回按钮和下载按钮 */}
          <div className="flex items-center justify-between mb-8">
            <Link
              href="/reports"
              className="flex items-center text-purple-600 hover:text-purple-800 transition-colors bg-white px-4 py-2 rounded-lg shadow-sm border"
            >
              <i className="fas fa-arrow-left mr-2"></i>
              返回日报列表
            </Link>
            
            <button
              onClick={downloadImage}
              className="flex items-center bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors font-medium shadow-sm"
            >
              <i className="fas fa-download mr-2"></i>
              下载图片
            </button>
          </div>

          {/* 日报标题卡片 */}
          <div className="bg-white rounded-xl shadow-sm border mb-8 overflow-hidden">
            <div className="bg-purple-600 p-6 text-white">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="md:w-1/2 text-center md:text-left mb-4 md:mb-0">
                  <h1 className="text-3xl md:text-4xl font-bold">{report.title}</h1>
                  <div className="flex items-center justify-center md:justify-start mt-4 space-x-4">
                    <div className="flex items-center bg-white/20 px-4 py-2 rounded-lg">
                      <i className="fas fa-calendar-alt mr-2"></i>
                      {formatDate(report.date)}
                    </div>
                    {report.group_name && (
                      <div className="flex items-center bg-white/20 px-4 py-2 rounded-lg">
                        <i className="fas fa-users mr-2"></i>
                        {report.group_name}
                      </div>
                    )}
                  </div>
                </div>
                <div className="md:w-1/3 flex justify-center md:justify-end">
                  <div className="text-center">
                    <div className="text-4xl font-bold">
                      {(() => {
                        try {
                          const date = new Date(report.date);
                          const month = date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
                          const day = date.getDate();
                          return `${month} ${day}`;
                        } catch {
                          return 'AUG 10';
                        }
                      })()}
                    </div>
                    <div className="text-xl font-bold">
                      {(() => {
                        try {
                          const date = new Date(report.date);
                          return date.getFullYear();
                        } catch {
                          return '2025';
                        }
                      })()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 日报内容 - 横向布局 */}
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            {/* 内容头部装饰 */}
            <div className="bg-purple-600 h-2"></div>
            
            <div className="p-6 md:p-8">
              <div 
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: report.html_content }}
                style={{
                  color: '#374151',
                  lineHeight: '1.7'
                }}
              />
            </div>
          </div>
          
          {/* 底部操作区域 */}
          <div className="mt-8 text-center">
            <div className="flex items-center justify-center space-x-4 flex-wrap gap-4">
              <Link
                href="/reports"
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-8 py-3 rounded-lg transition-colors font-medium border"
              >
                返回日报列表
              </Link>
              <button
                onClick={downloadImage}
                className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg transition-colors font-medium shadow-lg"
              >
                下载分享图片
              </button>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}