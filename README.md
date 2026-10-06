# QuickNotes

## Description

QuickNotes is a lightweight, browser-based note-taking application built with vanilla HTML, CSS, and JavaScript — no frameworks or libraries. Users can write notes, assign them to a category (Personal, Work, or Study), search through their notes in real time, and delete any note individually. All notes are saved automatically to the browser's localStorage, so they persist across page refreshes without any server or database.

---

## Features

- **Add notes** — Type a note and press the Add Note button or hit Enter
- **Categories** — Assign each note to Personal, Work, or Study; each category has a distinct colour-coded border
- **Validation** — Empty notes and notes over 200 characters are rejected with a clear error message
- **Delete** — Each note has its own Delete button that removes only that note
- **Search** — Filter notes in real time as you type; the search is case-insensitive
- **Note count** — Displays how many notes you currently have, updating automatically
- **localStorage persistence** — Notes are saved to the browser and survive a full page refresh
- **Responsive design** — The layout adapts to smaller screens; form controls stack vertically on mobile

---

## How to Run Locally

### Option 1 — Open directly in a browser (simplest)

1. Clone the repository:
   ```bash
   git clone https://github.com/PCB-faith-audi/quicknotes-app.git
   ```
2. Enter the project directory:
   ```bash
   cd quicknotes-app
   ```
3. Open `index.html` directly in your browser:
   - On most systems you can double-click `index.html` in your file explorer, **or**
   - Right-click `index.html` → *Open with* → your browser

### Option 2 — Use a local development server (recommended)

If you have VS Code with the **Live Server** extension installed:

1. Open the `quicknotes-app` folder in VS Code
2. Right-click `index.html` in the file explorer panel
3. Select **Open with Live Server**
4. The app opens at `http://127.0.0.1:5500` and auto-refreshes on every save

> No installation, build step, or server configuration is required. The app runs entirely in the browser.

---

## What I Learned

Working on QuickNotes gave me hands-on experience with several core web development concepts:

1. **DOM manipulation** — I learned how to use `document.querySelector()` to select elements and `document.createElement()` with `textContent` to safely build HTML from user input without risking XSS vulnerabilities.

2. **JavaScript arrays and objects** — I practised storing structured data as an array of objects (each note has `id`, `text`, `category`, and `createdAt`), and used array methods like `push()`, `filter()`, and `forEach()` to manage and display the data.

3. **Event handling** — I used `addEventListener()` to respond to form submissions, button clicks, and live input changes. I also learned why `event.preventDefault()` is essential to stop the browser reloading the page on form submit.

4. **localStorage and JSON** — I learned that the browser's `localStorage` can only store strings, so I used `JSON.stringify()` to convert my notes array before saving and `JSON.parse()` to restore it on page load.

5. **Form validation** — I implemented client-side validation that checks for empty input and character limits before a note is added, displaying exact error messages in a dedicated paragraph element.

6. **Responsive CSS with Flexbox and media queries** — I used Flexbox to lay out the form controls side by side on desktop and a `@media (max-width: 600px)` query to stack them vertically on smaller screens.

---

## Project Structure

```
quicknotes-app/
├── index.html   — Page structure and semantic HTML
├── style.css    — Styling, layout, category colours, responsive design
├── script.js    — All application logic (notes, localStorage, search)
└── README.md    — Project documentation
```

---

## Technologies Used

- HTML5
- CSS3 (Flexbox, media queries)
- Vanilla JavaScript (ES6)
- Browser localStorage API
