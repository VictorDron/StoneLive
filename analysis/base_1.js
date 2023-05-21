const XLSX = require('xlsx');
const moment = require('moment');

try {
  const workbook = XLSX.readFile('./database/base_1.xlsx');
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = XLSX.utils.sheet_to_json(sheet);

  data.forEach(row => {
    if (row.date) {
      row.date = XLSX.SSF.format('yyyy-mm-dd', row.date);
    } else {
      throw new Error('A data não está definida para uma linha.');
    }
  });

  //Calculo do total de atendimentos
  function getTotalOccurrences(data) {
    if (!Array.isArray(data)) {
      throw new Error('Os dados fornecidos não são um array.');
    }
    return data.length;
  }

  const totalOccurrences = getTotalOccurrences(data);

  //Exibe o total de dias analisados no console
  function getTotalDays(data) {
    if (!Array.isArray(data)) {
      throw new Error('Os dados fornecidos não são um array.');
    }
    const uniqueDates = [...new Set(data.map(row => row.date))];
    return uniqueDates.length;
  }

  const totalDays = getTotalDays(data);

  //Coleta tratada de datas
  function getAllDates(data) {
    if (!Array.isArray(data)) {
      throw new Error('Os dados fornecidos não são um array.');
    }
    const dates = data.map(row => row.date);
    const count = {};

    dates.forEach(date => {
      if (count[date]) {
        count[date]++;
      } else {
        count[date] = 1;
      }
    });

    return count;
  }

  const alldates = getAllDates(data);

  //Calculo da média mensal de atendimentos
  function getMonthlyAverage(data) {
    const countsByMonth = {};
    for (const row of data) {
      const date = moment(row.date, 'YYYY-MM-DD');
      const month = date.format('YYYY-MM');
      if (!countsByMonth[month]) {
        countsByMonth[month] = 0;
      }
      countsByMonth[month]++;
    }
  
    const monthlyAverages = {};
    for (const [month, count] of Object.entries(countsByMonth)) {
      const daysInMonth = moment(month + "-01").daysInMonth();
      const average = count / daysInMonth;
      monthlyAverages[month] = average.toFixed(2);
    }
  
    return monthlyAverages;
  }

  const monthlyAverages = getMonthlyAverage(data);

  //Retorna a média do total de meses em análise
  function getTotalMonthlyAverage(monthlyAverages) {
    if (typeof monthlyAverages !== 'object') {
      throw new Error('O argumento fornecido não é um objeto.');
    }
    const months = Object.keys(monthlyAverages);
    const totalAverage = months.reduce((sum, month) => {
      const average = parseFloat(monthlyAverages[month]);
      return sum + average;
    }, 0);
    const totalMonths = months.length;
    const totalMonthlyAverage = (totalAverage / totalMonths).toFixed(2);
    return parseFloat(totalMonthlyAverage);
  }

  const totalMonthlyAverage = getTotalMonthlyAverage(monthlyAverages);

  //Calculo da média diária de atendimentos
  function getDailyAverage(data) {
    if (!Array.isArray(data)) {
      throw new Error('Os dados fornecidos não são um array.');
    }
    const totalOccurrences = getTotalOccurrences(data);
    const totalDays = getTotalDays(data);
    const dailyAverage = (totalOccurrences / totalDays).toFixed(2);
    return parseFloat(dailyAverage);
  }

  const dailyAverage = getDailyAverage(data);

  //Ordenação crescente das datas
  function sortDates(getAllDates) {
    if (typeof getAllDates !== 'object') {
      throw new Error('O argumento fornecido não é um objeto.');
    }
    const dates = Object.keys(getAllDates);
    const sortedDates = dates.sort((a, b) => new Date(a) - new Date(b));
    const sortedObj = {};
    sortedDates.forEach(date => {
      sortedObj[date] = getAllDates[date];
    });
    return sortedObj;
  }

  const sortedDates = sortDates(alldates);

  //Coleta ordenada do Estados presentes no banco
  function getCountryStates(data) {
    if (!Array.isArray(data)) {
      throw new Error('Os dados fornecidos não são um array.');
    }
    const countryStates = data.map(row => row.country_state);
    const uniqueCountryStates = [...new Set(countryStates)];
    return uniqueCountryStates;
  }

  const uniqueCountryStates = getCountryStates(data);

  //Coleta ordenada das bases presentes no banco
  function getUniquebase(data) {
    if (!Array.isArray(data)) {
      throw new Error('Os dados fornecidos não são um array.');
    }
    const base = data.map(row => row.base);
    const baseReturn = [...new Set(base)];
    return baseReturn;
  }

  const polo = getUniquebase(data);

  //Retorno do número de ocorrências por Estado
  function countCountryStates(data) {
    if (!Array.isArray(data)) {
      throw new Error('Os dados fornecidos não são um array.');
    }
    const countryStates = data.map(row => row.country_state);
    const count = {};

    countryStates.forEach(state => {
      if (count[state]) {
        count[state]++;
      } else {
        count[state] = 1;
      }
    });

    return count;
  }

  const stateCounts = countCountryStates(data);

  //Retorno do número de ocorrências por Base
  function countBases(data) {
    if (!Array.isArray(data)) {
      throw new Error('Os dados fornecidos não são um array.');
    }
    const bases = data.map(row => row.base);
    const count = {};

    bases.forEach(base => {
      if (count[base]) {
        count[base] += 1;
      } else {
        count[base] = 1;
      }
    });

    return count;
  }

  const baseCount = countBases(data);

  //Retorna a ocorrência das bases por datas
  function getBaseCountsByDate(data) {
    if (!Array.isArray(data)) {
      throw new Error('Os dados fornecidos não são um array.');
    }
    const countsByDate = {};

    // Agrupar as ocorrências por data
    data.forEach(row => {
      if (!row.date) {
        throw new Error('A data não está definida para uma linha.');
      }
      const date = row.date;
      const base = row.base;

      if (!countsByDate[date]) {
        countsByDate[date] = {};
      }

      if (!countsByDate[date][base]) {
        countsByDate[date][base] = 1;
      } else {
        countsByDate[date][base]++;
      }
    });

    return countsByDate;
  }

  const baseCountsByDate = getBaseCountsByDate(data);

  //Verifica o top e o Botton em número atendimentos
  function findMostAndLeastOccurredStates(data) {
    if (!Array.isArray(data)) {
      throw new Error('Os dados fornecidos não são um array.');
    }
    const stateCounts = countCountryStates(data);

    let mostOccurredState = '';
    let leastOccurredState = '';
    let mostOccurrences = 0;
    let leastOccurrences = Infinity;

    for (const state in stateCounts) {
      if (stateCounts[state] > mostOccurrences) {
        mostOccurredState = state;
        mostOccurrences = stateCounts[state];
      }
      if (stateCounts[state] < leastOccurrences) {
        leastOccurredState = state;
        leastOccurrences = stateCounts[state];
      }
    }

    return {
      mostOccurredState,
      leastOccurredState
    };
  }

  const { mostOccurredState, leastOccurredState } = findMostAndLeastOccurredStates(data);

  //Verifica a quantidade de bases por Estado
  function countBasesByState(data) {
    if (!Array.isArray(data)) {
      throw new Error('Os dados fornecidos não são um array.');
    }
    const stateBases = {};

    data.forEach(row => {
      const state = row.country_state;
      const base = row.base;

      if (!stateBases[state]) {
        stateBases[state] = [base];
      } else {
        stateBases[state].push(base);
      }
    });

    const stateBaseCount = {};

    for (const state in stateBases) {
      stateBaseCount[state] = new Set(stateBases[state]).size;
    }

    return stateBaseCount;
  }

  const stateBaseCount = countBasesByState(data);

  //Calcula a distribuição percentual de atendimentos entre os Estados
  function calculateStatePercentage(states) {
    if (typeof states !== 'object') {
      throw new Error('O argumento fornecido não é um objeto.');
    }
    const total = Object.values(states).reduce((acc, val) => acc + val, 0);
    const percentages = {};
    for (let state in states) {
      const percentage = ((states[state] / total) * 100).toFixed(3) + '%';
      percentages[state] = percentage;
    }
    return percentages;
  }

  const statePercentages = calculateStatePercentage(stateCounts);

// Calcula a dispersão entre o estado com mais atendimentos e o estado com menos atendimentos
function calculateStateDispersion(stateCounts) {
  if (typeof stateCounts !== 'object') {
    throw new Error('O argumento fornecido não é um objeto.');
  }

  const occurrences = Object.values(stateCounts);
  const maxOccurrences = Math.max(...occurrences);
  const minOccurrences = Math.min(...occurrences);

  const dispersion = maxOccurrences - minOccurrences;

  return dispersion;
}

const stateDispersion = calculateStateDispersion(stateCounts);


  module.exports = {
    totalOccurrences,
    totalDays,
    alldates,
    monthlyAverages,
    totalMonthlyAverage,
    dailyAverage,
    sortedDates,
    uniqueCountryStates,
    polo,
    stateCounts,
    baseCount,
    baseCountsByDate,
    mostOccurredState,
    leastOccurredState,
    stateBaseCount,
    statePercentages,
    stateDispersion
  };
} catch (error) {
  console.error('Ocorreu um erro ao processar os dados:', error.message);
}
