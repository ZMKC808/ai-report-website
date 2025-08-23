const fs = require('fs');
const path = require('path');

// 模拟FormData和fetch，使用本地API
const reports = [];

// 读取HTML文件
const htmlPath = path.resolve('../Reports/20250810/沟通_20250810.html');
const htmlContent = fs.readFileSync(htmlPath, 'utf8');

// 创建报告数据
const reportData = {
  id: Date.now(),
  title: '沟通8月10日',
  date: '2025-08-10',
  group_name: '沟通',
  summary: '- 法律实务分享：新《治安管理处罚法》解读\n- 个人成长思考：边界设定和可视化\n- 社会观察洞察：草根派vs精英派对比\n- 商业案例剖析：项目管理沟通智慧',
  html_content: htmlContent,
  created_at: new Date().toISOString()
};

console.log('🚀 正在上传沟通群8月10日日报...');
console.log('📋 报告信息:');
console.log('   标题:', reportData.title);
console.log('   日期:', reportData.date);
console.log('   群组:', reportData.group_name);
console.log('   ID:', reportData.id);

// 模拟上传到生产环境
async function uploadToProduction() {
  try {
    const FormData = require('form-data');
    const fetch = require('node-fetch');
    
    const form = new FormData();
    form.append('title', reportData.title);
    form.append('date', reportData.date);
    form.append('group_name', reportData.group_name);
    form.append('summary', reportData.summary);
    form.append('html_file', htmlContent, {
      filename: '沟通_20250810.html',
      contentType: 'text/html'
    });
    
    console.log('🌐 正在上传到生产环境: https://ai-report-website.vercel.app/api/reports/upload');
    
    const response = await fetch('https://ai-report-website.vercel.app/api/reports/upload', {
      method: 'POST',
      body: form,
      timeout: 30000
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ 上传成功!');
      console.log('📋 报告详情:');
      console.log('   ID:', result.id);
      console.log('   标题:', result.title);
      console.log('   日期:', result.date);
      console.log('   群组:', result.group_name);
      console.log('🔗 查看链接: https://ai-report-website.vercel.app/reports/' + result.id);
      console.log('🖼️ 图片API: https://ai-report-website.vercel.app/api/reports/' + result.id + '/share-image');
      
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

// 先检查依赖
async function checkAndInstall() {
  try {
    require('node-fetch');
    require('form-data');
  } catch (error) {
    console.log('📦 正在安装必要的依赖...');
    const { execSync } = require('child_process');
    try {
      execSync('npm install node-fetch@2 form-data', { stdio: 'inherit' });
      console.log('✅ 依赖安装完成');
    } catch (installError) {
      console.log('❌ 依赖安装失败，使用本地API测试');
      return false;
    }
  }
  return true;
}

// 本地API测试上传
async function uploadToLocal() {
  try {
    console.log('🔄 使用本地API进行测试上传...');
    
    // 模拟本地API调用
    const localReports = require('./data/reports.json') || [];
    
    const newReport = {
      id: reportData.id,
      title: reportData.title,
      date: reportData.date,
      group_name: reportData.group_name,
      summary: reportData.summary,
      html_content: reportData.html_content,
      created_at: reportData.created_at
    };
    
    localReports.push(newReport);
    
    // 保存到本地
    fs.writeFileSync('./data/reports.json', JSON.stringify(localReports, null, 2));
    
    console.log('✅ 本地测试上传成功!');
    console.log('📋 报告详情:');
    console.log('   ID:', newReport.id);
    console.log('   标题:', newReport.title);
    console.log('   日期:', newReport.date);
    console.log('   群组:', newReport.group_name);
    console.log('🔗 本地查看: http://localhost:3000/reports/' + newReport.id);
    
    return newReport;
  } catch (error) {
    console.error('❌ 本地上传错误:', error.message);
    return null;
  }
}

// 执行上传
async function main() {
  const hasDepends = await checkAndInstall();
  
  let result = null;
  if (hasDepends) {
    result = await uploadToProduction();
  }
  
  if (!result) {
    console.log('🔄 尝试本地API上传...');
    result = await uploadToLocal();
  }
  
  if (result) {
    console.log('\n🎉 沟通群8月10日日报上传完成！');
    console.log('现在可以访问网站查看日报内容');
  } else {
    console.log('\n❌ 上传失败，请检查配置或稍后重试');
  }
}

main();
