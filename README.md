# 站点地图差异工具

一个用于下载、保存和比较网站站点地图的 Python 工具，可以跟踪站点地图随时间的变化。

## 功能特点

- 从网站下载站点地图
- 解析标准站点地图和站点地图索引文件
- 保存站点地图数据以供将来比较
- 比较站点地图以识别新增的 URL
- 命令行界面，使用简便

## 安装 

### 前提条件

- Python 3.6 或更高版本
- pip（Python 包管理器）

### 安装步骤

1. 克隆此仓库：

```bash
git clone https://github.com/MazzaWill/sitemap-diff-tool.git
cd sitemap-diff-tool
```

2. 安装依赖：

```bash
pip install requests
```

## 使用方法

### 基本命令

站点地图差异工具提供以下主要命令：

```bash
# 获取网站的站点地图
python sitemap_diff.py fetch <url>

# 比较站点地图
python sitemap_diff.py compare [--url <url> | --files <file1> <file2>]

# 列出保存的站点地图文件
python sitemap_diff.py list [--domain <domain>]

# 显示帮助信息
python sitemap_diff.py --help
```

### 详细用法

#### 获取站点地图

```bash
# 获取并保存站点地图
python sitemap_diff.py fetch example.com

# 获取站点地图但不保存
python sitemap_diff.py fetch example.com --no-save

# 指定输出目录
python sitemap_diff.py fetch example.com --output-dir ./my_sitemaps
```

此命令将：
- 下载指定网站的站点地图
- 解析站点地图内容（支持标准站点地图和站点地图索引）
- 将解析后的URL列表保存到数据目录

#### 比较站点地图

```bash
# 下载网站站点地图并与之前保存的进行比较
python sitemap_diff.py compare --url example.com

# 比较两个保存的站点地图文件
python sitemap_diff.py compare --files data/example.com_20230101.json data/example.com_20230201.json

# 指定数据目录
python sitemap_diff.py compare --url example.com --data-dir ./my_sitemaps
```

此命令将：
- 如果使用 `--url`，下载最新的站点地图并与之前保存的版本进行比较
- 如果使用 `--files`，比较两个指定的站点地图文件
- 显示新增的URL

#### 列出保存的站点地图文件

```bash
# 列出所有保存的站点地图文件
python sitemap_diff.py list

# 列出特定域名的站点地图文件
python sitemap_diff.py list --domain example.com

# 指定数据目录
python sitemap_diff.py list --data-dir ./my_sitemaps
```

此命令将：
- 显示保存在数据目录中的站点地图文件列表
- 如果指定了域名，只显示该域名的文件

## 工作原理

### 站点地图获取

工具会尝试多种可能的站点地图URL格式：
- `https://domain.com/sitemap.xml`
- `https://domain.com/sitemap_index.xml`
- `https://domain.com/sitemap/sitemap.xml`
- `https://domain.com/sitemaps/sitemap.xml`

如果这些尝试都失败，工具会尝试从网站的 `robots.txt` 文件中查找站点地图URL。

### 站点地图解析

工具支持：
- 标准的XML站点地图
- 站点地图索引文件（会递归获取所有引用的站点地图）

### 数据存储

站点地图数据以JSON格式保存，包含：
- 域名
- 时间戳
- URL列表

文件命名格式为：`domain_timestamp.json`

## 示例场景

### 每周监控网站变化

创建一个定期运行的脚本或计划任务：

```bash
#!/bin/bash
# 下载最新站点地图并与历史记录比较
python sitemap_diff.py compare --url example.com > weekly_changes.txt

# 可选：发送结果到电子邮件
cat weekly_changes.txt | mail -s "Weekly sitemap changes" your@email.com
```

### 批量处理多个网站

创建一个包含多个站点地图URL的文本文件 `sites.txt`：

```
site1.com
site2.com
site3.com
```

然后使用循环处理：

```bash
while read domain; do
  echo "Processing $domain"
  python sitemap_diff.py compare --url "$domain" --data-dir "./data/$domain"
done < sites.txt
```

## 故障排除

- **解析错误**：确保URL指向有效的XML站点地图
- **超时错误**：对于大型站点地图，可能需要增加超时时间
- **找不到站点地图**：尝试手动查找站点地图URL并直接提供完整URL

## 贡献

欢迎提交问题报告和拉取请求。对于重大更改，请先开issue讨论您想要更改的内容。

