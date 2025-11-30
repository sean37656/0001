
# Civics Dashboard (GitHub Pages Ready)

This is a production-ready static site optimized for GitHub Pages.
It includes:
- `index.html` (main page)
- `assets/style.css` (styles, dark mode)
- `assets/script.js` (all interactive JS)
- `assets/favicon.png` (placeholder)
- `README.md` (this file)
- `404.html` (optional GitHub Pages fallback)

## Quick Deploy (recommended)

1. Create a new public repository on GitHub (e.g. `civics-dashboard`).
2. Clone locally or upload files manually.
3. If using git:
```bash
git init
git add .
git commit -m "Initial site upload"
git branch -M main
git remote add origin https://github.com/<your-username>/<repo-name>.git
git push -u origin main
```

4. Enable GitHub Pages:
- Repository -> Settings -> Pages -> Source: `main` branch, folder `/ (root)` -> Save.
- Your site will be available at: `https://<your-username>.github.io/<repo-name>/`

## Optional: Custom domain
Add `CNAME` file in root with your domain and configure DNS (CNAME to `<your-username>.github.io`).

## Notes
- Uses Tailwind CDN and Chart.js CDN. Works without any build step.
- To further optimize, consider minifying `assets/script.js` and `assets/style.css`.
