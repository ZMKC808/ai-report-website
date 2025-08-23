// 获取日报详情内容API
// 返回指定ID的日报HTML内容

// 使用全局变量获取数据
let reports;
if (!global.reports) {
  global.reports = new Map();
}
reports = global.reports;

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method !== 'GET') {
    return res.status(405).json({ 
      success: false, 
      error: 'Method not allowed. Use GET.' 
    });
  }

  try {
    // 从内存存储中获取日报
    const report = reports.get(id);
    
    if (!report) {
      return res.status(404).json({
        success: false,
        error: '日报不存在',
        message: `未找到ID为 ${id} 的日报`
      });
    }

    console.log(`📄 获取日报详情: ${report.title} (ID: ${id})`);

    res.status(200).json({
      success: true,
      data: {
        id: report.id,
        title: report.title,
        date: report.date,
        group_name: report.group_name,
        summary: report.summary,
        html_content: report.html_content,
        created_at: report.created_at,
        image_api_url: report.image_api_url
      }
    });

  } catch (error) {
    console.error('❌ 获取日报详情时发生错误:', error);
    
    res.status(500).json({
      success: false,
      error: '服务器内部错误',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}