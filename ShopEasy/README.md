# E-commerce Platform with Admin Dashboard & User Authentication

A complete e-commerce platform built with HTML, CSS, JavaScript, and Supabase.

## Features

### User Features:
- User registration and login with Supabase Auth
- Browse products with search and filtering
- Add products to shopping cart
- Checkout process with order placement
- View order history

### Admin Features:
- Admin-only access with role-based authentication
- Add, edit, and delete products
- View and manage orders
- View registered users
- Dashboard with statistics

## Setup Instructions

### 1. Supabase Setup
1. Create a free account at [supabase.com](https://supabase.com)
2. Create a new project
3. Get your **Project URL** and **anon public key** from Settings > API

### 2. Database Setup
Run the SQL queries from the setup section in your Supabase SQL Editor to create the necessary tables and policies.

### 3. Update Configuration
In all HTML files, replace:
```javascript
const SUPABASE_URL = 'https://busxhfkirarsovdzepza.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_n04xz2UVJutlInF3dBgQtg__33bRNLt';