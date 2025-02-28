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
  if (!result || !result.output) {
    return null;
  }

  // 解析输出
  const parseOutput = () => {
    const output = result.output;
    const urls = [];
    let message = '';
    
    // 尝试提取URLs
    const urlMatches = output.match(/https?:\/\/[^\s]+/g) || [];
    urls.push(...urlMatches);
    
    // 提取消息
    const lines = output.split('\n');
    for (const line of lines) {
      if (line.includes('从Sitemap中提取到') || 
          line.includes('发现') || 
          line.includes('已保存') ||
          line.includes('比较')) {
        message += line + '\n';
      }
    }
    
    return { urls, message };
  };
  
  const { urls, message } = parseOutput();
  
  return (
    <div style={resultContainerStyle}>
      <div style={resultHeaderStyle}>处理结果</div>
      
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
            URL 列表 ({urls.length})
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