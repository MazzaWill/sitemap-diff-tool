import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';

const execPromise = promisify(exec);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { url } = req.body;
      
      if (!url) {
        return res.status(400).json({ error: '请提供URL' });
      }
      
      // 获取脚本的绝对路径
      const scriptPath = path.join(process.cwd(), 'sitemap_diff.py');
      
      // 执行命令，指定工作目录
      const { stdout, stderr } = await execPromise(`python "${scriptPath}" fetch ${url}`, {
        cwd: process.cwd()
      });
      
      // 检查是否找到URL
      if (stdout.includes('未找到任何URL')) {
        return res.status(404).json({ 
          success: false, 
          error: '未找到任何URL，请检查网站是否有站点地图',
          output: stdout 
        });
      }
      
      return res.status(200).json({ success: true, output: stdout });
    } catch (error) {
      console.error('Exception:', error);
      return res.status(500).json({ 
        error: '执行脚本时出错', 
        details: error.message,
        stdout: error.stdout,
        stderr: error.stderr
      });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 