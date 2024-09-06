document.addEventListener('DOMContentLoaded', () => {
	const app = document.getElementById('app');

	const loginModalTemplate = `
        <div class="modal fade" id="loginModal" tabindex="-1" aria-labelledby="loginModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="loginModalLabel">Login</h5>
                    </div>
                    <div class="modal-body">
                        <form id="loginForm">
                            <div class="mb-3">
                                <label for="username" class="form-label">Username</label>
                                <input type="text" class="form-control" id="username" required>
                            </div>
                            <div class="mb-3">
                                <label for="password" class="form-label">Password</label>
                                <input type="password" class="form-control" id="password" required>
                            </div>
                            <button type="submit" class="btn btn-primary">Login</button>
                            <button type="button" class="btn btn-secondary" id="login42Button">
                                <img src="${logo42ImageUrl}" alt="42 Logo" style="height: 20px; width: 20px;">
                                Login with 42
                            </button>
                        </form>
                        <p class="mt-3">No account? <a href="#" id="showRegister">Create one</a></p>
                    </div>
                </div>
            </div>
        </div>
    `;

	const registerModalTemplate = `
        <div class="modal fade" id="registerModal" tabindex="-1" aria-labelledby="registerModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="registerModalLabel">Register</h5>
                    </div>
                    <div class="modal-body">
                        <form id="registerForm">
                            <div class="form-group">
                                <label for="firstName">First Name</label>
                                <input type="text" class="form-control" id="firstName" required>
                            </div>
                            <div class="form-group">
                                <label for="lastName">Last Name</label>
                                <input type="text" class="form-control" id="lastName" required>
                            </div>
                            <div class="form-group">
                                <label for="userName">User Name</label>
                                <input type="text" class="form-control" id="userName" required>
                            </div>
                            <div class="form-group">
                                <label for="registerEmail">Email Address</label>
                                <input type="email" class="form-control" id="registerEmail" required>
                            </div>
                            <div class="form-group">
                                <label for="newPassword">Password</label>
                                <input type="password" class="form-control" id="newPassword" required>
                            </div>
                            <div class="form-group">
                                <label for="confirmPassword">Confirm Password</label>
                                <input type="password" class="form-control" id="confirmPassword" required>
                            </div>
                            <button type="submit" class="btn btn-primary">Register</button>
                            <button type="button" class="btn btn-secondary" id="register42Button">
                                Register with
                                <img src="${logo42ImageUrl}" alt="42 Logo" style="height: 20px; width: 20px;">
                            </button>
                        </form>
                        <p class="mt-3">Already have an account? <a href="#" id="showLogin">Login</a></p>
                    </div>
                </div>
            </div>
        </div>
    `;

	const otpModalTemplate = `
        <div class="modal fade" id="otpModal" tabindex="-1" aria-labelledby="otpModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="otpModalLabel">Verify OTP</h5>
                    </div>
                    <div class="modal-body">
                        <form id="otpForm">
                            <div class="mb-3">
                                <label for="otp" class="form-label">OTP</label>
                                <input type="text" class="form-control" id="otp" required>
                            </div>
                            <button type="submit" class="btn btn-primary">Verify OTP</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `;

	const profileModalTemplate = `
        <div class="modal fade" id="profileModal" tabindex="-1" aria-labelledby="profileModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="profileModalLabel">Edit Profile</h5>
                        <button type="button" class="btn-close" id="closeProfileModal" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form id="editProfileForm">
                            <div class="form-group">
                                <label for="editFirstName">First Name</label>
                                <input type="text" class="form-control" id="editFirstName" required>
                            </div>
                            <div class="form-group">
                                <label for="editLastName">Last Name</label>
                                <input type="text" class="form-control" id="editLastName" required>
                            </div>
                            <div class="form-group">
                                <label for="editUserName">User Name</label>
                                <input type="text" class="form-control" id="editUserName" required>
                            </div>
                            <button type="submit" class="btn btn-primary">Save Changes</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `;

	const passwordModalTemplate = `
        <div class="modal fade" id="changePasswordModal" tabindex="-1" aria-labelledby="changePasswordModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="changePasswordModalLabel">Change Password</h5>
                        <button type="button" class="btn-close" id="closePasswordModal" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form id="changePasswordForm">
                            <div class="mb-3">
                                <label for="currentPassword" class="form-label">Current Password</label>
                                <input type="password" class="form-control" id="currentPassword" required>
                            </div>
                            <div class="mb-3">
                                <label for="new_password1" class="form-label">New Password</label>
                                <input type="password" class="form-control" id="new_password1" required>
                            </div>
                            <div class="mb-3">
                                <label for="new_password2" class="form-label">Confirm Password</label>
                                <input type="password" class="form-control" id="new_password2" required>
                            </div>
                            <button type="submit" class="btn btn-primary">Change Password</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `;

	const mainContentTemplate = `
	<nav class="navbar navbar-expand-lg navbar-light bg-light">
		<div class="container-fluid">
			<a class="navbar-brand" href="#">Transcendence</a>
			<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
				aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
				<span class="navbar-toggler-icon"></span>
			</button>
			<div class="collapse navbar-collapse justify-content-end" id="navbarNav">
				<ul class="navbar-nav ms-auto">
					<li class="nav-item">
						<a class="nav-link" href="#" id="navHome">Home</a>
					</li>
					<li class="nav-item">
						<a class="nav-link" href="#" id="navProfile">Profile</a>
					</li>
					<li class="nav-item">
						<a class="nav-link" href="#" id="navHistory">History</a>
					</li>
					<li class="nav-item dropdown">
						<a class="nav-link dropdown-toggle" href="#" id="languagePicker" role="button" data-bs-toggle="dropdown" aria-expanded="false">
							<img src="${englishFlagUrl}" alt="English" style="width: 20px; height: 20px;">
							English
						</a>
						<ul class="dropdown-menu dropdown-menu-end" aria-labelledby="languagePicker">
							<li>
								<a class="dropdown-item language-option" href="#" data-language="en">
									<img src="${englishFlagUrl}" alt="English" style="width: 20px; height: 20px;">
									English
								</a>
							</li>
							<li>
								<a class="dropdown-item language-option" href="#" data-language="fr">
									<img src="${frenchFlagUrl}" alt="French" style="width: 20px; height: 20px;">
									French
								</a>
							</li>
							<!-- Add more languages here -->
						</ul>
					</li>
					<li class="nav-item">
						<button class="btn btn-outline-danger my-2 my-sm-0" id="logoutButton">Logout</button>
					</li>
				</ul>
			</div>
		</div>
	</nav>
	<div id="mainContent">
		<div id="homeSection">
			<h1>Welcome to the One Page Application</h1>
			<p>This is the main content of the application.</p>
			<button id="play-button" class="btn btn-primary">Play</button>
			<button id="tournament-button" class="btn btn-secondary">Tournoi</button>
			<div id="game-container" class="hidden">
				<canvas id="canvasgame" width="800" height="600"></canvas>
			</div>
			<div id="tournament-container">
				<canvas id="canvastour" width="800" height="600"></canvas>
			</div>
		</div>
		<div id="historySection" style="display:none;">
		</div>
		<div id="profileSection" style="display:none;">
			<h1>Profile</h1>
			<div class="col-md-4">
				<div class="profile-picture-container">
					<img id="profilePicture" src="${defaultProfileImageUrl}" alt="Profile Picture" class="rounded-circle" style="width: 150px; height: 150px;">
				</div>
				<div class="profile-info">
					<p><strong>Name:</strong> <span id="profileName"></span></p>
					<p><strong>Username:</strong> <span id="profileUserName"></span></p>
					<p><strong>Email:</strong> <span id="profileEmail"></span></p>
				</div>
				<button class="btn btn-secondary mt-3 w-100" id="editProfileButton">Edit Profile</button>
				<button class="btn btn-secondary mt-3 w-100" id="changePasswordButton">Change Password</button>
				<button class="btn btn-danger mt-3 w-100" id="deleteAccountButton">Delete Account</button>
				<button class="btn btn-warning mt-3 w-100" id="anonymizeUserButton">Anonymize Data</button>
			</div>
			<form id="uploadProfilePictureForm" class="mt-3" w-100>
				<div class="form-group mb-3">
					<label for="profilePictureInput" class="form-label">Upload Profile Picture</label>
					<input type="file" class="form-control" id="profilePictureInput" accept="image/*">
				</div>
				<button type="submit" class="btn btn-primary">Upload</button>
			</form>
		</div>
	</div>
	`;

	function fetchUserProfileData() {
        const token = localStorage.getItem('token');
        fetch('/get-profile-data/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                const profileData = data.profile_data;
                profileName.textContent = `${profileData.first_name} ${profileData.last_name}`;
                profileUserName.textContent = profileData.username;
                profileEmail.textContent = profileData.email;
                if (profileData.profile_picture) {
                    profilePicture.src = `${profileData.profile_picture}`;
                }
                localStorage.setItem('profileData', JSON.stringify(profileData));
            } else {
            }
        })
        .catch(error => {
        });
    }

	// Append modals and main content to the app container
	app.innerHTML = loginModalTemplate + registerModalTemplate + otpModalTemplate + profileModalTemplate + passwordModalTemplate + mainContentTemplate;

	const loginModal = new bootstrap.Modal(document.getElementById('loginModal'), {
		backdrop: 'static',
		keyboard: false
	});

	document.getElementById('loginModal').addEventListener('show.bs.modal', () => {
		document.getElementById('username').value = '';
		document.getElementById('password').value = '';
	});

	const registerModal = new bootstrap.Modal(document.getElementById('registerModal'), {
		backdrop: 'static',
		keyboard: false
	});

	const otpModal = new bootstrap.Modal(document.getElementById('otpModal'), {
		backdrop: 'static',
		keyboard: false
	});

	const profileModal = new bootstrap.Modal(document.getElementById('profileModal'), {
		backdrop: 'static',
		keyboard: true
	});

	const changePasswordModal = new bootstrap.Modal(document.getElementById('changePasswordModal'), {
		backdrop: 'static',
		keyboard: false
	});

	const mainContent = document.getElementById('mainContent');
	const showRegister = document.getElementById('showRegister');
	const loginForm = document.getElementById('loginForm');
	const showLogin = document.getElementById('showLogin');
	const registerForm = document.getElementById('registerForm');
	const otpForm = document.getElementById('otpForm');
	const navHome = document.getElementById('navHome');
	const navHistory = document.getElementById('navHistory');
	const navProfile = document.getElementById('navProfile');
	const logoutButton = document.getElementById('logoutButton');
	const profilePicture = document.getElementById('profilePicture');
	const profileName = document.getElementById('profileName');
	const profileUserName = document.getElementById('profileUserName');
	const profileEmail = document.getElementById('profileEmail');
	const uploadProfilePictureForm = document.getElementById('uploadProfilePictureForm');
	const editProfileButton = document.getElementById('editProfileButton');
	const editProfileForm = document.getElementById('editProfileForm');
	const changePasswordForm = document.getElementById('changePasswordForm');
	const changePasswordButton = document.getElementById('changePasswordButton');
	const profileCloseButton = document.getElementById('closeProfileModal');
	const closeButton = document.getElementById('closePasswordModal');

	showRegister.addEventListener('click', (e) => {
		e.preventDefault();
		loginModal.hide();
		registerModal.show();
	});

	showLogin.addEventListener('click', (e) => {
		e.preventDefault();
		registerModal.hide();
		loginModal.show();
	});

	function handleLoginSuccess() {
		location.reload();
        fetchUserProfileData();
        fetchFriends();
        fetchHistory();
        mainContent.style.display = 'block';
        showSection('home');
    }

	loginForm.addEventListener('submit', (e) => {
		e.preventDefault();
		const username = document.getElementById('username').value;
		const password = document.getElementById('password').value;

		fetch('/api/token/', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ username, password })
		})
			.then(response => response.json())
			.then(data => {
				if (data.access) {
					localStorage.setItem('token', data.access);
					fetch('/login/', {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
							'Authorization': `Bearer ${data.access}`,
							'X-CSRFToken': getCSRFToken()
						},
						body: JSON.stringify({ username, password })
					})
						.then(response => {
							if (!response.ok) {
								throw new Error('Network response was not ok.');
							}
							return response.json();
						})
						.then(loginData => {
							if (loginData.status === 'success') {
								loginModal.hide();
								mainContent.style.display = 'block';
								showSection('home');
								handleLoginSuccess();
							} else if (loginData.status === 'otp_required') {
								document.getElementById('otp').value = '';
								loginModal.hide();
								otpModal.show();
							} else {
								alert(loginData.message);
							}
						});
				} else {
					alert('Invalid username or password');
				}
			});
	});

	function getCSRFToken() {
		return window.CSRF_TOKEN;
	}

	otpForm.addEventListener('submit', (e) => {
		e.preventDefault();
		const otp = document.getElementById('otp').value;

		fetch('/verify-otp/', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${localStorage.getItem('token')}`,
			},
			body: JSON.stringify({ otp })
		})
			.then(response => response.json())
			.then(data => {
				if (data.status === 'success') {
					otpModal.hide();
					mainContent.style.display = 'block';
					showSection('home');
					handleLoginSuccess();
				} else {
					alert(data.message);
				}
			});
	});

	registerForm.addEventListener('submit', (e) => {
		e.preventDefault();
		const firstName = document.getElementById('firstName').value;
		const lastName = document.getElementById('lastName').value;
		const userName = document.getElementById('userName').value;
		const email = document.getElementById('registerEmail').value;
		const password = document.getElementById('newPassword').value;
		const confirmPassword = document.getElementById('confirmPassword').value;

		if (password !== confirmPassword) {
			alert('Passwords do not match');
			return;
		}

		fetch('/register/', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'X-CSRFToken': getCookie('csrftoken')
			},
			body: JSON.stringify({
				first_name: firstName,
				last_name: lastName,
				username: userName,
				email: email,
				password1: password,
				password2: confirmPassword
			})
		})
			.then(response => response.json())
			.then(data => {
				if (data.status === 'success') {
					localStorage.setItem('token', data.access);
					registerModal.hide();
					loginModal.show();
				} else {
					if (data.errors) {
						for (let field in data.errors) {
							alert(`${field}: ${data.errors[field]}`);
						}
					} else {
						alert(data.message);
					}
				}
			});
	});

	// Handle profile picture upload
	uploadProfilePictureForm.addEventListener('submit', (e) => {
		e.preventDefault();
		const fileInput = document.getElementById('profilePictureInput');
		const formData = new FormData();
		formData.append('profile_picture', fileInput.files[0]);

		const token = localStorage.getItem('token');

		fetch('/upload-profile-picture/', {
			method: 'POST',
			headers: {
				'Authorization': `Bearer ${token}`,
				'X-CSRFToken': getCookie('csrftoken')
			},
			body: formData
		})
			.then(response => response.json())
			.then(data => {
				if (data.status === 'success') {
					alert('Profile picture uploaded successfully.');
					fetchUserProfileData();
				} else {
					alert(data.message);
				}
			})
			.catch(error => {
				alert('An error occurred while uploading the profile picture.');
			});
	});

	// Show edit profile modal
	editProfileButton.addEventListener('click', () => {
		fetchUserProfileData(); // Fetch the latest profile data before showing the modal
		const profileData = JSON.parse(localStorage.getItem('profileData'));
		document.getElementById('editFirstName').value = profileData.first_name;
		document.getElementById('editLastName').value = profileData.last_name;
		document.getElementById('editUserName').value = profileData.username;
		//document.getElementById('editEmail').value = profileData.email;
		profileModal.show();
	});

	// Handle edit profile form submission
	editProfileForm.addEventListener('submit', (e) => {
		e.preventDefault();
		const firstName = document.getElementById('editFirstName').value;
		const lastName = document.getElementById('editLastName').value;
		const newUserName = document.getElementById('editUserName').value;
		//const newEmail = document.getElementById('editEmail').value;
		const token = localStorage.getItem('token');

		const profileData = JSON.parse(localStorage.getItem('profileData'));
		const currentUserName = profileData.username;
		//const currentEmail = profileData.email;

		const updateProfile = (emailConfirmed = false) => {
			fetch('/update-profile/', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${token}`,
					'X-CSRFToken': getCookie('csrftoken')
				},
				body: JSON.stringify({
					first_name: firstName,
					last_name: lastName,
					username: newUserName,
					//email: emailConfirmed ? newEmail : currentEmail // update email only if confirmed
				})
			})
				.then(response => response.json())
				.then(data => {
					if (data.status === 'success') {
						profileName.textContent = `${firstName} ${lastName}`;
						profileUserName.textContent = newUserName;
						//if (emailConfirmed) {
						//	profileEmail.textContent = newEmail;
						//}
						profileModal.hide();
						fetchUserProfileData(); // Fetch updated profile data
						if (emailConfirmed) {
							alert('Profile updated successfully.');
						} else {
							alert('A confirmation email has been sent to your new email address. Please confirm to complete the update.');
						}
					} else {
						alert('Failed to update profile');
					}
				});
		};

		const checkUsernameAndEmail = () => {
			let promises = [];

			if (newUserName !== currentUserName) {
				promises.push(fetch('/check-username/', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						'Authorization': `Bearer ${token}`
					},
					body: JSON.stringify({ username: newUserName })
				}).then(response => response.json()));
			}

			//if (newEmail !== currentEmail) {
			//	promises.push(fetch('/check-email/', {
			//		method: 'POST',
			//		headers: {
			//			'Content-Type': 'application/json',
			//			'Authorization': `Bearer ${token}`
			//		},
			//		body: JSON.stringify({ email: newEmail })
			//	}).then(response => response.json()));
			//}

			Promise.all(promises).then(results => {
				let usernameAvailable = true;
				//let emailAvailable = true;

				if (results.length > 0) {
					results.forEach(result => {
						if (result.status === 'error' && result.field === 'username') {
							usernameAvailable = false;
							alert('Username already taken');
						}
						//if (result.status === 'error' && result.field === 'email') {
						//	emailAvailable = false;
						//	alert('Email already in use');
						//}
					});
				}

				if (usernameAvailable) {
					updateProfile(true);
				}

				//if (usernameAvailable && emailAvailable) {
				//	if (newEmail !== currentEmail) {
				//		fetch('/send-confirmation-email/', {
				//			method: 'POST',
				//			headers: {
				//				'Content-Type': 'application/json',
				//				'Authorization': `Bearer ${token}`
				//			},
				//			body: JSON.stringify({ email: newEmail })
				//		})
				//			.then(response => response.json())
				//			.then(data => {
				//				if (data.status === 'success') {
				//					updateProfile(false); // Update profile without changing email immediately
				//				} else {
				//					alert('Failed to send confirmation email');
				//				}
				//			});
				//	} else {
				//		updateProfile(true); // Update profile including email if it hasn't changed
				//	}
				//}
			});
		};

		checkUsernameAndEmail();
	});

	// Function to anonymize user data
	document.getElementById('anonymizeUserButton').addEventListener('click', () => {
		if (confirm('Are you sure you want to anonymize your data? This action cannot be undone.')) {
			const token = localStorage.getItem('token');
			fetch('/anonymize-user/', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${token}`,
				},
			})
				.then(response => response.json())
				.then(data => {
					if (data.status === 'success') {
						alert('Your data has been anonymized.');
						fetchUserProfileData();
					} else {
						alert('Failed to anonymize user data');
					}
				});
		}
	});

	// Function to delete account
	document.getElementById('deleteAccountButton').addEventListener('click', () => {
		if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
			const token = localStorage.getItem('token');
			fetch('/delete-account/', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${token}`,
				},
			})
				.then(response => response.json())
				.then(data => {
					if (data.status === 'success') {
						alert('Your account has been permanently deleted.');
						localStorage.removeItem('token');
						window.location.href = '/';
					} else {
						alert('Failed to delete account');
					}
				});
		}
	});

	// Handle OAuth login button click
	login42Button.addEventListener('click', () => {
		window.location.href = '/oauth/42/login/';
	});

	register42Button.addEventListener('click', () => {
		window.location.href = '/oauth/42/login/';
	});

	// Check session status and update UI accordingly
	fetch('/session-status/')
		.then(response => response.json())
		.then(data => {
			if (data.logged_in) {
				fetchUserProfileData();
				mainContent.style.display = 'block';
				showSection('home');
			} else {
				loginModal.show();
			}
		});

	window.oauthCallback = () => {
		const urlParams = new URLSearchParams(window.location.search);
		const accessToken = urlParams.get('access');
		const refreshToken = urlParams.get('refresh');
		const username = urlParams.get('username');

		if (accessToken && refreshToken && username) {
			localStorage.setItem('token', accessToken);
			localStorage.setItem('refreshToken', refreshToken);
			localStorage.setItem('username', username);
			fetchUserProfileData();
			loginModal.hide(); // Hide the login modal
			mainContent.style.display = 'block';
			showSection('home');

			// Clear the URL parameters
			const newUrl = window.location.origin + window.location.pathname;
			window.history.replaceState({}, document.title, newUrl);
		} else {
			alert('OAuth flow failed');
		}
	};


	// Call oauthCallback on page load if OAuth query parameters are present
	const urlParams = new URLSearchParams(window.location.search);
	if (urlParams.has('access') && urlParams.has('refresh') && urlParams.has('username')) {
		window.oauthCallback();
	}

	// Handle navigation
	navHome.addEventListener('click', (e) => {
		e.preventDefault();
		showSection('home');
	});

	navHistory.addEventListener('click', (e) => {
		e.preventDefault();
		showSection('history');
	});

	navProfile.addEventListener('click', (e) => {
		e.preventDefault();
		showSection('profile');
	});

	logoutButton.addEventListener('click', () => {
		fetch('/logout/', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${localStorage.getItem('token')}`,
			},
		})
			.then(response => response.json())
			.then(data => {
				if (data.status === 'success') {
					localStorage.removeItem('token');
					localStorage.removeItem('username');
					localStorage.removeItem('refreshToken');
					document.getElementById('username').value = '';
					document.getElementById('password').value = '';
					localStorage.removeItem('profileData');
					clearProfileData();
					loginModal.show();
					mainContent.style.display = 'none';
					// Refresh friends list to reflect status changes
					fetchFriends();
				} else {
					alert('Failed to logout');
				}
			});
	});

	changePasswordButton.addEventListener('click', () => {
		changePasswordModal.show();
	});

	closeButton.addEventListener('click', () => {
		changePasswordModal.hide();
	});

	profileCloseButton.addEventListener('click', () => {
		profileModal.hide();
	});

	changePasswordForm.addEventListener('submit', (e) => {
		e.preventDefault();
		const currentPassword = document.getElementById('currentPassword').value;
		const new_password1 = document.getElementById('new_password1').value;
		const new_password2 = document.getElementById('new_password2').value;

		if (new_password1 !== new_password2) {
			alert('Passwords do not match');
			return;
		}

		fetch('/change-password/', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${localStorage.getItem('token')}`,
				'X-CSRFToken': getCookie('csrftoken')
			},
			body: JSON.stringify({
				current_password: currentPassword,
				new_password1: new_password1,
				new_password2: new_password2
			})
		})
			.then(response => response.json())
			.then(data => {
				if (data.status === 'success') {
					alert('Password changed successfully');
					changePasswordModal.hide();
				} else {
					if (data.errors) {
						for (let field in data.errors) {
							alert(`${field}: ${data.errors[field]}`);
						}
					} else {
						alert(data.message);
					}
				}
			});
	});

	function showSection(section) {
		const sections = ['home', 'history', 'profile'];
		sections.forEach((sec) => {
			document.getElementById(sec + 'Section').style.display = 'none';
		});
		document.getElementById(section + 'Section').style.display = 'block';
		history.pushState({ section: section }, null, `#${section}`);
	}

	function clearProfileData() {
		profileName.textContent = '';
		profileUserName.textContent = '';
		profileEmail.textContent = '';
		profilePicture.src = defaultProfileImageUrl;
	}

	function getCookie(name) {
		let cookieValue = null;
		if (document.cookie && document.cookie !== '') {
			const cookies = document.cookie.split(';');
			for (let i = 0; i < cookies.length; i++) {
				const cookie = cookies[i].trim();
				if (cookie.substring(0, name.length + 1) === (name + '=')) {
					cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
					break;
				}
			}
		}
		return cookieValue;
	}

	const translations = {
		en: {
			welcome: "Welcome to the One Page Application",
		},
		fr: {
			welcome: "Bienvenue dans l'application One Page",
		}
		// Add more languages here
	};

	// Function to update text content based on selected language
	function updateLanguage(language) {
		document.querySelectorAll('[data-translate]').forEach(element => {
			const key = element.getAttribute('data-translate');
			element.textContent = translations[language][key];
		});
	}

	// Handle language picker change
	document.querySelectorAll('.language-option').forEach(option => {
		option.addEventListener('click', (e) => {
			e.preventDefault();
			const language = option.getAttribute('data-language');
			updateLanguage(language);
			document.getElementById('languagePicker').innerHTML = option.innerHTML; // Update the flag icon in the navbar
		});
	});

	function loadTournamentScript() {
		const scriptElement = document.createElement('script');
		scriptElement.src = '/static/js/tournament.js';
		scriptElement.onload = () => {
			console.log('tournament.js loaded and executed.');
		};
		document.body.appendChild(scriptElement);
	}

	function loadPlayScript() {
		const scriptElement = document.createElement('script');
		scriptElement.src = '/static/js/pong.js';
		scriptElement.onload = () => {
			console.log('pong.js loaded and executed.');
		};
		document.body.appendChild(scriptElement);
	}

	const tournamentButton = document.getElementById('tournament-button');
	tournamentButton.addEventListener('click', () => {
		// Hide the buttons
		tournamentButton.style.display = 'none';
		const playButton = document.getElementById('play-button');
		if (playButton) {
			playButton.style.display = 'none';
		}

		// Load the tournament script
		loadTournamentScript();
	});

	const playButton = document.getElementById('play-button');
	playButton.addEventListener('click', () => {
		// Hide the buttons
		playButton.style.display = 'none';
		const tournamentButton = document.getElementById('tournament-button');
		if (tournamentButton) {
			tournamentButton.style.display = 'none';
		}

		// Load the play script
		loadPlayScript();
	});



	// Set default language
	updateLanguage('en');

	fetchFriends();

	//window.addEventListener('pageshow', (event) => {
	//	var isNavigation = event.persisted ||
	//		(typeof window.performance != 'undefined' && window.performance.navigation.type === 2);
	//	if (isNavigation) {
	//		window.location.reload();
	//	}
	//});
});
