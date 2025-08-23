// 获取日报列表API
// 返回所有已上传的日报

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ 
      success: false, 
      error: 'Method not allowed. Use GET.' 
    });
  }

  try {
    // 确保全局存储存在
    if (!global.reports) {
      global.reports = new Map();
    }
    
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