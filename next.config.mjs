export default {
  reactStrictMode: true,
  // Allow external images from Supabase storage (avatars, etc.)
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'mgnukermjfidhmpyrxyl.supabase.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // `experimental.appDir` is unsupported on some deployment targets — remove to avoid build errors
}
