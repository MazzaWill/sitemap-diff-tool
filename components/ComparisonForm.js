import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SitemapResults from './SitemapResults';

export default function ComparisonForm() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [sitemaps, setSitemaps] = useState([]);
  const [selectedSitemaps, setSelectedSitemaps] = useState([]);
  const [activeTab, setActiveTab] = useState('fetch'); // 'fetch' or 'compare'

  useEffect(() => {
    const fetchSitemaps = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/list-sitemaps');
        if (response.data.success) {
          setSitemaps(response.data.sitemaps || []);
        }
      } catch (error) {
        console.error('获取站点地图列表失败:', error);
        setSitemaps([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSitemaps();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await axios.post('/api/fetch-sitemap', { url });
      setResult(response.data);
      // 刷新站点地图列表
      const listResponse = await axios.get('/api/list-sitemaps');
      if (listResponse.data.success) {
        setSitemaps(listResponse.data.sitemaps || []);
      }
    } catch (error) {
      setError(error.response?.data?.error || '获取站点地图失败');
    } finally {
      setLoading(false);
    }
  };

  const handleCompare = async () => {
    if (selectedSitemaps.length !== 2) {
      setError('请选择两个站点地图进行比较');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await axios.post('/api/compare-sitemaps', {
        files: selectedSitemaps
      });
      setResult(response.data);
    } catch (error) {
      setError(error.response?.data?.error || '比较站点地图失败');
    } finally {
      setLoading(false);
    }
  };

  const toggleSitemapSelection = (sitemap) => {
    if (selectedSitemaps.includes(sitemap)) {
      setSelectedSitemaps(selectedSitemaps.filter(s => s !== sitemap));
    } else {
      if (selectedSitemaps.length < 2) {
        setSelectedSitemaps([...selectedSitemaps, sitemap]);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* 介绍卡片 */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg shadow-lg overflow-hidden">
        <div className="px-6 py-8 md:px-8">
          <h2 className="text-2xl font-bold text-white mb-2">站点地图差异分析工具</h2>
          <p className="text-blue-100 mb-4">
            跟踪网站内容变化，发现新增页面，优化您的SEO策略
          </p>
          <div className="flex flex-wrap gap-4 mt-6">
            <div className="bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg rounded-md px-4 py-2 text-white">
              <div className="font-semibold">下载站点地图</div>
              <div className="text-sm opacity-80">从任何网站获取站点地图</div>
            </div>
            <div className="bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg rounded-md px-4 py-2 text-white">
              <div className="font-semibold">比较变化</div>
              <div className="text-sm opacity-80">查看不同时间点的差异</div>
            </div>
            <div className="bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg rounded-md px-4 py-2 text-white">
              <div className="font-semibold">SEO优化</div>
              <div className="text-sm opacity-80">发现新内容和机会</div>
            </div>
          </div>
        </div>
      </div>

      {/* 选项卡 */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="flex border-b border-gray-200">
          <button
            className={`flex-1 py-4 px-4 text-center font-medium ${
              activeTab === 'fetch'
                ? 'text-blue-600 border-b-2 border-blue-500'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('fetch')}
          >
            <span className="flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              获取站点地图
            </span>
          </button>
          <button
            className={`flex-1 py-4 px-4 text-center font-medium ${
              activeTab === 'compare'
                ? 'text-blue-600 border-b-2 border-blue-500'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('compare')}
          >
            <span className="flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM14 11a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 110-2h1v-1a1 1 0 011-1z" />
              </svg>
              比较站点地图
            </span>
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'fetch' ? (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">获取新站点地图</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
                    网站 URL
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      id="url"
                      className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-12 sm:text-sm border-gray-300 rounded-md"
                      placeholder="例如: example.com 或 https://example.com/sitemap.xml"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      required
                    />
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    输入网站域名或直接输入站点地图URL
                  </p>
                </div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      处理中...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                      获取站点地图
                    </span>
                  )}
                </button>
              </form>
            </div>
          ) : (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">比较站点地图</h3>
              {!sitemaps || sitemaps.length === 0 ? (
                <div className="text-center p-6 bg-yellow-50 rounded-lg border border-yellow-100">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-yellow-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <p className="text-lg font-medium text-yellow-800 mb-2">没有找到保存的站点地图</p>
                  <p className="text-yellow-700">请先获取并保存站点地图，然后再进行比较。</p>
                  <button
                    onClick={() => setActiveTab('fetch')}
                    className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                  >
                    获取站点地图
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm text-gray-600 mb-2">
                    选择两个站点地图进行比较（已选择 {selectedSitemaps.length}/2）
                  </p>
                  <div className="border border-gray-200 rounded-md overflow-hidden">
                    <div className="max-h-60 overflow-y-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50 sticky top-0">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              选择
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              站点地图文件
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {sitemaps.map((sitemap, index) => (
                            <tr key={index} className={selectedSitemaps.includes(sitemap) ? "bg-blue-50" : "hover:bg-gray-50"}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <input
                                  type="checkbox"
                                  id={`sitemap-${index}`}
                                  checked={selectedSitemaps.includes(sitemap)}
                                  onChange={() => toggleSitemapSelection(sitemap)}
                                  disabled={!selectedSitemaps.includes(sitemap) && selectedSitemaps.length >= 2}
                                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                <label htmlFor={`sitemap-${index}`} className="cursor-pointer">
                                  {sitemap}
                                </label>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <button
                    onClick={handleCompare}
                    disabled={selectedSitemaps.length !== 2 || loading}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-green-300 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        比较中...
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM14 11a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 110-2h1v-1a1 1 0 011-1z" />
                        </svg>
                        比较选中的站点地图
                      </span>
                    )}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 错误提示 */}
      {error && (
        <div className="rounded-md bg-red-50 p-4 border border-red-100">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">处理过程中出现错误</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 结果显示 */}
      {result && <SitemapResults result={result} />}
    </div>
  );
} 