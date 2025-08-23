import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* 顶部导航 */}
      <nav className="flex items-center justify-between p-6">
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
          <Link href="/prompts" className="text-gray-300 hover:text-white transition-colors">
            AI提示词
          </Link>
        </div>
        <button className="bg-white text-black px-4 py-2 rounded-lg text-sm hover:bg-gray-100 transition-colors">
          登录
        </button>
      </nav>

      {/* 主要内容区域 */}
      <div className="flex flex-col items-center justify-center min-h-[80vh] px-6">
        <div className="text-center max-w-4xl">
          <h1 className="text-6xl font-bold mb-6">
            智能化社群日报
            <br />
            生成与管理平台
          </h1>
          <p className="text-xl text-gray-400 mb-12 opacity-60">
            每日精选社群动态、技术分享、干货合集，助您及时掌握 AI 领域最新进展。
          </p>
          
          {/* CTA按钮 */}
          <div className="flex justify-center gap-4 mb-16">
            <Link href="/reports">
              <button className="bg-white text-black px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                查看示例日报
              </button>
            </Link>
            <button className="bg-black bg-opacity-50 border border-gray-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors">
              了解更多
            </button>
          </div>
        </div>

        {/* 功能模块卡片 */}
        <div className="grid grid-cols-3 gap-8 w-full max-w-6xl">
          {/* 社群日报 */}
          <Link href="/reports">
            <div className="bg-black bg-opacity-60 border border-gray-700 rounded-xl p-8 hover:bg-black hover:bg-opacity-80 transition-colors cursor-pointer">
              <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center mb-6">
                <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-green-500 rounded"></div>
              </div>
              <h3 className="text-xl font-bold mb-4">社群日报</h3>
              <p className="text-gray-400 leading-relaxed">
                AI技术社群的每日精华内容汇总，技术讨论、项目分享、行业动态一网打尽。
              </p>
            </div>
          </Link>

          {/* 应用工具 */}
          <Link href="/tools">
            <div className="bg-black bg-opacity-60 border border-gray-700 rounded-xl p-8 hover:bg-black hover:bg-opacity-80 transition-colors cursor-pointer">
              <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center mb-6">
                <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded"></div>
              </div>
              <h3 className="text-xl font-bold mb-4">应用工具</h3>
              <p className="text-gray-400 leading-relaxed">
                精选AI开发工具集合，提升工作效率的实用应用和资源。
              </p>
            </div>
          </Link>

          {/* AI提示词 */}
          <Link href="/prompts">
            <div className="bg-black bg-opacity-60 border border-gray-700 rounded-xl p-8 hover:bg-black hover:bg-opacity-80 transition-colors cursor-pointer">
              <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center mb-6">
                <div className="w-6 h-6 bg-gradient-to-r from-yellow-500 to-orange-500 rounded"></div>
              </div>
              <h3 className="text-xl font-bold mb-4">AI提示词</h3>
              <p className="text-gray-400 leading-relaxed">
                高质量提示词库，涵盖编程、写作、分析等多个领域的专业提示词。
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}