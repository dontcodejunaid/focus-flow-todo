# Focus Flow — Premium Task Dashboard

Focus Flow is a full-stack, visually rich To-Do dashboard application. It uses a **glassmorphism** visual language, supporting customizable theme states (Sleek Dark Mode / Elegant Light Mode), animated status analytics, task metadata (priorities, categories, due dates), search, and sorting.

---

## ⚡ Tech Stack & Architecture

- **Frontend**: React (Vite-scaffolded), Styled using customized Vanilla CSS design tokens.
- **Backend API**: Node.js & Express REST endpoints.
- **Database**: SQLite database file synchronized dynamically via Sequelize ORM.

```
TASK_3_TO_DO_WEB_APP/
├── client/          # React (Vite) frontend application
│   ├── src/
│   │   ├── components/ # Dashboard, TaskForm, TaskCard, Toast
│   │   └── index.css   # Theme design tokens & animations
│   └── index.html
├── server/          # Express backend application
│   ├── models.js    # SQLite Database connection & Task schemas
│   ├── routes.js    # Express CRUD routing logic
│   └── server.js    # Main entry point & DB sync
└── .gitignore       # Git rules
```

---

## 🚀 Quickstart

To run the application locally, run both dev servers:

### 1. Start Express Server
Navigate to the `server/` directory, install packages, and start nodemon:
```bash
cd server
npm install
npm run dev
```
The server will synchronize the database and start listening at **`http://localhost:5000`**.

### 2. Start Frontend App
Navigate to the `client/` directory, install packages, and boot up Vite:
```bash
cd client
npm install
npm run dev
```
The dashboard compiles files and will launch at **`http://localhost:5173`**.

---

## ✨ Features
- **Visual Completion Progress**: Real-time progress percentage bar and SVG radial ring.
- **Priority Indicator Levels**: Color-coded borders matching Low (Teal), Medium (Amber), and High (Rose) priorities.
- **Categorization**: Group items under Personal, Work, Shopping, Health, Finance, Ideas, or Custom.
- **Due Date Reminders**: Visual indicator badge marking tasks that are overdue.
- **Inline Editing**: Double-click/tap edit controls inside the cards to modify details dynamically without page reloads.
- **Toast Notifications**: Interactive overlays signaling success, delete, or warning events.
- **Dark Mode toggle**: Instantly transitions design themes.
