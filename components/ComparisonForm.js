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
  }
};

export default function ComparisonForm() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [sitemaps, setSitemaps] = useState([]);
  const [selectedSitemaps, setSelectedSitemaps] = useState([]);
  const [activeTab, setActiveTab] = useState('fetch'); // 'fetch' or 'compare'
  const [localSitemaps, setLocalSitemaps] = useState([]);
  const [message, setMessage] = useState('');
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
          const uniqueSitemaps = [];
          const sitemapNames = new Set();
          
          parsedSitemaps.forEach(sitemap => {
            if (!sitemapNames.has(sitemap.name)) {
              sitemapNames.add(sitemap.name);
              uniqueSitemaps.push(sitemap);
            }
          });
          
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
    setResult('');
    
    try {
      console.log('开始比较选中的站点地图...');
      console.log('选中的文件:', selectedFiles);
      
      // 不再从IndexedDB获取完整数据，只使用文件名
      const sitemapData1 = {
        filename: selectedFiles[0].name,
        domain: selectedFiles[0].domain || extractDomainFromFilename(selectedFiles[0].name)
      };
      
      const sitemapData2 = {
        filename: selectedFiles[1].name,
        domain: selectedFiles[1].domain || extractDomainFromFilename(selectedFiles[1].name)
      };
      
      console.log('准备发送数据到API进行比较...');
      console.log('发送的数据:', { 
        sitemapData1: sitemapData1, 
        sitemapData2: sitemapData2
      });
      
      try {
        const response = await fetch('/api/compare-sitemaps', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            sitemapData1: sitemapData1, 
            sitemapData2: sitemapData2 
          })
        });
        
        console.log('API响应状态:', response.status);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('API响应错误:', errorText);
          throw new Error(`API响应失败: ${response.status} ${errorText}`);
        }
        
        const data = await response.json();
        console.log('API响应数据:', data);
        
        if (data.success) {
          setResult(data);
        } else {
          setError(data.error || '比较站点地图失败');
        }
      } catch (fetchError) {
        console.error('API请求失败:', fetchError);
        throw new Error(`API请求失败: ${fetchError.message}`);
      }
    } catch (error) {
      console.error('比较站点地图时出错:', error);
      setError('比较站点地图时出错: ' + error.message);
    } finally {
      setLoading(false);
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
      if (typeof window === 'undefined') {
        throw new Error('浏览器环境不可用');
      }

      const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
      
      await saveBlobToIndexedDB(filename, blob);
      
      const existingSitemapIndex = localSitemaps.findIndex(sitemap => sitemap.name === filename);
      let updatedSitemaps = [...localSitemaps];
      
      if (existingSitemapIndex >= 0) {
        updatedSitemaps[existingSitemapIndex] = {
          name: filename,
          domain: data.domain,
          timestamp: new Date().toISOString(),
          urlCount: data.urls.length
        };
      } else {
        updatedSitemaps.push({
          name: filename,
          domain: data.domain,
          timestamp: new Date().toISOString(),
          urlCount: data.urls.length
        });
      }
      
      setLocalSitemaps(updatedSitemaps);
      setSitemaps(updatedSitemaps);
      localStorage.setItem('sitemaps', JSON.stringify(updatedSitemaps));
      
      return true;
    } catch (e) {
      console.error('保存站点地图到本地失败:', e);
      return false;
    }
  };

  const handleFetchResponse = async (data) => {
    if (data.success) {
      const saved = await saveSitemapLocally({
        domain: data.domain,
        urls: data.urls,
        timestamp: new Date().toISOString()
      }, data.filename);
      
      if (saved) {
        setResult(data);
      } else {
        setError('保存站点地图到本地失败');
      }
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

  return (
    <div style={formContainerStyle}>
      <div style={tabContainerStyle}>
        <div 
          style={activeTab === 'fetch' ? activeTabStyle : inactiveTabStyle}
          onClick={() => setActiveTab('fetch')}
        >
          获取站点地图
        </div>
        <div 
          style={activeTab === 'compare' ? activeTabStyle : inactiveTabStyle}
          onClick={() => setActiveTab('compare')}
        >
          比较站点地图
        </div>
      </div>

      {activeTab === 'fetch' ? (
        <div>
          <h3 style={{fontSize: '18px', fontWeight: '500', marginBottom: '16px'}}>获取新站点地图</h3>
          <form onSubmit={handleSubmit}>
            <div style={inputContainerStyle}>
              <label htmlFor="url" style={labelStyle}>
                网站 URL
              </label>
              <input
                type="text"
                id="url"
                style={inputStyle}
                placeholder="例如: example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
              />
              <p style={{fontSize: '12px', color: '#6b7280', marginTop: '4px'}}>
                输入网站域名或直接输入站点地图URL
              </p>
            </div>
            <button
              type="submit"
              style={loading ? disabledButtonStyle : buttonStyle}
              disabled={loading}
            >
              {loading ? '处理中...' : '获取站点地图'}
            </button>
          </form>
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
                {sitemaps.map((sitemap, index) => (
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

      {error && (
        <div style={errorContainerStyle}>
          <p>{error}</p>
        </div>
      )}

      {result && <SitemapResults result={result} />}

      {activeTab === 'compare' && (
        <div>
          <h3 style={{fontSize: '18px', fontWeight: '500', marginBottom: '16px', marginTop: '24px'}}>管理站点地图</h3>
          <div style={styles.buttonGroup}>
            <button 
              onClick={importSitemap}
              style={styles.button}
            >
              导入站点地图
            </button>
          </div>

          <div style={styles.sitemapList}>
            {sitemaps.map((sitemap, index) => (
              <div key={sitemap.name} style={{
                ...styles.sitemapItem,
                borderBottom: index < sitemaps.length - 1 ? '1px solid #e5e7eb' : 'none'
              }}>
                <input
                  type="checkbox"
                  checked={selectedSitemaps.includes(sitemap.name)}
                  onChange={() => toggleSitemapSelection(sitemap.name)}
                  disabled={!selectedSitemaps.includes(sitemap.name) && selectedSitemaps.length >= 2}
                  style={{marginRight: '8px'}}
                />
                <span style={{flex: 1}}>{sitemap.name}</span>
                <div>
                  <button 
                    onClick={() => exportSitemap(sitemap.name)}
                    style={styles.smallButton}
                    title="导出此站点地图"
                  >
                    导出
                  </button>
                  <button 
                    onClick={() => deleteSitemap(sitemap.name)}
                    style={styles.deleteButton}
                    title="删除此站点地图"
                  >
                    删除
                  </button>
                </div>
              </div>
            ))}
          </div>
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