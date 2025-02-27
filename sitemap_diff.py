#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os
import sys
import requests
import xml.etree.ElementTree as ET
import json
from datetime import datetime
import argparse
from urllib.parse import urlparse

def download_sitemap(url):
    """
    下载指定URL的sitemap
    """
    try:
        # 如果URL不是以http开头，添加https://
        if not url.startswith('http'):
            # 先尝试https
            url = 'https://' + url
        
        # 解析URL
        parsed_url = urlparse(url)
        base_url = f"{parsed_url.scheme}://{parsed_url.netloc}"
        
        # 尝试多种可能的sitemap URL
        sitemap_urls = [
            f"{base_url}/sitemap.xml",
            f"{base_url}/sitemap_index.xml",
            f"{base_url}/sitemap/sitemap.xml",
            f"{base_url}/sitemaps/sitemap.xml"
        ]
        
        # 如果用户提供的URL已经包含sitemap路径，优先使用它
        if 'sitemap' in url.lower():
            sitemap_urls.insert(0, url)
        
        # 尝试访问网站首页，获取重定向后的域名
        try:
            response = requests.get(base_url, timeout=10, allow_redirects=True)
            if response.url != base_url:
                redirected_url = response.url
                parsed_redirected = urlparse(redirected_url)
                redirected_base = f"{parsed_redirected.scheme}://{parsed_redirected.netloc}"
                
                # 添加重定向后的域名的sitemap URL
                sitemap_urls.extend([
                    f"{redirected_base}/sitemap.xml",
                    f"{redirected_base}/sitemap_index.xml"
                ])
        except:
            pass  # 忽略获取重定向的错误
        
        # 尝试所有可能的sitemap URL
        errors = []
        for sitemap_url in sitemap_urls:
            try:
                print(f"尝试下载 Sitemap: {sitemap_url}")
                response = requests.get(sitemap_url, timeout=30)
                if response.status_code == 200:
                    return response.text
            except requests.exceptions.RequestException as e:
                errors.append(f"{sitemap_url}: {str(e)}")
        
        # 如果所有尝试都失败
        print("所有尝试的Sitemap URL都失败:")
        for error in errors:
            print(f"- {error}")
        
        # 尝试robots.txt中查找sitemap
        try:
            robots_url = f"{base_url}/robots.txt"
            print(f"尝试从robots.txt查找Sitemap: {robots_url}")
            response = requests.get(robots_url, timeout=10)
            if response.status_code == 200:
                robots_content = response.text
                # 查找Sitemap行
                sitemap_lines = [line for line in robots_content.splitlines() 
                                if line.lower().startswith('sitemap:')]
                
                if sitemap_lines:
                    for line in sitemap_lines:
                        sitemap_url = line.split(':', 1)[1].strip()
                        try:
                            print(f"从robots.txt中尝试: {sitemap_url}")
                            response = requests.get(sitemap_url, timeout=30)
                            if response.status_code == 200:
                                return response.text
                        except:
                            pass
        except:
            pass
            
        return None
    except Exception as e:
        print(f"下载Sitemap过程中发生错误: {e}")
        return None

