import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SitemapResults from './SitemapResults';

const formContainerStyle = {
  marginBottom: '20px'
};

const tabContainerStyle = {
  display: 'flex',
  borderBottom: '1px solid #e5e7eb',
  marginBottom: '20px'
};

const tabStyle = {
  padding: '10px 16px',
  cursor: 'pointer',
  fontWeight: '500',
  fontSize: '16px',
  flex: '1',
  textAlign: 'center'
};

const activeTabStyle = {
  ...tabStyle,
  borderBottom: '2px solid #2563eb',
  color: '#2563eb'
};

const inactiveTabStyle = {
  ...tabStyle,
  color: '#6b7280',
  borderBottom: '2px solid transparent'
};

const inputContainerStyle = {
  marginBottom: '16px'
};

const labelStyle = {
  display: 'block',
  marginBottom: '8px',
  fontSize: '14px',
  fontWeight: '500',
  color: '#374151'
};

const inputStyle = {
  width: '100%',
  padding: '10px 12px',
  border: '1px solid #d1d5db',
  borderRadius: '6px',
  fontSize: '14px'
};

const buttonStyle = {
  width: '100%',
  padding: '10px 16px',
  backgroundColor: '#2563eb',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  fontSize: '16px',
  fontWeight: '500',
  cursor: 'pointer'
};

const disabledButtonStyle = {
  ...buttonStyle,
  backgroundColor: '#93c5fd',
  cursor: 'not-allowed'
};

const errorContainerStyle = {
  padding: '12px',
  backgroundColor: '#fee2e2',
  borderRadius: '6px',
  marginBottom: '16px',
  color: '#b91c1c',
  border: '1px solid #fecaca'
};

const styles = {
  container: {
    // Add any necessary styles for the container
  },
  buttonGroup: {
    marginBottom: '16px',
    display: 'flex',
    justifyContent: 'center'
  },
  button: {
    padding: '8px 16px',
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px'
  },
  sitemapList: {
    border: '1px solid #e5e7eb',
    borderRadius: '6px',
    marginBottom: '16px',
    maxHeight: '200px',
    overflowY: 'auto'
  },
  sitemapItem: {
    padding: '10px 12px',
    borderBottom: '1px solid #e5e7eb',
    display: 'flex',
    alignItems: 'center',
    fontSize: '14px'
  },
  smallButton: {
    padding: '4px 8px',
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
    marginLeft: '8px'
  },
  deleteButton: {
    padding: '4px 8px',
    backgroundColor: '#ef4444',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
    marginLeft: '8px'
  },
  actionButton: {
    padding: '4px 8px',
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
    marginLeft: '8px'
  }
};

