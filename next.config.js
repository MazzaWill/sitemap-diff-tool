/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  api: {
    bodyParser: {
      sizeLimit: '10mb', // 将默认的1MB限制增加到10MB
    },
    responseLimit: '10mb', // 增加响应大小限制
  },
}

module.exports = nextConfig 