def parse_sitemap(sitemap_content):
    """
    解析sitemap内容，提取所有URL
    支持标准sitemap和sitemap索引文件
    """
    if not sitemap_content:
        return []
    
    try:
        # 注册命名空间
        namespaces = {
            'ns': 'http://www.sitemaps.org/schemas/sitemap/0.9'
        }
        
        root = ET.fromstring(sitemap_content)
        urls = []
        
        # 检查是否是sitemap索引文件
        is_sitemap_index = root.tag.endswith('sitemapindex')
        
        if is_sitemap_index:
            print("检测到Sitemap索引文件，正在处理...")
            # 处理sitemap索引文件
            for sitemap_element in root.findall('.//ns:sitemap', namespaces):
                loc_element = sitemap_element.find('ns:loc', namespaces)
                if loc_element is not None and loc_element.text:
                    sitemap_url = loc_element.text
                    print(f"从索引中获取Sitemap: {sitemap_url}")
                    try:
                        response = requests.get(sitemap_url, timeout=30)
                        if response.status_code == 200:
                            # 递归解析子sitemap
                            sub_urls = parse_sitemap(response.text)
                            urls.extend(sub_urls)
                    except Exception as e:
                        print(f"获取子Sitemap失败: {sitemap_url} - {e}")
        else:
            # 处理标准sitemap文件
            for url_element in root.findall('.//ns:url', namespaces):
                loc_element = url_element.find('ns:loc', namespaces)
                if loc_element is not None and loc_element.text:
                    urls.append(loc_element.text)
        
        return urls
    except ET.ParseError as e:
        print(f"解析 Sitemap 失败: {e}")
        # 尝试处理非标准XML或HTML格式的sitemap
        try:
            # 使用正则表达式提取URL
            import re
            urls = re.findall(r'<loc>(.*?)</loc>', sitemap_content)
            if urls:
                print(f"使用正则表达式提取到 {len(urls)} 个URL")
                return urls
        except Exception:
            pass
        return []

def save_sitemap_data(domain, urls, output_dir=None):
    """
    保存sitemap数据到文件
    """
    # 创建数据目录
    if output_dir:
        data_dir = output_dir
    else:
        data_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'data')
    
    os.makedirs(data_dir, exist_ok=True)
    
    # 生成文件名
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    filename = os.path.join(data_dir, f"{domain}_{timestamp}.json")
    
    # 保存数据
    data = {
        'domain': domain,
        'timestamp': timestamp,
        'urls': urls
    }
    
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    
    print(f"已保存 {len(urls)} 个URL到文件: {filename}")
    return filename

def get_latest_sitemap_file(domain, data_dir=None):
    """
    获取指定域名最新的sitemap文件
    """
    if not data_dir:
        data_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'data')
    
    if not os.path.exists(data_dir):
        return None
    
    files = [f for f in os.listdir(data_dir) if f.startswith(domain) and f.endswith('.json')]
    if not files:
        return None
    
    # 按时间戳排序
    files.sort(reverse=True)
    return os.path.join(data_dir, files[0])

def load_sitemap_data(filename):
    """
    从文件加载sitemap数据
    """
    try:
        with open(filename, 'r', encoding='utf-8') as f:
            return json.load(f)
    except (IOError, json.JSONDecodeError) as e:
        print(f"加载文件失败: {e}")
        return None

def compare_sitemaps(old_urls, new_urls):
    """
    比较两个sitemap，找出新增的URL
    """
    old_set = set(old_urls)
    new_set = set(new_urls)
    
    added_urls = new_set - old_set
    return list(added_urls)

def fetch_sitemap(url, save=True, output_dir=None):
    """
    获取网站的sitemap并可选保存
    """
    # 提取域名
    parsed_url = urlparse(url)
    domain = parsed_url.netloc
    if not domain:
        domain = url.split('/')[0]
    
    # 下载并解析sitemap
    sitemap_content = download_sitemap(url)
    if not sitemap_content:
        return None
    
    urls = parse_sitemap(sitemap_content)
    if not urls:
        print("未找到任何URL")
        return None
    
    print(f"从Sitemap中提取到 {len(urls)} 个URL")
    
    # 保存当前sitemap
    if save:
        save_sitemap_data(domain, urls, output_dir)
    
    return {
        'domain': domain,
        'urls': urls,
        'timestamp': datetime.now().strftime('%Y%m%d_%H%M%S')
    }

def compare_with_previous(domain, current_urls, data_dir=None):
    """
    将当前URLs与之前保存的进行比较
    """
    previous_file = get_latest_sitemap_file(domain, data_dir)
    if not previous_file:
        print("没有找到之前的Sitemap数据，无法进行比较")
        return []
    
    previous_data = load_sitemap_data(previous_file)
    if not previous_data:
        print("无法加载上一次的Sitemap数据")
        return []
    
    previous_urls = previous_data['urls']
    
    # 比较找出新增URL
    new_urls = compare_sitemaps(previous_urls, current_urls)
    
    print(f"\n发现 {len(new_urls)} 个新增URL:")
    for url in new_urls:
        print(url)
    
    return new_urls

