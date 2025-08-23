// API接口：上传日报（兼容配置文件格式）
// POST /api/reports/upload
// 
// 支持multipart/form-data格式，兼容你的配置文件中的curl命令
// curl示例：
// curl -X POST "https://ai-report-website.vercel.app/api/reports/upload" \
//   -F "title=业务脑袋1月23日" \
//   -F "date=2025-01-23" \
//   -F "group_name=业务脑袋" \
//   -F "summary=- 深入观察度交流\n- 李想创业智慧解读\n- 房产投资观察" \
//   -F "html_file=@/path/to/report.html" \
//   -F "image_file=@/path/to/report.png"

import { promises as fs } from 'fs';
import path from 'path';
import formidable from 'formidable';

// 配置API路由
export const config = {
  api: {
    bodyParser: false, // 禁用默认的body parser，使用formidable处理文件上传
  },
};

export default async function handler(req, res) {
  // 只允许POST请求
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      error: 'Method not allowed. Use POST.' 
    });
  }

  try {
    // 解析multipart/form-data
    const form = formidable({
      maxFileSize: 10 * 1024 * 1024, // 10MB限制
      keepExtensions: true,
    });

    const [fields, files] = await form.parse(req);
    
    // 提取字段值（formidable返回数组，取第一个值）
    const title = Array.isArray(fields.title) ? fields.title[0] : fields.title;
    const date = Array.isArray(fields.date) ? fields.date[0] : fields.date;
    const group_name = Array.isArray(fields.group_name) ? fields.group_name[0] : fields.group_name;
    const summary = Array.isArray(fields.summary) ? fields.summary[0] : fields.summary;
    const author = Array.isArray(fields.author) ? fields.author[0] : fields.author;
    
    // 验证必需参数
    if (!title) {
      return res.status(400).json({
        success: false,
        error: '缺少日报标题'
      });
    }
    
    if (!date) {
      return res.status(400).json({
        success: false,
        error: '缺少日报日期'
      });
    }
    
    // 生成唯一ID（基于日期和群组名）
    const dateStr = date.replace(/-/g, '');
    const groupStr = (group_name || 'default').replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '');
    const reportId = `${dateStr}_${groupStr}_${Date.now()}`;
    
    // 确保存储目录存在
    const storageDir = '/tmp/reports';
    try {
      await fs.mkdir(storageDir, { recursive: true });
    } catch (error) {
      console.log('存储目录已存在或创建失败:', error.message);
    }
    
    // 处理HTML文件
    let htmlContent = '';
    if (files.html_file && files.html_file[0]) {
      const htmlFile = files.html_file[0];
      htmlContent = await fs.readFile(htmlFile.filepath, 'utf8');
      
      // 保存HTML文件
      const htmlFilePath = path.join(storageDir, `${reportId}.html`);
      await fs.writeFile(htmlFilePath, htmlContent, 'utf8');
    } else if (fields.html) {
      // 如果没有文件，检查是否有HTML字段
      htmlContent = Array.isArray(fields.html) ? fields.html[0] : fields.html;
      const htmlFilePath = path.join(storageDir, `${reportId}.html`);
      await fs.writeFile(htmlFilePath, htmlContent, 'utf8');
    }
    
    // 处理图片文件（可选）
    let imageInfo = null;
    if (files.image_file && files.image_file[0]) {
      const imageFile = files.image_file[0];
      const imageExt = path.extname(imageFile.originalFilename || '.png');
      const imageFilePath = path.join(storageDir, `${reportId}${imageExt}`);
      
      // 复制图片文件
      await fs.copyFile(imageFile.filepath, imageFilePath);
      
      imageInfo = {
        filename: `${reportId}${imageExt}`,
        size: imageFile.size,
        type: imageFile.mimetype
      };
    }
    
    // 准备报告元数据
    const reportData = {
      id: reportId,
      title: title,
      date: date,
      group_name: group_name || '未知群组',
      author: author || '系统',
      summary: summary || '',
      createdAt: new Date().toISOString(),
      image_api_url: `/api/reports/${reportId}/share-image`,
      view_url: `/reports/${reportId}`,
      has_html: !!htmlContent,
      has_image: !!imageInfo,
      image_info: imageInfo
    };
    
    // 保存元数据
    const metaFilePath = path.join(storageDir, `${reportId}.json`);
    await fs.writeFile(metaFilePath, JSON.stringify(reportData, null, 2), 'utf8');
    
    console.log('日报上传成功:', {
      id: reportId,
      title: reportData.title,
      date: reportData.date,
      group: reportData.group_name,
      hasHtml: reportData.has_html,
      hasImage: reportData.has_image
    });
    
    res.status(200).json({
      success: true,
      message: '日报上传成功',
      data: {
        id: reportId,
        title: reportData.title,
        date: reportData.date,
        group_name: reportData.group_name,
        author: reportData.author,
        image_api_url: reportData.image_api_url,
        view_url: reportData.view_url,
        has_html: reportData.has_html,
        has_image: reportData.has_image
      }
    });

  } catch (error) {
    console.error('上传日报时发生错误:', error);
    
    res.status(500).json({
      success: false,
      error: '服务器内部错误',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}