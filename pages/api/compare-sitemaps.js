import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

// 从文件加载站点地图数据
const loadSitemapData = (filePath) => {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`加载站点地图数据失败: ${filePath}`, error);
    return null;
  }
};

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      console.log('收到比较请求');
      const { sitemapData1, sitemapData2 } = req.body;
      
      if (!sitemapData1 || !sitemapData2) {
        console.log('缺少站点地图数据');
        return res.status(400).json({ error: '请提供两个站点地图数据进行比较' });
      }
      
      // 记录接收到的数据结构
      console.log('站点地图1:', {
        filename: sitemapData1.filename,
        domain: sitemapData1.domain
      });
      console.log('站点地图2:', {
        filename: sitemapData2.filename,
        domain: sitemapData2.domain
      });
      
      // 提取文件名
      const file1 = sitemapData1.filename;
      const file2 = sitemapData2.filename;
      
      if (!file1 || !file2) {
        console.log('站点地图数据缺少文件名信息');
        return res.status(400).json({ error: '站点地图数据缺少文件名信息' });
      }
      
      // 获取完整的文件路径
      const dataDir = path.resolve(process.cwd(), 'data');
      const filePath1 = path.join(dataDir, file1);
      const filePath2 = path.join(dataDir, file2);
      
      // 检查文件是否存在
      if (!fs.existsSync(filePath1)) {
        console.log(`文件不存在: ${filePath1}`);
        return res.status(400).json({ error: `文件不存在: ${file1}` });
      }
      
      if (!fs.existsSync(filePath2)) {
        console.log(`文件不存在: ${filePath2}`);
        return res.status(400).json({ error: `文件不存在: ${file2}` });
      }
      
      // 加载站点地图数据以获取URL数量
      const data1 = loadSitemapData(filePath1);
      const data2 = loadSitemapData(filePath2);
      
      if (!data1 || !data2) {
        return res.status(500).json({ error: '无法加载站点地图数据文件' });
      }
      
      // 执行Python脚本比较站点地图
      const scriptPath = path.resolve(process.cwd(), 'sitemap_diff.py');
      const command = `python "${scriptPath}" compare --files "${filePath1}" "${filePath2}"`;
      
      console.log(`执行命令: ${command}`);
      const { stdout, stderr } = await execPromise(command);
      
      if (stderr) {
        console.error(`Python脚本错误: ${stderr}`);
      }
      
      console.log(`比较脚本输出: ${stdout}`);
      
      // 解析Python脚本输出
      const outputLines = stdout.split('\n');
      let newUrlsCount = 0;
      const newUrls = [];
      
      // 解析输出以提取新URL
      let captureUrls = false;
      for (const line of outputLines) {
        if (line.includes('新增URL:')) {
          const match = line.match(/找到 (\d+) 个新增URL/);
          if (match) {
            newUrlsCount = parseInt(match[1], 10);
          }
          captureUrls = true;
          continue;
        }
        
        if (captureUrls && line.trim() && !line.includes('旧站点地图') && !line.includes('新站点地图')) {
          newUrls.push(line.trim());
        }
      }
      
      // 生成输出结果
      let output = '';
      if (newUrls.length > 0) {
        output += `找到 ${newUrls.length} 个新增URL:\n`;
        newUrls.forEach(url => {
          output += `${url}\n`;
        });
      } else {
        output += '没有找到新增URL\n';
      }
      
      // 限制返回的URL数量，避免响应过大
      const limitedUrls = newUrls.length > 1000 ? newUrls.slice(0, 1000) : newUrls;
      
      const responseData = { 
        success: true, 
        output,
        newUrls: limitedUrls,
        totalNew: newUrls.length,
        oldTotal: data1.urls?.length || 0,
        newTotal: data2.urls?.length || 0,
        file1: file1,
        file2: file2
      };
      
      console.log('响应数据大小约为:', JSON.stringify(responseData).length, '字节');
      
      return res.status(200).json(responseData);
    } catch (error) {
      console.error('比较站点地图时出错:', error);
      return res.status(500).json({ 
        error: '执行比较时出错', 
        details: error.message
      });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 