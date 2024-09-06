# Pong Online Multiplayer - Mighty Pong Contest

Welcome to the **Mighty Pong Contest** project! This website allows users to participate in real-time Pong matches against other players in a friendly tournament environment. The project adheres to several technical and security guidelines while providing an engaging user experience.

## Overview
This project is designed to create a real-time multiplayer Pong game that users can play directly through the website. It includes player registration, matchmaking, and customizable game settings. It is built as a **single-page application** to ensure a seamless experience with smooth navigation using browser buttons like Back and Forward.

## Features
- **Real-time multiplayer Pong**: Users can compete against each other in real-time using the same keyboard.
- **Tournament mode**: Create and manage tournaments where multiple players take turns playing against each other.
- **Registration system**: Users register with unique aliases to join tournaments, including user profile customization with avatars.
- **Match history and stats**: Track user statistics, wins, and losses.
- **Customizable game options**: Players can choose power-ups, maps, and other game settings.
- **Security features**: HTTPS encryption, hashed passwords, validation of user input, and protection against SQL injection/XSS attacks.

## Modules
The project is structured into multiple modules, each contributing to its functionality. Below are some of the key modules:

- **Backend Framework (Django)**: The backend is built using Django to manage database connections, user authentication, and game logic.
- **Frontend Framework (Bootstrap)**: The UI is designed using Bootstrap to ensure responsiveness and ease of use.
- **Database (PostgreSQL)**: All user and game data is stored in a PostgreSQL database.
- **User Authentication (OAuth 2.0)**: Secure login is provided through OAuth 2.0 integration.
- **Game Customization**: Players can choose from various game customizations like different maps and power-ups.
- **GDPR Compliance**: Users can manage their personal data in compliance with GDPR, including anonymization and account deletion.
- **Two-Factor Authentication (2FA)**: Added security for user accounts through 2FA and JSON Web Tokens (JWT).
- **Browser Compatibility**: Supports the latest versions of Google Chrome and additional browsers for better accessibility.
- **Multilingual Support**: The website supports multiple languages to accommodate an international audience.

## Technologies Used
- **Frontend**: Vanilla JavaScript, Bootstrap
- **Backend**: Django (Python), PostgreSQL
- **Containerization**: Docker
- **Authentication**: OAuth 2.0, JWT, 2FA
- **Security**: HTTPS, password hashing, input validation
- **Multilingual support**: Support for multiple languages through localization.

## Security Considerations
- All passwords are securely hashed before being stored in the database.
- User inputs are validated to prevent SQL injection and cross-site scripting (XSS) attacks.
- The website uses HTTPS to ensure secure data transmission.
- Personal credentials, API keys, and environment variables are stored securely in `.env` files, which are ignored by Git.

