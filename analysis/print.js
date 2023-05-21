const puppeteer = require('puppeteer');
const { format } = require('date-fns');

async function print() {
  // Obter a data atual formatada como 'yyyy-MM-dd'
  const currentDate = format(new Date(), 'yyyy-MM-dd');

  // Diretório de saída para o relatório
  const outputDir = './analysis';

  // Caminho completo do arquivo de saída
  const outputPath = `${outputDir}/relatorio.pdf`;

  try {
    // Iniciar uma instância do navegador Puppeteer
    const browser = await puppeteer.launch();

    // Abrir uma nova página no navegador
    const page = await browser.newPage();

    // Acessar a página do relatório
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });

    // Gerar o relatório em formato PDF e salvá-lo no diretório de saída
    await page.pdf({ path: outputPath, format: 'A4' });

    // Fechar o navegador
    await browser.close();

    // Exibir mensagem de sucesso
    console.log('Relatório em PDF gerado com sucesso!');
  } catch (error) {
    // Lidar com erros e exibir mensagem de erro
    console.error('Erro ao gerar o relatório em PDF:', error);
  }
}

module.exports = print;
