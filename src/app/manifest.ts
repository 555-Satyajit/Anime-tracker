import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Senkai Anime Tracker',
    short_name: 'Senkai',
    description: 'Track, discover, and discuss your favorite anime.',
    start_url: '/',
    display: 'standalone',
    background_color: '#000000',
    theme_color: '#e71014',
    icons: [
      {
        src: '/favicon_io/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/favicon_io/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/favicon_io/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable'
      }
    ],
  };
}
