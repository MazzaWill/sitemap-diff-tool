import React, { useState, useEffect } from 'react';

const resultContainerStyle = {
  marginTop: '24px',
  border: '1px solid #e5e7eb',
  borderRadius: '8px',
  overflow: 'hidden',
  backgroundColor: 'white'
};

const resultHeaderStyle = {
  padding: '12px 16px',
  backgroundColor: '#3b82f6',
  color: 'white',
  fontWeight: '500',
  fontSize: '18px'
};

const summaryContainerStyle = {
  padding: '12px 16px',
  backgroundColor: '#eff6ff',
  borderBottom: '1px solid #dbeafe'
};

const urlListContainerStyle = {
  padding: '16px'
};

const urlListStyle = {
  border: '1px solid #e5e7eb',
  borderRadius: '6px',
  maxHeight: '400px',
  overflowY: 'auto'
};

const urlItemStyle = {
  padding: '10px 12px',
  borderBottom: '1px solid #e5e7eb',
  fontSize: '14px',
  wordBreak: 'break-all'
};

const urlLinkStyle = {
  color: '#2563eb',
  textDecoration: 'none'
};

const paginationStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginTop: '12px',
  padding: '8px 0'
};

const pageButtonStyle = {
  padding: '6px 12px',
  backgroundColor: '#3b82f6',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '14px',
  margin: '0 4px'
};

const disabledButtonStyle = {
  ...pageButtonStyle,
  backgroundColor: '#9ca3af',
  cursor: 'not-allowed'
};

const pageInfoStyle = {
  fontSize: '14px',
  color: '#4b5563'
};

export default function SitemapResults({ result }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(100);
  const [displayedUrls, setDisplayedUrls] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  
  // 如果没有结果，不显示任何内容
  if (!result) {
    return null;
  }

  // 解析输出
  const parseOutput = () => {
    // 如果是比较结果
    if (result.newUrls || result.output) {
      const urls = result.newUrls || [];
      let message = '';
      
      // 如果有 newUrls 数组，使用它
      if (result.newUrls) {
        if (urls.length > 0) {
          message = `比较结果: 发现 ${result.totalNew || urls.length} 个新增URL`;
          if (result.domain1 && result.domain2) {
            message += ` (从 ${result.domain1} 到 ${result.domain2})`;
          }
        } else {
          message = '比较结果: 未发现新增URL';
        }
      } 
      // 兼容旧格式 - 从输出文本中解析
      else if (result.output) {
        const output = result.output;
        const parsedUrls = [];
        
        // 处理比较结果 - 每行一个URL
        const lines = output.trim().split('\n');
        for (const line of lines) {
          const trimmedLine = line.trim();
          if (trimmedLine.startsWith('http')) {
            parsedUrls.push(trimmedLine);
          }
        }
        
        if (parsedUrls.length > 0) {
          message = `比较结果: 发现 ${parsedUrls.length} 个新增URL`;
          return { urls: parsedUrls, message, isComparison: true };
        } else {
          message = '比较结果: 未发现新增URL';
        }
      }
      
      return { urls, message, isComparison: true };
    } 
    // 如果是获取站点地图结果
    else if (result.domain && result.urls) {
      const message = `从 ${result.domain} 的站点地图中提取到 ${result.urls.length} 个URL，已保存到 ${result.filename}`;
      return { 
        urls: result.urls || [], 
        message, 
        isComparison: false 
      };
    }
    
    return { urls: [], message: '', isComparison: false };
  };
  
  const { urls, message, isComparison } = parseOutput();
  
  // 计算总页数
  useEffect(() => {
    if (urls.length > 0) {
      setTotalPages(Math.ceil(urls.length / itemsPerPage));
      updateDisplayedUrls(1);
    }
  }, [urls, itemsPerPage]);
  
  // 更新当前显示的URL
  const updateDisplayedUrls = (page) => {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setDisplayedUrls(urls.slice(startIndex, endIndex));
    setCurrentPage(page);
  };
  
  // 页面导航
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      updateDisplayedUrls(page);
    }
  };
  
  return (
    <div style={resultContainerStyle}>
      <div style={resultHeaderStyle}>
        {isComparison ? '比较结果' : '站点地图处理结果'}
      </div>
      
      {message && (
        <div style={summaryContainerStyle}>
          <h4 style={{fontSize: '14px', fontWeight: '500', marginBottom: '8px', color: '#1e40af'}}>摘要信息</h4>
          <pre style={{
            whiteSpace: 'pre-wrap',
            fontSize: '14px',
            color: '#1e40af',
            margin: 0,
            fontFamily: 'inherit'
          }}>{message}</pre>
        </div>
      )}
      
      {urls.length > 0 && (
        <div style={urlListContainerStyle}>
          <h4 style={{fontSize: '16px', fontWeight: '500', marginBottom: '12px'}}>
            {isComparison ? '新增 URL' : 'URL 列表'} ({urls.length})
            {urls.length > itemsPerPage && ` - 分页显示，每页 ${itemsPerPage} 个`}
          </h4>
          
          <div style={urlListStyle}>
            {displayedUrls.map((url, index) => (
              <div key={index} style={{
                ...urlItemStyle,
                borderBottom: index < displayedUrls.length - 1 ? '1px solid #e5e7eb' : 'none'
              }}>
                <a 
                  href={url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={urlLinkStyle}
                >
                  {url}
                </a>
              </div>
            ))}
          </div>
          
          {urls.length > itemsPerPage && (
            <div style={paginationStyle}>
              <div>
                <button 
                  style={currentPage === 1 ? disabledButtonStyle : pageButtonStyle}
                  onClick={() => goToPage(1)}
                  disabled={currentPage === 1}
                >
                  首页
                </button>
                <button 
                  style={currentPage === 1 ? disabledButtonStyle : pageButtonStyle}
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  上一页
                </button>
              </div>
              
              <div style={pageInfoStyle}>
                第 {currentPage} 页，共 {totalPages} 页
                （显示 {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, urls.length)} 项，共 {urls.length} 项）
              </div>
              
              <div>
                <button 
                  style={currentPage === totalPages ? disabledButtonStyle : pageButtonStyle}
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  下一页
                </button>
                <button 
                  style={currentPage === totalPages ? disabledButtonStyle : pageButtonStyle}
                  onClick={() => goToPage(totalPages)}
                  disabled={currentPage === totalPages}
                >
                  末页
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 