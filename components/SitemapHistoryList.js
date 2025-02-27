import Link from 'next/link';

export default function SitemapHistoryList({ sitemaps, loading }) {
  if (loading) {
    return (
      <div className="text-center p-8">
        <p>加载中...</p>
      </div>
    );
  }
  
  if (!sitemaps || sitemaps.length === 0) {
    return (
      <div className="text-center p-8 bg-gray-50 rounded">
        <p>没有找到保存的站点地图。请先获取并保存站点地图。</p>
      </div>
    );
  }
  
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              域名
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              时间
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              URL数量
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              文件大小
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              操作
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sitemaps.map((sitemap) => (
            <tr key={sitemap.filename} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                {sitemap.domain}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {new Date(sitemap.timestamp).toLocaleString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {sitemap.urlCount}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {(sitemap.size / 1024).toFixed(2)} KB
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <Link href={`/view?id=${encodeURIComponent(sitemap.filename)}`}>
                  <a className="text-blue-600 hover:underline mr-4">查看</a>
                </Link>
                <Link href={`/api/download?id=${encodeURIComponent(sitemap.filename)}`}>
                  <a className="text-green-600 hover:underline">下载</a>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 