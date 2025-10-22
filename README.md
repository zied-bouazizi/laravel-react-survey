# Laravel React Survey

An application for creating, managing and taking surveys with Laravel and React.

## Features

1. User registration and login
2. Surveys CRUD with pagination
3. Create multiple question types inside a survey
4. Submit answers to surveys
5. View all surveys and view all answers of a specific survey
6. Display public surveys if active
7. Dashboard showing latest and total surveys and answers

## Installation

> [!TIP]
> Make sure your environment is set up properly. You will need PHP 8.0, Composer and Node.js installed and the commands `php`, `composer`, `node` and `npm` should be available in your terminal.

1. Clone the project
2. Navigate to the project's root directory using terminal
3. Copy `.env.example` into `.env` file `cp .env.example .env`
4. Open `.env` and configure database credentials
5. Run `composer install`
6. Set application key `php artisan key:generate --ansi`
7. Run migrations `php artisan migrate`
8. Start artisan server `php artisan serve`
9. Open new terminal and navigate to the `react` folder
10. Copy `react/.env.example` into `.env` and adjust the `VITE_API_BASE_URL` parameter
11. Run `npm install`
12. Start vite server for React `npm run dev`
