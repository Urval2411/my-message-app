# Message App

A simple message app with a Node.js/Express backend and a React frontend styled with Tailwind CSS.

## Setup

### Backend

```bash
cd backend
npm install
npm start
```

The API runs at **http://localhost:3001**.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The app runs at **http://localhost:5173**.

## Usage

1. Start the **backend** first (`cd backend && npm start`).
2. Start the **frontend** (`cd frontend && npm run dev`).
3. Open http://localhost:5173, fill in Name, Contact, and Message (max 200 characters), and click **Send message**.
4. Check the backend terminal to see the submitted data logged to the console.

## Excel export (admin only)

- The **Export to Excel** option is hidden from the main form. Only you (the site owner) can use it.
- At the bottom of the page, click **"Admin: Export data"** to reveal the export section.
- When you **publish** the site, set an **export key** so only you can download messages:
  - On your server/hosting, set the environment variable **`EXPORT_SECRET`** to a long, random string (e.g. a password only you know).
  - Restart the backend. The export endpoint will then require that key.
  - In the admin export section, enter the same key and click **Download Excel**.
- If `EXPORT_SECRET` is not set (e.g. local development), the export works without a key so you can test easily.

## API

- **POST** `/send-message`  
  Body: `{ "name": string, "contact": string, "message": string }`  
  `message` must be at most 200 characters.
- **GET** `/messages/export` — returns an Excel file of all messages. When `EXPORT_SECRET` is set, the request must include it (e.g. header: `Authorization: Bearer your-secret` or query: `?key=your-secret`).
