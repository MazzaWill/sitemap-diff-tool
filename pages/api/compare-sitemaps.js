import { exec } from 'child_process';
import path from 'path';
import { promisify } from 'util';
import fs from 'fs';
import os from 'os';
import { v4 as uuidv4 } from 'uuid';

const execPromise = promisify(exec);

// 创建临时文件
const createTempFile = async (data, prefix) => {
  const tempDir = os.tmpdir();
  const filename = `${prefix}_${uuidv4()}.json`;
  const filePath = path.join(tempDir, filename);
  
  // 如果data是字符串，直接写入；否则转换为JSON字符串
  const content = typeof data === 'string' ? data : JSON.stringify(data);
  
  await fs.promises.writeFile(filePath, content, 'utf8');
  return filePath;
};

// 配置API路由，增加响应大小限制
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
    responseLimit: false, // 禁用响应大小限制
  },
};

export default async function handler(req, res) {
  // 增加响应大小限制
  res.setHeader('Content-Type', 'application/json');
  
  if (req.method === 'POST') {
    try {
      console.log('收到比较请求');
      const { sitemapData1, sitemapData2, sitemapContent1, sitemapContent2 } = req.body;
      
      if ((!sitemapData1 || !sitemapData2) && (!sitemapContent1 || !sitemapContent2)) {
        console.log('缺少站点地图数据');
        return res.status(400).json({ error: '请提供两个站点地图数据进行比较' });
      }
      
      let filePath1, filePath2;
      let domain1, domain2;
      
      // 处理两种情况：1. 上传的文件内容 2. 服务器上的文件
      if (sitemapContent1 && sitemapContent2) {
        // 用户上传的文件内容
        console.log('使用上传的站点地图内容进行比较');
        
        try {
          const content1 = JSON.parse(sitemapContent1);
          const content2 = JSON.parse(sitemapContent2);
          
          domain1 = content1.domain;
          domain2 = content2.domain;
          
          filePath1 = await createTempFile(sitemapContent1, domain1);
          filePath2 = await createTempFile(sitemapContent2, domain2);
        } catch (error) {
          console.error('解析上传的站点地图内容失败:', error);
          return res.status(400).json({ error: '无效的站点地图内容格式' });
        }
      } else {
        // 服务器上的文件
        console.log('使用服务器上的站点地图文件进行比较');
        
        // 记录接收到的数据结构
        console.log('站点地图1:', sitemapData1);
        console.log('站点地图2:', sitemapData2);
        
        // 提取文件名和域名
        const file1 = sitemapData1.filename;
        const file2 = sitemapData2.filename;
        domain1 = sitemapData1.domain;
        domain2 = sitemapData2.domain;
        
        if (!file1 || !file2) {
          console.log('站点地图数据缺少文件名信息');
          return res.status(400).json({ error: '站点地图数据缺少文件名信息' });
        }
        
        // 获取完整的文件路径
        const dataDir = path.resolve(process.cwd(), 'data');
        filePath1 = path.join(dataDir, file1);
        filePath2 = path.join(dataDir, file2);
        
        console.log('文件1路径:', filePath1);
        console.log('文件2路径:', filePath2);
        
        // 检查文件是否存在
        if (!fs.existsSync(filePath1)) {
          console.log(`文件不存在: ${filePath1}`);
          return res.status(400).json({ error: `文件不存在: ${file1}` });
        }
        
        if (!fs.existsSync(filePath2)) {
          console.log(`文件不存在: ${filePath2}`);
          return res.status(400).json({ error: `文件不存在: ${file2}` });
        }
      }
      
      // 执行Python脚本比较站点地图
      const scriptPath = path.resolve(process.cwd(), 'sitemap_diff.py');
      const command = `python "${scriptPath}" compare --files "${filePath1}" "${filePath2}"`;
      
      console.log(`执行命令: ${command}`);
      const { stdout, stderr } = await execPromise(command);
      
      if (stderr) {
        console.error(`Python脚本错误: ${stderr}`);
      }
      
      console.log(`比较脚本输出: ${stdout}`);
      
      // 解析输出以获取新增URL
      const newUrls = [];
      const lines = stdout.split('\n');
      let totalNew = 0;
      let isCapturingUrls = false;
      
      for (const line of lines) {
        if (line.includes('发现') && line.includes('个新增URL')) {
          const match = line.match(/发现\s+(\d+)\s+个新增URL/);
          if (match && match[1]) {
            totalNew = parseInt(match[1], 10);
          }
          isCapturingUrls = true;
          continue;
        }
        
        if (isCapturingUrls && line.trim() && !line.includes('从') && !line.includes('到')) {
          newUrls.push(line.trim());
        }
      }
      
      // 不限制URL数量，返回所有差异URL
      // 准备响应数据
      const responseData = {
        success: true,
        totalNew,
        newUrls: newUrls,
        file1: path.basename(filePath1),
        file2: path.basename(filePath2),
        domain1,
        domain2
      };
      
      // 计算响应数据大小
      const responseSize = JSON.stringify(responseData).length;
      console.log(`响应数据大小约为: ${responseSize} 字节`);
      
      // 检查响应大小是否接近限制
      if (responseSize > 5000000) { // 5MB的安全阈值
        console.log(`警告: 响应数据大小(${responseSize}字节)较大，但仍返回所有URL`);
      }
      
      return res.status(200).json(responseData);
    } catch (error) {
      console.error('比较站点地图时出错:', error);
      return res.status(500).json({ 
        error: '比较站点地图时出错', 
        details: error.message 
      });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 