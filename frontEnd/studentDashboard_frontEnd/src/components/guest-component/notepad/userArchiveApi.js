const ARCHIVED_NOTES_URL = "http://localhost:8080/api/context/archived-notes";

async function request(url = ARCHIVED_NOTES_URL, options = {}) {
    const token = localStorage.getItem("token");
    const response = await fetch(url, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            ...options.headers,
        },
    });

    if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Archived note request failed");
    }

    return response.status === 204 ? null : response.json();
}

export function loadUserArchivedNotes() {
    return request();
}

export function createUserArchivedNote(title, content) {
    return request(ARCHIVED_NOTES_URL, {
        method: "POST",
        body: JSON.stringify({ title, content }),
    });
}

export function updateUserArchivedNote(id, updates) {
    return request(`${ARCHIVED_NOTES_URL}/${id}`, {
        method: "PUT",
        body: JSON.stringify(updates),
    });
}

export function deleteUserArchivedNote(id) {
    return request(`${ARCHIVED_NOTES_URL}/${id}`, { method: "DELETE" });
}
