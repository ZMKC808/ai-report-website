// API接口：获取日报HTML内容
// GET /api/reports/[id]/content
// 
// curl示例：
// curl "https://your-site.vercel.app/api/reports/123/content"

import { promises as fs } from 'fs';
import path from 'path';

export default async function handler(req, res) {
  const { id } = req.query;
  
  // 只允许GET请求
  if (req.method !== 'GET') {
    return res.status(405).json({ 
      success: false, 
      error: 'Method not allowed. Use GET.' 
    });
  }

  // 验证ID参数
  if (!id) {
    return res.status(400).json({
      success: false,
      error: '缺少日报ID参数'
    });
  }

  try {
    const storageDir = '/tmp/reports';
    const metaFilePath = path.join(storageDir, `${id}.json`);
    const htmlFilePath = path.join(storageDir, `${id}.html`);
    
    // 检查元数据文件是否存在
    let reportMeta;
    try {
      const metaContent = await fs.readFile(metaFilePath, 'utf8');
      reportMeta = JSON.parse(metaContent);
    } catch (error) {
      return res.status(404).json({
        success: false,
        error: '日报不存在',
        details: `找不到ID为 ${id} 的日报`
      });
    }
    
    // 读取HTML内容
    let htmlContent = '';
    try {
      htmlContent = await fs.readFile(htmlFilePath, 'utf8');
    } catch (error) {
      console.error(`读取HTML文件失败 (${id}):`, error);
      htmlContent = '<div style="padding: 20px; text-align: center; color: #666;">HTML内容暂时无法加载</div>';
    }
    
    console.log(`成功获取日报内容，ID: ${id}, 标题: ${reportMeta.title}`);
    
    res.status(200).json({
      success: true,
      data: {
        id: reportMeta.id,
        title: reportMeta.title,
        date: reportMeta.date,
        author: reportMeta.author,
        group_name: reportMeta.group_name,
        summary: reportMeta.summary,
        html_content: htmlContent,
        createdAt: reportMeta.createdAt,
        image_api_url: reportMeta.image_api_url
      }
    });

  } catch (error) {
    console.error('获取日报内容时发生错误:', error);
    
    res.status(500).json({
      success: false,
      error: '服务器内部错误',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}