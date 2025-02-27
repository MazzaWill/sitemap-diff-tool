import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { files } = req.body;
      
      if (!files || !Array.isArray(files) || files.length !== 2) {
        return res.status(400).json({ error: '请提供两个站点地图文件进行比较' });
      }
      
      const [file1, file2] = files;
      const { stdout, stderr } = await execPromise(`python sitemap_diff.py compare --files "${file1}" "${file2}"`);
      
      if (stderr) {
        console.error('Error:', stderr);
        return res.status(500).json({ error: stderr });
      }
      
      return res.status(200).json({ success: true, output: stdout });
    } catch (error) {
      console.error('Exception:', error);
      return res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 