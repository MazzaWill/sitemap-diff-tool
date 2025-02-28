#!/usr/bin/env node

const path = require('path');
const yargs = require('yargs');
const { 
  fetchSitemap, 
  compareTwoFiles, 
  listSitemapFiles,
  compareSitemaps
} = require('./sitemap');

// 主函数
async function main() {
  try {
    // 定义命令行参数
    const argv = yargs
      .command('fetch', '获取站点地图', {
        url: {
          description: '网站URL或域名',
          demandOption: true,
          type: 'string'
        },
        save: {
          description: '是否保存到文件',
          default: true,
          type: 'boolean'
        },
        output: {
          alias: 'o',
          description: '输出目录',
          type: 'string'
        }
      })
      .command('compare', '比较站点地图', {
        url: {
          description: '网站URL或域名（与之前保存的站点地图比较）',
          type: 'string'
        },
        files: {
          description: '要比较的两个站点地图文件',
          type: 'array'
        }
      })
      .check(argv => {
        if (argv._[0] === 'compare' && !argv.url && (!argv.files || argv.files.length !== 2)) {
          throw new Error('比较命令需要提供 url 参数或者两个文件路径');
        }
        return true;
      })
      .command('list', '列出保存的站点地图', {
        domain: {
          description: '按域名筛选',
          type: 'string'
        }
      })
      .demandCommand(1, '请提供一个命令')
      .help()
      .argv;

    const command = argv._[0];

    if (command === 'fetch') {
      const result = await fetchSitemap(argv.url, argv.save, argv.output);
      if (result) {
        console.log(`从 ${result.domain} 获取到 ${result.urls.length} 个URL`);
        if (argv.save && result.filename) {
          console.log(`已保存到文件: ${result.filename}`);
        }
      } else {
        console.error('获取站点地图失败');
        process.exit(1);
      }
    } 
    else if (command === 'compare') {
      let newUrls = [];
      
      if (argv.url) {
        // 获取当前站点地图并与之前保存的比较
        const result = await fetchSitemap(argv.url, false);
        if (!result) {
          console.error('获取站点地图失败');
          process.exit(1);
        }
        
        // 比较结果
        console.log(`比较结果将显示在 ${argv.url} 中新增的URL`);
      } 
      else if (argv.files && argv.files.length === 2) {
        // 比较两个文件
        newUrls = await compareTwoFiles(argv.files[0], argv.files[1]);
      }
      
      if (newUrls.length > 0) {
        console.log(`找到 ${newUrls.length} 个新增URL:`);
        newUrls.forEach(url => console.log(url));
      } else {
        console.log('没有找到新增URL');
      }
    } 
    else if (command === 'list') {
      const files = await listSitemapFiles(argv.domain);
      if (files.length > 0) {
        console.log(`找到 ${files.length} 个站点地图文件:`);
        files.forEach(file => console.log(file));
      } else {
        console.log('没有找到站点地图文件');
      }
    }
  } catch (error) {
    console.error('错误:', error.message);
    process.exit(1);
  }
}

// 执行主函数
main(); 