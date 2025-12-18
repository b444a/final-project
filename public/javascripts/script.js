// =====================
// DOM ELEMENTS
// =====================
const introScreen = document.getElementById('introScreen');
const writeScreen = document.getElementById('writeScreen');
const archiveScreen = document.getElementById('archiveScreen');

const startWritingBtn = document.getElementById('startWriting');
const goArchiveFromIntro = document.getElementById('goArchiveFromIntro');
const backFromWrite = document.getElementById('backFromWrite');
const backFromArchive = document.getElementById('backFromArchive');

const introPromptEl = document.getElementById('introPrompt');
const activePromptEl = document.getElementById('activePrompt');
const entryForm = document.getElementById('entryForm');

const messageInput = document.getElementById('messageInput');
const tagSelect = document.getElementById('tagSelect');
const timeframeSelect = document.getElementById('timeframeSelect');

const envelopeGrid = document.getElementById('envelopeGrid');
const filterButtons = document.querySelectorAll('.filter-btn');

// Modal
const modal = document.getElementById('letterModal');
const modalPrompt = document.getElementById('modalPrompt');
const modalMeta = document.getElementById('modalMeta');
const modalMessage = document.getElementById('modalMessage');
const closeModal = document.getElementById('closeModal');

// Write envelope
const writeEnvelope = document.getElementById('writeEnvelope');

// =====================
// PROMPTS (UNCHANGED)
// =====================
const PROMPTS = [
  "What do you hope future-you remembers from right now?",
  "What would you thank your future self for?",
  "What is one promise you want to make to future-you?",
  "What are you afraid of forgetting?",
  "What part of yourself are you learning to accept?",
  "What dream do you hope you didn’t give up on?"
];

// =====================
// HELPERS
// =====================
function showScreen(screen) {
  introScreen.classList.add('hidden');
  writeScreen.classList.add('hidden');
  archiveScreen.classList.add('hidden');
  screen.classList.remove('hidden');
}

function randomPrompt() {
  return PROMPTS[Math.floor(Math.random() * PROMPTS.length)];
}

/**
 * 🔒 CRITICAL FIX
 * Convert UI tags → schema-safe tags
 */
function normalizeTag(tag) {
  const map = {
    'future advice': 'advice',
    'a little chaotic': 'reflective'
  };
  return map[tag] || tag || 'other';
}

function getSafePrompt() {
  return activePromptEl.textContent?.trim() || randomPrompt();
}

// =====================
// NAVIGATION
// =====================
startWritingBtn.addEventListener('click', () => {
  const prompt = randomPrompt();
  activePromptEl.textContent = prompt;
  introPromptEl.textContent = prompt;
  showScreen(writeScreen);
  writeEnvelope.classList.add('open');
});

goArchiveFromIntro.addEventListener('click', async () => {
  showScreen(archiveScreen);
  await loadEntries('all');
});

backFromWrite.addEventListener('click', () => {
  showScreen(introScreen);
  writeEnvelope.classList.remove('open', 'seal', 'sealed');
});

backFromArchive.addEventListener('click', () => {
  showScreen(introScreen);
});

// =====================
// FORM SUBMIT (SAFE)
// =====================
entryForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const message = messageInput.value.trim();
  if (!message) {
    alert('Write something to your future self first ✨');
    return;
  }

  const payload = {
    message,
    prompt: getSafePrompt(),
    tag: normalizeTag(tagSelect.value),
    timeframe: timeframeSelect.value || 'sometime',
  };

  try {
    const res = await fetch('/entries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error('Save failed');
    }

    // Envelope animation
    writeEnvelope.classList.remove('open');
    writeEnvelope.classList.add('sealed');

    setTimeout(async () => {
      messageInput.value = '';
      writeEnvelope.classList.remove('sealed');
      showScreen(archiveScreen);
      await loadEntries('all');
    }, 700);

  } catch (err) {
    console.error(err);

    // Gentle UX-safe message
    activePromptEl.textContent =
      "Something went wrong — please try again. Your words are safe.";
  }
});

// =====================
// LOAD ENTRIES
// =====================
async function loadEntries(tag = 'all') {
  try {
    const url =
      tag && tag !== 'all'
        ? `/entries?tag=${encodeURIComponent(tag)}`
        : '/entries';

    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch entries');

    const entries = await res.json();
    envelopeGrid.innerHTML = '';

    entries.forEach((entry) => {
      const card = document.createElement('div');
      card.className = 'envelope-card';

      const envelope = document.createElement('div');
      envelope.className = 'archive-envelope';
      envelope.dataset.id = entry._id;
      envelope.dataset.tag = entry.tag || 'other';

      envelope.innerHTML = `
        <div class="envelope-flap"></div>
        <div class="envelope-body"></div>
      `;

      envelope.addEventListener('click', () => openLetter(entry._id));
      card.appendChild(envelope);
      envelopeGrid.appendChild(card);
    });

  } catch (err) {
    console.error(err);
    alert('Error loading archive.');
  }
}

// =====================
// OPEN LETTER MODAL
// =====================
async function openLetter(id) {
  try {
    const res = await fetch(`/entries/${id}`);
    if (!res.ok) throw new Error('Failed to load letter');

    const entry = await res.json();

    modalPrompt.textContent = entry.prompt || '';
    modalMeta.textContent = `${entry.tag || 'other'} • for ${entry.timeframe || 'sometime'}`;
    modalMessage.textContent = entry.message || '';

    modal.classList.remove('hidden');
  } catch (err) {
    console.error(err);
    alert('Error opening this letter.');
  }
}

// =====================
// MODAL CLOSE
// =====================
closeModal.addEventListener('click', () => {
  modal.classList.add('hidden');
});

modal.addEventListener('click', (e) => {
  if (e.target === modal) modal.classList.add('hidden');
});

// =====================
// FILTER BUTTONS
// =====================
filterButtons.forEach((btn) => {
  btn.addEventListener('click', async () => {
    filterButtons.forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    await loadEntries(btn.dataset.tag);
  });
});


