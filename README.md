# 🛒 Speedymarket

Speedymarket is a full-stack smart shopping application designed to enhance the in-store experience for customers, suppliers, and managers. Featuring a mobile frontend with map-based navigation and an Azure Functions backend, Speedymarket streamlines everything from product discovery to payment and inventory management.

---

## 🚀 Features

### Customer
- 📍 Indoor navigation to locate products quickly
- 🛍️ Shopping list and cart management
- 💳 Secure in-app payment
- 🧾 Purchase history

### Manager
- 🧠 Smart inventory control
- 🗺️ Map editor for store layout customization
- 📦 Order and stock management

### Supplier
- 🚚 View and manage incoming/outgoing orders

---

## 🧱 Tech Stack

### Frontend
- **React Native + Expo**
- **TypeScript**
- **Context API** for state management

### Backend
- **Node.js** with **Azure Functions**
- **SQL Server** for data persistence
- **Docker** for database deployment

---

## 📂 Project Structure

```
Speedymarket/
├── app/                 # Expo app with role-based screens
├── Backend/             # Azure Functions for API logic
├── DB/                  # SQL scripts for database setup
├── Docker/              # Docker configs for local DB
├── src/                 # Reusable components & business logic
├── assets/              # Images and fonts
```

---

## ⚙️ Getting Started

### Prerequisites
- Node.js and npm
- Docker (for local DB)
- Expo CLI

### Setup Steps

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Run backend locally**
   ```bash
   cd Backend
   func start
   ```

3. **Start frontend app**
   ```bash
   expo start
   ```

4. **Run DB via Docker**
   ```bash
   docker-compose up --build
   ```

---

## 🧪 Testing

- Backend: Azure Function tests
- Frontend: Jest & React Testing Library

```bash
npm test
```

---

## 🤝 Contributors

Built with 💙 by Mati and contributors.

---

## 📜 License

This project is licensed under the MIT License.
