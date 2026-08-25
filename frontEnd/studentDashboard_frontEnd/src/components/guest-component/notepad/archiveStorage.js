const ARCHIVE_KEY = "notepad_archive";

export function loadArchivedNotes() {
    try {
        const raw = localStorage.getItem(ARCHIVE_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

export function saveArchivedNotes(notes) {
    localStorage.setItem(ARCHIVE_KEY, JSON.stringify(notes));
}

export function addArchivedNote(title, content) {
    const notes = loadArchivedNotes();
    const newNote = {
        id: crypto.randomUUID(),
        title: title.trim(),
        content,
        date: new Date().toISOString().slice(0, 10),
        updatedAt: new Date().toISOString(),
    };
    notes.unshift(newNote);
    saveArchivedNotes(notes);
    return newNote;
}

export function updateArchivedNote(id, updates) {
    const notes = loadArchivedNotes().map((note) =>
        note.id === id
            ? { ...note, ...updates, updatedAt: new Date().toISOString() }
            : note
    );
    saveArchivedNotes(notes);
    return notes;
}

export function deleteArchivedNote(id) {
    const notes = loadArchivedNotes().filter((note) => note.id !== id);
    saveArchivedNotes(notes);
    return notes;
}

export function formatDisplayDate(isoDate) {
    const [year, month, day] = isoDate.split("-");
    const date = new Date(Number(year), Number(month) - 1, Number(day));
    return date.toLocaleDateString(undefined, {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}
