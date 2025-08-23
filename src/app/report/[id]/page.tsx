"use client";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useState } from "react";

export default function ReportDetail() {
  const params = useParams();
  const reportId = (params?.id as string) || '';
  const [showShareMenu, setShowShareMenu] = useState(false);
  
  if (!reportId) {
    return <div>加载中...</div>;
  }

  // 模拟HTML内容
  const htmlContent = `
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 32px; border-radius: 16px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
      <div style="text-align: center; margin-bottom: 32px;">
        <h1 style="font-size: 2.5rem; margin: 0; font-weight: 700;">AI编程互助群</h1>
        <p style="font-size: 1.2rem; margin: 8px 0 0 0; opacity: 0.9;">2025年01月19日 日报</p>
      </div>
      
      <div style="background: rgba(255,255,255,0.1); border-radius: 12px; padding: 24px; margin-bottom: 24px; backdrop-filter: blur(10px);">
        <h2 style="font-size: 1.5rem; margin: 0 0 16px 0; color: #fbbf24;">精华亮点荟萃</h2>
        <div style="background: rgba(255,255,255,0.05); padding: 16px; border-radius: 8px;">
          <p style="margin: 0; font-size: 1.1rem;"> 特朗普发币引发讨论</p>
          <p style="margin: 8px 0 0 0; font-size: 1.1rem;"> Cursor工具使用技巧分享</p>
          <p style="margin: 8px 0 0 0; font-size: 1.1rem;"> iOS开发文档资源整合</p>
        </div>
      </div>
      
      <div style="background: rgba(255,255,255,0.1); border-radius: 12px; padding: 24px; backdrop-filter: blur(10px);">
        <h3 style="color: #a855f7; font-size: 1.3rem; margin: 0 0 16px 0;">特朗普发币引发讨论</h3>
        <div style="background: rgba(139, 92, 246, 0.1); padding: 16px; border-radius: 8px; margin-bottom: 16px;">
          <p style="margin: 0; font-style: italic; opacity: 0.9;">"川普发币了...... 太魔幻了"</p>
        </div>
        <div style="margin: 0; line-height: 1.6;">
          <p>群友观点：</p>
          <ul style="margin: 8px 0 0 0; padding-left: 20px;">
            <li>有群友猜测可能是为了化解债务</li>
            <li>有人质疑是否是真实消息或账号被盗</li>
            <li>群友讨论了名人币的发展趋势</li>
            <li>群主提醒大家注意投资风险</li>
          </ul>
        </div>
      </div>
    </div>
  `;

  const handleImageShare = () => {
    alert('图片分享功能正在开发中...');
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="bg-slate-800/50 backdrop-blur-sm sticky top-0 z-40 border-b border-slate-700">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link 
              href="/" 
              className="text-slate-400 hover:text-white transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              AI编程互助会日报
            </Link>
            <div className="text-slate-500">查看完整内容</div>
          </div>
          
          <div className="relative">
            <button
              onClick={() => setShowShareMenu(!showShareMenu)}
              className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              图片分享
            </button>
            
            {showShareMenu && (
              <div className="absolute right-0 top-full mt-2 bg-slate-800 border border-slate-600 rounded-lg shadow-xl min-w-48 py-2">
                <button
                  onClick={handleImageShare}
                  className="w-full px-4 py-2 text-left text-white hover:bg-slate-700 transition-colors flex items-center gap-3"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  下载图片
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        <div 
          className="bg-white rounded-2xl shadow-2xl overflow-hidden"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </div>
    </div>
  );
}