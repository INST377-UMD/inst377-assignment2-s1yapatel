const apiKey = 'NDppHYMqd3HhYZd9_fON9h3BdGdCbkqN'; // Replace with your Polygon.io API Key

// Function to handle stock lookup
async function handleStockLookup(tickerInput = null) {
  const ticker = (tickerInput || document.getElementById('stock-input').value).toUpperCase();
  const days = parseInt(document.getElementById('day-select').value);

  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - days);

  const formatDate = date => date.toISOString().split('T')[0];

  const url = `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/day/${formatDate(startDate)}/${formatDate(endDate)}?adjusted=true&sort=asc&limit=${days}&apiKey=${apiKey}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (data.results && data.results.length > 0) {
      const labels = data.results.map(entry => {
        const date = new Date(entry.t);
        return `${date.getMonth() + 1}/${date.getDate()}`;
      });

      const values = data.results.map(entry => entry.c);

      const ctx = document.getElementById('stock-chart').getContext('2d');
      if (window.stockChart) {
        window.stockChart.destroy();
      }

      window.stockChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: `${ticker} Closing Prices`,
            data: values,
            borderColor: '#0077cc',
            backgroundColor: 'rgba(0, 119, 204, 0.1)',
            borderWidth: 2,
            fill: true,
            tension: 0.2
          }]
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: false
            }
          }
        }
      });
    } else {
      alert('No stock data found. Please check the ticker symbol.');
    }
  } catch (error) {
    console.error('Error fetching stock data:', error);
    alert('Failed to fetch stock data. Please try again later.');
  }
}

// Function to load the top 5 Reddit stocks
async function loadRedditStocks() {
  try {
    const res = await fetch('https://tradestie.com/api/v1/apps/reddit?date=2022-04-03');
    const data = await res.json();
    const table = document.querySelector('#reddit-table tbody');
    table.innerHTML = '';

    // Display the top 5 Reddit stocks
    data.slice(0, 5).forEach(stock => {
      const row = document.createElement('tr');

      const tickerCell = document.createElement('td');
      const link = document.createElement('a');
      link.href = `https://finance.yahoo.com/quote/${stock.ticker}`;
      link.textContent = stock.ticker;
      link.target = '_blank';
      tickerCell.appendChild(link);

      const commentCell = document.createElement('td');
      commentCell.textContent = stock.no_of_comments;

      const sentimentCell = document.createElement('td');
      const icon = document.createElement('span');
      icon.textContent = stock.sentiment === 'Bullish' ? '📈' : '📉';
      sentimentCell.appendChild(icon);

      row.appendChild(tickerCell);
      row.appendChild(commentCell);
      row.appendChild(sentimentCell);
      table.appendChild(row);
    });
  } catch (error) {
    console.error('Error fetching Reddit stock data:', error);
  }
}

// Setup voice commands using Annyang
if (annyang) {
  const commands = {
    'lookup *stock': (stock) => {
      document.getElementById('stock-input').value = stock.toUpperCase();
      document.getElementById('day-select').value = '30';
      handleStockLookup(stock);
    }
  };
  annyang.addCommands(commands);
}

window.onload = () => {
  loadRedditStocks();
};