def compare_two_files(file1, file2):
    """
    比较两个保存的sitemap文件
    """
    data1 = load_sitemap_data(file1)
    data2 = load_sitemap_data(file2)
    
    if not data1 or not data2:
        print("无法加载Sitemap数据文件")
        return []
    
    # 比较找出新增URL (假设file2是较新的)
    new_urls = compare_sitemaps(data1['urls'], data2['urls'])
    
    print(f"\n从 {os.path.basename(file1)} 到 {os.path.basename(file2)}")
    print(f"发现 {len(new_urls)} 个新增URL:")
    for url in new_urls:
        print(url)
    
    return new_urls

def main():
    parser = argparse.ArgumentParser(description='Sitemap工具 - 下载、保存和比较网站Sitemap')
    subparsers = parser.add_subparsers(dest='command', help='子命令')
    
    # 获取sitemap子命令
    fetch_parser = subparsers.add_parser('fetch', help='获取网站的Sitemap')
    fetch_parser.add_argument('url', help='网站URL或域名')
    fetch_parser.add_argument('--no-save', action='store_true', help='不保存获取的Sitemap')
    fetch_parser.add_argument('--output-dir', '-o', help='指定输出目录')
    
    # 比较子命令
    compare_parser = subparsers.add_parser('compare', help='比较Sitemap')
    compare_group = compare_parser.add_mutually_exclusive_group(required=True)
    compare_group.add_argument('--url', help='下载网站Sitemap并与之前保存的进行比较')
    compare_group.add_argument('--files', nargs=2, metavar=('FILE1', 'FILE2'), help='比较两个保存的Sitemap文件')
    compare_parser.add_argument('--data-dir', '-d', help='指定数据目录')
    
    # 列出保存的sitemap文件
    list_parser = subparsers.add_parser('list', help='列出保存的Sitemap文件')
    list_parser.add_argument('--domain', help='指定域名筛选')
    list_parser.add_argument('--data-dir', '-d', help='指定数据目录')
    
    args = parser.parse_args()
    
    # 如果没有指定子命令，显示帮助
    if not args.command:
        parser.print_help()
        return
    
    # 处理获取sitemap命令
    if args.command == 'fetch':
        result = fetch_sitemap(args.url, not args.no_save, args.output_dir)
        if not result:
            sys.exit(1)
    
    # 处理比较命令
    elif args.command == 'compare':
        if args.url:
            # 下载并与之前的比较
            result = fetch_sitemap(args.url, True, args.data_dir)
            if not result:
                sys.exit(1)
            
            compare_with_previous(result['domain'], result['urls'], args.data_dir)
        
        elif args.files:
            # 比较两个文件
            compare_two_files(args.files[0], args.files[1])
    
    # 处理列出文件命令
    elif args.command == 'list':
        data_dir = args.data_dir or os.path.join(os.path.dirname(os.path.abspath(__file__)), 'data')
        if not os.path.exists(data_dir):
            print(f"数据目录不存在: {data_dir}")
            return
        
        files = os.listdir(data_dir)
        if args.domain:
            files = [f for f in files if f.startswith(args.domain) and f.endswith('.json')]
        else:
            files = [f for f in files if f.endswith('.json')]
        
        if not files:
            print("没有找到保存的Sitemap文件")
            return
        
        print(f"找到 {len(files)} 个Sitemap文件:")
        for f in sorted(files):
            file_path = os.path.join(data_dir, f)
            file_size = os.path.getsize(file_path) / 1024  # KB
            print(f"{f} ({file_size:.2f} KB)")

if __name__ == "__main__":
    main() 