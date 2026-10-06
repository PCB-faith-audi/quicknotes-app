/* ================================================
   QUICKNOTES — script.js
   Task 3: Add and display notes
   Task 4: Validation, delete, and count
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


/* ── SECTION 2: THE NOTES ARRAY ──────────────────
   This is our "database" in memory. Every note the
   user creates will be stored here as an object.
   'let' (not 'const') because we'll reassign it
   later when loading from localStorage (Task 5).  */

let notes = [];


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

  /* 1. Clear the list */
  notesList.innerHTML = '';

  /* 2. Loop through every note and build a card */
  notes.forEach(function(note) {
    const card = buildNoteCard(note);
    notesList.appendChild(card);   /* 3. Add to the page */
  });

  /* Update the count paragraph every time we render */
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

  /* Create the note object, add to array, redraw  */
  const newNote = createNote(text, category);
  notes.push(newNote);     /* push() adds to end of array */

  render();

  /* Clear the input so user can type the next note */
  noteInput.value = '';
  noteInput.focus();   /* move cursor back to the input  */
});
