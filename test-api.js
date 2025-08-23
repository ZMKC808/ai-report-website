#!/usr/bin/env node
/**
 * API接口测试脚本
 * 用于测试上传HTML和生成图片的API接口
 * 
 * 使用方法：
 * node test-api.js
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

// 配置
const CONFIG = {
  // 本地测试时使用 http://localhost:3000
  // 部署后使用 https://your-site.vercel.app
  baseUrl: 'http://localhost:3000',
  // baseUrl: 'https://ai-report-website.vercel.app',
};

// 测试用的HTML内容
const TEST_HTML = `
<div style="padding: 20px; font-family: Arial, sans-serif;">
  <h1 style="color: #2c3e50; text-align: center;">AI社群日报测试</h1>
  <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
    <h2 style="color: #34495e;">今日讨论重点</h2>
    <ul>
      <li>AI技术发展趋势分析</li>
      <li>机器学习最佳实践分享</li>
      <li>开源项目推荐与评测</li>
    </ul>
  </div>
  <div style="background: #e8f5e8; padding: 15px; border-radius: 8px; margin: 20px 0;">
    <h3 style="color: #27ae60;">技术亮点</h3>
    <p>本期重点关注了大语言模型在实际应用中的优化策略，包括提示工程、模型微调等关键技术。</p>
  </div>
  <div style="text-align: center; margin-top: 30px; color: #7f8c8d;">
    <p>生成时间: ${new Date().toLocaleString('zh-CN')}</p>
  </div>
</div>
`;

// HTTP请求工具函数
function makeRequest(options, data = null) {
  return new Promise((resolve, reject) => {
    const protocol = options.protocol === 'https:' ? https : http;
    
    const req = protocol.request(options, (res) => {
      let body = '';
      
      res.on('data', (chunk) => {
        body += chunk;
      });
      
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(body);
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            data: jsonData
          });
        } catch (e) {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            data: body
          });
        }
      });
    });
    
    req.on('error', (err) => {
      reject(err);
    });
    
    if (data) {
      req.write(data);
    }
    
    req.end();
  });
}

// 测试上传HTML接口
async function testUploadHtml() {
  console.log('\n🚀 测试上传HTML接口...');
  
  const url = new URL('/api/upload-html', CONFIG.baseUrl);
  
  const postData = JSON.stringify({
    html: TEST_HTML,
    title: 'API测试日报',
    date: new Date().toISOString().split('T')[0],
    author: 'API测试脚本'
  });
  
  const options = {
    hostname: url.hostname,
    port: url.port || (url.protocol === 'https:' ? 443 : 80),
    path: url.pathname,
    method: 'POST',
    protocol: url.protocol,
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };
  
  try {
    const response = await makeRequest(options, postData);
    
    console.log(`📊 状态码: ${response.statusCode}`);
    
    if (response.statusCode === 200 && response.data.success) {
      console.log('✅ HTML上传成功!');
      console.log(`📝 报告ID: ${response.data.data.id}`);
      console.log(`📅 标题: ${response.data.data.title}`);
      console.log(`🔗 图片API: ${response.data.data.image_api_url}`);
      
      return response.data.data.id;
    } else {
      console.log('❌ HTML上传失败:');
      console.log(JSON.stringify(response.data, null, 2));
      return null;
    }
  } catch (error) {
    console.log('❌ 请求失败:', error.message);
    return null;
  }
}

// 测试生成图片接口
async function testGenerateImage(reportId) {
  console.log('\n🖼️  测试生成图片接口...');
  
  const url = new URL(`/api/reports/${reportId}/share-image?include_qr=true&device_mode=mobile`, CONFIG.baseUrl);
  
  const options = {
    hostname: url.hostname,
    port: url.port || (url.protocol === 'https:' ? 443 : 80),
    path: url.pathname + url.search,
    method: 'GET',
    protocol: url.protocol,
    headers: {
      'Accept': 'application/json'
    }
  };
  
  try {
    const response = await makeRequest(options);
    
    console.log(`📊 状态码: ${response.statusCode}`);
    
    if (response.statusCode === 200 && response.data.success) {
      console.log('✅ 图片生成成功!');
      console.log(`📝 报告标题: ${response.data.report_info.title}`);
      console.log(`📅 报告日期: ${response.data.report_info.date}`);
      console.log(`📏 设备模式: ${response.data.generation_params.device_mode}`);
      console.log(`🔍 包含二维码: ${response.data.generation_params.include_qr}`);
      
      // 保存图片到本地（如果是base64数据）
      if (response.data.image_data) {
        const imageData = response.data.image_data;
        let imageBuffer;
        
        if (imageData.startsWith('data:image/')) {
          // 处理data URL格式
          const base64Data = imageData.split(',')[1];
          imageBuffer = Buffer.from(base64Data, 'base64');
        } else {
          // 直接的base64数据
          imageBuffer = Buffer.from(imageData, 'base64');
        }
        
        const filename = `test_report_${reportId}_${Date.now()}.png`;
        const filepath = path.join(__dirname, filename);
        
        fs.writeFileSync(filepath, imageBuffer);
        console.log(`💾 图片已保存: ${filepath}`);
        console.log(`📦 图片大小: ${imageBuffer.length} 字节`);
      }
      
      return true;
    } else {
      console.log('❌ 图片生成失败:');
      console.log(JSON.stringify(response.data, null, 2));
      return false;
    }
  } catch (error) {
    console.log('❌ 请求失败:', error.message);
    return false;
  }
}

// 生成curl命令示例
function generateCurlExamples(reportId) {
  console.log('\n📋 curl命令示例:');
  console.log('\n1. 上传HTML:');
  console.log(`curl -X POST ${CONFIG.baseUrl}/api/upload-html \\`);
  console.log(`  -H "Content-Type: application/json" \\`);
  console.log(`  -d '{
    "html": "<div><h1>测试日报</h1><p>这是测试内容</p></div>",
    "title": "测试日报标题",
    "date": "${new Date().toISOString().split('T')[0]}",
    "author": "测试用户"
  }'`);
  
  if (reportId) {
    console.log('\n2. 生成图片:');
    console.log(`curl "${CONFIG.baseUrl}/api/reports/${reportId}/share-image?include_qr=true&device_mode=mobile"`);
  }
}

// 主测试函数
async function runTests() {
  console.log('🧪 开始API接口测试');
  console.log(`🌐 测试地址: ${CONFIG.baseUrl}`);
  
  // 测试上传HTML
  const reportId = await testUploadHtml();
  
  if (reportId) {
    // 等待一下，确保文件已保存
    console.log('\n⏳ 等待文件保存...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // 测试生成图片
    await testGenerateImage(reportId);
  }
  
  // 生成curl示例
  generateCurlExamples(reportId);
  
  console.log('\n🎉 测试完成!');
  
  if (reportId) {
    console.log('\n💡 提示:');
    console.log('- 如果是本地测试，请确保运行了 npm run dev');
    console.log('- 如果是生产环境测试，请修改 CONFIG.baseUrl 为你的Vercel地址');
    console.log('- 图片生成可能需要一些时间，请耐心等待');
  }
}

// 运行测试
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = {
  testUploadHtml,
  testGenerateImage,
  generateCurlExamples
};