#!/usr/bin/env node

/**
 * sitemap-cli.js - 站点地图工具命令行接口
 * 
 * 用于从命令行调用站点地图工具的功能
 */

const { 
  fetchSitemap, 
  compareWithPrevious, 
  compareTwoFiles, 
  listSitemapFiles 
} = require('../utils/sitemap');
const path = require('path');
const yargs = require('yargs');

// 定义命令行参数
const argv = yargs
  .usage('使用方法: $0 <命令> [选项]')
  .command('fetch', '获取网站的站点地图', (yargs) => {
    return yargs
      .option('url', {
        describe: '网站URL或域名',
        demandOption: true,
        type: 'string'
      })
      .option('no-save', {
        describe: '不保存获取的站点地图',
        type: 'boolean',
        default: false
      })
      .option('output-dir', {
        alias: 'o',
        describe: '指定输出目录',
        type: 'string'
      });
  })
  .command('compare', '比较站点地图', (yargs) => {
    return yargs
      .option('url', {
        describe: '下载网站站点地图并与之前保存的进行比较',
        type: 'string',
        conflicts: 'files'
      })
      .option('files', {
        describe: '比较两个保存的站点地图文件',
        type: 'array',
        conflicts: 'url'
      })
      .option('data-dir', {
        alias: 'd',
        describe: '指定数据目录',
        type: 'string'
      })
      .check((argv) => {
        if (!argv.url && (!argv.files || argv.files.length !== 2)) {
          throw new Error('必须指定 --url 或者 --files 参数（需要两个文件）');
        }
        return true;
      });
  })
  .command('list', '列出保存的站点地图文件', (yargs) => {
    return yargs
      .option('domain', {
        describe: '指定域名筛选',
        type: 'string'
      })
      .option('data-dir', {
        alias: 'd',
        describe: '指定数据目录',
        type: 'string'
      });
  })
  .demandCommand(1, '请指定一个命令')
  .help()
  .alias('help', 'h')
  .argv;

// 主函数
async function main() {
  const command = argv._[0];
  
  try {
    // 处理获取站点地图命令
    if (command === 'fetch') {
      const result = await fetchSitemap(argv.url, !argv['no-save'], argv['output-dir']);
      if (!result) {
        process.exit(1);
      }
    }
    
    // 处理比较命令
    else if (command === 'compare') {
      if (argv.url) {
        // 下载并与之前的比较
        const result = await fetchSitemap(argv.url, true, argv['data-dir']);
        if (!result) {
          process.exit(1);
        }
        
        await compareWithPrevious(result.domain, result.urls, argv['data-dir']);
      }
      
      else if (argv.files) {
        // 比较两个文件
        await compareTwoFiles(argv.files[0], argv.files[1]);
      }
    }
    
    // 处理列出文件命令
    else if (command === 'list') {
      await listSitemapFiles(argv.domain, argv['data-dir']);
    }
  } catch (error) {
    console.error(`错误: ${error.message}`);
    process.exit(1);
  }
}

// 执行主函数
main().catch(error => {
  console.error(`未处理的错误: ${error.message}`);
  process.exit(1);
}); 