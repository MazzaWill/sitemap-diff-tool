import { useState } from 'react';

export default function ComparisonResults({ comparison }) {
  const [activeTab, setActiveTab] = useState('added');
  
  if (!comparison) return null;
  
  const { oldDomain, newDomain, oldTimestamp, newTimestamp, added, removed, unchanged, stats } = comparison;
  
  return (
    <div className="bg-white shadow-md rounded-lg p-6 mt-6">
      <h2 className="text-xl font-semibold mb-4">比较结果</h2>
      
      <div className="mb-4 p-4 bg-gray-50 rounded">
        <p><strong>旧站点地图:</strong> {oldDomain} ({new Date(oldTimestamp).toLocaleString()})</p>
        <p><strong>新站点地图:</strong> {newDomain} ({new Date(newTimestamp).toLocaleString()})</p>
        <div className="mt-2 grid grid-cols-3 gap-4">
          <div className="bg-green-100 p-2 rounded">
            <p className="text-center"><strong>新增:</strong> {stats.addedCount}</p>
          </div>
          <div className="bg-red-100 p-2 rounded">
            <p className="text-center"><strong>删除:</strong> {stats.removedCount}</p>
          </div>
          <div className="bg-gray-100 p-2 rounded">
            <p className="text-center"><strong>未变:</strong> {stats.unchangedCount}</p>
          </div>
        </div>
      </div>
      
      <div className="mb-4">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex">
            <button
              onClick={() => setActiveTab('added')}
              className={`py-2 px-4 font-medium ${
                activeTab === 'added'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              新增 URL ({stats.addedCount})
            </button>
            <button
              onClick={() => setActiveTab('removed')}
              className={`py-2 px-4 font-medium ${
                activeTab === 'removed'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              删除 URL ({stats.removedCount})
            </button>
            <button
              onClick={() => setActiveTab('unchanged')}
              className={`py-2 px-4 font-medium ${
                activeTab === 'unchanged'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              未变 URL ({stats.unchangedCount})
            </button>
          </nav>
        </div>
        
        <div className="mt-4">
          {activeTab === 'added' && (
            <UrlList urls={added} emptyMessage="没有新增的URL" />
          )}
          
          {activeTab === 'removed' && (
            <UrlList urls={removed} emptyMessage="没有删除的URL" />
          )}
          
          {activeTab === 'unchanged' && (
            <UrlList urls={unchanged} emptyMessage="没有保持不变的URL" />
          )}
        </div>
      </div>
      
      <div className="flex justify-between">
        <button
          onClick={() => {
            const data = {
              comparison: {
                oldDomain,
                newDomain,
                oldTimestamp,
                newTimestamp,
                stats
              },
              added,
              removed,
              unchanged
            };
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `comparison_${oldDomain}_${newDomain}.json`;
            a.click();
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-4 rounded"
        >
          下载完整比较结果
        </button>
        
        <button
          onClick={() => {
            let content = '';
            if (added.length > 0) {
              content += '=== 新增 URL ===\n' + added.join('\n') + '\n\n';
            }
            if (removed.length > 0) {
              content += '=== 删除 URL ===\n' + removed.join('\n') + '\n\n';
            }
            
            const blob = new Blob([content], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `changes_${oldDomain}_${newDomain}.txt`;
            a.click();
          }}
          className="bg-gray-600 hover:bg-gray-700 text-white py-1 px-4 rounded"
        >
          下载变更URL列表
        </button>
      </div>
    </div>
  );
}

function UrlList({ urls, emptyMessage }) {
  const [showAll, setShowAll] = useState(false);
  
  if (!urls || urls.length === 0) {
    return (
      <div className="text-center p-4 bg-gray-50 rounded">
        <p>{emptyMessage}</p>
      </div>
    );
  }
  
  const displayUrls = showAll ? urls : urls.slice(0, 100);
  
  return (
    <div>
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
        
        {!showAll && urls.length > 100 && (
          <div className="mt-4 text-center">
            <button
              onClick={() => setShowAll(true)}
              className="text-blue-600 hover:underline"
            >
              显示全部 {urls.length} 个URL
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 