// 测试业务脑袋群日报上传
// 完全按照ai_report_config.json中的格式

const fs = require('fs');
const FormData = require('form-data');
const fetch = require('node-fetch');

async function testBusinessBrainUpload() {
  try {
    console.log('🧠 测试业务脑袋群日报上传...\n');

    // 创建测试HTML内容（模拟你的日报格式）
    const testHtml = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>业务脑袋群日报 - 8月20日</title>
    <style>
        body { 
            font-family: -apple-system, BlinkMacSystemFont, sans-serif; 
            margin: 0; padding: 20px; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
        }
        .container { 
            max-width: 800px; margin: 0 auto; 
            background: white; border-radius: 15px; 
            padding: 30px; box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }
        .header { 
            text-align: center; margin-bottom: 30px; 
            padding: 20px; background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
            border-radius: 10px; color: white;
        }
        .highlight-card { 
            background: linear-gradient(45deg, #667eea, #764ba2);
            color: white; padding: 20px; border-radius: 10px; 
            margin: 20px 0; box-shadow: 0 10px 20px rgba(0,0,0,0.1);
        }
        .topic-card { 
            border-left: 4px solid #667eea; 
            background: #f8f9fa; padding: 15px; 
            margin: 15px 0; border-radius: 5px;
        }
        .user { font-weight: bold; color: #667eea; }
        .stats { 
            display: flex; justify-content: space-around; 
            background: #f1f3f4; padding: 20px; 
            border-radius: 10px; margin: 20px 0;
        }
        .stat-item { text-align: center; }
        .stat-number { font-size: 24px; font-weight: bold; color: #667eea; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🧠 业务脑袋群日报</h1>
            <p>2025年8月20日 | 沟通项目专题讨论</p>
        </div>
        
        <div class="highlight-card">
            <h2>📈 今日亮点总结</h2>
            <ul>
                <li>深入观察度交流 - 项目沟通流程优化讨论</li>
                <li>李想创业智慧解读 - 分享创业经验和方法论</li>
                <li>房产投资观察 - 市场趋势分析和投资策略</li>
            </ul>
        </div>
        
        <div class="stats">
            <div class="stat-item">
                <div class="stat-number">145</div>
                <div>交流总次数</div>
            </div>
            <div class="stat-item">
                <div class="stat-number">2</div>
                <div>参与人数</div>
            </div>
            <div class="stat-item">
                <div class="stat-number">阿霖</div>
                <div>最活跃成员</div>
            </div>
        </div>
        
        <h2>🔥 热门话题</h2>
        
        <div class="topic-card">
            <h3>💼 项目沟通流程优化</h3>
            <p><span class="user">阿霖:</span> 我们需要建立更高效的沟通机制，减少信息传递的损耗</p>
            <p><span class="user">阿竹:</span> 同意，可以考虑引入一些协作工具来提升效率</p>
        </div>
        
        <div class="topic-card">
            <h3>🚀 创业智慧分享</h3>
            <p><span class="user">阿霖:</span> 李想的创业方法论很值得学习，特别是关于产品定位的思考</p>
            <p><span class="user">阿竹:</span> 确实，从用户需求出发，而不是从技术出发，这个思路很重要</p>
        </div>
        
        <div class="topic-card">
            <h3>🏠 房产投资观察</h3>
            <p><span class="user">阿霖:</span> 当前市场环境下，需要更谨慎地评估投资风险</p>
            <p><span class="user">阿竹:</span> 地段和政策因素都很关键，需要综合考虑</p>
        </div>
        
        <h2>💎 创造者金句</h2>
        <div class="highlight-card">
            <p>"真正的沟通不是信息的传递，而是理解的达成" - 阿霖</p>
            <p>"投资的本质是对未来的判断，而判断需要基于深度的思考" - 阿竹</p>
        </div>
    </div>
</body>
</html>`;

    // 保存HTML文件
    const htmlPath = './业务脑袋_20250820.html';
    fs.writeFileSync(htmlPath, testHtml, 'utf8');
    console.log('✅ HTML文件已创建:', htmlPath);

    // 准备上传数据（完全按照你的配置格式）
    const formData = new FormData();
    formData.append('title', '业务脑袋8月20日');
    formData.append('date', '2025-08-20');
    formData.append('group_name', '业务脑袋');
    formData.append('summary', '- 深入观察度交流\n- 李想创业智慧解读\n- 房产投资观察');
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
    
    if (response.ok && result.success) {
      console.log('\n✅ 上传成功!');
      console.log('📋 报告详情:');
      console.log('   ID:', result.data.id);
      console.log('   标题:', result.data.title);
      console.log('   日期:', result.data.date);
      console.log('   群组:', result.data.group_name);
      console.log('🔗 查看链接:', `https://ai-report-website.vercel.app${result.data.view_url}`);
      console.log('🖼️ 图片API:', `https://ai-report-website.vercel.app${result.data.image_api_url}`);
      
      // 测试获取日报列表
      console.log('\n📋 测试获取日报列表...');
      const listResponse = await fetch('https://ai-report-website.vercel.app/api/reports/list');
      const listResult = await listResponse.json();
      
      if (listResult.success) {
        console.log(`✅ 日报列表获取成功，共 ${listResult.total} 条记录`);
        listResult.data.forEach((report, index) => {
          console.log(`   ${index + 1}. ${report.title} (${report.date})`);
        });
      }
      
    } else {
      console.log('\n❌ 上传失败:');
      console.log('状态码:', response.status);
      console.log('错误信息:', result);
    }

  } catch (error) {
    console.error('\n❌ 测试过程中发生错误:', error.message);
  }
}

// 运行测试
console.log('🧪 开始测试业务脑袋群日报系统...\n');
testBusinessBrainUpload();