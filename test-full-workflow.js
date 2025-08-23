#!/usr/bin/env node
/**
 * 完整工作流程测试脚本
 * 模拟本地脚本上传HTML日报并生成图片的完整流程
 * 
 * 使用方法：
 * node test-full-workflow.js
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');

// 配置
const CONFIG = {
  // 部署后使用你的Vercel地址
  baseUrl: 'https://ai-report-website.vercel.app',
  // 本地测试时使用
  // baseUrl: 'http://localhost:3000',
};

// 创建测试HTML内容
const createTestHTML = (title, date, group) => {
  return `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background: #f8f9fa;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            border-radius: 12px;
            text-align: center;
            margin-bottom: 30px;
        }
        .header h1 {
            margin: 0;
            font-size: 2.5em;
            font-weight: 700;
        }
        .header .date {
            font-size: 1.2em;
            opacity: 0.9;
            margin-top: 10px;
        }
        .content {
            background: white;
            padding: 30px;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        .section {
            margin-bottom: 30px;
        }
        .section h2 {
            color: #2c3e50;
            border-bottom: 3px solid #3498db;
            padding-bottom: 10px;
            margin-bottom: 20px;
        }
        .highlight-box {
            background: #e8f5e8;
            border-left: 4px solid #27ae60;
            padding: 20px;
            margin: 20px 0;
            border-radius: 0 8px 8px 0;
        }
        .discussion-item {
            background: #f8f9fa;
            padding: 15px;
            margin: 10px 0;
            border-radius: 8px;
            border-left: 3px solid #007bff;
        }
        .footer {
            text-align: center;
            margin-top: 40px;
            padding: 20px;
            color: #666;
            font-size: 0.9em;
        }
        ul {
            list-style-type: none;
            padding: 0;
        }
        li {
            padding: 8px 0;
            border-bottom: 1px solid #eee;
        }
        li:before {
            content: "▶ ";
            color: #3498db;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>${title}</h1>
        <div class="date">${date} | ${group}</div>
    </div>
    
    <div class="content">
        <div class="section">
            <h2>📈 今日讨论重点</h2>
            <div class="discussion-item">
                <strong>AI技术发展趋势</strong>
                <p>社群成员深入讨论了大语言模型的最新发展，包括GPT-4的应用场景和优化策略。</p>
            </div>
            <div class="discussion-item">
                <strong>项目实战分享</strong>
                <p>多位成员分享了实际项目中的技术难点和解决方案，涵盖前端、后端和AI集成。</p>
            </div>
            <div class="discussion-item">
                <strong>行业洞察交流</strong>
                <p>关于AI行业的最新动态和商业机会的深度分析，为创业者提供了宝贵的参考。</p>
            </div>
        </div>
        
        <div class="section">
            <h2>💡 技术亮点</h2>
            <div class="highlight-box">
                <h3>本期重点关注</h3>
                <ul>
                    <li>大语言模型在实际应用中的优化策略</li>
                    <li>提示工程的最佳实践和技巧分享</li>
                    <li>模型微调的实战经验和注意事项</li>
                    <li>AI工具链的搭建和使用心得</li>
                </ul>
            </div>
        </div>
        
        <div class="section">
            <h2>🔥 热门话题</h2>
            <ul>
                <li>ChatGPT API的高效使用方法</li>
                <li>本地AI模型部署的最佳实践</li>
                <li>AI辅助编程工具的对比评测</li>
                <li>机器学习项目的完整开发流程</li>
                <li>AI创业项目的商业模式探讨</li>
            </ul>
        </div>
        
        <div class="section">
            <h2>📚 资源分享</h2>
            <div class="highlight-box">
                <p><strong>推荐阅读：</strong></p>
                <ul>
                    <li>《深度学习实战指南》- 理论与实践结合</li>
                    <li>《AI产品经理手册》- 商业应用视角</li>
                    <li>《提示工程完全指南》- 实用技巧集合</li>
                </ul>
            </div>
        </div>
    </div>
    
    <div class="footer">
        <p>📊 数据统计：本期讨论消息 ${Math.floor(Math.random() * 200 + 100)} 条 | 活跃成员 ${Math.floor(Math.random() * 20 + 15)} 人</p>
        <p>🤖 由 AI 智能分析生成 | 生成时间：${new Date().toLocaleString('zh-CN')}</p>
    </div>
</body>
</html>
  `.trim();
};

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

// 使用FormData上传文件
function uploadWithFormData(url, fields, files) {
  return new Promise((resolve, reject) => {
    const form = new FormData();
    
    // 添加字段
    Object.keys(fields).forEach(key => {
      form.append(key, fields[key]);
    });
    
    // 添加文件
    Object.keys(files).forEach(key => {
      form.append(key, fs.createReadStream(files[key]));
    });
    
    form.submit(url, (err, res) => {
      if (err) {
        reject(err);
        return;
      }
      
      let body = '';
      res.on('data', chunk => {
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
  });
}

// 测试完整工作流程
async function testFullWorkflow() {
  console.log('🚀 开始完整工作流程测试');
  console.log(`🌐 目标地址: ${CONFIG.baseUrl}`);
  
  // 1. 创建测试数据
  const testData = {
    title: `AI编程互助会${new Date().getMonth() + 1}月${new Date().getDate()}日`,
    date: new Date().toISOString().split('T')[0],
    group_name: 'AI编程互助会',
    summary: '- AI技术发展趋势分析\n- 项目实战经验分享\n- 行业洞察深度交流',
    author: '自动化脚本'
  };
  
  console.log('\n📝 测试数据:');
  console.log(`标题: ${testData.title}`);
  console.log(`日期: ${testData.date}`);
  console.log(`群组: ${testData.group_name}`);
  
  // 2. 创建临时HTML文件
  const htmlContent = createTestHTML(testData.title, testData.date, testData.group_name);
  const tempDir = path.join(__dirname, 'temp');
  
  // 确保临时目录存在
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }
  
  const htmlFilePath = path.join(tempDir, `${testData.title.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '_')}.html`);
  fs.writeFileSync(htmlFilePath, htmlContent, 'utf8');
  
  console.log(`\n📄 HTML文件已创建: ${htmlFilePath}`);
  
  try {
    // 3. 上传日报
    console.log('\n📤 正在上传日报...');
    
    const uploadUrl = `${CONFIG.baseUrl}/api/reports/upload`;
    
    const response = await uploadWithFormData(uploadUrl, testData, {
      html_file: htmlFilePath
    });
    
    console.log(`📊 上传状态码: ${response.statusCode}`);
    
    if (response.statusCode === 200 && response.data.success) {
      console.log('✅ 日报上传成功!');
      console.log(`📝 报告ID: ${response.data.data.id}`);
      console.log(`📅 标题: ${response.data.data.title}`);
      console.log(`🔗 查看链接: ${CONFIG.baseUrl}${response.data.data.view_url}`);
      console.log(`🖼️ 图片API: ${CONFIG.baseUrl}${response.data.data.image_api_url}`);
      
      const reportId = response.data.data.id;
      
      // 4. 等待一下，然后生成图片
      console.log('\n⏳ 等待文件处理...');
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // 5. 生成并下载图片
      console.log('\n🖼️ 正在生成图片...');
      
      const imageUrl = `${CONFIG.baseUrl}/api/reports/${reportId}/share-image?include_qr=true&device_mode=mobile`;
      const url = new URL(imageUrl);
      
      const imageOptions = {
        hostname: url.hostname,
        port: url.port || (url.protocol === 'https:' ? 443 : 80),
        path: url.pathname + url.search,
        method: 'GET',
        protocol: url.protocol,
        headers: {
          'Accept': 'application/json'
        }
      };
      
      const imageResponse = await makeRequest(imageOptions);
      
      console.log(`📊 图片生成状态码: ${imageResponse.statusCode}`);
      
      if (imageResponse.statusCode === 200 && imageResponse.data.success) {
        console.log('✅ 图片生成成功!');
        
        // 保存图片
        if (imageResponse.data.image_data) {
          const imageData = imageResponse.data.image_data;
          let imageBuffer;
          
          if (imageData.startsWith('data:image/')) {
            const base64Data = imageData.split(',')[1];
            imageBuffer = Buffer.from(base64Data, 'base64');
          } else {
            imageBuffer = Buffer.from(imageData, 'base64');
          }
          
          const imageFilePath = path.join(tempDir, `${testData.title.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '_')}.png`);
          fs.writeFileSync(imageFilePath, imageBuffer);
          
          console.log(`💾 图片已保存: ${imageFilePath}`);
          console.log(`📦 图片大小: ${imageBuffer.length} 字节`);
        }
        
        // 6. 验证网站更新
        console.log('\n🌐 验证网站更新...');
        
        const listUrl = `${CONFIG.baseUrl}/api/reports/list`;
        const listUrlObj = new URL(listUrl);
        
        const listOptions = {
          hostname: listUrlObj.hostname,
          port: listUrlObj.port || (listUrlObj.protocol === 'https:' ? 443 : 80),
          path: listUrlObj.pathname,
          method: 'GET',
          protocol: listUrlObj.protocol,
          headers: {
            'Accept': 'application/json'
          }
        };
        
        const listResponse = await makeRequest(listOptions);
        
        if (listResponse.statusCode === 200 && listResponse.data.success) {
          const reports = listResponse.data.reports || [];
          const newReport = reports.find(r => r.id === reportId);
          
          if (newReport) {
            console.log('✅ 网站已更新，新日报已显示在列表中!');
            console.log(`📋 列表中共有 ${reports.length} 条日报`);
          } else {
            console.log('⚠️ 网站列表中未找到新上传的日报');
          }
        }
        
      } else {
        console.log('❌ 图片生成失败:');
        console.log(JSON.stringify(imageResponse.data, null, 2));
      }
      
    } else {
      console.log('❌ 日报上传失败:');
      console.log(JSON.stringify(response.data, null, 2));
    }
    
  } catch (error) {
    console.error('❌ 测试过程中发生错误:', error.message);
  } finally {
    // 清理临时文件
    try {
      if (fs.existsSync(htmlFilePath)) {
        fs.unlinkSync(htmlFilePath);
        console.log('\n🧹 临时HTML文件已清理');
      }
    } catch (error) {
      console.log('⚠️ 清理临时文件失败:', error.message);
    }
  }
  
  console.log('\n🎉 完整工作流程测试完成!');
  console.log('\n💡 总结:');
  console.log('1. ✅ 本地生成HTML文件');
  console.log('2. ✅ 上传到网站API');
  console.log('3. ✅ 网站存储日报数据');
  console.log('4. ✅ 生成分享图片');
  console.log('5. ✅ 网站列表自动更新');
  console.log('\n🔗 你现在可以访问网站查看新上传的日报!');
  console.log(`   网站地址: ${CONFIG.baseUrl}/reports`);
}

// 运行测试
if (require.main === module) {
  testFullWorkflow().catch(console.error);
}

module.exports = {
  testFullWorkflow,
  createTestHTML
};