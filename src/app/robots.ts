import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/account/', '/api/'],
      },
      // Allow Answer Engines & AI Search
      {
        userAgent: ['PerplexityBot', 'ChatGPT-User', 'Google-Extended', 'OAI-SearchBot', 'Claude-Web', 'ClaudeBot', 'Googlebot'],
        allow: '/',
      },
      // Disallow Foundation Model Training Crawlers
      {
        userAgent: ['CCBot', 'GPTBot', 'Anthropic-ai', 'Bytespider', 'Diffbot', 'Amazonbot', 'FacebookBot'],
        disallow: '/',
      }
    ],
    sitemap: 'https://www.senkaihub.com/sitemap.xml',
  }
}
