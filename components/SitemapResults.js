import React, { useState } from 'react';

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

export default function SitemapResults({ result }) {
  // 如果没有结果，不显示任何内容
  if (!result) {
    return null;
  }

  // 解析输出
  const parseOutput = () => {
    // 如果是比较结果
    if (result.output) {
      const output = result.output;
      const urls = [];
      
      // 处理比较结果 - 每行一个URL
      const lines = output.trim().split('\n');
      for (const line of lines) {
        const trimmedLine = line.trim();
        if (trimmedLine.startsWith('http')) {
          urls.push(trimmedLine);
        }
      }
      
      let message = '';
      if (urls.length > 0) {
        message = `比较结果: 发现 ${urls.length} 个不同的URL`;
      } else {
        message = '比较结果: 未发现不同的URL';
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
            {isComparison ? '不同的 URL' : 'URL 列表'} ({urls.length})
          </h4>
          
          <div style={urlListStyle}>
            {urls.map((url, index) => (
              <div key={index} style={{
                ...urlItemStyle,
                borderBottom: index < urls.length - 1 ? '1px solid #e5e7eb' : 'none'
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
        </div>
      )}
    </div>
  );
} 