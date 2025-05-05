const API_KEY = '3ha9Mch86E_HOx0a2A9wclI6p7GyIgz9';

async function getStockData() {
    const ticker = document.getElementById('ticker').value;
    const days = document.getElementById('days').value;
    
    if (!ticker) {
        alert('Please enter a stock ticker.');
        return;
    }


    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - parseInt(days));


    const formatDate = date => date.toISOString().split('T')[0];
    const url = `https://api.polygon.io/v2/aggs/ticker/${ticker.toUpperCase()}/range/1/day/${formatDate(start)}/${formatDate(end)}?adjusted=true&sort=asc&limit=120&apiKey=${API_KEY}`;

    try {

        const response = await fetch(url);
        const data = await response.json();
        console.log('API response:', data); //trying to get the stock chart to show up


        if (!data.results || data.results.length === 0) {
            alert('No data found for this ticker!');
            return;
        }


        const labels = data.results.map(item => new Date(item.t).toLocaleDateString());
        const prices = data.results.map(item => item.c);


        const ctx = document.getElementById('stockChart').getContext('2d');
        if (window.stockChart) window.stockChart.destroy();

        window.stockChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels, 
                datasets: [{
                    label: `${ticker} Closing Price`, 
                    data: prices,
                    borderColor: 'blue', 
                    backgroundColor: 'lightblue',
                    tension: 0.3
                }]
            }
        });
    } catch (error) {
        console.error(error);
        alert('Failed to fetch stock data');
    }
}


//loading the top 5 reddit stocks 
fetch('https://tradestie.com/api/v1/apps/reddit?date=2022-04-03')
    .then(response => response.json())
    .then(data => {
        const top5 = data.slice(0, 5);
        const tbody = document.querySelector('#redditTable tbody');
        top5.forEach(stock => {
            let sentimentHTML = stock.sentiment;
            if (sentiment.toLowerCase() === 'bullish') {
                sentimentHTML += ` <img src = "bull.png" alt = "Bullish">`;
            } else if (stock.sentiment.toLowerCase() === 'bearish') {
                sentimentHTML += `<img src = "bear.png" alt = "Bearish">`;
            }

            const row = document.createElement('tr');
            row.innerHTML = `
                <td><a href = "https://finance.yahoo.com/quote/${stock.ticker}" target="_blank">${stock.ticker}</a></td>
                <td>${stock.no_of_comments}</td>
                <td>${sentimentHTML}</td>
            `;
            tbody.appendChild(row);
        });
    })
    .catch(error => {
        console.error('Failed to fetch Reddit data:', error);
    });


if (annyang) {
    const stockCommands = {
        'lookup *ticker':ticker => {
            document.getElementById('ticker').value = ticker;
            document.getElementById('days').value = '30';
            getStockData();
        }
    };
    annyang.addCommands(stockCommands);
}