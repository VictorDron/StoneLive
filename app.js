const express = require('express');
const app = express();
const data = require('./analysis/base_1.js');
const data2 = require('./analysis/base_2.js');

app.set('view engine', 'ejs');
app.use(express.static('public'));

function setupRoutes() {
  app.get('/', (req, res) => {
    res.render('index', { data, data2 });
  });

  app.get('/data', (req, res) => {
    res.json({ data, data2 });
  });
}

setupRoutes();

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor em: http://localhost:${PORT}/`);
});
