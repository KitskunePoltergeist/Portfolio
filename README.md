# Aidan's Portfolio

A personal portfolio website showcasing my projects, experiments, and interests in web development.

## Project Structure

```text
Portfolio/
├── .github/
├── fonts/
├── node_modules/
├── dist/
├── index.html
├── animation.js
├── package.json
├── package-lock.json
├── README.md
└── .gitignore
```

> `node_modules/` and `dist/` are generated directories and should generally not be committed to the repository.

## Running Locally

### 1. Clone the repository

```bash
git clone https://github.com/KitskunePoltergeist/Portfolio.git
```

### 2. Navigate into the project

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

## Production Build

To create an optimized production build:

```bash
npm run build
```

The resulting files will be placed in the `dist/` directory.

To preview the production build locally:

```bash
npm run preview
```

## Deployment

The portfolio is deployed using **GitHub Pages**.

The project uses Vite to build the site before deployment.

---

**Built with HTML, CSS, JavaScript, GSAP, and Vite.**