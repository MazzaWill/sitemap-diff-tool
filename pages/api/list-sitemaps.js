import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const { stdout, stderr } = await execPromise('python sitemap_diff.py list');
      
      if (stderr) {
        console.error('Error:', stderr);
        return res.status(500).json({ error: stderr });
      }
      
      // 解析输出以获取站点地图文件列表
      const lines = stdout.split('\n');
      const sitemapFiles = [];
      
      let startCollecting = false;
      for (const line of lines) {
        if (line.includes('找到') && line.includes('个Sitemap文件')) {
          startCollecting = true;
          continue;
        }
        
        if (startCollecting && line.trim()) {
          // 提取文件名
          const match = line.match(/^(.+?)(\s+\(\d+\.\d+\s+KB\))?$/);
          if (match) {
            sitemapFiles.push(match[1].trim());
          }
        }
      }
      
      return res.status(200).json({ success: true, sitemaps: sitemapFiles });
    } catch (error) {
      console.error('Exception:', error);
      return res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 