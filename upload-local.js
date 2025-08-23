const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

// 读取HTML文件
const htmlPath = path.resolve(__dirname, '../Reports/20250810/沟通_20250810.html');
const htmlContent = fs.readFileSync(htmlPath, 'utf8');

// 创建报告数据
const reportData = {
  title: '沟通8月10日',
  date: '2025-08-10',
  group_name: '沟通',
  summary: '- 法律实务分享：新《治安管理处罚法》解读\n- 个人成长思考：边界设定和可视化\n- 社会观察洞察：草根派vs精英派对比\n- 商业案例剖析：项目管理沟通智慧',
  html_content: htmlContent
};

console.log('🚀 正在上传沟通群8月10日日报到本地API...');
console.log('📋 报告信息:');
console.log('   标题:', reportData.title);
console.log('   日期:', reportData.date);
console.log('   群组:', reportData.group_name);

async function uploadToLocalAPI() {
  try {
    const response = await fetch('http://localhost:3000/api/reports/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reportData)
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ 上传成功!');
      console.log('📋 报告详情:');
      console.log('   ID:', result.data.id);
      console.log('   标题:', result.data.title);
      console.log('   日期:', result.data.date);
      console.log('   群组:', result.data.group_name);
      console.log('🔗 查看链接: http://localhost:3000/reports/' + result.data.id);
      
      return result;
    } else {
      const errorText = await response.text();
      console.log('❌ 上传失败:', response.status, errorText);
      return null;
    }
  } catch (error) {
    console.error('❌ 上传错误:', error.message);
    return null;
  }
}

// 执行上传
async function main() {
  const result = await uploadToLocalAPI();
  
  if (result) {
    console.log('\n🎉 沟通群8月10日日报上传完成！');
    console.log('现在可以访问网站查看日报内容');
  } else {
    console.log('\n❌ 上传失败，请检查配置或稍后重试');
  }
}

main();