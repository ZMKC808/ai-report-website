// API接口：生成日报分享图片
// GET /api/reports/[id]/share-image
// 
// curl示例：
// curl "https://your-site.vercel.app/api/reports/123/share-image?include_qr=true&device_mode=mobile"

import { promises as fs } from 'fs';
import path from 'path';
import puppeteer from 'puppeteer';

export default async function handler(req, res) {
  // 只允许GET请求
  if (req.method !== 'GET') {
    return res.status(405).json({ 
      success: false, 
      error: 'Method not allowed. Use GET.' 
    });
  }

  let browser = null;

  try {
    const { id } = req.query;
    const { 
      include_qr = 'true', 
      device_mode = 'mobile',
      qr_guide_text = '扫描二维码查看完整内容'
    } = req.query;

    // 验证报告ID
    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'Missing report ID'
      });
    }

    // 检查报告是否存在
    const storageDir = '/tmp/reports';
    const htmlFilePath = path.join(storageDir, `${id}.html`);
    const metaFilePath = path.join(storageDir, `${id}.json`);

    let htmlContent, reportMeta;
    
    try {
      htmlContent = await fs.readFile(htmlFilePath, 'utf8');
      const metaContent = await fs.readFile(metaFilePath, 'utf8');
      reportMeta = JSON.parse(metaContent);
    } catch (error) {
      return res.status(404).json({
        success: false,
        error: `Report with ID ${id} not found`
      });
    }

    // 使用Puppeteer生成图片
    const imageBuffer = await generateImageFromHtml(htmlContent, {
      includeQr: include_qr === 'true',
      deviceMode: device_mode,
      qrGuideText: qr_guide_text,
      reportMeta: reportMeta
    });

    // 将图片转换为base64
    const base64Image = imageBuffer.toString('base64');

    console.log(`生成图片成功: 报告ID=${id}, 设备模式=${device_mode}, 大小=${imageBuffer.length}字节`);

    // 返回成功响应
    res.status(200).json({
      success: true,
      message: '图片生成成功',
      image_data: base64Image, // base64编码的图片数据
      report_info: {
        id: reportMeta.id,
        title: reportMeta.title,
        date: reportMeta.date,
        author: reportMeta.author
      },
      generation_params: {
        include_qr: include_qr === 'true',
        device_mode: device_mode,
        qr_guide_text: qr_guide_text
      }
    });

  } catch (error) {
    console.error('生成图片时发生错误:', error);
    
    res.status(500).json({
      success: false,
      error: '服务器内部错误',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  } finally {
    // 确保浏览器被关闭
    if (browser) {
      try {
        await browser.close();
      } catch (e) {
        console.error('关闭浏览器时出错:', e);
      }
    }
  }
}

// 使用Puppeteer将HTML转换为图片
async function generateImageFromHtml(htmlContent, options) {
  const { includeQr, deviceMode, qrGuideText, reportMeta } = options;
  
  // 设置视口尺寸
  const viewport = deviceMode === 'mobile' 
    ? { width: 600, height: 800 }
    : { width: 1200, height: 800 };

  let browser = null;
  
  try {
    // 启动浏览器
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--single-process',
        '--disable-gpu'
      ]
    });

    const page = await browser.newPage();
    
    // 设置视口
    await page.setViewport(viewport);

    // 处理HTML内容，添加样式优化
    const processedHtml = processHtmlForScreenshot(htmlContent, {
      includeQr,
      qrGuideText,
      deviceMode,
      reportMeta
    });

    // 设置HTML内容
    await page.setContent(processedHtml, {
      waitUntil: 'networkidle0',
      timeout: 15000
    });

    // 等待页面完全加载
    await page.waitForTimeout(1000);

    // 截图
    const screenshot = await page.screenshot({
      type: 'png',
      fullPage: false,
      clip: {
        x: 0,
        y: 0,
        width: viewport.width,
        height: viewport.height
      }
    });

    return screenshot;

  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// 处理HTML内容，优化截图效果
function processHtmlForScreenshot(htmlContent, options) {
  const { includeQr, qrGuideText, deviceMode, reportMeta } = options;
  
  // 添加基础样式和优化
  const additionalStyles = `
    <style>
      * {
        box-sizing: border-box;
      }
      body {
        margin: 0;
        padding: 20px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        min-height: 100vh;
        color: #333;
      }
      .report-container {
        background: white;
        border-radius: 12px;
        padding: 30px;
        box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        max-width: ${deviceMode === 'mobile' ? '560px' : '1160px'};
        margin: 0 auto;
      }
      .report-header {
        text-align: center;
        margin-bottom: 30px;
        border-bottom: 2px solid #f0f0f0;
        padding-bottom: 20px;
      }
      .report-title {
        font-size: ${deviceMode === 'mobile' ? '24px' : '32px'};
        font-weight: bold;
        color: #2c3e50;
        margin-bottom: 10px;
      }
      .report-meta {
        color: #7f8c8d;
        font-size: ${deviceMode === 'mobile' ? '14px' : '16px'};
      }
      ${includeQr ? `
        .qr-section {
          margin-top: 30px;
          text-align: center;
          padding: 20px;
          background: #f8f9fa;
          border-radius: 8px;
        }
        .qr-placeholder {
          width: 100px;
          height: 100px;
          background: #ddd;
          margin: 0 auto 10px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          color: #666;
        }
        .qr-text {
          font-size: 12px;
          color: #666;
        }
      ` : ''}
    </style>
  `;

  // 包装HTML内容
  const wrappedHtml = `
    <!DOCTYPE html>
    <html lang="zh-CN">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${reportMeta.title}</title>
      ${additionalStyles}
    </head>
    <body>
      <div class="report-container">
        <div class="report-header">
          <div class="report-title">${reportMeta.title}</div>
          <div class="report-meta">${reportMeta.date} | ${reportMeta.author}</div>
        </div>
        <div class="report-content">
          ${htmlContent}
        </div>
        ${includeQr ? `
          <div class="qr-section">
            <div class="qr-placeholder">二维码</div>
            <div class="qr-text">${qrGuideText}</div>
          </div>
        ` : ''}
      </div>
    </body>
    </html>
  `;

  return wrappedHtml;
}
