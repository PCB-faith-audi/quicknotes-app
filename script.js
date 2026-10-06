/* ================================================
   QUICKNOTES — script.js
   Task 3: Add and display notes
   Task 4: Validation, delete, and count
   Task 5: localStorage persistence and search
   ================================================ */


/* ── SECTION 1: GET DOM ELEMENTS ─────────────────
   querySelector() finds an element using a CSS
   selector string. "#note-form" means "the element
   with id="note-form"". We store each one in a
   variable so we can use it throughout the code.  */

const noteForm     = document.querySelector('#note-form');
const noteInput    = document.querySelector('#note-input');
const noteCategory = document.querySelector('#note-category');
const notesList    = document.querySelector('#notes-list');
const noteCount    = document.querySelector('#note-count');
const errorMessage = document.querySelector('#error-message');
const searchInput  = document.querySelector('#search-input');
const clearBtn     = document.querySelector('#clear-btn');


/* ── SECTION 2: THE NOTES ARRAY ──────────────────
   This is our "database" in memory. Every note the
   user creates will be stored here as an object.
   'let' (not 'const') because we'll reassign it
   later when loading from localStorage (Task 5).  */

let notes = [];


/* ── SECTION 2b: LOCALSTORAGE — SAVE & LOAD ──────
   localStorage is a key-value store built into
   every browser. It persists even after the tab
   is closed or the page is refreshed.

   SAVE:
   localStorage can only store STRINGS — not arrays
   or objects. JSON.stringify() converts our notes
   array into a JSON string like:
   '[{"id":123,"text":"Buy milk",...}]'
   We store it under the key 'quicknotes'.

   LOAD:
   JSON.parse() converts that JSON string back into
   a real JavaScript array of objects.
   We use || [] as a safety net: if nothing has
   been saved yet, localStorage.getItem() returns
   null — and JSON.parse(null) returns null too.
   The || [] means: "if the result is falsy, use
   an empty array instead." Prevents a crash.      */

function saveNotes() {
  localStorage.setItem('quicknotes', JSON.stringify(notes));
}

function loadNotes() {
  const saved = localStorage.getItem('quicknotes');
  notes = JSON.parse(saved) || [];
}


/* ── SECTION 3: MAKE A NOTE OBJECT ──────────────
   A factory function — it takes text + category,
   builds a proper note object, and returns it.

   Date.now() returns a large integer like
   1712345678901 — it's the milliseconds since
   Jan 1 1970. It makes a unique ID every time
   because two calls are always milliseconds apart.

   new Date().toLocaleString() gives a readable
   date like "10/6/2025, 3:15:22 PM".             */

function createNote(text, category) {
  return {
    id:        Date.now(),
    text:      text,
    category:  category,
    createdAt: new Date().toLocaleString()
  };
}


/* ── SECTION 3b: DELETE A NOTE ───────────────────
   filter() goes through every item in the array
   and keeps only the ones where the condition is
   TRUE. Here: keep every note whose id is NOT
   equal to the id we want to delete.
   The note we want gone fails the test → excluded.
   We reassign the notes variable to the new array.
   Then we call render() to redraw the updated list.
   Then we call saveNotes() to update localStorage.  */

function deleteNote(id) {
  notes = notes.filter(function(note) {
    return note.id !== id;
  });
  saveNotes();   /* persist the updated array immediately */
  render();
}


/* ── SECTION 3c: UPDATE NOTE COUNT ──────────────
   Reads notes.length and sets the correct sentence.
   The rubric checks the exact wording, so we match
   it character-for-character.                      */

function updateCount() {
  if (notes.length === 0) {
    noteCount.textContent = 'You have no notes yet.';
  } else if (notes.length === 1) {
    noteCount.textContent = 'You have 1 note.';
  } else {
    noteCount.textContent = 'You have ' + notes.length + ' notes.';
  }
}


/* ── SECTION 4: BUILD ONE NOTE CARD ─────────────
   Returns a fully built <li> element for one note.
   We use createElement() + textContent — NEVER
   innerHTML — for any user-supplied text.
   This prevents XSS: if a user typed
   <script>alert("hacked")</script>
   as their note, innerHTML would RUN that code.
   textContent treats it as plain text — safe.     */

function buildNoteCard(note) {

  /* <li class="category-personal"> (for example) */
  const li = document.createElement('li');
  li.classList.add('category-' + note.category.toLowerCase());

  /* <p class="note-text">user note here</p> */
  const textEl = document.createElement('p');
  textEl.classList.add('note-text');
  textEl.textContent = note.text;        /* ← safe! textContent, not innerHTML */

  /* <div class="note-meta"> — holds badge, date, delete */
  const meta = document.createElement('div');
  meta.classList.add('note-meta');

  /* <span class="note-category-badge">Personal</span> */
  const badge = document.createElement('span');
  badge.classList.add('note-category-badge');
  badge.textContent = note.category;

  /* <span class="note-date">10/6/2025, 3:15 PM</span> */
  const dateEl = document.createElement('span');
  dateEl.classList.add('note-date');
  dateEl.textContent = note.createdAt;

  /* Delete button
     When clicked, we read the note's id from the
     button's data-id attribute, convert it from a
     string back to a number with Number(), then
     call deleteNote() with that id.               */
  const deleteBtn = document.createElement('button');
  deleteBtn.classList.add('delete-btn');
  deleteBtn.textContent = 'Delete';
  deleteBtn.setAttribute('data-id', note.id);

  deleteBtn.addEventListener('click', function() {
    const idToDelete = Number(deleteBtn.getAttribute('data-id'));
    deleteNote(idToDelete);
  });

  /* Assemble: meta row gets badge + date + deleteBtn */
  meta.appendChild(badge);
  meta.appendChild(dateEl);
  meta.appendChild(deleteBtn);

  /* Card gets text + meta row */
  li.appendChild(textEl);
  li.appendChild(meta);

  return li;  /* hand the finished card back to render() */
}


