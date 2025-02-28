import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs';

const execPromise = promisify(exec);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { files } = req.body;
      
      if (!files || !Array.isArray(files) || files.length !== 2) {
        return res.status(400).json({ error: '请提供两个站点地图文件进行比较' });
      }
      
      const [file1, file2] = files;
      
      // 检查文件是否存在
      const dataDir = path.join(process.cwd(), 'data');
      const file1Path = path.join(dataDir, file1);
      const file2Path = path.join(dataDir, file2);
      
      if (!fs.existsSync(file1Path)) {
        return res.status(404).json({ error: `文件不存在: ${file1}` });
      }
      
      if (!fs.existsSync(file2Path)) {
        return res.status(404).json({ error: `文件不存在: ${file2}` });
      }
      
      // 获取脚本的绝对路径
      const scriptPath = path.join(process.cwd(), 'sitemap_diff.py');
      
      // 构建命令 - 使用绝对路径
      const command = `python "${scriptPath}" compare --files "${file1Path}" "${file2Path}"`;
      console.log(`执行命令: ${command}`);
      
      const { stdout, stderr } = await execPromise(command, {
        cwd: process.cwd(),
        timeout: 60000 // 60秒
      });
      
      console.log("比较脚本输出:", stdout);
      
      if (stderr) {
        console.error('比较脚本错误:', stderr);
        return res.status(500).json({ error: stderr });
      }
      
      return res.status(200).json({ success: true, output: stdout });
    } catch (error) {
      console.error('比较脚本异常:', error);
      return res.status(500).json({ 
        error: '执行比较脚本时出错', 
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