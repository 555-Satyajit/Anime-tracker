const query = `
query GetTopCharacters($perPage: Int) {
  Page(page: 1, perPage: $perPage) {
    characters(sort: FAVORITES_DESC) {
      id
      name { full }
      image { large }
      favorites
    }
  }
}
`;

fetch('https://graphql.anilist.co', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  body: JSON.stringify({
    query,
    variables: { perPage: 10 },
  })
})
  .then(res => res.json())
  .then(json => console.log(JSON.stringify(json, null, 2)))
  .catch(err => console.error(err));
