import Link from 'next/link';
import Head from 'next/head';

export default function Layout({ children, title = '站点地图差异工具' }) {
  const description = '一个用于下载、保存和比较网站站点地图的工具，帮助您跟踪网站内容变化和SEO优化';
  
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="utf-8" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {children}
    </>
  );
} 