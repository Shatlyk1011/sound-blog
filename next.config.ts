import withPayload from '@payloadcms/next/withPayload';
import type { NextConfig } from 'next';





const nextConfig: NextConfig = {
  /* config options here */

  async redirects() {
    return [
      {
        source: '/record',
        destination: '/dashboard',
        permanent: true,
      },
    ]
  },
}

export default withPayload(nextConfig)
