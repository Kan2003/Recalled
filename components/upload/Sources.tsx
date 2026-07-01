"use client";

// components/upload/Sources.tsx
// Source tab strip + the four source panes (audio / paste / record / url).
// Each pane is self-contained — the parent supplies the value + setter.

import { useRef, useState } from "react";
import { tokens } from "../landing/tokens";

// ── Types ────────────────────────────────────────────────────────────────
export type SourceKind = "audio" | "paste" | "record" | "url";
export type SelectedFile = { name: string; size: string; duration: string };

// ── Icons (inline so no icon-library dep) ────────────────────────────────
const MicIcon = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2a3 3 0 00-3 3v7a3 3 0 006 0V5a3 3 0 00-3-3z" />
    <path d="M19 10v2a7 7 0 01-14 0v-2M12 19v4M8 23h8" />
  </svg>
);
const PasteIcon = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="8" y="2" width="8" height="4" rx="1" />
    <path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2" />
  </svg>
);
const RecordIcon = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="3.5" fill="currentColor" />
  </svg>
);
const LinkIcon = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 14a5 5 0 007.07 0l3-3a5 5 0 00-7.07-7.07l-1.72 1.72" />
    <path d="M14 10a5 5 0 00-7.07 0l-3 3a5 5 0 007.07 7.07l1.72-1.72" />
  </svg>
);

// ── Tab strip ────────────────────────────────────────────────────────────
function SourceTab({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "10px 12px",
        background: active ? `linear-gradient(135deg, ${tokens.violet}1a, ${tokens.cyan}1a)` : "transparent",
        border: active ? `1px solid ${tokens.cyan}55` : "1px solid transparent",
        borderRadius: 8,
        color: active ? tokens.text : tokens.textDim,
        fontFamily: "var(--font-geist-sans)",
        fontSize: 12.5,
        fontWeight: 500,
        letterSpacing: "-0.005em",
        cursor: "pointer",
        transition: "all 0.15s",
        textAlign: "left",
      }}
      onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = "rgba(255,255,255,0.025)"; }}
      onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = "transparent"; }}
    >
      <span style={{ color: active ? tokens.cyan : tokens.textMute, display: "grid", placeItems: "center", width: 16, height: 16 }}>
        {icon}
      </span>
      <span>{label}</span>
    </button>
  );
}

export function SourceTabs({ active, onChange }: { active: SourceKind; onChange: (k: SourceKind) => void }) {
  return (
    <div
      style={{
        display: "flex",
        gap: 4,
        padding: 4,
        background: tokens.surface2,
        border: `1px solid ${tokens.border}`,
        borderRadius: 10,
        marginBottom: 18,
      }}
    >
      <SourceTab icon={MicIcon}    label="Upload audio"     active={active === "audio"}   onClick={() => onChange("audio")} />
      <SourceTab icon={PasteIcon}  label="Paste transcript" active={active === "paste"}   onClick={() => onChange("paste")} />
      <SourceTab icon={RecordIcon} label="Record now"       active={active === "record"}  onClick={() => onChange("record")} />
      <SourceTab icon={LinkIcon}   label="From URL"         active={active === "url"}     onClick={() => onChange("url")} />
    </div>
  );
}

