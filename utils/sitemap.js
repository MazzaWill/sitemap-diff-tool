/**
 * sitemap.js - 站点地图工具
 * 
 * 用于下载、解析、保存和比较网站的站点地图
 */

const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');
const { parse } = require('url');
const { JSDOM } = require('jsdom');
const xml2js = require('xml2js');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

/**
 * 下载指定URL的站点地图
 * @param {string} url - 网站URL或域名
 * @returns {Promise<string|null>} - 站点地图内容
 */
async function downloadSitemap(url) {
  try {
    // 如果URL不是以http开头，添加https://
    if (!url.startsWith('http')) {
      url = 'https://' + url;
    }
    
    // 解析URL
    const parsedUrl = parse(url);
    const baseUrl = `${parsedUrl.protocol}//${parsedUrl.host}`;
    
    // 尝试多种可能的站点地图URL
    const sitemapUrls = [
      `${baseUrl}/sitemap.xml`,
      `${baseUrl}/sitemap_index.xml`,
      `${baseUrl}/sitemap/sitemap.xml`,
      `${baseUrl}/sitemaps/sitemap.xml`,
      `${baseUrl}/wp-sitemap.xml`,  // WordPress
      `${baseUrl}/sitemap.php`,     // 一些CMS使用PHP生成
      `${baseUrl}/sitemap.html`,    // HTML格式的站点地图
    ];
    
    // 如果用户提供的URL已经包含sitemap路径，优先使用它
    if (url.toLowerCase().includes('sitemap')) {
      sitemapUrls.unshift(url);
    }
    
    // 尝试访问网站首页，获取重定向后的域名
    try {
      console.log(`尝试访问网站首页: ${baseUrl}`);
      const response = await axios.get(baseUrl, {
        timeout: 10000,
        maxRedirects: 5,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });
      
      console.log(`首页响应状态码: ${response.status}`);
      
      if (response.request.res.responseUrl !== baseUrl) {
        const redirectedUrl = response.request.res.responseUrl;
        console.log(`检测到重定向: ${baseUrl} -> ${redirectedUrl}`);
        
        const parsedRedirected = parse(redirectedUrl);
        const redirectedBase = `${parsedRedirected.protocol}//${parsedRedirected.host}`;
        
        // 添加重定向后的域名的站点地图URL
        sitemapUrls.push(
          `${redirectedBase}/sitemap.xml`,
          `${redirectedBase}/sitemap_index.xml`,
          `${redirectedBase}/wp-sitemap.xml`
        );
      }
    } catch (e) {
      console.log(`访问首页时出错: ${e.message}`);
    }
    
    // 尝试所有可能的站点地图URL
    const errors = [];
    for (const sitemapUrl of sitemapUrls) {
      try {
        console.log(`尝试下载 Sitemap: ${sitemapUrl}`);
        const response = await axios.get(sitemapUrl, {
          timeout: 30000,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
          }
        });
        
        console.log(`响应状态码: ${response.status}`);
        
        if (response.status === 200) {
          const contentType = response.headers['content-type'] || '';
          console.log(`内容类型: ${contentType}`);
          
          // 检查是否是HTML内容
          if (contentType.toLowerCase().includes('html')) {
            console.log("检测到HTML格式的站点地图，将尝试提取链接");
          }
          
          return response.data;
        }
      } catch (e) {
        errors.push(`${sitemapUrl}: ${e.message}`);
      }
    }
    
    // 如果所有尝试都失败
    console.log("所有尝试的Sitemap URL都失败:");
    errors.forEach(error => console.log(`- ${error}`));
    
    // 尝试robots.txt中查找站点地图
    try {
      const robotsUrl = `${baseUrl}/robots.txt`;
      console.log(`尝试从robots.txt查找Sitemap: ${robotsUrl}`);
      
      const response = await axios.get(robotsUrl, {
        timeout: 10000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });
      
      if (response.status === 200) {
        const robotsContent = response.data;
        console.log("robots.txt内容:");
        console.log(robotsContent);
        
        // 查找Sitemap行
        const sitemapLines = robotsContent
          .split('\n')
          .filter(line => line.toLowerCase().startsWith('sitemap:'));
        
        console.log(`找到 ${sitemapLines.length} 个可能的Sitemap行:`, sitemapLines);
        
        if (sitemapLines.length > 0) {
          console.log(`在robots.txt中找到 ${sitemapLines.length} 个Sitemap条目`);
          
          for (const line of sitemapLines) {
            const sitemapUrl = line.split(':', 2)[1]?.trim();
            if (!sitemapUrl) {
              console.log(`无法从行中提取Sitemap URL: ${line}`);
              continue;
            }
            try {
              console.log(`从robots.txt中尝试: ${sitemapUrl}`);
              const response = await axios.get(sitemapUrl, {
                timeout: 30000,
                headers: {
                  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                }
              });
              
              if (response.status === 200) {
                // 直接返回响应数据，让parseSitemap处理
                return response.data;
              }
            } catch (e) {
              console.log(`访问robots.txt中的Sitemap失败: ${e.message}`);
            }
          }
        }
      }
    } catch (e) {
      console.log(`获取robots.txt失败: ${e.message}`);
    }
    
    // 尝试直接爬取网站首页，提取所有链接
    try {
      console.log(`尝试从网站首页提取链接: ${baseUrl}`);
      const response = await axios.get(baseUrl, {
        timeout: 30000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });
      
      if (response.status === 200) {
        // 创建一个伪站点地图
        console.log("创建从首页提取的链接的伪站点地图");
        
        const dom = new JSDOM(response.data);
        const links = dom.window.document.querySelectorAll('a[href]');
        
        // 构建一个简单的XML站点地图
        let sitemapContent = '<?xml version="1.0" encoding="UTF-8"?>\n';
        sitemapContent += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
        
        const addedUrls = new Set();
        
        for (const link of links) {
          let href = link.getAttribute('href');
          
          // 处理相对URL
          let fullUrl;
          if (href.startsWith('/')) {
            fullUrl = baseUrl + href;
          } else if (href.startsWith('http')) {
            // 只包含同一域名的URL
            if (href.includes(parsedUrl.host)) {
              fullUrl = href;
            } else {
              continue;
            }
          } else {
            // 跳过锚点链接和JavaScript
            if (href.startsWith('#') || href.startsWith('javascript:')) {
              continue;
            }
            fullUrl = baseUrl + '/' + href;
          }
          
          // 去重
          if (!addedUrls.has(fullUrl)) {
            addedUrls.add(fullUrl);
            sitemapContent += `  <url>\n    <loc>${fullUrl}</loc>\n  </url>\n`;
          }
        }
        
        sitemapContent += '</urlset>';
        
        if (addedUrls.size > 0) {
          console.log(`从首页提取了 ${addedUrls.size} 个链接`);
          return sitemapContent;
        }
      }
    } catch (e) {
      console.log(`从首页提取链接失败: ${e.message}`);
    }
    
    return null;
  } catch (e) {
    console.log(`下载Sitemap过程中发生错误: ${e.message}`);
    return null;
  }
}

