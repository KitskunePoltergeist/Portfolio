# Aidan's Portfolio

A personal portfolio website showcasing my projects, experiments, and interests in front-end web development.

**Live Website:** [kitskunepoltergeist.github.io/Portfolio](https://kitskunepoltergeist.github.io/Portfolio/)

## Project Structure

```text
Portfolio/
├── .github/
│   └── workflows/
├── fonts/
├── public/
│   └── images/
├── index.html
├── animation.js
├── script.js
├── style.css
├── vite.config.js
├── package.json
├── package-lock.json
├── README.md
└── .gitignore
```

### Directory Overview

| Path | Description |
|---|---|
| `.github/workflows/` | GitHub Actions deployment workflows |
| `fonts/` | Locally hosted font files |
| `images/` | Website images and visual assets |
| `index.html` | Main HTML document |
| `animation.js` | GSAP animations and text effects |
| `script.js` | Main JavaScript functionality |
| `style.css` | Website styling and layout |
| `vite.config.js` | Vite configuration, including the deployment base path |
| `package.json` | Project metadata, scripts, and dependencies |
| `package-lock.json` | Locked dependency versions |
| `.gitignore` | Files and directories excluded from Git |

> `node_modules/` and `dist/` are generated directories. They are excluded from version control and should not be committed.

## Running Locally

### 1. Clone the repository

```bash
git clone https://github.com/KitskunePoltergeist/Portfolio.git
```

### 2. Navigate into the project directory

```bash
cd Portfolio
```

### 3. Install dependencies

```bash
npm install
```

### 4. Start the development server

```bash
npm run dev
```

Vite will start a local development server and provide a URL in the terminal.

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Starts the Vite development server |
| `npm run build` | Creates an optimized production build |
| `npm run preview` | Locally previews the production build |

## Production Build

To generate an optimized production build:

```bash
npm run build
```

Vite outputs the compiled website to the `dist/` directory.

To preview the production build locally:

```bash
npm run preview
```

## Deployment

The portfolio is hosted on **GitHub Pages** and uses **GitHub Actions** for automated deployment.

Vite is configured with the `/Portfolio/` base path in `vite.config.js` to ensure that assets and resources resolve correctly when hosted under the repository's GitHub Pages URL.

---

**Built with HTML, CSS, JavaScript, GSAP, and Vite.**
