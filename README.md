# 🌍 Go to Visa — Visa Center

> Landing page for a visa center with an interactive quiz, visa catalog, and lead capture via Google Forms

<p align="center">
  <a href="https://pavelbuiko04.github.io/go_to_visa/"><strong>Live Demo →</strong></a><br>
  <sub>Portfolio project · HTML · CSS · JavaScript · Responsive layout</sub>
</p>

---

## 📋 About

Single-page landing for the **Go to Visa** visa agency. Features a Hero with video background, interactive visa quiz, country catalog, testimonials section, and contact form with submission to Google Sheets.

Built as a **portfolio piece** to demonstrate semantic HTML, vanilla JavaScript (no frameworks), CSS Grid/Flexbox, responsive design, and third-party API integration.

---

## ✨ Features

| Feature | Description |
|--------|-------------|
| **Hero + video** | Video background in header |
| **Interactive quiz** | 5-step flow: number of people, visas in last 3 years, trip date, countries, contact info. Validation, country autocomplete, confetti on completion |
| **Visa catalog** | Country cards (Spain, Greece, Italy, France, Germany) with illustrations |
| **Testimonials** | 6 chat screenshots in framed cards with hover effects |
| **Forms** | Lead form and quiz form, both submitting to Google Apps Script → Google Sheets |
| **Sticky header** | Transparent over Hero, switches to solid background on scroll |
| **Mobile menu** | Hamburger menu with animation |
| **Scroll animations** | Sections reveal on scroll (Intersection Observer) |

---

## 🛠 Tech Stack

- **HTML5** — semantic markup, ARIA, meta tags, Open Graph
- **CSS3** — custom properties, Grid, Flexbox, animations, media queries, `clamp()` for typography
- **JavaScript (Vanilla)** — no frameworks, ES5-compatible
- **Fonts** — Google Fonts (Manrope, Caveat, Caveat Brush)
- **Icons** — inline SVG, favicon set (PNG/SVG/ICO)
- **Integrations**:
  - [canvas-confetti](https://github.com/catdad/canvas-confetti) — quiz completion effect
  - [flagcdn.com](https://flagcdn.com) — country flags in quiz
  - Google Apps Script — form submissions to Google Sheets

---

## 📁 Project Structure

```
├── index.html          # Main page: Hero, quiz, testimonials, form
├── catalog.html        # Visa catalog
├── privacy.html        # Privacy policy
├── css/
│   └── styles.css      # Styles (~1800 lines)
├── js/
│   ├── main.js         # Header, menu, forms, quiz, scroll
│   └── countries-ru.js # Country autocomplete data
├── images/             # Assets: testimonials, quiz, catalog, logos
├── videos/             # Hero, contact videos
├── google-apps-script/ # Google Sheets backend
├── scripts/            # Favicon generation (Node.js)
└── package.json        # npm: sharp, to-ico for favicons
```

---

## 🚀 Run Locally

```bash
# Use a local server (e.g. Live Server in VS Code) or:
npx serve .
```

Forms submit to Google Apps Script. To enable: copy `google-apps-script/Code.gs` into a new Apps Script project, deploy as Web App, then update `LEAD_FORM_URL` in `js/main.js`.

---

## 📱 Responsive

- Desktop, tablet, mobile
- Breakpoints: 1024px, 900px, 768px, 600px, 480px
- Touch-friendly buttons and menu
- Video optimized for iOS (muted, playsinline)

---

## 🎨 Design Notes

- Logo typography: "Go to" + "Visa" (Caveat Brush)
- Catalog: Germany Visa Centre–style cards
- Quiz: multi-step selection without page reload

---

## 📄 License

Educational and portfolio use.

---

<p align="center">
  <sub>Made with ❤️ for portfolio</sub>
</p>
