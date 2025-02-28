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
                    backgroundColor: selectedSitemaps.includes(sitemap) ? '#eff6ff' : 'white'
                  }}>
                    <label style={{display: 'flex', alignItems: 'center', cursor: 'pointer'}}>
                      <input
                        type="checkbox"
                        checked={selectedSitemaps.includes(sitemap)}
                        onChange={() => toggleSitemapSelection(sitemap)}
                        disabled={!selectedSitemaps.includes(sitemap) && selectedSitemaps.length >= 2}
                        style={{marginRight: '8px'}}
                      />
                      <span style={{fontSize: '14px'}}>{sitemap}</span>
                    </label>
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
    </div>
  );
} 