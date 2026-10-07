"use client";

// components/dashboard/DeleteMeetingButton.tsx
// "Delete" button + confirm dialog, shared by the dashboard detail pane and
// the full meeting page. Deletes the meeting (and its action items) from the
// database, clears its saved Ask AI chat, then calls `onDeleted` so the
// caller can update its list or navigate away.

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { tokens } from "../landing/tokens";
import { TrashIcon } from "./Icons";
import { askStorageKey } from "@/lib/exportMeeting";

const DANGER = "#f87171";

export function DeleteMeetingButton({
  meetingId,
  meetingTitle,
  onDeleted,
}: {
  meetingId: string;
  meetingTitle: string;
  onDeleted: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const close = () => {
    if (busy) return;
    setOpen(false);
    setError(null);
  };

  // Escape closes the dialog (but not while a delete is in flight).
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !busy) {
        setOpen(false);
        setError(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, busy]);

  const confirmDelete = async () => {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/meetings/${meetingId}`, { method: "DELETE" });
      // 404 means it's already gone (e.g. deleted in another tab) — treat as done.
      if (!res.ok && res.status !== 404) throw new Error("Couldn't delete the meeting, please try again.");

      try {
        localStorage.removeItem(askStorageKey(meetingId));
      } catch {
        // Storage unavailable — nothing to clean up.
      }

      setOpen(false);
      setBusy(false);
      onDeleted();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setBusy(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        title="Delete meeting"
        style={{
          background: "transparent",
          color: DANGER,
          border: `1px solid ${DANGER}44`,
          padding: "7px 12px",
          borderRadius: 7,
          fontFamily: "var(--font-geist-sans)",
          fontSize: 12.5,
          cursor: "pointer",
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        <TrashIcon />
        Delete
      </button>

      {/* Portaled to <body> so no pane's overflow/transform can clip the overlay. */}
      {open && createPortal(
        <div
          onClick={close}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100,
            background: "rgba(5, 4, 10, 0.72)",
            display: "grid",
            placeItems: "center",
            padding: 16,
          }}
        >
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-meeting-title"
            aria-describedby="delete-meeting-desc"
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: 420,
              background: tokens.surface,
              border: `1px solid ${tokens.borderStrong}`,
              borderRadius: 12,
              padding: 22,
              boxShadow: "0 24px 60px rgba(0,0,0,0.5)",
            }}
          >
            <h3
              id="delete-meeting-title"
              style={{
                margin: 0,
                fontFamily: "var(--font-geist-sans)",
                fontSize: 17,
                fontWeight: 600,
                letterSpacing: "-0.01em",
                color: tokens.text,
              }}
            >
              Delete this meeting?
            </h3>
            <p
              id="delete-meeting-desc"
              style={{
                margin: "10px 0 0",
                fontFamily: "var(--font-geist-sans)",
                fontSize: 13.5,
                lineHeight: 1.55,
                color: tokens.textDim,
              }}
            >
              <span style={{ color: tokens.text, fontWeight: 500 }}>{meetingTitle}</span> will be permanently
              deleted, along with its transcript, summary, decisions, action items and Ask AI chat. This can&apos;t
              be undone.
            </p>

            {error && (
              <div
                style={{
                  marginTop: 14,
                  padding: "9px 11px",
                  background: "#f8717115",
                  border: "1px solid #f8717144",
                  borderRadius: 8,
                  fontFamily: "var(--font-geist-mono)",
                  fontSize: 11.5,
                  color: "#fca5a5",
                  lineHeight: 1.45,
                }}
              >
                {error}
              </div>
            )}

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 20 }}>
              <button
                onClick={close}
                disabled={busy}
                autoFocus
                style={{
                  background: "transparent",
                  border: `1px solid ${tokens.border}`,
                  color: tokens.textDim,
                  padding: "9px 14px",
                  borderRadius: 8,
                  fontFamily: "var(--font-geist-sans)",
                  fontSize: 13,
                  cursor: busy ? "not-allowed" : "pointer",
                }}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={busy}
                style={{
                  background: busy ? tokens.surface2 : DANGER,
                  color: busy ? tokens.textMute : tokens.bg,
                  border: "none",
                  padding: "9px 14px",
                  borderRadius: 8,
                  fontFamily: "var(--font-geist-sans)",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: busy ? "not-allowed" : "pointer",
                }}
              >
                {busy ? "Deleting…" : "Delete meeting"}
              </button>
            </div>
          </div>
        </div>,
        document.body,
      )}
    </>
  );
}
