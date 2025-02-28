// 这个API端点将不再需要，因为我们将直接从前端的IndexedDB获取数据
// 但为了兼容性，我们可以保留它并返回一个空列表

import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';
import { promisify } from 'util';

const execPromise = promisify(exec);

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // 执行Python脚本列出所有站点地图
      const scriptPath = path.resolve(process.cwd(), 'sitemap_diff.py');
      const command = `python "${scriptPath}" list`;
      
      console.log(`执行命令: ${command}`);
      const { stdout, stderr } = await execPromise(command);
      
      if (stderr) {
        console.error(`Python脚本错误: ${stderr}`);
      }
      
      // 直接从data目录读取所有JSON文件
      const dataDir = path.resolve(process.cwd(), 'data');
      const files = fs.readdirSync(dataDir);
      const sitemapFiles = files
        .filter(file => file.endsWith('.json'))
        .sort()
        .reverse();
      
      // 解析文件名获取域名和时间戳
      const sitemaps = sitemapFiles.map(filename => {
        // 假设文件名格式为: domain_YYYYMMDD_HHMMSS.json
        const parts = filename.split('_');
        const domain = parts[0];
        const dateStr = parts.length > 1 ? parts[1] : '';
        const timeStr = parts.length > 2 ? parts[2].replace('.json', '') : '';
        
        // 读取文件获取URL数量
        const filePath = path.join(dataDir, filename);
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const urls = JSON.parse(fileContent);
        
        return {
          domain,
          filename,
          timestamp: `${dateStr}_${timeStr}`,
          urlCount: urls.length,
          fullPath: filePath
        };
      });
      
      return res.status(200).json({
        success: true,
        sitemaps,
        message: '成功获取站点地图列表'
      });
    } catch (error) {
      console.error('获取站点地图列表时出错:', error);
      return res.status(500).json({ 
        error: '获取站点地图列表时出错', 
        details: error.message
      });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 