/**
 * 解析站点地图内容，提取所有URL
 * @param {string} sitemapContent - 站点地图内容
 * @returns {Promise<string[]>} - URL列表
 */
async function parseSitemap(sitemapContent) {
  if (!sitemapContent) {
    return [];
  }
  
  try {
    // 尝试解析XML
    try {
      const parser = new xml2js.Parser({ explicitArray: false });
      const result = await parser.parseStringPromise(sitemapContent);
      
      const urls = [];
      
      // 检查是否是站点地图索引文件
      if (result.sitemapindex) {
        console.log("检测到Sitemap索引文件，正在处理...");
        console.log("索引内容:", JSON.stringify(result.sitemapindex).substring(0, 200) + "...");
        
        // 处理站点地图索引文件
        const sitemaps = Array.isArray(result.sitemapindex.sitemap) 
          ? result.sitemapindex.sitemap 
          : [result.sitemapindex.sitemap];
        
        console.log(`索引中包含 ${sitemaps.length} 个站点地图`);
        
        for (const sitemap of sitemaps) {
          if (sitemap && sitemap.loc) {
            const sitemapUrl = sitemap.loc;
            console.log(`从索引中获取Sitemap: ${sitemapUrl}`);
            
            try {
              const response = await axios.get(sitemapUrl, {
                timeout: 30000,
                headers: {
                  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                }
              });
              
              if (response.status === 200) {
                // 递归解析子站点地图
                const subUrls = await parseSitemap(response.data);
                urls.push(...subUrls);
              }
            } catch (e) {
              console.log(`获取子Sitemap失败: ${sitemapUrl} - ${e.message}`);
            }
          }
        }
      } else if (result.urlset) {
        // 处理标准站点地图文件
        const urlEntries = Array.isArray(result.urlset.url) 
          ? result.urlset.url 
          : [result.urlset.url];
        
        for (const urlEntry of urlEntries) {
          if (urlEntry && urlEntry.loc) {
            urls.push(urlEntry.loc);
          }
        }
      }
      
      if (urls.length > 0) {
        return urls;
      }
    } catch (e) {
      console.log(`XML解析失败，尝试使用正则表达式: ${e.message}`);
    }
    
    // 如果XML解析失败，尝试使用正则表达式
    const locRegex = /<loc>(.*?)<\/loc>/g;
    const matches = [...sitemapContent.matchAll(locRegex)];
    
    if (matches.length > 0) {
      const urls = matches.map(match => match[1]);
      console.log(`使用正则表达式提取到 ${urls.length} 个URL`);
      return urls;
    }
    
    // 如果仍然没有找到URL，尝试解析为HTML
    try {
      const dom = new JSDOM(sitemapContent);
      const links = dom.window.document.querySelectorAll('a[href]');
      
      const urls = Array.from(links)
        .map(link => link.getAttribute('href'))
        .filter(href => href.startsWith('http'));
      
      if (urls.length > 0) {
        console.log(`从HTML中提取到 ${urls.length} 个链接`);
        return urls;
      }
    } catch (e) {
      console.log(`HTML解析失败: ${e.message}`);
    }
    
    // 最后尝试直接匹配所有URL
    const urlRegex = /https?:\/\/[^\s<>"']+/g;
    const allMatches = [...sitemapContent.matchAll(urlRegex)];
    
    if (allMatches.length > 0) {
      const urls = allMatches.map(match => match[0]);
      console.log(`通过通用URL模式提取到 ${urls.length} 个URL`);
      return urls;
    }
    
    return [];
  } catch (e) {
    console.log(`解析Sitemap时发生错误: ${e.message}`);
    return [];
  }
}

/**
 * 保存站点地图数据到文件
 * @param {string} domain - 域名
 * @param {string[]} urls - URL列表
 * @param {string} [outputDir] - 输出目录
 * @returns {Promise<string>} - 保存的文件路径
 */
async function saveSitemapData(domain, urls, outputDir = null) {
  // 创建数据目录
  const dataDir = outputDir || path.join(process.cwd(), 'data');
  
  try {
    await fs.mkdir(dataDir, { recursive: true });
    
    // 生成文件名
    const timestamp = new Date().toISOString().replace(/[-:.]/g, '').substring(0, 15);
    const filename = path.join(dataDir, `${domain}_${timestamp}.json`);
    
    // 保存数据
    const data = {
      domain,
      timestamp,
      urls
    };
    
    await fs.writeFile(filename, JSON.stringify(data, null, 2), 'utf8');
    
    console.log(`已保存 ${urls.length} 个URL到文件: ${filename}`);
    return filename;
  } catch (e) {
    console.log(`保存站点地图数据失败: ${e.message}`);
    throw e;
  }
}

/**
 * 获取指定域名最新的站点地图文件
 * @param {string} domain - 域名
 * @param {string} [dataDir] - 数据目录
 * @returns {Promise<string|null>} - 文件路径
 */
async function getLatestSitemapFile(domain, dataDir = null) {
  const dir = dataDir || path.join(process.cwd(), 'data');
  
  try {
    const files = await fs.readdir(dir);
    const domainFiles = files.filter(f => f.startsWith(domain) && f.endsWith('.json'));
    
    if (domainFiles.length === 0) {
      return null;
    }
    
    // 按时间戳排序
    domainFiles.sort().reverse();
    return path.join(dir, domainFiles[0]);
  } catch (e) {
    console.log(`获取最新站点地图文件失败: ${e.message}`);
    return null;
  }
}

/**
 * 从文件加载站点地图数据
 * @param {string} filename - 文件路径
 * @returns {Promise<Object|null>} - 站点地图数据
 */
async function loadSitemapData(filename) {
  try {
    const data = await fs.readFile(filename, 'utf8');
    return JSON.parse(data);
  } catch (e) {
    console.log(`加载文件失败: ${e.message}`);
    return null;
  }
}

/**
 * 比较两个站点地图，找出新增的URL
 * @param {string[]} oldUrls - 旧的URL列表
 * @param {string[]} newUrls - 新的URL列表
 * @returns {string[]} - 新增的URL列表
 */
function compareSitemaps(oldUrls, newUrls) {
  const oldSet = new Set(oldUrls);
  const newSet = new Set(newUrls);
  
  const addedUrls = [...newSet].filter(url => !oldSet.has(url));
  return addedUrls;
}

/**
 * 获取网站的站点地图并可选保存
 * @param {string} url - 网站URL或域名
 * @param {boolean} [save=true] - 是否保存
 * @param {string} [outputDir] - 输出目录
 * @returns {Promise<Object|null>} - 站点地图数据
 */
async function fetchSitemap(url, save = true, outputDir = null) {
  // 提取域名
  const parsedUrl = parse(url);
  const domain = parsedUrl.host || url.split('/')[0];
  
  // 下载并解析站点地图
  const sitemapContent = await downloadSitemap(url);
  if (!sitemapContent) {
    return null;
  }
  
  const urls = await parseSitemap(sitemapContent);
  if (!urls || urls.length === 0) {
    console.log("未找到任何URL");
    return null;
  }
  
  console.log(`从Sitemap中提取到 ${urls.length} 个URL`);
  
  // 如果URL数量太少，尝试使用Python脚本
  if (urls.length < 200) {
    try {
      console.log("URL数量较少，尝试使用Python脚本获取更多URL");
      const pythonScript = path.join(process.cwd(), 'sitemap_diff.py');
      const { stdout } = await execPromise(`python "${pythonScript}" fetch ${domain}`);
      console.log("Python脚本输出:", stdout);
      
      // 查找最新的站点地图文件
      const dataDir = outputDir || path.join(process.cwd(), 'data');
      const files = await fs.readdir(dataDir);
      const domainFiles = files.filter(f => f.startsWith(domain) && f.endsWith('.json'));
      
      if (domainFiles.length > 0) {
        // 按时间戳排序
        domainFiles.sort().reverse();
        const latestFile = path.join(dataDir, domainFiles[0]);
        
        // 读取Python生成的文件
        const pythonData = JSON.parse(await fs.readFile(latestFile, 'utf8'));
        if (pythonData.urls && pythonData.urls.length > urls.length) {
          console.log(`使用Python脚本获取到 ${pythonData.urls.length} 个URL，替换之前的 ${urls.length} 个URL`);
          
          return {
            domain,
            urls: pythonData.urls,
            timestamp: pythonData.timestamp || new Date().toISOString().replace(/[-:.]/g, '').substring(0, 15),
            filename: latestFile
          };
        }
      }
    } catch (e) {
      console.log(`使用Python脚本获取URL失败: ${e.message}`);
    }
  }
  
  // 保存当前站点地图
  let filename = null;
  if (save) {
    filename = await saveSitemapData(domain, urls, outputDir);
  }
  
  return {
    domain,
    urls,
    timestamp: new Date().toISOString().replace(/[-:.]/g, '').substring(0, 15),
    filename
  };
}

/**
 * 将当前URLs与之前保存的进行比较
 * @param {string} domain - 域名
 * @param {string[]} currentUrls - 当前URL列表
 * @param {string} [dataDir] - 数据目录
 * @returns {Promise<string[]>} - 新增的URL列表
 */
async function compareWithPrevious(domain, currentUrls, dataDir = null) {
  const previousFile = await getLatestSitemapFile(domain, dataDir);
  if (!previousFile) {
    console.log("没有找到之前的Sitemap数据，无法进行比较");
    return [];
  }
  
  const previousData = await loadSitemapData(previousFile);
  if (!previousData) {
    console.log("无法加载上一次的Sitemap数据");
    return [];
  }
  
  const previousUrls = previousData.urls;
  
  // 比较找出新增URL
  const newUrls = compareSitemaps(previousUrls, currentUrls);
  
  console.log(`\n发现 ${newUrls.length} 个新增URL:`);
  newUrls.forEach(url => console.log(url));
  
  return newUrls;
}

/**
 * 比较两个保存的站点地图文件
 * @param {string} file1 - 第一个文件路径
 * @param {string} file2 - 第二个文件路径
 * @returns {Promise<string[]>} - 新增的URL列表
 */
async function compareTwoFiles(file1, file2) {
  const data1 = await loadSitemapData(file1);
  const data2 = await loadSitemapData(file2);
  
  if (!data1 || !data2) {
    console.log("无法加载Sitemap数据文件");
    return [];
  }
  
  // 比较找出新增URL (假设file2是较新的)
  const newUrls = compareSitemaps(data1.urls, data2.urls);
  
  console.log(`\n从 ${path.basename(file1)} 到 ${path.basename(file2)}`);
  console.log(`发现 ${newUrls.length} 个新增URL:`);
  newUrls.forEach(url => console.log(url));
  
  return newUrls;
}

/**
 * 列出保存的站点地图文件
 * @param {string} [domain] - 域名筛选
 * @param {string} [dataDir] - 数据目录
 * @returns {Promise<string[]>} - 文件列表
 */
async function listSitemapFiles(domain = null, dataDir = null) {
  const dir = dataDir || path.join(process.cwd(), 'data');
  
  try {
    if (!(await fs.stat(dir)).isDirectory()) {
      console.log(`数据目录不存在: ${dir}`);
      return [];
    }
    
    let files = await fs.readdir(dir);
    
    if (domain) {
      files = files.filter(f => f.startsWith(domain) && f.endsWith('.json'));
    } else {
      files = files.filter(f => f.endsWith('.json'));
    }
    
    if (files.length === 0) {
      console.log("没有找到保存的Sitemap文件");
      return [];
    }
    
    console.log(`找到 ${files.length} 个Sitemap文件:`);
    
    const fileDetails = await Promise.all(files.map(async f => {
      const filePath = path.join(dir, f);
      const stats = await fs.stat(filePath);
      const fileSize = stats.size / 1024; // KB
      return { name: f, size: fileSize };
    }));
    
    fileDetails.sort((a, b) => a.name.localeCompare(b.name));
    
    fileDetails.forEach(file => {
      console.log(`${file.name} (${file.size.toFixed(2)} KB)`);
    });
    
    return files;
  } catch (e) {
    console.log(`列出站点地图文件失败: ${e.message}`);
    return [];
  }
}

module.exports = {
  downloadSitemap,
  parseSitemap,
  saveSitemapData,
  getLatestSitemapFile,
  loadSitemapData,
  compareSitemaps,
  fetchSitemap,
  compareWithPrevious,
  compareTwoFiles,
  listSitemapFiles
}; 