function fetchFriends() {
    fetch('/get-friends/')
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                renderFriendsList(data.friends);
            } else {
            }
        });
}

function renderFriendsList(friends) {
    friendsList.innerHTML = '';
    friends.forEach(friend => {
        const friendItem = document.createElement('li');
        friendItem.className = 'list-group-item d-flex justify-content-between align-items-center';
        friendItem.style.backgroundColor = friend.status === 'online' ? 'lightgreen' : 'lightgray';

        const friendName = document.createElement('span');
        friendName.textContent = friend.name.length > 12 ? friend.name.slice(0, 12) + '...' : friend.name;
        friendItem.appendChild(friendName);

        const buttonsDiv = document.createElement('div');

        const profileButton = createButton('btn-info', '👤', () => viewProfile(friend.id), 'View Profile');
        buttonsDiv.appendChild(profileButton);

        const removeButton = createButton('btn-danger', '❌', () => removeFriend(friend.id), 'Remove Friend');
        buttonsDiv.appendChild(removeButton);

        friendItem.appendChild(buttonsDiv);
        friendsList.appendChild(friendItem);
    });
}

function createButton(className, innerHTML, onClick, tooltip) {
    const button = document.createElement('button');
    button.className = `btn btn-sm ml-2 ${className} friend-btn`;
    button.innerHTML = innerHTML;
    button.style.padding = '1px 1px';
    button.onclick = onClick;
    button.title = tooltip;
    return button;
}

document.addEventListener('DOMContentLoaded', () => {
    const friendProfileModalTemplate = `
        <div class="modal fade" id="friendsProfileModal" tabindex="-1" aria-labelledby="profileModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="profileModalLabel" data-translate="friendProfileTitle">Friend's Profile</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <canvas id="winLossChart" width="400" height="400"></canvas>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', friendProfileModalTemplate);

    const friendsSidebar = document.createElement('div');
    friendsSidebar.id = 'friendsSidebar';
    friendsSidebar.innerHTML = `
        <h3 data-translate="friendsSidebarTitle">Friends</h3>
        <ul id="friendsList" class="list-group">
            <!-- Friends will be appended here -->
        </ul>
        <div class="input-group mt-3">
            <input type="text" id="newFriendInput" class="form-control" data-translate-placeholder="newFriendInputPlaceholder" placeholder="Enter friend's name">
            <div class="input-group-append">
                <button id="addFriendBtn" class="btn btn-primary" data-translate="addFriendButton">Add Friend</button>
            </div>
        </div>
        <div id="friendMessage" class="mt-3"></div>
    `;
    document.body.appendChild(friendsSidebar);

    const friendsList = document.getElementById('friendsList');
    const newFriendInput = document.getElementById('newFriendInput');
    const addFriendBtn = document.getElementById('addFriendBtn');
    const friendMessage = document.getElementById('friendMessage');

    function addFriend(username) {
        fetch('/add-friend/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')
            },
            body: JSON.stringify({ username })
        })
            .then(response => response.json())
            .then(data => {
                friendMessage.textContent = data.message;
                if (data.status === 'success') {
                    fetchFriends();
                }
            });
    }

    function removeFriend(friendId) {
        fetch('/delete-friend/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')
            },
            body: JSON.stringify({ friend_id: friendId })
        })
            .then(response => response.json())
            .then(data => {
                friendMessage.textContent = data.message;
                if (data.status === 'success') {
                    fetchFriends();
                }
            });
    }

	function viewProfile(friendId) {
		console.log('Fetching profile for friend ID:', friendId);  // Log the friend ID being fetched
		fetch(`/friend-profile/${friendId}/`)
			.then(response => {
				if (!response.ok) {
					throw new Error('Network response was not ok');
				}
				return response.json();
			})
			.then(data => {
				console.log('Profile data fetched:', data);  // Log the data fetched
				if (data.status === 'success') {
					const friend = data.friend_profile;
					console.log('Friend profile:', friend);  // Log the friend profile details
					const friendsProfileModal = new bootstrap.Modal(document.getElementById('friendsProfileModal'));
					friendsProfileModal.show();

					// Check if friend wins and losses data are present
					if (friend.wins !== undefined && friend.losses !== undefined) {
						// Display win/loss data
						displayWinLossData(friend.wins, friend.losses);
					} else {
						console.error('Win/Loss data not found in friend profile');  // Log error if win/loss data is missing
					}
				} else {
					alert('Failed to load friend profile');
				}
			})
			.catch(error => {
				console.error('Error fetching profile:', error);  // Log any errors encountered
				alert('Failed to load friend profile');
			});
	}

	function displayWinLossData(winCount, lossCount) {
		const totalGames = winCount + lossCount;
		const winPercentage = totalGames > 0 ? ((winCount / totalGames) * 100).toFixed(2) : 0;
		const lossPercentage = totalGames > 0 ? ((lossCount / totalGames) * 100).toFixed(2) : 0;

		// Ensure the modal body is cleared before inserting new data
		const modalBody = document.querySelector('#friendsProfileModal .modal-body');
		modalBody.innerHTML = `
			<p><strong>🏆🏆🏆:</strong> ${winCount} (${winPercentage}%)</p>
			<p><strong>💀💀💀:</strong> ${lossCount} (${lossPercentage}%)</p>
		`;
	}

	//function displayWinLossChart(winCount, lossCount) {
	//	console.log('Displaying Win/Loss Chart with data:', { winCount, lossCount }); // Log the win/loss data

	//	const totalGames = winCount + lossCount;
	//	const winPercentage = totalGames > 0 ? ((winCount / totalGames) * 100).toFixed(2) : 0;
	//	const lossPercentage = totalGames > 0 ? ((lossCount / totalGames) * 100).toFixed(2) : 0;

	//	const winLossChartCtx = document.getElementById('winLossChart').getContext('2d');

	//	// Destroy the existing chart before creating a new one
	//	if (winLossChart) {
	//		console.log('Destroying existing chart');
	//		winLossChart.destroy();
	//	}

	//	// Log the context to ensure it is obtained correctly
	//	console.log('Chart context:', winLossChartCtx);

	//	// Initialize the chart
	//	winLossChart = new Chart(winLossChartCtx, {
	//		type: 'doughnut',
	//		data: {
	//			labels: ['Wins (' + winPercentage + '%)', 'Losses (' + lossPercentage + '%)'],
	//			datasets: [{
	//				data: [winCount, lossCount],
	//				backgroundColor: ['#36A2EB', '#FF6384']
	//			}]
	//		},
	//		options: {
	//			responsive: true,
	//			maintainAspectRatio: false,
	//			plugins: {
	//				tooltip: {
	//					callbacks: {
	//						label: function(tooltipItem) {
	//							return 'Number of games: ' + tooltipItem.raw;
	//						}
	//					}
	//				}
	//			}
	//		}
	//	});

	//	// Log to confirm the chart has been created
	//	console.log('Chart created:', winLossChart);
	//}

    addFriendBtn.addEventListener('click', () => {
        const newFriendName = newFriendInput.value.trim();
        if (newFriendName) {
            addFriend(newFriendName);
            newFriendInput.value = '';
        }
    });

    fetchFriends();

    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '='))
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        return cookieValue;
    }
});
