document.addEventListener('DOMContentLoaded', () => {
    const historySection = document.getElementById('historySection');
    const historyContentTemplate = `
        <div class="history-table-container">
            <table id="historyTable" class="table table-striped">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Opponent</th>
                        <th>Result</th>
                        <th>Score</th>
                    </tr>
                </thead>
                <tbody>
                    <!-- Match history will be populated here -->
                </tbody>
            </table>
        </div>
    `;

    // Set innerHTML for historySection with the structure
    historySection.innerHTML = `
        <h1>Match History</h1>
        <div class="history-section">
            ${historyContentTemplate}
        </div>
    `;

    const chartContainer = document.createElement('div');
    chartContainer.id = 'chart-container-wrapper';
    chartContainer.style.width = '400px'; // Adjust width as needed
    chartContainer.style.height = '400px'; // Adjust height as needed
    chartContainer.style.position = 'relative'; // Ensure the container is positioned
    chartContainer.style.margin = 'auto'; // Center horizontally
    chartContainer.innerHTML = `
        <canvas id="chartContainer"></canvas>
    `;
    historySection.appendChild(chartContainer);

    const historyTableBody = document.querySelector('#historyTable tbody');

    // Fetch match history from the backend
    fetch('/get-game-history/')
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                const matchHistory = data.games;

                // Populate the table with match history data
                matchHistory.forEach(match => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${match.date}</td>
                        <td>${match.opponent}</td>
                        <td>${match.result}</td>
                        <td>${match.score}</td>
                    `;
                    historyTableBody.appendChild(row);
                });

                // Calculate win/loss ratio
                const winCount = matchHistory.filter(match => match.result === 'Win').length;
                const lossCount = matchHistory.filter(match => match.result === 'Loss').length;
                const totalGames = winCount + lossCount;

                // Calculate percentages
                const winPercentage = ((winCount / totalGames) * 100).toFixed(2);
                const lossPercentage = ((lossCount / totalGames) * 100).toFixed(2);

                // Create the pie chart for win/loss ratio
                const ctx = document.getElementById('chartContainer').getContext('2d');
                new Chart(ctx, {
                    type: 'doughnut',
                    data: {
                        labels: [`Wins (${winPercentage}%)`, `Losses (${lossPercentage}%)`],
                        datasets: [{
                            data: [winCount, lossCount],
                            backgroundColor: ['#36a2eb', '#ff6384']
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            tooltip: {
                                callbacks: {
                                    label: function (tooltipItem) {
                                        return `Number of games: ${tooltipItem.raw}`;
                                    }
                                }
                            },
                            legend: {
                                position: 'top',
                            },
                            title: {
                                display: true,
                                text: 'Win/Loss Ratio'
                            }
                        }
                    }
                });

                // Adjust height of history section based on window height
                function adjustHistorySectionHeight() {
                    const windowHeight = window.innerHeight;
                    const historySectionHeight = windowHeight / 2; // Set history section height to half of the window height
                    historySection.style.maxHeight = `${historySectionHeight}px`;
                }

                adjustHistorySectionHeight(); // Initial adjustment

                window.addEventListener('resize', adjustHistorySectionHeight); // Adjust on window resize
            } else {
            }
        });
});
