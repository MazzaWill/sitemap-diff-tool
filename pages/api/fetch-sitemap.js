import { exec } from 'child_process';
import path from 'path';
import { promisify } from 'util';
import { v4 as uuidv4 } from 'uuid';

const execPromise = promisify(exec);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { url } = req.body;
      
      if (!url) {
        return res.status(400).json({ error: '请提供域名或URL' });
      }
      
      console.log(`开始获取站点地图: ${url}`);
      
      // 执行Python脚本获取站点地图，但不保存到文件
      const scriptPath = path.resolve(process.cwd(), 'sitemap_diff.py');
      const command = `python "${scriptPath}" fetch ${url} --no-save`;
      
      console.log(`执行命令: ${command}`);
      const { stdout, stderr } = await execPromise(command);
      
      if (stderr) {
        console.error(`Python脚本错误: ${stderr}`);
      }
      
      console.log(`脚本输出: ${stdout}`);
      
      // 解析Python脚本输出，提取URL列表
      const urls = [];
      const lines = stdout.split('\n');
      let captureUrls = false;
      
      for (const line of lines) {
        if (line.includes('从Sitemap中提取到')) {
          captureUrls = true;
          continue;
        }
        
        if (captureUrls && line.trim() && !line.includes('已保存') && !line.startsWith('尝试') && !line.startsWith('检测')) {
          urls.push(line.trim());
        }
      }
      
      // 如果没有捕获到URL，尝试直接解析所有可能的URL
      if (urls.length === 0) {
        for (const line of lines) {
          if (line.trim().startsWith('http')) {
            urls.push(line.trim());
          }
        }
      }
      
      console.log(`解析到 ${urls.length} 个URL`);
      
      // 生成唯一的文件名
      const timestamp = new Date().toISOString().replace(/:/g, '').replace(/\./g, '').replace(/[-T]/g, '').substring(0, 14);
      const domain = url.replace(/^https?:\/\//, '').split('/')[0];
      const filename = `${domain}_${timestamp}.json`;
      
      // 构建返回数据
      const sitemapData = {
        domain: domain,
        timestamp: new Date().toISOString(),
        urls: urls
      };
      
      return res.status(200).json({
        success: true,
        domain: domain,
        urls: urls,
        filename: filename,
        timestamp: new Date().toISOString(),
        data: sitemapData
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