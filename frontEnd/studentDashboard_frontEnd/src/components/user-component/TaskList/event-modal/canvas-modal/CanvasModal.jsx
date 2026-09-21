import { useState } from "react";
import "./CanvasModal.css";

function CanvasModal({ isOpen, onClose, onSyncComplete }) {
  const [calendarUrl, setCalendarUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleSync = async () => {
    const trimmed = calendarUrl.trim();
    if (!trimmed) {
      setError("Enter a calendar URL");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:8080/api/canvas-events/sync-and-override",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ url: trimmed }),
        },
      );

      if (!response.ok) {
        setError(
          response.status === 422
            ? "No events could be imported from this calendar."
            : "Sync failed. Check the URL and try again.",
        );
        return;
      }

      if (response.status === 204) {
        if (onSyncComplete) await onSyncComplete();
        onClose();
        setCalendarUrl("");
        return;
      }

      await response.json();
      if (onSyncComplete) await onSyncComplete();
      onClose();
      setCalendarUrl("");
    } catch (networkError) {
      console.error("Canvas calendar sync failed:", networkError);
      setError("Cannot reach the server. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setError(null);
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:8080/api/canvas-events/refresh",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok && response.status !== 204) {
        setError(
          response.status === 409
            ? "Enter a calendar link before refreshing."
            : "Refresh failed. Try again.",
        );
        return;
      }

      if (onSyncComplete) await onSyncComplete();
      onClose();
    } catch (networkError) {
      console.error("Canvas calendar refresh failed:", networkError);
      setError("Cannot reach the server. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="canvas-modal-wrapper">
      <div className="canvas-modal-container">
        <span className="input-container">
          <input
            className="input-link"
            type="url"
            placeholder="Enter Calendar Link"
            aria-label="Canvas calendar link"
            value={calendarUrl}
            onChange={(e) => setCalendarUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSync();
            }}
            disabled={loading}
          />
        </span>

        <span className="input-container-button">
          <button
            type="button"
            className="input-send"
            onClick={handleSync}
            disabled={loading}
            aria-busy={loading}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M7.5 7.5h-.75A2.25 2.25 0 0 0 4.5 9.75v7.5a2.25 2.25 0 0 0 2.25 2.25h7.5a2.25 2.25 0 0 0 2.25-2.25v-7.5a2.25 2.25 0 0 0-2.25-2.25h-.75m-6 3.75 3 3m0 0 3-3m-3 3V1.5m6 9h.75a2.25 2.25 0 0 1 2.25 2.25v7.5a2.25 2.25 0 0 1-2.25 2.25h-7.5a2.25 2.25 0 0 1-2.25-2.25v-.75"
              />
            </svg>
            Enter
          </button>
          <button
            type="button"
            className="input-refresh"
            onClick={handleRefresh}
            disabled={loading}
            aria-busy={loading}
            title="Refresh saved Canvas calendar"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.023 9.348h4.992V4.356m-.97 11.679A9 9 0 1 1 20.49 9"
              />
            </svg>
            Refresh
          </button>
          <button
            type="button"
            className="input-close"
            onClick={() => onClose()}
            disabled={loading}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
            Close
          </button>
        </span>
      </div>
      {error ? <p className="canvas-modal-error">{error}</p> : null}
    </div>
  );
}

export default CanvasModal;
