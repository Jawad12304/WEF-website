# Worldwide Education Foundation (WEF) - Project Details

## 1. Project Overview
This repository contains the frontend source code for the **Worldwide Education Foundation (WEF)** website. WEF is a 501(c)(3) NGO dedicated to investing in the potential of children and youth across underserved communities in Central and South Asia (specifically Chitral, Pakistan). Their programs focus on early childhood development, teacher training, English language learning, and scholarship programs.

## 2. Current Architecture & State
Currently, the website is a **fully static, frontend-only site** consisting of multiple HTML pages. There is no backend, database, or CMS connected. It uses purely static assets (HTML, CSS, JS, and Images) to render all content.

## 3. Technology Stack
* **HTML:** Pure HTML5 with Semantic elements. Features robust SEO meta tags, Open Graph tags, and Schema.org Structured Data.
* **CSS:** Vanilla CSS3 (`css/styles.css`). The styling follows a premium, modern design aesthetic incorporating:
  * Glassmorphism effects
  * Micro-animations and hover effects
  * Fluid typography
  * Fully responsive layouts (Mobile-first design principles)
* **JavaScript:** Vanilla JavaScript (`js/main.js`, `js/map.js` if present). Used for:
  * UI Interactivity (e.g., mobile navigation, sliders, tabs)
  * Scroll reveal animations
  * Number counters for statistics
  * Lightbox galleries
* **Third-Party Libraries:** 
  * [Leaflet.js](https://leafletjs.com/) is used for rendering interactive maps to show program locations.

## 4. Directory & File Structure
The project is organized into several specific pages covering different aspects of the organization:

### Core Pages
* `index.html`: The main landing page outlining the mission, impact statistics, featured programs, and interactive map.

### About Section
* `our-mission.html`: Detailed explanation of the WEF mission and vision.
* `our-team.html`: Profiles of the foundation's team members and board.
* `our-history.html`: Timeline and story of how WEF was founded.

### Programs Section
* `programs.html`: Hub page for all programs.
* `early-childhood.html`, `bright-beginnings.html`: Pages dedicated to Early Childhood Development.
* `scholarships.html`, `secondary-scholarships.html`: Pages outlining scholarship opportunities.
* `teacher-training.html`, `skills-development.html`: Pages for professional development.
* `learning-centers.html`, `model-schools.html`, `language-labs.html`: Pages for infrastructure and educational centers.

### Impact & Media
* `success-stories.html`: Articles highlighting student success.
* `annual-reports.html`: Hub for viewing/downloading yearly reports.
* `gallery.html`: Photo gallery (uses lightboxes).
* `video-gallery.html`: Video media page.
* `research-hub.html`: Hub for research papers and findings.

### Get Involved
* `contact.html`: Contact forms and details.
* `volunteer.html`: Opportunities for volunteering.

### Assets
* `assets/`: Contains all static images, SVGs, and logos.
* `css/`: Contains styling (`styles.css`).
* `js/`: Contains all interactive scripts.

## 5. Security & Best Practices
* Uses Content Security Policy (CSP) headers in `index.html` to prevent XSS.
* Uses modern image formats (`.webp`) and `loading="eager"/"lazy"` attributes for performance optimization.
* Fully accessible ARIA labels for screen readers.

## 6. Future Development Goals (CMS/Admin Integration)
A primary upcoming goal for this project is to convert it from a static site into a dynamic one, so that content can be updated by non-technical staff. This involves:
1. **Selecting a Backend/Database:** (e.g., Node.js/Express, Firebase, Supabase, or headless CMS like Strapi/Sanity).
2. **Creating an Admin Dashboard UI:** For CRUD operations.
3. **Refactoring Frontend:** Connecting the HTML/Vanilla JS frontend to fetch data from APIs instead of hardcoding text and images.

Areas targeted for dynamic updates:
* Active Projects / Programs (Titles, descriptions, metrics).
* Honor Board / Sponsors.
* Team Members (Bios, roles, images).
* Media Galleries (Photos, videos, captions).
* Success Stories & Annual Reports (Articles and PDFs).

---
*Note for AI Agents: When working on this codebase, prioritize maintaining the existing premium aesthetic and semantic HTML structure. If modifying styles, rely heavily on the existing CSS tokens and classes defined in `styles.css`.*
