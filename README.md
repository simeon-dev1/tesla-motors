# Tesla Motors Giveaway App

This is a fully functional React/Vite application built for a global car giveaway campaign. It includes a public-facing home page, a 4-step participation form, and a password-protected admin dashboard.

The app uses **`localStorage`** for data persistence, so no external database is required to run it locally or deploy it.

---

## 📋 Prerequisites

Make sure you have **Node.js** (v16 or higher) and **npm** installed on your computer.

- Check your Node version: `node -v`
- Check your npm version: `npm -v`

---

## 🚀 Installation & Setup

Follow these steps to get the app running on your machine:

1. **Open your terminal** (or command prompt) inside the project folder.
2. **Install all dependencies** by running: `npm install`
3. **Start the development server** by running: `npm run dev`
4. **Open the app** in your browser:
   - The terminal will display a local URL (usually `http://localhost:5173`).
   - Copy and paste that URL into your browser to view the site.

---

## 🛠️ Building for Production

If you want to generate a static build to deploy to a hosting provider (like Vercel or Netlify), run: `npm run build`

This will create an optimized `dist/` folder containing all the compiled files.

---

## 🔐 Admin Panel Access

The app includes a hidden admin dashboard where you can manage car models, delivery fees, payment wallets, and view all user submissions.

- **Admin URL:** Add `/Admin` to the end of your site's URL (e.g., `http://localhost:5173/Admin`)
- **Admin Password:** `cblfunz@#$&`

*(You can change this password by editing the `ADMIN_PASSWORD` variable inside `src/Admin.jsx`).*

---

## 📁 Project Structure (Quick Overview)

- **`src/App.jsx`** – Handles the main routing (Home, Admin, Participate).
- **`src/Home.jsx`** – The main landing page with hero, car listings, videos, and live transaction feed.
- **`src/Participate.jsx`** – The 4-step order form (Details → Order → Payment → Success) with live tracking.
- **`src/Admin.jsx`** – The admin dashboard for managing content and submissions.
- **`src/main.jsx`** – The entry point that preloads default data into `localStorage` on the first visit.

---

## 🖼️ Images & Assets

All static images (Tesla logos, car photos, and background assets) are located in the `public/images/` folder.

If you want to change any images, simply replace the existing files in that folder with your own. The app will automatically detect the changes.

---

## 🌍 Deploying to Vercel (Recommended)

1. Push this codebase to a **GitHub repository**.
2. Go to [Vercel.com](https://vercel.com) and click **"Add New → Project"**.
3. Connect your GitHub repo and select it.
4. Vercel will automatically detect it as a Vite project and deploy it.
5. Once deployed, you will receive a public live URL (e.g., `https://your-project-name.vercel.app`).

---

## 📞 Support / Questions

If you encounter any issues while setting up the app, simply reach out to your developer (Simeon) with the error message you see in the terminal or browser console.
