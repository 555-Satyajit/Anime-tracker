const Parser = require('rss-parser');
const parser = new Parser({
  customFields: {
    item: [
      ['media:thumbnail', 'mediaThumbnail'],
      ['media:content', 'mediaContent']
    ]
  }
});

async function test() {
  const feed = await parser.parseURL('https://myanimelist.net/rss/news.xml');
  console.log("Feed items count:", feed.items.length);
  if (feed.items.length > 0) {
    console.log("First item FULL JSON:");
    console.log(JSON.stringify(feed.items[0], null, 2));
  }
}
test().catch(console.error);
