#!/usr/bin/env node

/**
 * Generates the main index.html page that lists all deployed prototypes.
 * Scans the cloned gh-pages branch of the prototype repo to discover prototypes.
 *
 * Usage: node scripts/generate-index.cjs <output-path> [prototype1] [prototype2] ...
 */

const fs = require('fs');
const path = require('path');

const outputPath = process.argv[2];
const prototypes = process.argv.slice(3).filter(Boolean).sort();

// Base URL where prototypes are hosted (prototype repo's GitHub Pages)
const PROTOTYPES_BASE_URL = 'https://karimlo.github.io/prototype';

const now = new Date().toLocaleDateString('en-US', {
  year: 'numeric', month: 'long', day: 'numeric',
  hour: '2-digit', minute: '2-digit', timeZoneName: 'short',
});

const prototypeCards = prototypes.length > 0
  ? prototypes.map(name => `
        <a href="${PROTOTYPES_BASE_URL}/${name}/" class="card" target="_blank" rel="noopener">
          <div class="card-icon">&#9670;</div>
          <div class="card-content">
            <h2>${name}</h2>
            <p>View prototype &rarr;</p>
          </div>
        </a>`).join('\n')
  : '<p class="empty">No prototypes deployed yet. Create a branch in the prototype repo, push it, and it will appear here automatically.</p>';

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Prototypes</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #f8fafc; color: #1e293b; min-height: 100vh;
    }
    header {
      background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
      color: white; padding: 3rem 1.5rem; text-align: center;
    }
    header h1 { font-size: 2rem; font-weight: 700; margin-bottom: 0.5rem; }
    header p { opacity: 0.85; font-size: 1.1rem; }
    main {
      max-width: 800px; margin: 2rem auto; padding: 0 1.5rem;
    }
    .count { color: #64748b; margin-bottom: 1.5rem; font-size: 0.95rem; }
    .grid { display: grid; gap: 1rem; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); }
    .card {
      display: flex; align-items: center; gap: 1rem;
      background: white; border: 1px solid #e2e8f0; border-radius: 12px;
      padding: 1.25rem 1.5rem; text-decoration: none; color: inherit;
      transition: all 0.2s ease; box-shadow: 0 1px 3px rgba(0,0,0,0.04);
    }
    .card:hover {
      border-color: #6366f1; box-shadow: 0 4px 12px rgba(99,102,241,0.15);
      transform: translateY(-2px);
    }
    .card-icon {
      font-size: 1.5rem; color: #6366f1; flex-shrink: 0;
    }
    .card-content h2 { font-size: 1.05rem; font-weight: 600; color: #1e293b; }
    .card-content p { font-size: 0.85rem; color: #6366f1; margin-top: 0.25rem; }
    .empty {
      text-align: center; color: #94a3b8; padding: 3rem 1rem;
      background: white; border-radius: 12px; border: 1px dashed #cbd5e1;
    }
    footer {
      text-align: center; padding: 2rem; color: #94a3b8; font-size: 0.8rem;
    }
  </style>
</head>
<body>
  <header>
    <h1>&#9670; Prototypes</h1>
    <p>Browse all deployed prototype branches</p>
  </header>
  <main>
    <p class="count">${prototypes.length} prototype${prototypes.length !== 1 ? 's' : ''} deployed</p>
    <div class="grid">
${prototypeCards}
    </div>
  </main>
  <footer>Last updated: ${now}</footer>
</body>
</html>`;

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, html, 'utf8');
console.log('Generated index page with ' + prototypes.length + ' prototype(s) at ' + outputPath);