export default function ComparisonForm() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [result, setResult] = useState(null);
  const [sitemaps, setSitemaps] = useState([]);
  const [selectedSitemaps, setSelectedSitemaps] = useState([]);
  const [activeTab, setActiveTab] = useState('fetch'); // 'fetch' or 'compare'
  const [localSitemaps, setLocalSitemaps] = useState([]);
  const [saveAsFunction, setSaveAsFunction] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('file-saver').then(module => {
        setSaveAsFunction(() => module.saveAs);
      }).catch(err => {
        console.error('Failed to load file-saver:', err);
      });
    }
    
    if (typeof window !== 'undefined') {
      const storedSitemaps = localStorage.getItem('sitemaps');
      if (storedSitemaps) {
        try {
          const parsedSitemaps = JSON.parse(storedSitemaps);
          
          // 确保站点地图名称唯一
          const uniqueSitemaps = [];
          const sitemapNames = new Set();
          
          parsedSitemaps.forEach(sitemap => {
            if (!sitemapNames.has(sitemap.name)) {
              sitemapNames.add(sitemap.name);
              uniqueSitemaps.push(sitemap);
            } else {
              console.log(`跳过重复的站点地图: ${sitemap.name}`);
            }
          });
          
          console.log(`加载了 ${uniqueSitemaps.length} 个唯一站点地图`);
          setLocalSitemaps(uniqueSitemaps);
          setSitemaps(uniqueSitemaps);
        } catch (e) {
          console.error('解析本地站点地图失败:', e);
        }
      }
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    handleFetch();
  };

  const getSitemapFromIndexedDB = (filename) => {
    return new Promise((resolve, reject) => {
      if (typeof window === 'undefined' || !window.indexedDB) {
        reject(new Error('IndexedDB 不可用'));
        return;
      }

      try {
        console.log(`尝试从IndexedDB获取站点地图: ${filename}`);
        const request = indexedDB.open('SitemapDB', 1);
        
        request.onupgradeneeded = (event) => {
          console.log('IndexedDB需要升级，创建对象存储');
          const db = event.target.result;
          if (!db.objectStoreNames.contains('sitemaps')) {
            db.createObjectStore('sitemaps', { keyPath: 'name' });
          }
        };
        
        request.onsuccess = (event) => {
          console.log('成功打开IndexedDB数据库');
          const db = event.target.result;
          
          try {
            const transaction = db.transaction(['sitemaps'], 'readonly');
            const store = transaction.objectStore('sitemaps');
            
            console.log(`从对象存储中获取: ${filename}`);
            const getRequest = store.get(filename);
            
            getRequest.onsuccess = () => {
              if (getRequest.result) {
                console.log(`找到站点地图数据: ${filename}`);
                const reader = new FileReader();
                
                reader.onload = (e) => {
                  try {
                    const data = JSON.parse(e.target.result);
                    console.log(`成功解析站点地图数据: ${filename}`, {
                      domain: data.domain,
                      urlCount: data.urls?.length
                    });
                    
                    // 确保数据包含filename字段
                    data.filename = filename;
                    
                    resolve(data);
                  } catch (error) {
                    console.error(`解析站点地图数据失败: ${filename}`, error);
                    reject(error);
                  }
                };
                
                reader.onerror = (error) => {
                  console.error(`读取站点地图数据失败: ${filename}`, error);
                  reject(error);
                };
                
                reader.readAsText(getRequest.result.data);
              } else {
                console.error(`站点地图未找到: ${filename}`);
                reject(new Error('站点地图未找到'));
              }
            };
            
            getRequest.onerror = (e) => {
              console.error(`获取站点地图请求失败: ${filename}`, e);
              reject(e);
            };
          } catch (error) {
            console.error(`创建事务或获取对象存储失败: ${filename}`, error);
            reject(error);
          }
        };
        
        request.onerror = (event) => {
          console.error(`打开IndexedDB数据库失败: ${filename}`, event.target.error);
          reject(event.target.error);
        };
      } catch (error) {
        console.error(`从IndexedDB获取站点地图时发生异常: ${filename}`, error);
        reject(error);
      }
    });
  };

  const handleCompare = async () => {
    const selectedFiles = sitemaps.filter(sitemap => selectedSitemaps.includes(sitemap.name));
    
    if (selectedFiles.length !== 2) {
      setError('请选择两个站点地图进行比较');
      return;
    }
    
    setLoading(true);
    setError('');
    setMessage('');
    setResult('');
    
    try {
      console.log('开始比较选中的站点地图...');
      console.log('选中的文件:', selectedFiles);
      
      // 准备请求数据
      const requestData = {};
      
      // 检查是否有downloadUrl（上传的文件）
      if (selectedFiles[0].downloadUrl && selectedFiles[1].downloadUrl) {
        // 从downloadUrl获取文件内容
        const content1 = await fetchFileContent(selectedFiles[0].downloadUrl);
        const content2 = await fetchFileContent(selectedFiles[1].downloadUrl);
        
        if (!content1 || !content2) {
          throw new Error('无法获取站点地图文件内容');
        }
        
        requestData.sitemapContent1 = content1;
        requestData.sitemapContent2 = content2;
      } else {
        // 使用文件名 - 确保使用完整的文件名，不要修改格式
        requestData.sitemapData1 = {
          filename: selectedFiles[0].name,
          domain: selectedFiles[0].domain || extractDomainFromFilename(selectedFiles[0].name)
        };
        
        requestData.sitemapData2 = {
          filename: selectedFiles[1].name,
          domain: selectedFiles[1].domain || extractDomainFromFilename(selectedFiles[1].name)
        };
      }
      
      console.log('准备发送数据到API进行比较...');
      // 详细记录发送的数据，便于调试
      console.log('发送的数据:', JSON.stringify(requestData, null, 2));
      
      try {
        const response = await fetch('/api/compare-sitemaps', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestData)
        });
        
        console.log('API响应状态:', response.status);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('API响应错误:', errorText);
          
          // 使用错误处理函数
          handleApiError(new Error(errorText));
          return;
        }
        
        const data = await response.json();
        console.log('API响应数据:', data);
        
        if (data.success) {
          setResult(data);
          setMessage(`比较完成，找到 ${data.totalNew} 个新增URL。`);
          
          // 如果URL数量很多，添加额外提示
          if (data.totalNew > 1000) {
            setMessage(`比较完成，找到 ${data.totalNew} 个新增URL。由于数据量较大，可能需要一些时间来显示所有结果。`);
          }
        } else {
          setError(data.error || '比较站点地图失败');
        }
      } catch (fetchError) {
        console.error('API请求失败:', fetchError);
        
        // 使用错误处理函数
        handleApiError(fetchError);
      }
    } catch (error) {
      console.error('比较站点地图时出错:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // 从URL获取文件内容的辅助函数
  const fetchFileContent = async (url) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`获取文件内容失败: ${response.status}`);
      }
      return await response.text();
    } catch (error) {
      console.error('获取文件内容失败:', error);
      return null;
    }
  };

  // 从文件名中提取域名的辅助函数
  const extractDomainFromFilename = (filename) => {
    const parts = filename.split('_');
    return parts.length > 0 ? parts[0] : '';
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

  const deleteSitemap = async (filename) => {
    try {
      if (typeof window === 'undefined' || !window.indexedDB) {
        throw new Error('浏览器环境不可用');
      }

      const request = indexedDB.open('SitemapDB', 1);
      
      request.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction(['sitemaps'], 'readwrite');
        const store = transaction.objectStore('sitemaps');
        
        const deleteRequest = store.delete(filename);
        
        deleteRequest.onsuccess = () => {
          const updatedSitemaps = localSitemaps.filter(sitemap => sitemap.name !== filename);
          setLocalSitemaps(updatedSitemaps);
          setSitemaps(updatedSitemaps);
          
          localStorage.setItem('sitemaps', JSON.stringify(updatedSitemaps));
          
          if (selectedSitemaps.includes(filename)) {
            setSelectedSitemaps(selectedSitemaps.filter(name => name !== filename));
          }
          
          setMessage(`成功删除站点地图: ${filename}`);
        };
        
        deleteRequest.onerror = (e) => {
          setError(`删除站点地图失败: ${e.target.error}`);
        };
      };
      
      request.onerror = (event) => {
        setError(`打开数据库失败: ${event.target.error}`);
      };
    } catch (error) {
      console.error('删除站点地图失败:', error);
      setError('删除站点地图失败: ' + error.message);
    }
  };

  const saveSitemapLocally = async (data, filename) => {
    try {
      // 检查是否已存在同名站点地图
      const existingIndex = sitemaps.findIndex(sitemap => sitemap.name === filename);
      
      // 如果已存在，更新它而不是添加新的
      if (existingIndex !== -1) {
        console.log(`更新已存在的站点地图: ${filename}`);
        const updatedSitemaps = [...sitemaps];
        updatedSitemaps[existingIndex] = {
          name: filename,
          domain: data.domain,
          urls: data.urls,
          timestamp: new Date().toISOString()
        };
        setSitemaps(updatedSitemaps);
        localStorage.setItem('sitemaps', JSON.stringify(updatedSitemaps));
        return;
      }
      
      // 否则添加新的站点地图
      const newSitemap = {
        name: filename,
        domain: data.domain,
        urls: data.urls,
        timestamp: new Date().toISOString()
      };
      
      const updatedSitemaps = [...sitemaps, newSitemap];
      setSitemaps(updatedSitemaps);
      
      // 保存到localStorage
      localStorage.setItem('sitemaps', JSON.stringify(updatedSitemaps));
      
      // 保存到IndexedDB
      await saveBlobToIndexedDB(filename, new Blob([JSON.stringify(data)], { type: 'application/json' }));
      
      console.log(`站点地图已保存: ${filename}`);
      return true;
    } catch (error) {
      console.error('保存站点地图失败:', error);
      return false;
    }
  };

  const handleFetchResponse = async (data) => {
    if (data.success) {
      // 创建下载链接
      const blob = new Blob([JSON.stringify(data.data || {
        domain: data.domain,
        urls: data.urls,
        timestamp: new Date().toISOString()
      })], { type: 'application/json' });
      
      // 创建下载URL
      const downloadUrl = URL.createObjectURL(blob);
      
      // 设置结果，包含下载URL
      setResult({
        ...data,
        downloadUrl: downloadUrl
      });
      
      // 显示成功消息，提示用户可以下载
      setMessage(`站点地图已成功获取，包含 ${data.urls.length} 个URL。您可以点击下载按钮保存文件。`);
      
      // 添加到本地站点地图列表
      const newSitemap = {
        name: data.filename,
        domain: data.domain,
        timestamp: new Date().toISOString(),
        urlCount: data.urls.length,
        downloadUrl: downloadUrl
      };
      
      setLocalSitemaps(prev => [...prev, newSitemap]);
      setSitemaps(prev => [...prev, newSitemap]);
      
      // 更新本地存储
      const updatedSitemaps = [...localSitemaps, newSitemap];
      localStorage.setItem('sitemaps', JSON.stringify(updatedSitemaps));
    } else {
      setError(data.error || '获取站点地图失败');
    }
    setLoading(false);
  };

  const handleFetch = async () => {
    if (!url) {
      setError('请输入网站域名或站点地图URL');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await axios.post('/api/fetch-sitemap', { url });
      handleFetchResponse(response.data);
    } catch (error) {
      console.error('获取站点地图失败:', error);
      setError(error.response?.data?.error || '获取站点地图失败');
      setLoading(false);
    }
  };

  const exportSitemap = async (filename) => {
    try {
      if (typeof window === 'undefined' || !window.indexedDB) {
        throw new Error('浏览器环境不可用');
      }

      if (!saveAsFunction) {
        setError('导出功能尚未加载完成，请稍后再试');
        return;
      }

      const request = indexedDB.open('SitemapDB', 1);
      
      request.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction(['sitemaps'], 'readonly');
        const store = transaction.objectStore('sitemaps');
        
        const getRequest = store.get(filename);
        
        getRequest.onsuccess = () => {
          if (getRequest.result) {
            saveAsFunction(getRequest.result.data, filename);
          } else {
            setError('站点地图未找到');
          }
        };
      };
    } catch (error) {
      console.error('导出站点地图失败:', error);
      setError('导出站点地图失败: ' + error.message);
    }
  };
  
  const importSitemap = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      
      try {
        const reader = new FileReader();
        
        reader.onload = async (event) => {
          try {
            const data = JSON.parse(event.target.result);
            
            if (!data.domain || !Array.isArray(data.urls)) {
              throw new Error('无效的站点地图文件格式');
            }
            
            await saveSitemapLocally(data, file.name);
            setMessage(`成功导入站点地图: ${file.name}`);
          } catch (error) {
            setError('解析站点地图文件失败: ' + error.message);
          }
        };
        
        reader.readAsText(file);
      } catch (error) {
        setError('导入站点地图失败: ' + error.message);
      }
    };
    
    input.click();
  };

  // 添加上传站点地图文件的函数
  const uploadSitemap = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    setLoading(true);
    setError(null);
    setMessage(null);
    
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const content = e.target.result;
        const data = JSON.parse(content);
        
        if (!data.domain || !data.urls) {
          setError('无效的站点地图文件格式');
          setLoading(false);
          return;
        }
        
        // 创建文件名
        const timestamp = new Date().toISOString()
          .replace(/:/g, '')
          .replace(/\./g, '')
          .replace(/[-T]/g, '')
          .substring(0, 14);
        const filename = `${data.domain}_${timestamp}.json`;
        
        // 创建下载URL
        const blob = new Blob([content], { type: 'application/json' });
        const downloadUrl = URL.createObjectURL(blob);
        
        // 添加到本地状态
        const newSitemap = {
          name: filename,
          domain: data.domain,
          timestamp: data.timestamp || new Date().toISOString(),
          urlCount: data.urls.length,
          downloadUrl: downloadUrl
        };
        
        setLocalSitemaps(prev => [...prev, newSitemap]);
        setSitemaps(prev => [...prev, newSitemap]);
        
        setMessage(`站点地图文件 "${file.name}" 已成功上传，包含 ${data.urls.length} 个URL。`);
      } catch (error) {
        console.error('解析站点地图文件失败:', error);
        setError('解析站点地图文件失败: ' + error.message);
      } finally {
        setLoading(false);
      }
    };
    
    reader.onerror = () => {
      setError('读取文件失败');
      setLoading(false);
    };
    
    reader.readAsText(file);
  };

  // 处理API错误的函数
  const handleApiError = (error) => {
    console.error('API错误:', error);
    
    // 检查是否是响应大小超出限制的错误
    if (error.message && (
        error.message.includes('exceeded 1mb limit') || 
        error.message.includes('Body exceeded') ||
        error.message.includes('body size limit')
      )) {
      setError('响应数据过大，超出了服务器限制。已修复此问题，请刷新页面后重试。');
    } else {
      setError(error.message || '请求失败，请重试');
    }
  };

  return (
    <div style={formContainerStyle}>
      <div style={tabContainerStyle}>
        <button 
          style={{...tabStyle, ...(activeTab === 'fetch' ? activeTabStyle : {})}} 
          onClick={() => setActiveTab('fetch')}
        >
          获取站点地图
        </button>
        <button 
          style={{...tabStyle, ...(activeTab === 'compare' ? activeTabStyle : {})}} 
          onClick={() => setActiveTab('compare')}
        >
          比较站点地图
        </button>
      </div>

      {error && (
        <div style={errorContainerStyle}>
          <p>{error}</p>
        </div>
      )}

      {message && (
        <div style={{
          padding: '12px',
          backgroundColor: '#d1fae5',
          borderRadius: '6px',
          marginBottom: '16px',
          color: '#15803d',
          border: '1px solid #a7f3d0'
        }}>
          <p>{message}</p>
        </div>
      )}

      {activeTab === 'fetch' ? (
        <div>
          <h3 style={{fontSize: '18px', fontWeight: '500', marginBottom: '16px'}}>获取新站点地图</h3>
          <form onSubmit={handleSubmit}>
            <div style={inputContainerStyle}>
              <label htmlFor="url" style={labelStyle}>
                网站 URL
              </label>
              <input
                id="url"
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="输入域名或URL，例如: example.com"
                style={inputStyle}
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              style={loading ? disabledButtonStyle : buttonStyle}
              disabled={loading}
            >
              {loading ? '获取中...' : '获取站点地图'}
            </button>
          </form>
          
          {/* 添加上传站点地图文件的选项 */}
          <div style={{marginTop: '20px'}}>
            <h3 style={{fontSize: '18px', fontWeight: '500', marginBottom: '16px'}}>上传站点地图文件</h3>
            <input
              type="file"
              accept=".json"
              onChange={uploadSitemap}
              style={{marginBottom: '16px'}}
            />
          </div>
          
          {result && (
            <div style={{marginTop: '20px'}}>
              <h3 style={{fontSize: '18px', fontWeight: '500', marginBottom: '16px'}}>获取结果</h3>
              <SitemapResults data={result} />
              
              {result.downloadUrl && (
                <div style={{marginTop: '16px'}}>
                  <a 
                    href={result.downloadUrl} 
                    download={result.filename}
                    style={{
                      display: 'inline-block',
                      padding: '10px 16px',
                      backgroundColor: '#2563eb',
                      color: 'white',
                      textDecoration: 'none',
                      borderRadius: '6px',
                      fontSize: '16px',
                      fontWeight: '500',
                      cursor: 'pointer'
                    }}
                  >
                    下载站点地图文件
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div>
          <h3 style={{fontSize: '18px', fontWeight: '500', marginBottom: '16px'}}>比较站点地图</h3>
          {!sitemaps || sitemaps.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '20px',
              backgroundColor: '#fffbeb',
              borderRadius: '6px',
              color: '#92400e',
              border: '1px solid #fef3c7'
            }}>
              <p style={{marginBottom: '10px', fontWeight: '500'}}>没有找到保存的站点地图</p>
              <p style={{marginBottom: '16px'}}>请先获取并保存站点地图，然后再进行比较。</p>
              <button
                onClick={() => setActiveTab('fetch')}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#f59e0b',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                获取站点地图
              </button>
            </div>
          ) : (
            <div>
              <p style={{marginBottom: '12px', fontSize: '14px', color: '#4b5563'}}>
                选择两个站点地图进行比较（已选择 {selectedSitemaps.length}/2）
              </p>
              <div style={{
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                maxHeight: '300px',
                overflowY: 'auto',
                marginBottom: '16px'
              }}>
                {/* 确保显示唯一的站点地图列表 */}
                {sitemaps.filter((sitemap, index, self) => 
                  index === self.findIndex(s => s.name === sitemap.name)
                ).map((sitemap, index) => (
                  <div key={index} style={{
                    padding: '10px 12px',
                    borderBottom: index < sitemaps.length - 1 ? '1px solid #e5e7eb' : 'none',
                    backgroundColor: selectedSitemaps.includes(sitemap.name) ? '#eff6ff' : 'white',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <label style={{display: 'flex', alignItems: 'center', cursor: 'pointer', flex: 1}}>
                      <input
                        type="checkbox"
                        checked={selectedSitemaps.includes(sitemap.name)}
                        onChange={() => toggleSitemapSelection(sitemap.name)}
                        disabled={!selectedSitemaps.includes(sitemap.name) && selectedSitemaps.length >= 2}
                        style={{marginRight: '8px'}}
                      />
                      <span style={{fontSize: '14px'}}>{sitemap.name}</span>
                    </label>
                    <button
                      onClick={() => deleteSitemap(sitemap.name)}
                      style={{
                        backgroundColor: '#ef4444',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        padding: '4px 8px',
                        fontSize: '12px',
                        cursor: 'pointer'
                      }}
                      title="删除此站点地图"
                    >
                      删除
                    </button>
                  </div>
                ))}
              </div>
              <button
                onClick={handleCompare}
                disabled={selectedSitemaps.length !== 2 || loading}
                style={selectedSitemaps.length !== 2 || loading ? disabledButtonStyle : {
                  ...buttonStyle,
                  backgroundColor: '#059669'
                }}
              >
                {loading ? '比较中...' : '比较选中的站点地图'}
              </button>
              {selectedSitemaps.length === 2 && (
                <p style={{fontSize: '12px', color: '#6b7280', marginTop: '8px', textAlign: 'center'}}>
                  将比较: {selectedSitemaps[0]} 和 {selectedSitemaps[1]}
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {result && <SitemapResults result={result} />}

      {activeTab === 'compare' && (
        <div style={compareContainerStyle}>
          <div style={uploadContainerStyle}>
            <h3>上传站点地图文件</h3>
            <input
              type="file"
              accept=".json"
              onChange={uploadSitemap}
              style={{ display: 'none' }}
              id="sitemap-upload"
            />
            <label htmlFor="sitemap-upload" style={uploadButtonStyle}>
              选择文件
            </label>
            <p style={{ marginTop: '8px', fontSize: '14px', color: '#666' }}>
              支持JSON格式的站点地图文件
            </p>
          </div>
          
          <div style={sitemapListStyle}>
            <h3>可用的站点地图</h3>
            <div style={styles.buttonGroup}>
              <button 
                onClick={importSitemap}
                style={styles.button}
              >
                导入站点地图
              </button>
            </div>

            <div style={styles.sitemapList}>
              {/* 确保显示唯一的站点地图列表 */}
              {sitemaps.filter((sitemap, index, self) => 
                index === self.findIndex(s => s.name === sitemap.name)
              ).map((sitemap, index) => (
                <div key={sitemap.name} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '8px 12px',
                  borderBottom: '1px solid #eee',
                  backgroundColor: selectedSitemaps.includes(sitemap.name) ? '#f0f9ff' : 'white'
                }}>
                  <label style={{display: 'flex', alignItems: 'center', cursor: 'pointer', flex: 1}}>
                    <input
                      type="checkbox"
                      checked={selectedSitemaps.includes(sitemap.name)}
                      onChange={() => toggleSitemapSelection(sitemap.name)}
                      disabled={!selectedSitemaps.includes(sitemap.name) && selectedSitemaps.length >= 2}
                      style={{marginRight: '8px'}}
                    />
                    <span>{sitemap.name}</span>
                  </label>
                  <div>
                    <button
                      onClick={() => exportSitemap(sitemap.name)}
                      style={styles.actionButton}
                    >
                      导出
                    </button>
                    <button
                      onClick={() => deleteSitemap(sitemap.name)}
                      style={{...styles.actionButton, backgroundColor: '#ef4444'}}
                    >
                      删除
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const saveBlobToIndexedDB = (filename, blob) => {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB 不可用'));
      return;
    }

    try {
      const request = indexedDB.open('SitemapDB', 1);
      
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains('sitemaps')) {
          db.createObjectStore('sitemaps', { keyPath: 'name' });
        }
      };
      
      request.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction(['sitemaps'], 'readwrite');
        const store = transaction.objectStore('sitemaps');
        
        const item = {
          name: filename,
          data: blob,
          timestamp: new Date().toISOString()
        };
        
        const storeRequest = store.put(item);
        
        storeRequest.onsuccess = () => resolve(true);
        storeRequest.onerror = (e) => reject(e);
      };
      
      request.onerror = (event) => {
        reject(event.target.error);
      };
    } catch (error) {
      reject(error);
    }
  });
};

// 添加样式
const compareContainerStyle = {
  marginBottom: '20px',
  padding: '16px',
  border: '1px dashed #d9d9d9',
  borderRadius: '6px',
  textAlign: 'center'
};

const uploadContainerStyle = {
  marginBottom: '20px',
  padding: '16px',
  border: '1px dashed #d9d9d9',
  borderRadius: '6px',
  textAlign: 'center'
};

const uploadButtonStyle = {
  display: 'inline-block',
  padding: '8px 16px',
  backgroundColor: '#1890ff',
  color: 'white',
  borderRadius: '4px',
  cursor: 'pointer',
  transition: 'background-color 0.3s'
};

const sitemapListStyle = {
  marginBottom: '16px'
}; 