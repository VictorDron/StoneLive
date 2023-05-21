const express = require('express');
const app = express();
const fs = require('fs');
const print = require('./analysis/print.js');

// Conexão com os scripts de análise
const data = require('./analysis/base_1.js');
const data2 = require('./analysis/base_2.js');

// Configuração do renderizador
app.set('view engine', 'ejs');
app.use(express.static('public'));

function setupRoutes() {
  app.get('/', (req, res) => {
    res.render('index', { data, data2 });
  });

  app.get('/data', (req, res) => {
    res.json({ data, data2 });
  });

  app.get('/gerar-pdf', async (req, res) => {
    try {
      // Chamar a função print para gerar o arquivo PDF
      await print();

      // Definir o nome do arquivo e o caminho onde ele será salvo
      const fileName = 'relatorio.pdf';
      const filePath = __dirname + '/analysis/' + fileName;

      // Verificar se o arquivo existe
      if (fs.existsSync(filePath)) {
        // Enviar o arquivo para download
        res.download(filePath, fileName, (err) => {
          if (err) {
            console.error('Erro ao baixar o arquivo:', err);
            res.status(500).send('Erro ao baixar o arquivo');
          } else {
            // Remover o arquivo após o download
            fs.unlink(filePath, (err) => {
              if (err) {
                console.error('Erro ao remover o arquivo:', err);
              }
            });
          }
        });
      } else {
        console.error('O arquivo PDF não existe.');
        res.status(404).send('Arquivo não encontrado');
      }
    } catch (error) {
      console.error('Erro ao gerar o relatório:', error);
      res.status(500).send('Erro ao gerar o relatório');
    }
  });
}

setupRoutes();

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor em: http://localhost:${PORT}/`);
});
