import React from 'react';
import Layout from '../components/Layout';
import ComparisonForm from '../components/ComparisonForm';

export default function Home() {
  return (
    <Layout title="站点地图差异工具">
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '20px',
        fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif'
      }}>
        <h1 style={{
          fontSize: '2rem',
          fontWeight: 'bold',
          marginBottom: '1.5rem',
          color: '#1f2937'
        }}>站点地图差异工具</h1>
        <p style={{
          marginBottom: '1.5rem',
          color: '#4b5563'
        }}>使用此工具下载、保存和比较网站站点地图，跟踪站点地图随时间的变化。</p>
        
        <ComparisonForm />
      </div>
    </Layout>
  );
} 