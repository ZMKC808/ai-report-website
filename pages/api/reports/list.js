// 获取日报列表API
// 返回所有已上传的日报
import fs from 'fs';
import path from 'path';

// 从文件系统读取报告数据
function loadReportsFromFile() {
  try {
    const reportsFilePath = path.join(process.cwd(), 'data', 'reports.json');
    if (fs.existsSync(reportsFilePath)) {
      const data = fs.readFileSync(reportsFilePath, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('读取报告文件失败:', error);
  }
  return [];
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ 
      success: false, 
      error: 'Method not allowed. Use GET.' 
    });
  }

  try {
    // 从文件系统中读取报告数据
    const reportsData = loadReportsFromFile();
    
    // 确保全局存储存在并更新
    if (!global.reports) {
      global.reports = new Map();
    }
    
    // 将文件系统中的数据同步到内存中
    reportsData.forEach(report => {
      global.reports.set(report.id.toString(), report);
    });
    
    // 从全局存储中获取所有日报
    const reportList = Array.from(global.reports.values())
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at)) // 按创建时间倒序
      .map(report => ({
        id: report.id,
        title: report.title,
        date: report.date,
        group_name: report.group_name,
        summary: report.summary,
        view_url: report.view_url,
        image_api_url: report.image_api_url,
        created_at: report.created_at
      }));

    console.log(`📋 获取日报列表，共 ${reportList.length} 条记录`);

    res.status(200).json({
      success: true,
      data: reportList,
      total: reportList.length
    });

  } catch (error) {
    console.error('❌ 获取日报列表时发生错误:', error);
    
    res.status(500).json({
      success: false,
      error: '服务器内部错误',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}