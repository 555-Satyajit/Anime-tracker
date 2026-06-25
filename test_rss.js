const Parser = require('rss-parser');
const parser = new Parser();

async function testFeeds() {
  const feeds = [
    'https://www.crunchyroll.com/news/rss',
    'https://myanimelist.net/rss/news.xml',
    'https://www.animenewsnetwork.com/news/rss.xml'
  ];

  for (const url of feeds) {
    try {
      const result = await parser.parseURL(url);
      console.log(`Success: ${url} - Items: ${result.items.length}`);
    } catch (e) {
      console.error(`Error: ${url} - ${e.message}`);
    }
  }
}

testFeeds();
