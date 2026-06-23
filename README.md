# 🚗 AutoBridge

AutoBridge is a modern car marketplace platform built with React and Firebase that allows users to buy and sell vehicles through a simple and user-friendly interface.

## 🌟 Features

### 👤 User Authentication

* Sign Up and Sign In using Firebase Authentication
* Protected routes for authenticated users
* User session management

### 🚘 Buy Cars

* Browse available vehicle listings
* View car details and seller information
* Easy-to-use search experience

### 💰 Sell Cars

* Create and publish vehicle listings
* Upload car information including:

  * Brand
  * Model
  * Year
  * Price
  * Description
* Listings stored securely in Firebase Firestore

### 📊 Dashboard

* Personalized user dashboard
* Manage account information
* Access user-specific features

### 🛠 Admin Panel

* Dedicated admin login
* Manage platform content
* Monitor vehicle listings

### ⭐ Rating System

* User rating functionality
* Enhanced trust and transparency

---

## 🏗 Tech Stack

### Frontend

* React.js
* React Router DOM
* CSS3

### Backend & Database

* Firebase Authentication
* Firebase Firestore

### Tools

* Git
* GitHub
* VS Code

---

## 📂 Project Structure

```text
src/
├── admin/
│   ├── AdminLogin.jsx
│   └── AdminPanel.jsx
│
├── components/
│   ├── Navbar.jsx
│   ├── Footer.jsx
│   └── CarLoader.jsx
│
├── context/
│   └── AuthContext.jsx
│
├── firebase/
│   └── config.js
│
├── pages/
│   ├── Home.jsx
│   ├── BuyCars.jsx
│   ├── SellCar.jsx
│   ├── Dashboard.jsx
│   ├── About.jsx
│   ├── Contact.jsx
│   ├── Rating.jsx
│   ├── SignIn.jsx
│   ├── SignUp.jsx
│   └── NotFound.jsx
│
├── App.jsx
└── index.js
```

---

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/harshu-codex/AutoBridge.git
```

### Navigate to Project

```bash
cd AutoBridge
```

### Install Dependencies

```bash
npm install
```

### Configure Environment Variables

Create a `.env` file in the root directory:

```env
REACT_APP_FIREBASE_API_KEY=YOUR_API_KEY
REACT_APP_FIREBASE_AUTH_DOMAIN=YOUR_AUTH_DOMAIN
REACT_APP_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
REACT_APP_FIREBASE_STORAGE_BUCKET=YOUR_STORAGE_BUCKET
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=YOUR_SENDER_ID
REACT_APP_FIREBASE_APP_ID=YOUR_APP_ID
```

### Start Development Server

```bash
npm start
```

Application will run at:

```text
http://localhost:3000
```

---

## 🔒 Firebase Setup

1. Create a Firebase Project.
2. Enable Authentication.
3. Enable Firestore Database.
4. Add your Firebase credentials to the `.env` file.
5. Run the application.

---

## 🚀 Future Enhancements

* Vehicle image uploads
* Advanced search & filters
* Real-time chat between buyers and sellers
* Wishlist functionality
* Vehicle comparison feature
* Payment integration
* Admin analytics dashboard

---

## 👨‍💻 Developer

**Harshil Anghan**

GitHub: https://github.com/harshu-codex

---

## 📄 License

This project is intended for educational and portfolio purposes.

---

⭐ If you found this project useful, consider starring the repository.