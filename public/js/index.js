const gerarRelatorioBtn = document.getElementById('gerarRelatorioBtn');

// Adiciona um evento de clique ao botão
gerarRelatorioBtn.addEventListener('click', function() {
  // Faz uma requisição para a rota /gerar-pdf para gerar e baixar o arquivo PDF
  fetch('/gerar-pdf')
    .then(response => {
      if (response.ok) {
        // Se a resposta for bem-sucedida, redireciona o navegador para o arquivo baixado
        response.blob().then(blob => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'relatorio.pdf';
          a.click();
          window.URL.revokeObjectURL(url);
        });
      } else {
        console.error('Erro ao gerar o relatório');
        // Exiba uma mensagem de erro ao usuário, se necessário
      }
    })
    .catch(error => {
      console.error('Erro ao gerar o relatório:', error);
      // Exiba uma mensagem de erro ao usuário, se necessário
    });
});

const commonOptions = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          font: {
            size: 10,
          },
        },
      },
    },
    scales: {
      x: {
        ticks: {
          font: {
            size: 6,
          },
        },
        categoryPercentage: 0.5,
        barPercentage: 2,
      },
      y: {
        beginAtZero: true,
      },
    },
  };
  
  //GRÁFICO DE OCORRÊNCIAS POR DATA
  function createOccurrencesByDatesChart(data) {
    const ctx = document.getElementById('sortedDates').getContext('2d');
    const myChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: Object.keys(data.data.sortedDates),
        datasets: [{
          label: 'ANÁLISE DE OCORRÊNCIAS DIÁRIAS',
          data: Object.values(data.data.sortedDates),
          backgroundColor: '#5ad15a',
          borderColor: '#5ad15a',
          borderWidth: 0.5,
          barThickness: 1,
        }],
      },
      options: {
        ...commonOptions,
      },
    });
  }
  //GRÁFICO DE OCORRÊNCIAS POR BASES
  function createBaseCountsByDateChart(data) {
    const ctx = document.getElementById('baseCountsByDate').getContext('2d');
    const myChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: Object.keys(data.data.baseCount),
        datasets: [{
          label: 'OCORRÊNCIAS POR BASES',
          data: Object.values(data.data.baseCount),
          backgroundColor: '#5ad15a',
          borderColor: '#5ad15a',
          borderWidth: 0.5,
          barThickness: 3,
        }],
      },
      options: {
        ...commonOptions,
      },
    });
  }
   //GRÁFICO EM PIZZA DA DISTRIBUIÇÃO EM PERCENTUAL 
  function createStatePercentagesChart(data) {
    const statePercentages = data.data.statePercentages;
    const labels = Object.keys(statePercentages);
    const dataset = Object.values(statePercentages).map(val => parseFloat(val));
  
    const ctx = document.getElementById('statePercentages').getContext('2d');
    const myChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          data: dataset,
          backgroundColor: labels.map(() => '#' + Math.floor(Math.random() * 16777215).toString(16)),
          borderWidth: 1,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
            labels: {
              font: {
                size: 10,
              },
            },
          },
        },
      },
    });
  }
  //GRÁFICO DA QUANTIDADE DE BASES POR ESTADOS
  function createStateBaseCountChart(data) {
    const ctx = document.getElementById('stateBaseCount').getContext('2d');
    const myChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: Object.keys(data.data.stateBaseCount),
        datasets: [{
          label: 'QUANTIDADE DE BASES POR ESTADO',
          data: Object.values(data.data.stateBaseCount),
          backgroundColor: '#5ad15a',
          borderColor: '#5ad15a',
          borderWidth: 0.5,
          barThickness: 3,
        }],
      },
      options: {
        ...commonOptions,
      },
    });
  }
  //GRÁFICO DE ESTOQUE POR BASE
  function createStockByBaseChart(data) {
    const ctx = document.getElementById('stockByBase').getContext('2d');
    const myChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: Object.keys(data.data2.stockByBase),
        datasets: [{
          label: 'ESTOQUE DISPONÍVEL POR BASE',
          data: Object.values(data.data2.stockByBase),
          backgroundColor: '#5ad15a',
          borderColor: '#5ad15a',
          borderWidth: 0.5,
          barThickness: 3,
        }],
      },
      options: {
        ...commonOptions,
      },
    });
  }
  
  //MÉTODO PARA OBTER DADOS DO SERVIDOR 
  fetch('http://localhost:3000/data')
    .then(response => response.json())
    .then(data => {
      console.log(data);
  
      createOccurrencesByDatesChart(data);
      createBaseCountsByDateChart(data);
      createStatePercentagesChart(data);
      createStateBaseCountChart(data);
      createStockByBaseChart(data);
    })
    .catch(error => {
      console.error('Erro:', error);
    });
  