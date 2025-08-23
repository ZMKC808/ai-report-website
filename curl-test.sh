#!/bin/bash

# 测试上传8月20日"沟通"项目的聊天记录

echo "🚀 正在上传沟通项目聊天记录..."

# 创建测试HTML文件
cat > 沟通项目_8月20日.html << 'EOF'
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title>沟通项目聊天记录 - 8月20日</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
        .container { max-width: 800px; margin: 0 auto; background: white; padding: 20px; border-radius: 10px; }
        .header { text-align: center; margin-bottom: 30px; }
        .chat-message { margin: 15px 0; padding: 10px; border-left: 3px solid #007bff; background: #f8f9fa; }
        .user { font-weight: bold; color: #007bff; }
        .content { margin-top: 5px; line-height: 1.6; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>沟通项目聊天记录</h1>
            <p>2025年8月20日</p>
        </div>
        <div class="chat-message">
            <div class="user">张三</div>
            <div class="content">今天我们需要讨论项目沟通流程优化问题</div>
        </div>
        <div class="chat-message">
            <div class="user">李四</div>
            <div class="content">建议制定标准化的沟通模板，提升沟通效率</div>
        </div>
        <div class="chat-message">
            <div class="user">王五</div>
            <div class="content">可以引入协作工具，如Slack或企业微信群组</div>
        </div>
    </div>
</body>
</html>
EOF

echo "✅ HTML文件已创建"

# 使用curl上传
curl -X POST "https://ai-report-website.vercel.app/api/reports/upload" \
  -F "title=沟通项目聊天记录" \
  -F "date=2025-08-20" \
  -F "group_name=沟通项目组" \
  -F "summary=讨论沟通流程优化、协作工具引入、跨部门协调等关键议题" \
  -F "html_file=@沟通项目_8月20日.html"

echo ""
echo "✅ 上传完成！请查看网站: https://ai-report-website.vercel.app/reports"