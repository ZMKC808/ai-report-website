'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ReportDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (params.id) {
      fetchReportContent(params.id);
    }
  }, [params.id]);

  const fetchReportContent = async (id) => {
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

  const formatDate = (dateStr) => {
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
        // 创建下载链接
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
      <div className="min-h-screen bg-black text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-400">正在加载日报内容...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-8 max-w-md mx-auto">
              <h2 className="text-xl font-bold text-red-400 mb-4">加载失败</h2>
              <p className="text-gray-300 mb-6">{error}</p>
              <div className="space-x-4">
                <button
                  onClick={() => fetchReportContent(params.id)}
                  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
                >
                  重试
                </button>
                <Link
                  href="/reports"
                  className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg transition-colors inline-block"
                >
                  返回列表
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h2 className="text-xl font-bold text-gray-400 mb-4">日报不存在</h2>
            <Link
              href="/reports"
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors inline-block"
            >
              返回列表
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* 导航栏 */}
      <nav className="border-b border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-xl font-bold">
              AI社群日报平台
            </Link>
            <div className="flex items-center space-x-6">
              <Link href="/reports" className="text-gray-300 hover:text-white transition-colors">
                社群日报
              </Link>
              <Link href="/tools" className="text-gray-300 hover:text-white transition-colors">
                应用工具
              </Link>
              <Link href="/prompts" className="text-gray-300 hover:text-white transition-colors">
                AI提示词
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* 主要内容 */}
      <div className="container mx-auto px-4 py-8">
        {/* 头部信息 */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <Link
              href="/reports"
              className="flex items-center text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              返回日报列表
            </Link>
            
            <button
              onClick={downloadImage}
              className="flex items-center bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              下载图片
            </button>
          </div>
          
          <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-800">
            <h1 className="text-3xl font-bold mb-2">{report.title}</h1>
            <div className="flex items-center space-x-6 text-gray-400">
              <span className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {formatDate(report.date)}
              </span>
              {report.group_name && (
                <span className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  {report.group_name}
                </span>
              )}
              {report.author && (
                <span className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  {report.author}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* HTML内容 */}
        <div className="bg-white rounded-lg overflow-hidden shadow-lg">
          <div 
            className="prose prose-lg max-w-none p-8"
            dangerouslySetInnerHTML={{ __html: report.html_content }}
            style={{
              color: '#333',
              lineHeight: '1.6'
            }}
          />
        </div>
      </div>
    </div>
  );
}