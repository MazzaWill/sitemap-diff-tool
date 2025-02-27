import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import axios from 'axios';
import Layout from '../components/Layout';

export default function ViewSitemap() {
  const router = useRouter();
  const { id } = router.query;
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sitemap, setSitemap] = useState(null);
  const [showAllUrls, setShowAllUrls] = useState(false);
  
  useEffect(() => {
    if (!id) return;
    
    const fetchSitemap = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/api/get-sitemap?id=${encodeURIComponent(id)}`);
        setSitemap(response.data);
      } catch (error) {
        setError(error.response?.data?.error || '获取站点地图失败');
      } finally {
        setLoading(false);
      }
    };
    
    fetchSitemap();
  }, [id]);
  
  if (!id) return null;
  
  if (loading) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto p-4 text-center">
          <p>加载中...</p>
        </div>
      </Layout>
    );
  }
  
  if (error) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto p-4">
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 my-4">
            <p>{error}</p>
          </div>
          <button
            onClick={() => router.back()}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
          >
            返回
          </button>
        </div>
      </Layout>
    );
  }
  
  if (!sitemap) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto p-4 text-center">
          <p>未找到站点地图</p>
          <button
            onClick={() => router.back()}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded mt-4"
          >
            返回
          </button>
        </div>
      </Layout>
    );
  }
  
  const { domain, timestamp, urls } = sitemap;
  const displayUrls = showAllUrls ? urls : urls.slice(0, 100);
  
  return (
    <Layout>
      <Head>
        <title>{domain} 站点地图 - 站点地图差异工具</title>
      </Head>
      
      <div className="max-w-4xl mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">{domain} 站点地图</h1>
          
          <button
            onClick={() => router.back()}
            className="bg-gray-600 hover:bg-gray-700 text-white py-1 px-4 rounded"
          >
            返回
          </button>
        </div>
        
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="mb-4 p-4 bg-gray-50 rounded">
            <p><strong>域名:</strong> {domain}</p>
            <p><strong>时间戳:</strong> {new Date(timestamp).toLocaleString()}</p>
            <p><strong>URL数量:</strong> {urls.length}</p>
          </div>
          
          <div className="mb-4">
            <h3 className="text-lg font-medium mb-2">URL列表:</h3>
            
            <div className="max-h-96 overflow-y-auto border rounded p-2">
              <ul className="list-disc pl-5">
                {displayUrls.map((url, index) => (
                  <li key={index} className="mb-1 break-all">
                    <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      {url}
                    </a>
                  </li>
                ))}
              </ul>
              
              {!showAllUrls && urls.length > 100 && (
                <div className="mt-4 text-center">
                  <button
                    onClick={() => setShowAllUrls(true)}
                    className="text-blue-600 hover:underline"
                  >
                    显示全部 {urls.length} 个URL
                  </button>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex justify-between">
            <button
              onClick={() => {
                const blob = new Blob([JSON.stringify(sitemap, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${domain}_sitemap.json`;
                a.click();
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-4 rounded"
            >
              下载JSON
            </button>
            
            <button
              onClick={() => {
                const text = urls.join('\n');
                const blob = new Blob([text], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${domain}_urls.txt`;
                a.click();
              }}
              className="bg-gray-600 hover:bg-gray-700 text-white py-1 px-4 rounded"
            >
              下载URL列表
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
} 