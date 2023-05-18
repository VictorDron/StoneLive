const XLSX = require('xlsx');
const moment = require('moment');

const workbook = XLSX.readFile('./database/base_1.xlsx');
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const data = XLSX.utils.sheet_to_json(sheet);

data.forEach(row => {
  row.date = XLSX.SSF.format('yyyy-mm-dd', row.date);
});

//Calculo do total de atendimentos
function getTotalOccurrences(data) {
  return data.length;
}
const totalOccurrences = getTotalOccurrences(data);

//Exibe o total de dias analisados no console
function getTotalDays(data) {
  const uniqueDates = [...new Set(data.map(row => row.date))];
  return uniqueDates.length;
}
const totalDays = getTotalDays(data);

//Coleta tratada de datas
function getAllDates(data) {
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

  // Agrupar as ocorrências por mês
  data.forEach(row => {
    const date = moment(row.date);
    const month = date.format('YYYY-MM');

    if (!countsByMonth[month]) {
      countsByMonth[month] = 0;
    }

    countsByMonth[month]++;
  });

  // Calcular a média por mês
  const months = Object.keys(countsByMonth);
  const monthlyAverages = {};
  months.forEach(month => {
    const count = countsByMonth[month];
    const daysInMonth = moment(month).daysInMonth();
    const average = count / daysInMonth;
    monthlyAverages[month] = average.toFixed(2);
  });

  return monthlyAverages;
}
const monthlyAverages = getMonthlyAverage(data);

//Retorna a média do total de meses em análise
function getTotalMonthlyAverage(monthlyAverages) {
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
  const totalOccurrences = getTotalOccurrences(data);
  const totalDays = getTotalDays(data);
  const dailyAverage = (totalOccurrences / totalDays).toFixed(2);
  return parseFloat(dailyAverage);
}

const dailyAverage = getDailyAverage(data);

//Ordenação crescente das datas
function sortDates(getAllDates) {
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
  const countryStates = data.map(row => row.country_state);
  const uniqueCountryStates = [...new Set(countryStates)];
  return uniqueCountryStates;
}
const uniqueCountryStates = getCountryStates(data);

//Coleta ordenada das bases presentes no banco
function getUniquebase(data) {
  const base = data.map(row => row.base);
  const baseReturn = [...new Set(base)];
  return baseReturn;
}
const polo = getUniquebase(data);

//Retorno do número de ocorrências por Estado
function countCountryStates(data) {
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

//Pesquisa de atendimentos com base na Data
function getOccurrenceByDate(data, date) {
    const filteredData = data.filter(row => row.date === date);
    const statesCount = countCountryStates(filteredData);
    const basesCount = countBases(filteredData);
  
    return {
      states: statesCount,
      bases: basesCount
    };
}
const result = getOccurrenceByDate(data, '2020-06-05');

//Retorna a ocorrência das bases por datas
function getBaseCountsByDate(data) {
  const countsByDate = {};

  // Agrupar as ocorrências por data
  data.forEach(row => {
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
  const total = Object.values(states).reduce((acc, val) => acc + val, 0);
  const percentages = {};
  for (let state in states) {
    const percentage = ((states[state] / total) * 100).toFixed(3) + '%';
    percentages[state] = percentage;
  }
  return percentages;
}
const statePercentages = calculateStatePercentage(stateCounts);


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
  result,
  baseCountsByDate,
  mostOccurredState,
  leastOccurredState,
  stateBaseCount,
  statePercentages,
};










