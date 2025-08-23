// API接口：上传HTML日报
// POST /api/upload-html
// 
// curl示例：
// curl -X POST https://your-site.vercel.app/api/upload-html \
//   -H "Content-Type: application/json" \
//   -d '{"html": "<html>...</html>", "title": "日报标题", "date": "2025-01-01"}'

import { promises as fs } from 'fs';
import path from 'path';

export default async function handler(req, res) {
  // 只允许POST请求
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      error: 'Method not allowed. Use POST.' 
    });
  }

  try {
    const { html, title, date, author } = req.body;

    // 验证必需参数
    if (!html) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameter: html'
      });
    }

    // 生成唯一ID（基于时间戳）
    const reportId = Date.now();
    
    // 准备报告数据
    const reportData = {
      id: reportId,
      title: title || `日报_${new Date().toISOString().split('T')[0]}`,
      date: date || new Date().toISOString().split('T')[0],
      author: author || 'AI助手',
      html: html,
      createdAt: new Date().toISOString(),
      status: 'active'
    };

    // 创建存储目录（在临时目录中）
    const storageDir = '/tmp/reports';
    try {
      await fs.mkdir(storageDir, { recursive: true });
    } catch {
      // 目录可能已存在，忽略错误
    }

    // 保存HTML文件
    const htmlFilePath = path.join(storageDir, `${reportId}.html`);
    await fs.writeFile(htmlFilePath, html, 'utf8');

    // 保存元数据
    const metaFilePath = path.join(storageDir, `${reportId}.json`);
    await fs.writeFile(metaFilePath, JSON.stringify(reportData, null, 2), 'utf8');

    console.log(`报告已保存: ID=${reportId}, 标题=${reportData.title}`);

    // 返回成功响应
    res.status(200).json({
      success: true,
      message: 'HTML报告上传成功',
      data: {
        id: reportId,
        title: reportData.title,
        date: reportData.date,
        author: reportData.author,
        upload_time: reportData.createdAt,
        // 提供图片生成API的URL
        image_api_url: `/api/reports/${reportId}/share-image`
      }
    });

  } catch (error) {
    console.error('上传HTML时发生错误:', error);
    
    res.status(500).json({
      success: false,
      error: '服务器内部错误',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

// 配置请求体大小限制
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb', // 允许最大10MB的HTML内容
    },
  },
};