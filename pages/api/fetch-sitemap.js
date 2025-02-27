import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { url } = req.body;
      
      if (!url) {
        return res.status(400).json({ error: '请提供URL' });
      }
      
      const { stdout, stderr } = await execPromise(`python sitemap_diff.py fetch ${url}`);
      
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