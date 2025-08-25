// 兼容业务脑袋群配置的日报上传API
// 支持你的ai_report_config.json中的curl命令格式

import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

// 使用全局变量存储数据，确保API之间可以共享
if (!global.reports) {
  global.reports = new Map();
}
const reports = global.reports;

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

// 保存报告到文件系统
function saveReportsToFile(reportsArray) {
  try {
    const reportsFilePath = path.join(process.cwd(), 'data', 'reports.json');
    const dataDir = path.dirname(reportsFilePath);
    
    // 确保data目录存在
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    fs.writeFileSync(reportsFilePath, JSON.stringify(reportsArray, null, 2), 'utf8');
    console.log('✅ 报告数据已保存到文件系统');
  } catch (error) {
    console.error('❌ 保存报告到文件系统失败:', error);
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      error: 'Method not allowed. Use POST.' 
    });
  }

  try {
    const form = formidable({
      uploadDir: process.platform === 'win32' ? process.env.TEMP || 'C:\\temp' : '/tmp',
      keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024, // 10MB
    });

    const [fields, files] = await form.parse(req);
    
    // 提取字段值（formidable返回数组）
    const getField = (name) => fields[name] ? fields[name][0] : null;
    
    // 兼容你的配置文件参数
    const title = getField('title') || '未命名日报';
    const date = getField('date') || new Date().toISOString().split('T')[0];
    const groupName = getField('group_name') || '未知群组';
    const summary = getField('summary') || '';
    
    // 处理HTML文件
    let htmlContent = '';
    if (files.html_file && files.html_file[0]) {
      const htmlFile = files.html_file[0];
      htmlContent = fs.readFileSync(htmlFile.filepath, 'utf8');
    }
    
    // 处理图片文件
    let imagePath = '';
    if (files.image_file && files.image_file[0]) {
      const imageFile = files.image_file[0];
      imagePath = imageFile.filepath;
    }
    
    // 生成唯一ID
    const reportId = Date.now().toString();
    
    // 保存到内存存储（模拟数据库）
    const reportData = {
      id: reportId,
      title: title,
      date: date,
      group_name: groupName,
      summary: summary,
      html_content: htmlContent,
      image_path: imagePath,
      created_at: new Date().toISOString(),
      view_url: `/reports/${reportId}`,
      image_api_url: `/api/reports/${reportId}/share-image`
    };
    
    // 从文件系统加载现有报告
    const existingReports = loadReportsFromFile();
    
    // 将现有报告同步到内存中
    existingReports.forEach(report => {
      if (!reports.has(report.id.toString())) {
        reports.set(report.id.toString(), report);
      }
    });
    
    // 保存到内存
    reports.set(reportId, reportData);
    
    // 保存到文件系统
    const updatedReportsArray = Array.from(reports.values());
    saveReportsToFile(updatedReportsArray);
    
    console.log('✅ 业务脑袋日报上传成功:', {
      id: reportId,
      title: title,
      date: date,
      group_name: groupName,
      summary: summary.substring(0, 50) + '...'
    });
    
    res.status(200).json({
      success: true,
      message: '日报上传成功',
      data: {
        id: reportId,
        title: title,
        date: date,
        group_name: groupName,
        summary: summary,
        view_url: `/reports/${reportId}`,
        image_api_url: `/api/reports/${reportId}/share-image`,
        created_at: reportData.created_at
      }
    });

  } catch (error) {
    console.error('❌ 上传日报时发生错误:', error);
    
    res.status(500).json({
      success: false,
      error: '服务器内部错误',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

// 导出reports用于其他API访问
export { reports };