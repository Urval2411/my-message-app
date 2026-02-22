# Deploy Your Message App to the Live Web

This guide gets your app running on the internet: **backend** on Railway and **frontend** on Vercel (both have free tiers).

---

## What You’ll Have When Done

- **Frontend**: Your React form at a URL like `https://your-app.vercel.app`
- **Backend**: Your API at a URL like `https://your-app-backend.railway.app`
- Visitors can submit messages; only you can export them to Excel (using your export key).

---

## Part 1: Deploy the Backend (Railway)

1. **Sign up**: Go to [railway.app](https://railway.app) and sign in with GitHub.

2. **New project**: Click **“New Project”** → **“Deploy from GitHub repo”**. Connect GitHub if needed, then select your message-app repo.

3. **Backend runs from repo root** (no need to set Root Directory):
   - A root **package.json** is included so Railway detects Node and runs the backend: it runs `npm install` (which installs backend dependencies) and `npm start` (which starts the backend server).
   - **If the build still fails** (e.g. “Railpack could not determine how to build”): in Railway → your service → **Settings** → **Source**, set **Root Directory** to `backend`. Then set **Start Command** to `npm start` or `node server.js` and redeploy.

4. **Environment variables** (in Railway → your service → **Variables**):
   - `EXPORT_SECRET` = a long random string only you know (e.g. `MyStr0ng_Export_Key_2025`). **Required** so only you can download the Excel file.
   - `FRONTEND_URL` = your frontend URL **after** you deploy it (e.g. `https://your-app.vercel.app`). Optional but recommended so only your site can call the API.

5. **Deploy**: Railway will build and run the backend. Open the **Settings** → **Networking** (or **Generate Domain**) and create a **public URL**. Copy it (e.g. `https://message-app-backend-production-xxxx.up.railway.app`). You’ll use this as the backend URL for the frontend.

---

## Part 2: Deploy the Frontend (Vercel)

1. **Sign up**: Go to [vercel.com](https://vercel.com) and sign in with GitHub.

2. **Import project**: Click **“Add New”** → **“Project”** and import the same GitHub repo.

3. **Configure the project**:
   - **Root Directory**: Click **Edit** and set to `frontend` (so Vercel builds only the frontend).
   - **Framework Preset**: Vite (should be auto-detected).
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

4. **Environment variable** (in Vercel → your project → **Settings** → **Environment Variables**):
   - **Name**: `VITE_API_URL`
   - **Value**: Your Railway backend URL from Part 1 (e.g. `https://message-app-backend-production-xxxx.up.railway.app`).  
   - No trailing slash.

5. **Deploy**: Click **Deploy**. When it’s done, you’ll get a URL like `https://your-app.vercel.app`.

---

## Part 3: Tie It Together

1. **Update backend CORS** (optional but good for security):
   - In Railway, open your backend service → **Variables**.
   - Add or set `FRONTEND_URL` to your Vercel URL (e.g. `https://your-app.vercel.app`).
   - Redeploy the backend so the new variable is applied.

2. **Use the app**:
   - Open your Vercel URL. Submit a message; it should reach the Railway backend.
   - To download messages as Excel: scroll down → **“Admin: Export data”** → enter your `EXPORT_SECRET` → **Download Excel**.

---

## Important Notes

- **Messages are stored in memory** on the backend. If Railway restarts your app (e.g. after inactivity on free tier), messages can be lost. For permanent storage you’d add a database later.
- **Export key**: Keep `EXPORT_SECRET` secret. Only you should use the admin export.
- **Two repos or monorepo**: If your backend and frontend are in **one repo** (e.g. `frontend/` and `backend/`), use **Root Directory** in both Railway and Vercel so each uses the right folder. If they are in **two repos**, deploy each repo separately and set `VITE_API_URL` to the backend URL and `FRONTEND_URL` to the frontend URL.

---

## Quick Checklist

- [ ] Backend deployed on Railway with `EXPORT_SECRET` set
- [ ] Backend public URL copied
- [ ] Frontend deployed on Vercel with `VITE_API_URL` = backend URL
- [ ] (Optional) `FRONTEND_URL` set on Railway to your Vercel URL
- [ ] Test: submit a message and export Excel with your key
