const XLSX = require('xlsx');

try {
  const workbook = XLSX.readFile('./database/base_2.xlsx');
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

  //Retorna os valores da coluna base
  function getBaseColumn(data) {
    const baseColumn = data.slice(1).map(row => row[0]);
    return baseColumn;
  }

  const BaseColumn = getBaseColumn(data);

  //Retorna os valores da coluna de estoque
  function getStockColumn(data) {
    const stockColumn = data.slice(1).map(row => row[1]);
    return stockColumn;
  }

  const StockColumn = getStockColumn(data);

  //Retorna o total de bases
  function getTotalBases(data) {
    const baseColumn = getBaseColumn(data);
    return baseColumn.length;
  }

  const TotalBases = getTotalBases(data);

  //Retorna total em estoque
  function getTotalStock(data) {
    const stockColumn = getStockColumn(data);
    const totalStock = stockColumn.reduce((total, stock) => total + stock, 0);
    return totalStock;
  }

  const TotalStock = getTotalStock(data);

  //Retorna a correlação necessária para que a função "calculateStockDistribution" possa ter sucesso
  function getColumns(data) {
    if (data.length < 2 || data[0].length < 2) {
      throw new Error('O arquivo de dados está vazio ou não possui colunas suficientes.');
    }
    const baseColumn = data.slice(1).map(row => row[0]);
    const stockColumn = data.slice(1).map(row => row[1]);
    return { bases: baseColumn, stocks: stockColumn };
  }

  //Retorna a distribuição em percentual de estoque nas bases
  function calculateStockDistribution(data) {
    const { bases, stocks } = getColumns(data);

    const stockByBase = {};

    for (let i = 0; i < bases.length; i++) {
      const base = bases[i];
      const stock = stocks[i];

      if (!stockByBase[base]) {
        stockByBase[base] = 0;
      }

      stockByBase[base] += stock;
    }

    const totalStock = Object.values(stockByBase).reduce((acc, stock) => acc + stock, 0);

    const distribution = {};

    for (let base in stockByBase) {
      const stock = stockByBase[base];
      const percent = (stock / totalStock) * 100;
      distribution[base] = percent.toFixed(2) + '%';
    }

    return distribution;
  }

  const stockDistribution = calculateStockDistribution(data);

  function calculateStockByBase(data) {
    const { bases, stocks } = getColumns(data);

    const stockByBase = {};

    for (let i = 0; i < bases.length; i++) {
      const base = bases[i];
      const stock = stocks[i];

      if (!stockByBase[base]) {
        stockByBase[base] = 0;
      }

      stockByBase[base] += stock;
    }

    return stockByBase;
  }

  const stockByBase = calculateStockByBase(data);

  module.exports = {
    BaseColumn,
    StockColumn,
    TotalBases,
    TotalStock,
    stockDistribution,
    stockByBase
  };
} catch (error) {
  console.error('Ocorreu um erro ao processar os dados:', error.message);
}
