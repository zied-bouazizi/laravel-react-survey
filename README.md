# Laravel React Survey

A web application for creating, managing and taking surveys with Laravel and React.

## Features

1. User registration and authentication
2. Surveys CRUD with pagination
3. Create multiple question types inside a survey
4. View all surveys
5. Display public surveys if active
6. Submit answers to surveys
7. Dashboard showing latest and total surveys and answers

## Local Setup

> [!TIP]
> Ensure your environment is ready. You will need PHP 8.0, Composer and Node.js installed and the commands `php`, `composer`, `node` and `npm` should be available in your terminal.

### 1. Clone the repository

```
git clone <repository-url>
```

### 2. Navigate to the project folder

```
cd <project-folder>
```

### 3. Copy the environment file

```
cp .env.example .env
```

### 4. Configure environment variables

Open `.env` and update the database credentials as needed.

### 5. Install PHP dependencies

```
composer install
```

### 6. Generate the application key

```
php artisan key:generate 
``` 

### 7. Run database migrations

```
php artisan migrate
```

### 8. Create symbolic link for storage

This command links `storage/app/public` to `public/storage` so uploaded files can be publicly accessible.

```
php artisan storage:link
```

### 9. Start the Laravel development server 

```
php artisan serve
```

### 10. Navigate to the react folder

Run this command in a separate terminal.

```
cd react
```

### 11. Copy the React environment file

```
cp .env.example .env
```

> [!NOTE]
> `VITE_API_BASE_URL` should match your Laravel backend URL if it’s different.

### 12. Install JavaScript dependencies

```
npm install
```

### 13. Start the Vite development server

```
npm run dev
```
