# 🛒 ShopSphere – Full Stack E-Commerce Platform

## 📌 Overview

ShopSphere is a **full-stack e-commerce web application** built using **React.js, Node.js, Express.js, and MySQL**.  
It simulates a real-world online shopping platform with complete user and admin functionality.

This project connects:
- 🖥️ Frontend (React.js)
- ⚙️ Backend (Node.js + Express.js)
- 🗄️ Database (MySQL)

It also includes **product image upload system, cart management, wishlist, and admin dashboard features**.

---

## 🚀 Key Highlights

- Full Stack Architecture (Frontend + Backend + Database)
- MySQL database integration for all data storage
- Admin dashboard for product management
- Image upload system using Multer
- REST API-based backend communication
- Responsive UI for all devices
- Real-world e-commerce workflow simulation

---

## ✨ Features

### 👤 User Side
- Browse products with search & category filters
- Add products to wishlist ❤️
- Add products to cart 🛒
- Place orders
- View product details
- Responsive UI for mobile & desktop

### 🛠️ Admin Side
- Add new products with image upload
- Delete products
- Manage inventory
- View dashboard statistics:
  - Total users
  - Total orders
  - Total revenue
- Product management system

---

## 🖼️ Image Upload System

- Admin uploads product images directly from dashboard
- Images stored in backend `/uploads` folder
- Images retrieved dynamically in frontend
- Fallback image system for missing images
- Fully integrated with MySQL product records

---

## 🏗️ Tech Stack

### Frontend
- React.js
- HTML5
- CSS3
- React Toastify

### Backend
- Node.js
- Express.js
- Multer (file uploads)
- REST API development

### Database
- MySQL (Relational Database Management System)

---

## 🔗 System Architecture

Frontend (React.js)
        ↓
Backend (Node.js + Express.js)
        ↓
MySQL Database
        ↓
File Upload System (Multer - Images)

---

## 📂 Project Structure

shop-sphere/
│
├── frontend/ # React Frontend (UI)
├── backend/ # Node.js + Express Backend (APIs)
├── uploads/ # Product Images Storage
└── database/ # MySQL Database Schema

---

## ⚙️ Installation & Setup

### 1️⃣ Clone Repository
```bash
git clone https://github.com/your-username/shopsphere.git

2️⃣ Backend Setup

cd backend
npm install
node app.js

3️⃣ Frontend Setup
cd frontend
npm install
npm start

🗄️ Database Tables
users
products
cart
orders
order_items
wishlist
reviews
inventory

All data is stored and managed using MySQL relational database system 

📈 Future Improvements
Payment gateway integration (Razorpay / Stripe)
Advanced analytics dashboard with graphs
Cloud image storage (AWS S3 / Cloudinary)
JWT authentication system upgrade
Real-time order tracking system
Email notifications for orders
👨‍💻 Developer

Full Stack Developer
Project: ShopSphere E-Commerce Platform
Stack: React + Node + Express + MySQL

⭐ Summary

ShopSphere is a complete end-to-end full-stack e-commerce system that demonstrates real-world development skills including frontend UI design, backend API development, database integration, and file handling system