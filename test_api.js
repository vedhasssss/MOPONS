const http = require('http');

http.get('http://localhost:5000/api/coupons?status=sold&ownerId=67e5a07c309f7a7d4ba77eb8&limit=1000', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log(JSON.parse(data).data?.coupons?.length);
  });
});