// ── AUDIO SOURCE ─────────────────────────────────────────────────────────
export function AudioSource({
  file,
  onFileChange,
}: {
  file: SelectedFile | null;
  onFileChange: (f: SelectedFile | null) => void;
}) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Convert a real File → display object. Real impl uploads to /api/transcribe.
  const handleFile = (f: File | undefined) => {
    if (!f) return;
    onFileChange({
      name: f.name,
      size: (f.size / 1024 / 1024).toFixed(1) + " MB",
      duration: "—", // populated by server once probed
    });
  };

  return (
    <>
      {!file && (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            handleFile(e.dataTransfer.files?.[0]);
          }}
          style={{
            border: `2px dashed ${dragging ? tokens.cyan : tokens.borderStrong}`,
            borderRadius: 14,
            padding: "52px 24px",
            background: dragging
              ? `linear-gradient(135deg, ${tokens.violet}14, ${tokens.cyan}14)`
              : `linear-gradient(180deg, ${tokens.surface} 0%, ${tokens.bg} 100%)`,
            textAlign: "center",
            cursor: "pointer",
            transition: "all 0.18s",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: 280,
              height: 280,
              borderRadius: 99,
              transform: "translate(-50%, -50%)",
              background: `radial-gradient(circle, ${tokens.cyan}10 0%, transparent 70%)`,
              pointerEvents: "none",
              opacity: dragging ? 1 : 0.5,
            }}
          />
          <div style={{ position: "relative" }}>
            <div
              style={{
                width: 56,
                height: 56,
                margin: "0 auto 18px",
                borderRadius: 14,
                background: `linear-gradient(135deg, ${tokens.violet}22, ${tokens.cyan}22)`,
                border: `1px solid ${tokens.cyan}44`,
                display: "grid",
                placeItems: "center",
                color: tokens.cyan,
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a3 3 0 00-3 3v7a3 3 0 006 0V5a3 3 0 00-3-3z" />
                <path d="M19 10v2a7 7 0 01-14 0v-2M12 19v4M8 23h8" />
              </svg>
            </div>
            <div
              style={{
                fontFamily: "var(--font-geist-sans)",
                fontSize: 20,
                fontWeight: 600,
                color: tokens.text,
                letterSpacing: "-0.02em",
                marginBottom: 6,
              }}
            >
              {dragging ? "Drop to upload" : "Drop your recording here"}
            </div>
            <div
              style={{
                fontFamily: "var(--font-geist-sans)",
                fontSize: 13.5,
                color: tokens.textDim,
                marginBottom: 20,
              }}
            >
              or click to browse · paste with ⌘V
            </div>
            <button
              type="button"
              style={{
                background: tokens.text,
                color: tokens.bg,
                border: "none",
                padding: "9px 18px",
                borderRadius: 8,
                fontFamily: "var(--font-geist-sans)",
                fontSize: 13,
                fontWeight: 500,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              Browse files
              <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: 11 }}>→</span>
            </button>
            <div
              style={{
                marginTop: 22,
                fontFamily: "var(--font-geist-mono)",
                fontSize: 10.5,
                color: tokens.textMute,
                letterSpacing: "0.04em",
              }}
            >
              MP3 · WAV · M4A · WEBM · MP4 · UP TO 500 MB · 6 LANGUAGES
            </div>
          </div>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="audio/*,video/*"
        style={{ display: "none" }}
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      {file && (
        <div
          style={{
            border: `1px solid ${tokens.cyan}55`,
            borderRadius: 12,
            padding: 16,
            background: `linear-gradient(135deg, ${tokens.violet}0c, ${tokens.cyan}0c)`,
            display: "flex",
            alignItems: "center",
            gap: 14,
            marginBottom: 16,
          }}
        >
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: 10,
              background: `linear-gradient(135deg, ${tokens.violet}, ${tokens.cyan})`,
              display: "grid",
              placeItems: "center",
              color: tokens.bg,
              flexShrink: 0,
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <path d="M9 18V5l12-2v13" />
              <circle cx="6" cy="18" r="3" />
              <circle cx="18" cy="16" r="3" />
            </svg>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontFamily: "var(--font-geist-sans)",
                fontSize: 14,
                color: tokens.text,
                fontWeight: 500,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {file.name}
            </div>
            <div
              style={{
                fontFamily: "var(--font-geist-mono)",
                fontSize: 11,
                color: tokens.textDim,
                marginTop: 3,
                letterSpacing: "0.02em",
              }}
            >
              {file.duration} · {file.size} ·
              <span style={{ color: "#34d399", marginLeft: 4 }}>READY TO ANALYZE</span>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "end", gap: 2, height: 26 }}>
            {Array.from({ length: 36 }).map((_, i) => {
              const h = 4 + Math.abs(Math.sin(i * 0.55) + Math.sin(i * 0.27)) * 10;
              return (
                <div
                  key={i}
                  style={{
                    width: 2.5,
                    height: `${h}px`,
                    background: `linear-gradient(180deg, ${tokens.cyan} 0%, ${tokens.violet} 100%)`,
                    borderRadius: 1.5,
                    opacity: 0.85,
                  }}
                />
              );
            })}
          </div>
          <button
            onClick={() => onFileChange(null)}
            title="Remove"
            style={{
              background: "transparent",
              border: `1px solid ${tokens.border}`,
              width: 28,
              height: 28,
              borderRadius: 6,
              color: tokens.textDim,
              cursor: "pointer",
              display: "grid",
              placeItems: "center",
              fontFamily: "var(--font-geist-mono)",
              fontSize: 13,
            }}
          >
            ×
          </button>
        </div>
      )}

      {/* Recent files */}
      <div>
        <div
          style={{
            fontFamily: "var(--font-geist-mono)",
            fontSize: 10.5,
            color: tokens.textMute,
            letterSpacing: "0.08em",
            marginBottom: 10,
          }}
        >
          // RECENT FROM YOUR DEVICE
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {[
            { name: "standup_03.wav",  size: "12 MB", dur: "18:42" },
            { name: "design_crit.m4a", size: "47 MB", dur: "52:04" },
            { name: "1on1_dana.mp3",   size: "21 MB", dur: "28:15" },
          ].map((f) => (
            <button
              key={f.name}
              onClick={() => onFileChange({ name: f.name, size: f.size, duration: f.dur })}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "7px 11px",
                borderRadius: 8,
                background: "transparent",
                border: `1px solid ${tokens.border}`,
                color: tokens.textDim,
                fontFamily: "var(--font-geist-mono)",
                fontSize: 11.5,
                cursor: "pointer",
                transition: "all 0.15s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = tokens.cyan + "55";
                e.currentTarget.style.color = tokens.text;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = tokens.border;
                e.currentTarget.style.color = tokens.textDim;
              }}
            >
              <span style={{ color: tokens.cyan }}>♪</span>
              <span>{f.name}</span>
              <span style={{ color: tokens.textMute, fontSize: 10 }}>· {f.dur}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

// ── PASTE SOURCE ─────────────────────────────────────────────────────────
export function PasteSource({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0;
  return (
    <div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Paste your raw transcript here. Multiple speakers? Use 'Name: ...' on each line and we'll detect speakers automatically."
        style={{
          width: "100%",
          minHeight: 280,
          background: tokens.surface2,
          border: `1px solid ${tokens.border}`,
          borderRadius: 12,
          padding: 18,
          color: tokens.text,
          fontFamily: "var(--font-geist-mono)",
          fontSize: 13,
          lineHeight: 1.6,
          outline: "none",
          resize: "vertical",
        }}
      />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: 12,
          fontFamily: "var(--font-geist-mono)",
          fontSize: 11,
          color: tokens.textMute,
          letterSpacing: "0.02em",
        }}
      >
        <span>
          TIP: format as <span style={{ color: tokens.cyan }}>Name: line</span> for speaker detection
        </span>
        <span>
          {wordCount} WORDS · ~{Math.ceil(wordCount / 130)} MIN READ
        </span>
      </div>
    </div>
  );
}

// ── RECORD SOURCE ────────────────────────────────────────────────────────
// Placeholder for the in-browser recorder. Real impl: getUserMedia + MediaRecorder.
export function RecordSource() {
  return (
    <div
      style={{
        border: `1px dashed ${tokens.borderStrong}`,
        borderRadius: 14,
        padding: "52px 24px",
        textAlign: "center",
        background: tokens.surface,
      }}
    >
      <div
        style={{
          width: 84,
          height: 84,
          margin: "0 auto 20px",
          borderRadius: 99,
          background: `linear-gradient(135deg, #ef444422, ${tokens.violet}22)`,
          border: "1.5px solid #ef444444",
          display: "grid",
          placeItems: "center",
          color: "#ef4444",
          boxShadow: "0 0 30px #ef444433",
        }}
      >
        <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2a3 3 0 00-3 3v7a3 3 0 006 0V5a3 3 0 00-3-3z" />
          <path d="M19 10v2a7 7 0 01-14 0v-2M12 19v4M8 23h8" />
        </svg>
      </div>
      <div
        style={{
          fontFamily: "var(--font-geist-sans)",
          fontSize: 20,
          fontWeight: 600,
          color: tokens.text,
          letterSpacing: "-0.02em",
          marginBottom: 8,
        }}
      >
        Record from your microphone
      </div>
      <div
        style={{
          fontFamily: "var(--font-geist-sans)",
          fontSize: 13.5,
          color: tokens.textDim,
          marginBottom: 20,
          maxWidth: 380,
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        We&apos;ll capture audio in your browser and stream it to Whisper as you record. Hit stop and we analyze.
      </div>
      <button
        style={{
          background: "#ef4444",
          color: tokens.text,
          border: "none",
          padding: "11px 22px",
          borderRadius: 99,
          fontFamily: "var(--font-geist-sans)",
          fontSize: 13.5,
          fontWeight: 500,
          cursor: "pointer",
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          boxShadow: "0 8px 20px #ef444440",
        }}
      >
        <span style={{ width: 8, height: 8, borderRadius: 99, background: tokens.text }} />
        Start recording
      </button>
      <div
        style={{
          marginTop: 18,
          fontFamily: "var(--font-geist-mono)",
          fontSize: 10.5,
          color: tokens.textMute,
          letterSpacing: "0.04em",
        }}
      >
        REQUIRES MICROPHONE PERMISSION
      </div>
    </div>
  );
}

// ── URL SOURCE ───────────────────────────────────────────────────────────
export function URLSource({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "14px 16px",
          background: tokens.surface2,
          border: `1px solid ${tokens.border}`,
          borderRadius: 12,
          marginBottom: 14,
        }}
      >
        <span style={{ color: tokens.textMute }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 14a5 5 0 007.07 0l3-3a5 5 0 00-7.07-7.07l-1.72 1.72" />
            <path d="M14 10a5 5 0 00-7.07 0l-3 3a5 5 0 007.07 7.07l1.72-1.72" />
          </svg>
        </span>
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://meet.google.com/… or paste a Loom / Zoom link"
          style={{
            flex: 1,
            background: "transparent",
            border: "none",
            outline: "none",
            fontFamily: "var(--font-geist-mono)",
            fontSize: 13,
            color: tokens.text,
          }}
        />
        <button
          style={{
            background: tokens.text,
            color: tokens.bg,
            border: "none",
            padding: "6px 14px",
            borderRadius: 6,
            fontFamily: "var(--font-geist-sans)",
            fontSize: 12,
            fontWeight: 500,
            cursor: "pointer",
          }}
        >
          Fetch
        </button>
      </div>
      <div
        style={{
          fontFamily: "var(--font-geist-mono)",
          fontSize: 10.5,
          color: tokens.textMute,
          letterSpacing: "0.08em",
          marginBottom: 10,
        }}
      >
        // SUPPORTED
      </div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {["Google Meet", "Zoom recordings", "Loom", "YouTube", "Direct audio URL"].map((s) => (
          <span
            key={s}
            style={{
              padding: "6px 11px",
              borderRadius: 99,
              background: tokens.surface,
              border: `1px solid ${tokens.border}`,
              fontFamily: "var(--font-geist-mono)",
              fontSize: 10.5,
              color: tokens.textDim,
              letterSpacing: "0.02em",
            }}
          >
            {s}
          </span>
        ))}
      </div>
    </div>
  );
}
