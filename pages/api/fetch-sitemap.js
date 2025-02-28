import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';
import { promisify } from 'util';

const execPromise = promisify(exec);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { url } = req.body;
      
      if (!url) {
        return res.status(400).json({ error: '请提供域名或URL' });
      }
      
      console.log(`开始获取站点地图: ${url}`);
      
      // 执行Python脚本获取站点地图
      const scriptPath = path.resolve(process.cwd(), 'sitemap_diff.py');
      const command = `python "${scriptPath}" fetch ${url}`;
      
      console.log(`执行命令: ${command}`);
      const { stdout, stderr } = await execPromise(command);
      
      if (stderr) {
        console.error(`Python脚本错误: ${stderr}`);
      }
      
      console.log(`脚本输出: ${stdout}`);
      
      // 查找最新的站点地图文件
      const dataDir = path.resolve(process.cwd(), 'data');
      const files = fs.readdirSync(dataDir);
      const sitemapFiles = files
        .filter(file => file.startsWith(`${url}_`) && file.endsWith('.json'))
        .sort()
        .reverse();
      
      if (sitemapFiles.length === 0) {
        return res.status(500).json({ error: '获取站点地图失败，未找到保存的文件' });
      }
      
      const latestFile = sitemapFiles[0];
      const filePath = path.join(dataDir, latestFile);
      
      // 读取站点地图文件内容
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const sitemapData = JSON.parse(fileContent);
      
      return res.status(200).json({
        success: true,
        domain: url,
        urls: sitemapData,
        filename: latestFile,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('获取站点地图时出错:', error);
      return res.status(500).json({ 
        error: '获取站点地图时出错', 
        details: error.message
      });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 