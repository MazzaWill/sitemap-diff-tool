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
      
      console.log(`执行命令: python "${scriptPath}" fetch ${url}`);
      
      // 执行命令，指定工作目录
      const { stdout, stderr } = await execPromise(`python "${scriptPath}" fetch ${url}`, {
        cwd: process.cwd(),
        // 增加超时时间
        timeout: 60000 // 60秒
      });
      
      console.log("脚本输出:", stdout);
      if (stderr) {
        console.error("脚本错误:", stderr);
      }
      
      // 检查是否找到URL
      if (stdout.includes('未找到任何URL')) {
        return res.status(404).json({ 
          success: false, 
          error: '未找到任何URL，请检查网站是否有站点地图',
          output: stdout 
        });
      }
      
      // 检查是否成功保存了文件
      if (stdout.includes('已保存') && stdout.includes('个URL到文件')) {
        return res.status(200).json({ success: true, output: stdout });
      }
      
      // 如果没有明确的成功或失败标志，但有输出
      if (stdout.trim()) {
        return res.status(200).json({ success: true, output: stdout });
      }
      
      // 默认情况，可能是未知错误
      return res.status(500).json({ 
        success: false, 
        error: '处理站点地图时出现未知错误',
        output: stdout 
      });
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