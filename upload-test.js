const fs = require('fs');
const FormData = require('form-data');
const fetch = require('node-fetch');

// 测试上传8月20日"沟通"项目的聊天记录
async function uploadReport() {
  try {
    // 创建测试HTML内容
    const testHtml = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>沟通项目聊天记录 - 8月20日</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
        .container { max-width: 800px; margin: 0 auto; background: white; padding: 20px; border-radius: 10px; }
        .header { text-align: center; margin-bottom: 30px; }
        .date { color: #666; font-size: 14px; }
        .title { color: #333; font-size: 24px; margin: 10px 0; }
        .chat-message { margin: 15px 0; padding: 10px; border-left: 3px solid #007bff; background: #f8f9fa; }
        .user { font-weight: bold; color: #007bff; }
        .time { color: #999; font-size: 12px; }
        .content { margin-top: 5px; line-height: 1.6; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="date">2025年8月20日</div>
            <h1 class="title">沟通项目聊天记录</h1>
        </div>
        
        <div class="chat-message">
            <div class="user">张三 <span class="time">09:15</span></div>
            <div class="content">今天我们需要讨论一下项目的沟通流程优化问题</div>
        </div>
        
        <div class="chat-message">
            <div class="user">李四 <span class="time">09:18</span></div>
            <div class="content">同意，现在的沟通效率确实有待提升，建议我们制定一个标准化的沟通模板</div>
        </div>
        
        <div class="chat-message">
            <div class="user">王五 <span class="time">09:22</span></div>
            <div class="content">我觉得可以引入一些协作工具，比如Slack或者企业微信群组</div>
        </div>
        
        <div class="chat-message">
            <div class="user">赵六 <span class="time">09:25</span></div>
            <div class="content">还需要考虑跨部门沟通的问题，建议设立专门的沟通协调员</div>
        </div>
        
        <div class="chat-message">
            <div class="user">张三 <span class="time">09:30</span></div>
            <div class="content">总结一下今天的讨论要点：
            1. 制定标准化沟通模板
            2. 引入协作工具
            3. 设立沟通协调员
            4. 定期评估沟通效果</div>
        </div>
    </div>
</body>
</html>`;

    // 保存HTML文件到本地
    const htmlPath = './沟通项目_8月20日.html';
    fs.writeFileSync(htmlPath, testHtml, 'utf8');
    console.log('✅ HTML文件已保存到:', htmlPath);

    // 准备上传数据
    const formData = new FormData();
    formData.append('title', '沟通项目聊天记录');
    formData.append('date', '2025-08-20');
    formData.append('group_name', '沟通项目组');
    formData.append('summary', '讨论沟通流程优化、协作工具引入、跨部门协调等关键议题');
    formData.append('html_file', fs.createReadStream(htmlPath));

    // 上传到API
    const apiUrl = 'https://ai-report-website.vercel.app/api/reports/upload';
    console.log('🚀 正在上传到:', apiUrl);
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      body: formData,
      headers: formData.getHeaders()
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ 上传成功!');
      console.log('📋 报告ID:', result.data.id);
      console.log('🔗 查看链接:', `https://ai-report-website.vercel.app/reports/${result.data.id}`);
      console.log('🖼️ 图片API:', `https://ai-report-website.vercel.app/api/reports/${result.data.id}/share-image`);
    } else {
      console.log('❌ 上传失败:', result);
    }

  } catch (error) {
    console.error('❌ 错误:', error.message);
  }
}

// 运行测试
uploadReport();