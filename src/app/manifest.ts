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
        src: '/favicon.png',
        sizes: 'any',
        type: 'image/png',
      },
    ],
  };
}
