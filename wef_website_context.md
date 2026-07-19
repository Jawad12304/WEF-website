# Worldwide Education Foundation (WEF) - Website Context for AI Agent

## Overview
This document provides full context for an AI agent tasked with building an **Admin Page / CMS** for the Worldwide Education Foundation (WEF) website. The current website is a completely static, frontend-only site that requires an admin interface to make content updates dynamically instead of editing raw HTML files.

## 1. Project Information
* **Organization:** Worldwide Education Foundation (WEF)
* **Mission:** An NGO investing in early childhood development, teacher training, language learning, and scholarships in underserved communities (specifically Chitral, Pakistan).
* **Current State:** The website is a fully static multi-page frontend built with plain HTML, CSS, and Vanilla JavaScript. There is currently no backend, database, or CMS connected to it.

## 2. Technology Stack (Current Frontend)
* **HTML:** Pure HTML5 (Semantic HTML, multiple pages).
* **CSS:** Vanilla CSS3 (`css/styles.css`), implementing a modern, premium design aesthetic (Glassmorphism, micro-animations, fluid typography).
* **JavaScript:** Vanilla JavaScript (`js/main.js`, `js/map.js`), handling UI interactivity (slideshows, scroll reveals, mobile menu, lightboxes, number counters).
* **Third-Party Libraries:** Leaflet.js for interactive maps. No heavy frontend frameworks (like React, Vue, or Angular) are currently used.

## 3. Site Architecture & File Structure
The website consists of several static HTML pages, categorized as follows:
* **Core Pages:** `index.html` (Landing page)
* **About:** `our-team.html`, `our-mission.html`, `our-history.html`
* **Impact:** `success-stories.html`, `annual-reports.html`
* **Programs:** `programs.html`, `early-childhood.html`, `scholarships.html`
* **Media:** `gallery.html`, `video-gallery.html`
* **Get Involved:** `contact.html`, `volunteer.html`
* **Assets:** Images/SVGs stored in `assets/images/`, CSS in `css/`, JS in `js/`.

## 4. Key Sections to be Managed by the Admin Page
When building the admin page, the AI should account for creating CRUD (Create, Read, Update, Delete) functionality for the following dynamic areas of the website:

1. **Active Projects / Programs:** (Currently hardcoded in `index.html` and `programs.html`)
   * Fields needed: Project Title, Description, Image, Launch Year, Location, Metrics (e.g., Number of students/centers).
2. **Honor Board / Sponsors:** (Currently hardcoded in `index.html`)
   * Fields needed: Sponsor Name, Sponsorship Tier/Group, Number of Centers sponsored.
3. **Team Members:** (Currently in `our-team.html`)
   * Fields needed: Name, Role, Bio, Profile Image.
4. **Media Galleries:** (Currently in `gallery.html` and `video-gallery.html`)
   * Needs ability to upload new photos/videos and assign captions.
5. **Success Stories & Annual Reports:**
   * Needs a way to upload PDF reports or write new success story articles.

## 5. Next Steps for Admin Page Generation
Since the current site is fully static HTML/CSS/JS, building an admin panel will require:
1. **Selecting a Backend/Database:** (e.g., Node.js/Express, Firebase, Supabase, or a headless CMS like Strapi/Sanity) to store the data.
2. **Creating the Admin UI:** A secure dashboard to manage the content listed above.
3. **Refactoring Frontend (Optional but Recommended):** Fetching data from the newly created backend/API to populate the HTML pages dynamically, either by using vanilla JS `fetch()` calls or migrating to a framework.

*Note to AI: Use this context to generate the necessary backend models, API routes, and the Admin Dashboard UI to integrate with the existing WEF static site.*