/* ── SECTION 5: RENDER FUNCTION ──────────────────
   This is the most important function in the app.
   Every time anything changes (add, delete, search)
   we call render() to redraw the notes list
   completely from the notes[] array.

   Step-by-step:
   1. Wipe the current list (innerHTML = '' is OK
      here — we're clearing, not inserting user text)
   2. Loop through every note object
   3. Build a card for each note using buildNoteCard()
   4. Append each card to the list on the page       */

function render() {

  /* 1. Read the current search term and lowercase it
        so comparisons are case-insensitive.          */
  const query = searchInput.value.trim().toLowerCase();

  /* 2. Filter notes[] into a temporary display list.
        If query is empty, every note passes the test.
        If query has text, only notes whose text
        contains the query string are kept.
        The original notes[] array is NEVER modified — 
        this is just a temporary view.                */
  const filtered = notes.filter(function(note) {
    return note.text.toLowerCase().includes(query);
  });

  /* 3. Clear the list */
  notesList.innerHTML = '';

  /* 4. If nothing matched the search, show a message */
  if (filtered.length === 0 && query !== '') {
    const li = document.createElement('li');
    li.style.textAlign  = 'center';
    li.style.color      = '#999';
    li.style.padding    = '1rem';
    li.style.listStyle  = 'none';
    li.textContent = 'No notes match your search.';
    notesList.appendChild(li);

  } else {
    /* 5. Build a card for each matching note */
    filtered.forEach(function(note) {
      const card = buildNoteCard(note);
      notesList.appendChild(card);
    });
  }

  /* Update the count (always based on the FULL array) */
  updateCount();
}


/* ── SECTION 6: FORM SUBMIT EVENT LISTENER ───────
   addEventListener watches for an event on an
   element. 'submit' fires when the user clicks
   the submit button OR presses Enter in the form.

   event.preventDefault() stops the browser's
   default behaviour — which would be to reload
   the page and lose all our data!                 */

noteForm.addEventListener('submit', function(event) {

  event.preventDefault();   /* stop page reload */

  /* .trim() removes leading/trailing spaces so
     "   " (spaces only) counts as empty.         */
  const text     = noteInput.value.trim();
  const category = noteCategory.value;

  /* ── VALIDATION ─────────────────────────────────
     The rubric requires these EXACT error strings.
     We check empty first, then length.
     On any error: show message and stop (return).
     On success: clear the error message.           */

  if (text === '') {
    errorMessage.textContent = 'Please type a note first.';
    return;   /* stop here — do not add the note */
  }

  if (text.length > 200) {
    errorMessage.textContent = 'Notes must be 200 characters or fewer.';
    return;   /* stop here — do not add the note */
  }

  /* All good — clear any previous error message */
  errorMessage.textContent = '';

  /* Create the note object, add to array, save, redraw */
  const newNote = createNote(text, category);
  notes.push(newNote);

  saveNotes();   /* save to localStorage before rendering */
  render();

  /* Clear the input so user can type the next note */
  noteInput.value = '';
  noteInput.focus();
});


/* ── SECTION 7: SEARCH EVENT LISTENER ────────────
   'input' fires every time the user types a
   character, pastes text, or deletes a character.
   It is more immediate than 'change' (which only
   fires when the field loses focus).              */

searchInput.addEventListener('input', function() {
  render();   /* re-render with the new query — no save needed */
});


/* ── BONUS: CLEAR ALL ────────────────────────────
   confirm() opens a browser dialog with OK/Cancel.
   It returns true if the user clicks OK, and
   false if they click Cancel or close the dialog.
   We only wipe the notes if they confirm.
   Without the if-check, clicking Cancel would
   still delete everything — a bad user experience. */

function clearAll() {
  if (confirm('Delete all notes?')) {
    notes = [];          /* empty the array        */
    saveNotes();         /* overwrite localStorage  */
    render();            /* redraw the empty list   */
    searchInput.value = ''; /* also clear search   */
  }
}

clearBtn.addEventListener('click', clearAll);


/* ── SECTION 8: STARTUP — LOAD SAVED NOTES ───────
   This runs once, immediately when the page loads.
   loadNotes() pulls notes out of localStorage.
   render() then draws whatever was found.
   Result: notes are still there after a refresh.  */

loadNotes();
render();
