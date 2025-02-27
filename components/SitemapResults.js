import { useState } from 'react';

export default function SitemapResults({ result }) {
  const [filter, setFilter] = useState('');
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState('all');
  const itemsPerPage = 20;

  // 如果没有结果，显示加载中或空状态
  if (!result || !result.output) {
    return (
      <div className="bg-white shadow-lg rounded-lg overflow-hidden mt-6 max-w-4xl mx-auto">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
          <h3 className="text-lg font-medium text-white">处理结果</h3>
        </div>
        <div className="p-6 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="mt-2 text-gray-500">暂无站点地图数据</p>
        </div>
      </div>
    );
  }

  // 解析输出
  const parseOutput = () => {
    const output = result.output;
    let urls = [];
    let addedUrls = [];
    let removedUrls = [];
    let unchangedUrls = [];
    let message = '';
    
    // 提取消息和统计信息
    const lines = output.split('\n');
    let currentSection = null;
    
    for (const line of lines) {
      // 提取摘要信息
      if (line.includes('从Sitemap中提取到') || 
          line.includes('发现') || 
          line.includes('已保存') ||
          line.includes('比较')) {
        message += line + '\n';
      }
      
      // 识别URL部分
      if (line.includes('新增的URL:')) {
        currentSection = 'added';
        continue;
      } else if (line.includes('删除的URL:')) {
        currentSection = 'removed';
        continue;
      } else if (line.includes('未变的URL:')) {
        currentSection = 'unchanged';
        continue;
      }
      
      // 提取URL
      if (currentSection && line.trim() && line.match(/^https?:\/\//)) {
        const url = line.trim();
        urls.push(url);
        
        if (currentSection === 'added') {
          addedUrls.push(url);
        } else if (currentSection === 'removed') {
          removedUrls.push(url);
        } else if (currentSection === 'unchanged') {
          unchangedUrls.push(url);
        }
      }
    }
    
    return { 
      urls, 
      addedUrls, 
      removedUrls, 
      unchangedUrls, 
      message,
      stats: {
        total: urls.length,
        added: addedUrls.length,
        removed: removedUrls.length,
        unchanged: unchangedUrls.length
      }
    };
  };
  
  const { urls, addedUrls, removedUrls, unchangedUrls, message, stats } = parseOutput();
  
  // 根据当前标签选择要显示的URL
  let displayableUrls = [];
  switch (activeTab) {
    case 'added':
      displayableUrls = addedUrls;
      break;
    case 'removed':
      displayableUrls = removedUrls;
      break;
    case 'unchanged':
      displayableUrls = unchangedUrls;
      break;
    default:
      displayableUrls = urls;
  }
  
  // 过滤URLs
  const filteredUrls = displayableUrls.filter(url => 
    url.toLowerCase().includes(filter.toLowerCase())
  );
  
  // 分页
  const totalPages = Math.ceil(filteredUrls.length / itemsPerPage);
  const paginatedUrls = filteredUrls.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );
  
  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden mt-6 max-w-4xl mx-auto">
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
        <h3 className="text-lg font-medium text-white">处理结果</h3>
      </div>
      
      {message && (
        <div className="px-6 py-4 bg-blue-50 border-b border-blue-100">
          <h4 className="text-sm font-medium text-blue-800 mb-2">摘要信息</h4>
          <pre className="whitespace-pre-wrap text-sm text-blue-700 bg-blue-50 p-3 rounded">{message}</pre>
        </div>
      )}
      
      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6">
        <div className="bg-gray-50 rounded-lg p-4 text-center shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-gray-700">{stats.total}</div>
          <div className="text-xs uppercase tracking-wide text-gray-500">总URL数</div>
        </div>
        <div className="bg-green-50 rounded-lg p-4 text-center shadow-sm border border-green-200">
          <div className="text-2xl font-bold text-green-700">{stats.added}</div>
          <div className="text-xs uppercase tracking-wide text-green-500">新增URL</div>
        </div>
        <div className="bg-red-50 rounded-lg p-4 text-center shadow-sm border border-red-200">
          <div className="text-2xl font-bold text-red-700">{stats.removed}</div>
          <div className="text-xs uppercase tracking-wide text-red-500">删除URL</div>
        </div>
        <div className="bg-blue-50 rounded-lg p-4 text-center shadow-sm border border-blue-200">
          <div className="text-2xl font-bold text-blue-700">{stats.unchanged}</div>
          <div className="text-xs uppercase tracking-wide text-blue-500">未变URL</div>
        </div>
      </div>
      
      {/* 标签页 */}
      <div className="px-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-6">
            <button
              onClick={() => {setActiveTab('all'); setPage(1);}}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'all'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              所有URL ({urls.length})
            </button>
            <button
              onClick={() => {setActiveTab('added'); setPage(1);}}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'added'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              新增URL ({addedUrls.length})
            </button>
            <button
              onClick={() => {setActiveTab('removed'); setPage(1);}}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'removed'
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              删除URL ({removedUrls.length})
            </button>
            <button
              onClick={() => {setActiveTab('unchanged'); setPage(1);}}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'unchanged'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              未变URL ({unchangedUrls.length})
            </button>
          </nav>
        </div>
      </div>
      
      {/* 搜索框 */}
      <div className="px-6 py-4">
        <div className="relative">
          <input
            type="text"
            placeholder="搜索URL..."
            value={filter}
            onChange={(e) => {setFilter(e.target.value); setPage(1);}}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <div className="absolute left-3 top-2.5">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </div>
      
      {/* URL列表 */}
      <div className="px-6 pb-6">
        {filteredUrls.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">没有找到匹配的URL</h3>
            <p className="mt-1 text-sm text-gray-500">尝试使用不同的搜索词或清除过滤器。</p>
          </div>
        ) : (
          <>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="max-h-96 overflow-y-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        URL
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {paginatedUrls.map((url, index) => (
                      <tr key={index} className={
                        activeTab === 'added' ? 'bg-green-50 hover:bg-green-100' : 
                        activeTab === 'removed' ? 'bg-red-50 hover:bg-red-100' : 
                        activeTab === 'unchanged' ? 'bg-blue-50 hover:bg-blue-100' : 
                        'hover:bg-gray-50'
                      }>
                        <td className="px-6 py-4 whitespace-nowrap text-sm break-all">
                          <a 
                            href={url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className={
                              activeTab === 'added' ? 'text-green-600 hover:text-green-800 hover:underline' : 
                              activeTab === 'removed' ? 'text-red-600 hover:text-red-800 hover:underline' : 
                              activeTab === 'unchanged' ? 'text-blue-600 hover:text-blue-800 hover:underline' : 
                              'text-blue-600 hover:text-blue-800 hover:underline'
                            }
                          >
                            {url}
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* 分页 */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    上一页
                  </button>
                  <button
                    onClick={() => setPage(Math.min(totalPages, page + 1))}
                    disabled={page === totalPages}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    下一页
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      显示第 <span className="font-medium">{(page - 1) * itemsPerPage + 1}</span> 到 <span className="font-medium">{Math.min(page * itemsPerPage, filteredUrls.length)}</span> 条，共 <span className="font-medium">{filteredUrls.length}</span> 条结果
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <button
                        onClick={() => setPage(Math.max(1, page - 1))}
                        disabled={page === 1}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span className="sr-only">上一页</span>
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                      
                      {/* 页码按钮 */}
                      {[...Array(Math.min(5, totalPages))].map((_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (page <= 3) {
                          pageNum = i + 1;
                        } else if (page >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = page - 2 + i;
                        }
                        
                        return (
                          <button
                            key={i}
                            onClick={() => setPage(pageNum)}
                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                              page === pageNum
                                ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                      
                      <button
                        onClick={() => setPage(Math.min(totalPages, page + 1))}
                        disabled={page === totalPages}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span className="sr-only">下一页</span>
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
            
            {/* 导出按钮 */}
            <div className="mt-6 flex justify-center">
              <button
                onClick={() => {
                  const blob = new Blob([filteredUrls.join('\n')], { type: 'text/plain' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `sitemap-${activeTab}-urls.txt`;
                  a.click();
                }}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                导出URL列表
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
} 