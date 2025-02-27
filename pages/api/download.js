import fs from 'fs';
import path from 'path';

// 数据存储目录
const DATA_DIR = path.join(process.cwd(), 'data');

export default async function handler(req, res) {
  const { id } = req.query;
  
  if (!id) {
    return res.status(400).json({ error: '请提供站点地图ID' });
  }
  
  try {
    // 确保数据目录存在
    if (!fs.existsSync(DATA_DIR)) {
      return res.status(404).json({ error: '数据目录不存在' });
    }
    
    const filePath = path.join(DATA_DIR, id);
    
    // 检查文件是否存在
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: '站点地图文件不存在' });
    }
    
    // 设置响应头
    res.setHeader('Content-Disposition', `attachment; filename=${id}`);
    res.setHeader('Content-Type', 'application/json');
    
    // 创建文件读取流并发送
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  } catch (error) {
    console.error('下载站点地图时出错:', error);
    return res.status(500).json({ error: '下载站点地图时出错' + error.message });
  }
} 