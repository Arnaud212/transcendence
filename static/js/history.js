document.addEventListener('DOMContentLoaded', () => {
    const historySection = document.getElementById('historySection');
    const historyContentTemplate = `
        <div class="history-table-container">
            <table id="historyTable" class="table table-striped">
                <thead>
                    <tr>
                        <th data-translate="historyDate">Date</th>
                        <th data-translate="historyOpponent">Opponent</th>
                        <th data-translate="historyResult">Result</th>
                        <th data-translate="historyScore">Score</th>
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
        <h1 data-translate="historyTitle">Match History</h1>
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

    // Fetch and update game history on page load
    fetchAndUpdateGameHistory();

    // Add event listener to refetch game history when history section is clicked
    historySection.addEventListener('click', () => {
        fetchAndUpdateGameHistory();
    });
});

let historyChart; // Global variable to keep a reference to the Chart instance

function fetchAndUpdateGameHistory() {
    const historyTableBody = document.querySelector('#historyTable tbody');
    const chartContainer = document.getElementById('chartContainer').getContext('2d');

    // Clear existing table body content
    historyTableBody.innerHTML = '';

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

                // Destroy existing chart if it exists
                if (historyChart) {
                    historyChart.destroy();
                }

                // Create the pie chart for win/loss ratio
                historyChart = new Chart(chartContainer, {
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
                console.error('Failed to fetch game history');
            }
        })
        .catch(error => {
            console.error('Error fetching game history:', error);
        });
}