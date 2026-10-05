# Daily Tracker (LifeOS) 🌸

A cute, calm, aesthetic personal tracker web application built with **React 19**, **TypeScript**, and **Vite**, featuring a soft 3D neumorphic pastel design system.

Live Deployed URL: **[https://chandan0393.github.io/daily-tracker/](https://chandan0393.github.io/daily-tracker/)**

---

## ✨ Features

- **🌸 Soft Pastel Neumorphic UI**: Warm off-white canvas (`#F4F0EC`), dual raised and inset shadows, pill-shaped buttons, and rounded squircle widgets.
- **🕒 Aesthetic Dashboard Widgets**:
  - Digital clock widget with live time and date
  - Analog clock face with pastel hands and golden hour markers
  - Circular progress countdown meter
  - Vertical capsule widgets for Water intake and Energy/Activity
  - Quick glance widgets for To-Do tasks, Walking, Expenses, and Learning
  - Cute companion face `( > ‿ < )` and audio wave widget
- **🎯 Full Goal Management**:
  - Target/Unit tracking, Checklist milestones, and Manual % sliders
  - Overdue deadline alerts and active progress monitoring
  - Category tags (Health, Career, Finance, Learning, Personal, etc.)
  - Client-side browser notification reminders
- **✅ To-Do Task Management**:
  - Filter by All, Active, Completed, or Priority
  - Custom rounded squircle checkboxes with smooth completion transitions
  - Inset search bar and sorting
- **⚙️ Settings & Privacy**:
  - Soft rounded settings rows for Appearance, Notifications, Data, and Theme
  - **100% Client-Side Privacy**: All data is stored directly in browser `localStorage`. No backend database, tracking, or external credentials required.

---

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Bundler**: [Vite 8](https://vite.dev/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Styling**: Vanilla CSS with custom Neumorphic Design Tokens
- **Linter**: [Oxlint](https://oxc.rs/)
- **Hosting**: [GitHub Pages](https://pages.github.com/) via GitHub Actions

---

## 🚀 Local Development

1. **Clone the repository**:
   ```bash
   git clone https://github.com/chandan0393/daily-tracker.git
   cd daily-tracker
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173/daily-tracker/` in your browser.

4. **Build production bundle**:
   ```bash
   npm run build
   ```

5. **Run linter**:
   ```bash
   npm run lint
   ```

---

## 📦 Deployment to GitHub Pages

This project is pre-configured for automated deployment using GitHub Actions.

### Setup Instructions:

1. **Create the GitHub repository**:
   - Go to GitHub and create a new repository named: `daily-tracker`
   - URL: `https://github.com/chandan0393/daily-tracker`

2. **Push your code to the `main` branch**:
   ```bash
   git init
   git remote add origin https://github.com/chandan0393/daily-tracker.git
   git branch -M main
   git add .
   git commit -m "Initial commit with GitHub Pages deployment workflow"
   git push -u origin main
   ```

3. **Enable GitHub Pages via Actions**:
   - On GitHub, go to your repository: **Settings** → **Pages**
   - Under **Build and deployment** → **Source**, select: **GitHub Actions**
   - That's it! Every push to `main` will automatically build and publish the application.

4. **Access your live app**:
   - Visit: **[https://chandan0393.github.io/daily-tracker/](https://chandan0393.github.io/daily-tracker/)**

---

## 🔒 Security & Privacy

- No API keys, passwords, or secrets are required or stored in this repository.
- Storage operates strictly offline-first in the user's browser via HTML5 `localStorage`.
