# Drink Menu Management System (Laravel CRUD)

A Laravel + MySQL application to add, view, update and delete drink details.
Technologies: Laravel, PHP, MySQL, HTML, CSS, Bootstrap 5.

This folder holds the project files (model, controller, migration, seeder, routes and Blade views).
Copy them into a fresh Laravel project to run the app.

## Setup

1. Create a Laravel project (PHP 8.2+ and Composer required):

   ```bash
   composer create-project laravel/laravel drink-menu
   cd drink-menu
   ```

2. Copy the contents of this `laravel` folder into the project, keeping the same paths
   (`routes/web.php`, `app/`, `database/`, `resources/views/`). Replace `routes/web.php` when asked.

3. Create a MySQL database named `drink_menu` and set it in `.env`:

   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=drink_menu
   DB_USERNAME=root
   DB_PASSWORD=
   ```

4. Create the table, add sample drinks and start the server:

   ```bash
   php artisan migrate
   php artisan db:seed --class=DrinkSeeder
   php artisan serve
   ```

5. Open http://127.0.0.1:8000

## Features

- Create, read, update and delete drinks
- Search by name and filter by category
- Form validation with error messages
- Pagination and success messages
- Responsive Bootstrap 5 layout

## Browser demo

`../index.html` is a plain HTML/JavaScript version of the same screens (data is saved in the browser)
so the project can be previewed without PHP or MySQL.
