const fs = require('fs');
const http = require('http');
const url = require('url');

const PORT = 3000;
const templateOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  'utf-8',
);
const templateProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  'utf-8',
);
const templateCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  'utf-8',
);

const data = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8'),
);
const replaceTemplate = function (template, data) {
  let output = template.replace(/{%PRODUCTNAME%}/g, data.productName);
  output = output.replace(/{%ID%}/g, data.id);
  output = output.replace(/{%IMAGE%}/g, data.image);
  output = output.replace(/{%FROM%}/g, data.from);
  output = output.replace(/{%NUTRIENTS%}/g, data.nutrients);
  output = output.replace(/{%QUANTITY%}/g, data.quantity);
  output = output.replace(/{%PRICE%}/g, data.price);
  output = output.replace(/{%DESCRIPTION%}/g, data.description);
  if (!data.organic) output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');
  return output;
};

const server = http.createServer((req, res) => {
  const { pathname } = url.parse(req.url, true);

  const id = +url.parse(req.url, true).query.id;

  if (pathname === '/' || pathname === '/overview') {
    res.writeHead(200, {
      'content-type': 'text/html',
    });
    const cards = data.map((ob) => {
      return replaceTemplate(templateCard, ob);
    });
    const output = templateOverview.replace(/{%CARDS%}/g, cards.join());
    res.end(output);
  }
  if (pathname === '/product') {
    const product = data.find((ob) => ob.id === id);
    if (!product) {
      res.statusCode = 404;
      res.end('Page not found');
      return;
    }
    const output = replaceTemplate(templateProduct, product);
    res.writeHead(200, {
      'content-type': 'text/html',
    });
    res.end(output);
  }
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`Server is running at : http://127.0.0.1:${PORT}`);
});
