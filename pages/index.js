import React from 'react';
import Layout from '../components/Layout';
import ComparisonForm from '../components/ComparisonForm';

const containerStyle = {
  maxWidth: '1000px',
  margin: '0 auto',
  padding: '20px',
  backgroundColor: '#fff',
  borderRadius: '8px',
  boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
};

const headingStyle = {
  fontSize: '28px',
  fontWeight: 'bold',
  marginBottom: '16px',
  color: '#2563eb',
  textAlign: 'center'
};

const paragraphStyle = {
  fontSize: '16px',
  lineHeight: '1.6',
  marginBottom: '24px',
  color: '#4b5563',
  textAlign: 'center'
};

export default function Home() {
  return (
    <div style={{
      backgroundColor: '#f3f4f6',
      minHeight: '100vh',
      padding: '20px'
    }}>
      <div style={containerStyle}>
        <h1 style={headingStyle}>站点地图差异工具</h1>
        <p style={paragraphStyle}>
          使用此工具下载、保存和比较网站站点地图，跟踪站点地图随时间的变化。
        </p>
        
        <ComparisonForm />
      </div>
      
      <div style={{
        textAlign: 'center',
        marginTop: '20px',
        fontSize: '14px',
        color: '#6b7280'
      }}>
        站点地图差异工具 &copy; {new Date().getFullYear()} | 
        <a 
          href="https://github.com/MazzaWill/sitemap-diff-tool" 
          style={{color: '#2563eb', marginLeft: '5px'}}
          target="_blank" 
          rel="noopener noreferrer"
        >
          GitHub 仓库
        </a>
      </div>
    </div>
  );
} 