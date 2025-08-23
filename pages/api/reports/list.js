// API接口：获取日报列表
// GET /api/reports/list
// 
// curl示例：
// curl "https://your-site.vercel.app/api/reports/list"

import { promises as fs } from 'fs';
import path from 'path';

export default async function handler(req, res) {
  // 只允许GET请求
  if (req.method !== 'GET') {
    return res.status(405).json({ 
      success: false, 
      error: 'Method not allowed. Use GET.' 
    });
  }

  try {
    const storageDir = '/tmp/reports';
    
    // 检查存储目录是否存在
    let files = [];
    try {
      files = await fs.readdir(storageDir);
    } catch (error) {
      // 目录不存在，返回空列表
      return res.status(200).json({
        success: true,
        reports: [],
        message: '暂无日报数据'
      });
    }

    // 筛选出JSON元数据文件
    const jsonFiles = files.filter(file => file.endsWith('.json'));
    
    const reports = [];
    
    // 读取每个日报的元数据
    for (const jsonFile of jsonFiles) {
      try {
        const filePath = path.join(storageDir, jsonFile);
        const content = await fs.readFile(filePath, 'utf8');
        const reportData = JSON.parse(content);
        
        // 添加渐变色配置
        const gradients = [
          "bg-gradient-to-br from-blue-500 via-purple-500 to-purple-600",
          "bg-gradient-to-br from-green-400 via-blue-500 to-blue-600", 
          "bg-gradient-to-br from-pink-500 via-purple-500 to-purple-600",
          "bg-gradient-to-br from-orange-500 via-red-500 to-red-600",
          "bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500"
        ];
        
        // 根据ID选择渐变色
        const gradientIndex = parseInt(reportData.id) % gradients.length;
        
        // 处理摘要数据
        let summary = [];
        if (typeof reportData.summary === 'string') {
          // 如果是字符串，按行分割并清理
          summary = reportData.summary
            .split('\n')
            .map(line => line.trim().replace(/^-\s*/, ''))
            .filter(line => line.length > 0)
            .slice(0, 3); // 最多显示3条
        } else if (Array.isArray(reportData.summary)) {
          summary = reportData.summary.slice(0, 3);
        }
        
        reports.push({
          id: reportData.id,
          date: formatDate(reportData.date),
          title: reportData.title || "今日讨论重点",
          summary: summary.length > 0 ? summary : ["暂无摘要信息"],
          group: reportData.group_name || reportData.author || "未知群组",
          gradient: gradients[gradientIndex],
          createdAt: reportData.createdAt,
          rawDate: reportData.date
        });
        
      } catch (error) {
        console.error(`读取日报文件 ${jsonFile} 失败:`, error);
        continue;
      }
    }
    
    // 按创建时间倒序排列
    reports.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    console.log(`获取日报列表成功，共 ${reports.length} 条记录`);
    
    res.status(200).json({
      success: true,
      reports: reports,
      total: reports.length,
      message: `成功获取 ${reports.length} 条日报记录`
    });

  } catch (error) {
    console.error('获取日报列表时发生错误:', error);
    
    res.status(500).json({
      success: false,
      error: '服务器内部错误',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

// 格式化日期显示
function formatDate(dateStr) {
  try {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    
    return `${year}年${month}月${day}日`;
  } catch (error) {
    return dateStr || '未知日期';
  }
}