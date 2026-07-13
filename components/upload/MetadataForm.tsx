"use client";

// components/upload/MetadataForm.tsx
// Right pane — title, speakers, tags, language, AI options, submit.

import { useState } from "react";
import { tokens } from "../landing/tokens";
import { Card, Eyebrow } from "./primitives";

// ── Form state shape ─────────────────────────────────────────────────────
export type MetaState = {
  title: string;
  speakers: string[];
  tags: string[];
  language: string;
  summarize: boolean;
  actions: boolean;
  speakerDetect: boolean;
  reminders: boolean;
};

export const META_DEFAULTS: MetaState = {
  title: "",
  speakers: [],
  tags: [],
  language: "auto",
  summarize: true,
  actions: true,
  speakerDetect: true,
  reminders: false,
};

// ── Atoms ────────────────────────────────────────────────────────────────
function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 6 }}>
        <label
          style={{
            fontFamily: "var(--font-geist-mono)",
            fontSize: 10.5,
            color: tokens.textDim,
            letterSpacing: "0.08em",
            fontWeight: 600,
          }}
        >
          {label}
        </label>
        {hint && (
          <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: 10, color: tokens.textMute }}>{hint}</span>
        )}
      </div>
      {children}
    </div>
  );
}

function TextInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        width: "100%",
        background: tokens.surface2,
        border: `1px solid ${tokens.border}`,
        borderRadius: 7,
        padding: "9px 12px",
        color: tokens.text,
        fontFamily: "var(--font-geist-sans)",
        fontSize: 13,
        outline: "none",
        transition: "border-color 0.15s",
      }}
      onFocus={(e) => { e.currentTarget.style.borderColor = tokens.cyan + "55"; }}
      onBlur={(e) => { e.currentTarget.style.borderColor = tokens.border; }}
    />
  );
}

function ChipInput({
  items,
  onAdd,
  onRemove,
  placeholder,
  prefix = "",
  color,
}: {
  items: string[];
  onAdd: (v: string) => void;
  onRemove: (i: number) => void;
  placeholder?: string;
  prefix?: string;
  color?: string;
}) {
  const [draft, setDraft] = useState("");
  const accent = color || tokens.cyan;
  const submit = () => {
    if (draft.trim()) {
      onAdd(draft.trim());
      setDraft("");
    }
  };
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 6,
        padding: "8px 10px",
        background: tokens.surface2,
        border: `1px solid ${tokens.border}`,
        borderRadius: 7,
        minHeight: 38,
        alignItems: "center",
      }}
    >
      {items.map((it, i) => (
        <span
          key={i}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            padding: "3px 4px 3px 9px",
            borderRadius: 99,
            background: `${accent}1a`,
            border: `1px solid ${accent}44`,
            fontFamily: "var(--font-geist-mono)",
            fontSize: 11,
            color: accent,
            letterSpacing: "0.02em",
          }}
        >
          {prefix}{it}
          <button
            onClick={() => onRemove(i)}
            style={{
              width: 16,
              height: 16,
              borderRadius: 99,
              background: "transparent",
              border: "none",
              color: accent,
              cursor: "pointer",
              fontFamily: "var(--font-geist-mono)",
              fontSize: 11,
              display: "grid",
              placeItems: "center",
            }}
          >
            ×
          </button>
        </span>
      ))}
      <input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            submit();
          }
          if (e.key === "Backspace" && !draft && items.length) {
            onRemove(items.length - 1);
          }
        }}
        placeholder={items.length === 0 ? placeholder : ""}
        style={{
          flex: 1,
          minWidth: 120,
          background: "transparent",
          border: "none",
          outline: "none",
          fontFamily: "var(--font-geist-sans)",
          fontSize: 12.5,
          color: tokens.text,
          padding: "4px 2px",
        }}
      />
    </div>
  );
}

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!value)}
      style={{
        width: 34,
        height: 19,
        borderRadius: 99,
        background: value ? tokens.cyan : "#1a1827",
        border: `1px solid ${value ? tokens.cyan : tokens.border}`,
        padding: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: value ? "flex-end" : "flex-start",
        cursor: "pointer",
        transition: "all 0.18s",
        flexShrink: 0,
      }}
    >
      <div
        style={{
          width: 13,
          height: 13,
          borderRadius: 99,
          background: value ? tokens.bg : tokens.textDim,
          transition: "all 0.18s",
        }}
      />
    </button>
  );
}

function OptionRow({
  value,
  onChange,
  label,
  sub,
}: {
  value: boolean;
  onChange: (v: boolean) => void;
  label: string;
  sub: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 12,
        padding: "10px 0",
        borderBottom: `1px solid ${tokens.border}`,
      }}
    >
      <Toggle value={value} onChange={onChange} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: "var(--font-geist-sans)", fontSize: 13, color: tokens.text, fontWeight: 500 }}>
          {label}
        </div>
        <div
          style={{
            fontFamily: "var(--font-geist-sans)",
            fontSize: 11.5,
            color: tokens.textDim,
            marginTop: 2,
            lineHeight: 1.4,
          }}
        >
          {sub}
        </div>
      </div>
    </div>
  );
}

function LanguagePicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const opts = [
    { id: "auto", label: "Auto-detect" },
    { id: "en",   label: "English" },
    { id: "es",   label: "Español" },
    { id: "fr",   label: "Français" },
    { id: "de",   label: "Deutsch" },
    { id: "other",label: "6 langs" },
  ];
  return (
    <div
      style={{
        display: "inline-flex",
        padding: 3,
        background: tokens.surface2,
        border: `1px solid ${tokens.border}`,
        borderRadius: 7,
        gap: 2,
      }}
    >
      {opts.map((o) => (
        <button
          key={o.id}
          onClick={() => onChange(o.id)}
          style={{
            padding: "6px 11px",
            borderRadius: 5,
            background: value === o.id ? `linear-gradient(135deg, ${tokens.violet}22, ${tokens.cyan}22)` : "transparent",
            border: value === o.id ? `1px solid ${tokens.cyan}55` : "1px solid transparent",
            color: value === o.id ? tokens.cyan : tokens.textDim,
            fontFamily: "var(--font-geist-sans)",
            fontSize: 11.5,
            fontWeight: value === o.id ? 600 : 500,
            cursor: "pointer",
            letterSpacing: "-0.005em",
          }}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

// ── Main panel ───────────────────────────────────────────────────────────
export function MetadataForm({
  state,
  set,
  hasSource,
  busy = false,
  error = null,
  onCancel,
  onSubmit,
}: {
  state: MetaState;
  set: (patch: Partial<MetaState>) => void;
  hasSource: boolean;
  busy?: boolean;
  error?: string | null;
  onCancel: () => void;
  onSubmit: () => void;
}) {
  const canSubmit = hasSource && !busy;
  return (
    <Card padding={26}>
      <Eyebrow>// MEETING DETAILS · OPTIONAL</Eyebrow>

      <Field label="TITLE" hint="auto-generated if empty">
        <TextInput value={state.title} onChange={(v) => set({ title: v })} placeholder="Q1 launch sync" />
      </Field>

      <Field label="SPEAKERS" hint="we'll guess if you skip">
        <ChipInput
          items={state.speakers}
          onAdd={(v) => set({ speakers: [...state.speakers, v] })}
          onRemove={(i) => set({ speakers: state.speakers.filter((_, j) => j !== i) })}
          placeholder="Maya · PM, Devon · Eng…"
          color={tokens.violet}
        />
      </Field>

      <Field label="TAGS">
        <ChipInput
          items={state.tags}
          onAdd={(v) => set({ tags: [...state.tags, v] })}
          onRemove={(i) => set({ tags: state.tags.filter((_, j) => j !== i) })}
          placeholder="launch, q1, onboarding…"
          prefix="#"
          color={tokens.cyan}
        />
      </Field>

      <Field label="LANGUAGE">
        <LanguagePicker value={state.language} onChange={(v) => set({ language: v })} />
      </Field>

      <div style={{ height: 1, background: tokens.border, margin: "24px 0 20px" }} />

      <Eyebrow accent={tokens.cyan}>// AI PROCESSING</Eyebrow>

      <OptionRow
        value={state.summarize}
        onChange={(v) => set({ summarize: v })}
        label="Summarize meeting"
        sub="TL;DR + key decisions + topics. Costs ~$0.02 / 10 min."
      />
      <OptionRow
        value={state.actions}
        onChange={(v) => set({ actions: v })}
        label="Extract action items"
        sub="Tasks with owner + due date. Required for daily reminders."
      />
      <OptionRow
        value={state.speakerDetect}
        onChange={(v) => set({ speakerDetect: v })}
        label="Detect speakers"
        sub="Auto-label who said what. Falls back to Speaker 1/2/3."
      />
      <OptionRow
        value={state.reminders}
        onChange={(v) => set({ reminders: v })}
        label="Email reminders for open actions"
        sub="Daily nudge until each action is checked off."
      />



      <div style={{ marginTop: 22, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
        <button
          onClick={onCancel}
          style={{
            background: "transparent",
            border: `1px solid ${tokens.border}`,
            color: tokens.textDim,
            padding: "11px 16px",
            borderRadius: 8,
            fontFamily: "var(--font-geist-sans)",
            fontSize: 13.5,
            cursor: "pointer",
          }}
        >
          Cancel
        </button>

        <button
          onClick={onSubmit}
          disabled={!canSubmit}
          style={{
            flex: 1,
            background: canSubmit ? tokens.text : tokens.surface2,
            color: canSubmit ? tokens.bg : tokens.textMute,
            border: canSubmit ? "none" : `1px solid ${tokens.border}`,
            padding: "11px 18px",
            borderRadius: 8,
            fontFamily: "var(--font-geist-sans)",
            fontSize: 14,
            fontWeight: 500,
            cursor: canSubmit ? "pointer" : "not-allowed",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            boxShadow: canSubmit ? `0 8px 20px ${tokens.cyan}25` : "none",
          }}
        >
          {busy ? "Analyzing…" : hasSource ? "Analyze meeting" : "Add a source first"}
          {canSubmit && <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: 12 }}>→</span>}
        </button>
      </div>

      {error && (
        <div
          style={{
            marginTop: 14,
            padding: "10px 12px",
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

      <div
        style={{
          marginTop: 14,
          fontFamily: "var(--font-geist-mono)",
          fontSize: 10.5,
          color: tokens.textMute,
          textAlign: "center",
          letterSpacing: "0.04em",
        }}
      >
        ⏎ TO ANALYZE · ⌘S TO SAVE DRAFT · ⎋ TO CANCEL
      </div>
    </Card>
  );
}
