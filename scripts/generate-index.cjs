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

// Confluence page URLs
const DOCUMENTATION_URL = 'https://karimlounes.atlassian.net/wiki/spaces/SD/pages/491523/Documentation';
const ABOUT_ME_URL = 'https://karimlounes.atlassian.net/wiki/spaces/SD/pages/786433/About+Me';

// Icon mapping for known prototypes
const iconMap = {
  'main': '🎨',
  'test-prototype-1': '�',
};

// Description mapping for known prototypes
const descriptionMap = {
  'main': 'The primary UX AI storyboard prototype with navigation, layout components, and design system.',
  'test-prototype-1': 'Experimental prototype branch for testing new component ideas.',
};

// Display name mapping
const nameMap = {
  'main': 'Main Prototype',
  'test-prototype-1': 'Test Prototype 1',
};

function getDisplayName(slug) {
  return nameMap[slug] || slug.replace(/-/g, ' ').replace(/\b./g, c => c.toUpperCase());
}

function getIcon(slug) {
  return iconMap[slug] || '📁';
}

function getDescription(slug) {
  return descriptionMap[slug] || 'View this prototype deployment.';
}

const prototypeCards = prototypes.length > 0
  ? prototypes.map(slug => `
        <a href="${PROTOTYPES_BASE_URL}/${slug}/" class="prototype-card" target="_blank" rel="noopener noreferrer">
          <span class="card-icon">${getIcon(slug)}</span>
          <div class="card-body">
            <h2 class="card-title">${getDisplayName(slug)}</h2>
            <p class="card-description">${getDescription(slug)}</p>
            <span class="card-cta">View prototype &rarr;</span>
          </div>
        </a>`).join('\n')
  : '<div class="empty">No prototypes deployed yet. Create a branch in the prototype repo, push it, and it will appear here automatically.</div>';

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My UX AI</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background: #f9fafb;
      color: #213547;
      min-height: 100vh;
    }

    /* Navigation Bar */
    .navbar {
      position: fixed;
      top: 0; left: 0; right: 0;
      height: 60px;
      background-color: #ffffff;
      border-bottom: 1px solid #e5e7eb;
      z-index: 1000;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
    }
    .nav-container {
      max-width: 1200px;
      margin: 0 auto;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 1.5rem;
    }
    .nav-brand {
      font-size: 1.4rem;
      font-weight: 700;
      color: #4f46e5;
      text-decoration: none;
      letter-spacing: -0.02em;
    }
    .nav-brand:hover { color: #4338ca; }
    .nav-links {
      list-style: none;
      display: flex;
      gap: 2rem;
      align-items: center;
    }
    .nav-link {
      color: #4b5563;
      text-decoration: none;
      font-weight: 500;
      font-size: 0.95rem;
      padding: 0.5rem 0;
      position: relative;
      transition: color 0.2s ease;
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }
    .nav-link:hover { color: #4f46e5; }
    .nav-link::after {
      content: '';
      position: absolute;
      bottom: 0; left: 0;
      width: 0; height: 2px;
      background-color: #4f46e5;
      border-radius: 1px;
      transition: width 0.2s ease;
    }
    .nav-link:hover::after { width: 100%; }
    .external-icon { font-size: 0.75rem; opacity: 0.6; }

    /* Mobile toggle */
    .nav-toggle {
      display: none;
      flex-direction: column;
      justify-content: center;
      gap: 5px;
      width: 36px; height: 36px;
      background: none; border: none;
      cursor: pointer; padding: 4px;
    }
    .hamburger-line {
      display: block;
      width: 24px; height: 2px;
      background-color: #374151;
      border-radius: 2px;
      transition: all 0.3s ease;
    }

    /* Main Content */
    .main-content {
      margin-top: 60px;
      max-width: 1200px;
      margin-left: auto;
      margin-right: auto;
      padding: 0 1.5rem;
      min-height: calc(100vh - 60px);
    }

    /* Hero */
    .hero {
      text-align: center;
      padding: 3rem 1rem 2rem;
    }
    .hero h1 {
      font-size: 2.4rem;
      color: #111827;
      font-weight: 700;
      margin-bottom: 0.5rem;
    }
    .brand-highlight { color: #4f46e5; }
    .hero-subtitle {
      font-size: 1.1rem;
      color: #6b7280;
      max-width: 500px;
      margin: 0 auto;
      line-height: 1.6;
    }

    /* Prototypes Section */
    .prototypes-section { padding: 1rem 0 3rem; }
    .prototypes-count {
      color: #64748b;
      font-size: 0.9rem;
      margin-bottom: 1.25rem;
    }
    .prototypes-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.25rem;
    }
    .prototype-card {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 1.5rem;
      text-decoration: none;
      color: inherit;
      transition: all 0.2s ease;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
    }
    .prototype-card:hover {
      border-color: #4f46e5;
      box-shadow: 0 4px 12px rgba(79, 70, 229, 0.12);
      transform: translateY(-2px);
    }
    .card-icon {
      font-size: 2rem;
      flex-shrink: 0;
      line-height: 1;
    }
    .card-body { flex: 1; min-width: 0; }
    .card-title {
      font-size: 1.05rem;
      font-weight: 600;
      color: #1e293b;
      margin: 0 0 0.35rem;
    }
    .card-description {
      font-size: 0.875rem;
      color: #64748b;
      line-height: 1.5;
      margin: 0 0 0.75rem;
    }
    .card-cta {
      font-size: 0.85rem;
      color: #4f46e5;
      font-weight: 500;
    }
    .prototype-card:hover .card-cta { text-decoration: underline; }
    .empty {
      text-align: center;
      color: #94a3b8;
      padding: 3rem 1rem;
      background: #ffffff;
      border-radius: 12px;
      border: 1px dashed #cbd5e1;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .nav-toggle { display: flex; }
      .nav-links {
        display: none;
        position: absolute;
        top: 60px; left: 0; right: 0;
        flex-direction: column;
        background-color: #ffffff;
        border-bottom: 1px solid #e5e7eb;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.08);
        padding: 0.75rem 1.5rem;
        gap: 0;
      }
      .navbar.menu-open .nav-links { display: flex; }
      .nav-link { padding: 0.75rem 0; width: 100%; }
      .nav-link::after { display: none; }
      .hero { padding: 2rem 0.5rem 1.5rem; }
      .hero h1 { font-size: 1.8rem; }
      .hero-subtitle { font-size: 1rem; }
      .prototypes-grid { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>
  <nav class="navbar" id="navbar">
    <div class="nav-container">
      <a href="/" class="nav-brand">My UX AI</a>
      <button class="nav-toggle" aria-label="Toggle navigation" onclick="document.getElementById('navbar').classList.toggle('menu-open')">
        <span class="hamburger-line"></span>
        <span class="hamburger-line"></span>
        <span class="hamburger-line"></span>
      </button>
      <ul class="nav-links">
        <li><a href="/" class="nav-link">Prototypes</a></li>
        <li><a href="${DOCUMENTATION_URL}" target="_blank" rel="noopener noreferrer" class="nav-link">Documentation <span class="external-icon" aria-hidden="true">&#8599;</span></a></li>
        <li><a href="${ABOUT_ME_URL}" target="_blank" rel="noopener noreferrer" class="nav-link">About Me <span class="external-icon" aria-hidden="true">&#8599;</span></a></li>
      </ul>
    </div>
  </nav>

  <main class="main-content">
    <div class="hero">
      <h1>Welcome to <span class="brand-highlight">My UX AI</span></h1>
      <p class="hero-subtitle">A prototyping platform for exploring and sharing UX design concepts.</p>
    </div>

    <section class="prototypes-section">
      <p class="prototypes-count">${prototypes.length} prototype${prototypes.length !== 1 ? 's' : ''} available</p>
      <div class="prototypes-grid">
${prototypeCards}
      </div>
    </section>
  </main>

  <script>
    // Mobile menu toggle
    document.querySelector('.nav-toggle').addEventListener('click', function() {
      document.getElementById('navbar').classList.toggle('menu-open');
    });
  </script>
</body>
</html>`;

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, html, 'utf8');
console.log('Generated index page with ' + prototypes.length + ' prototype(s) at ' + outputPath);
