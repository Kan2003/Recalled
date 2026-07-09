"use client";

// components/upload/ReviewPanel.tsx
// STEP 3 — shows the AI analysis before it's saved. Everything here is
// editable: the user can fix the summary, drop a bad decision, or correct
// an action item's owner/due date before it's persisted to the database.

import { useState } from "react";
import { tokens } from "../landing/tokens";
import { Card, Eyebrow } from "./primitives";

export type ReviewActionItem = { task: string; owner: string | null; dueDate: string | null };

export type AnalysisResult = {
  summary: string;
  decisions: string[];
  topics: string[];
  actionItems: ReviewActionItem[];
};

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontFamily: "var(--font-geist-mono)",
        fontSize: 10.5,
        color: tokens.textDim,
        letterSpacing: "0.08em",
        fontWeight: 600,
        marginBottom: 10,
      }}
    >
      {children}
    </div>
  );
}

function RemoveButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      title="Remove"
      style={{
        width: 22,
        height: 22,
        borderRadius: 6,
        background: "transparent",
        border: `1px solid ${tokens.border}`,
        color: tokens.textMute,
        cursor: "pointer",
        flexShrink: 0,
        display: "grid",
        placeItems: "center",
        fontFamily: "var(--font-geist-mono)",
        fontSize: 12,
      }}
    >
      ×
    </button>
  );
}

function inputStyle(): React.CSSProperties {
  return {
    background: tokens.surface2,
    border: `1px solid ${tokens.border}`,
    borderRadius: 7,
    padding: "8px 10px",
    color: tokens.text,
    fontFamily: "var(--font-geist-sans)",
    fontSize: 12.5,
    outline: "none",
    width: "100%",
  };
}

export function ReviewPanel({
  title,
  analysis,
  onChange,
  includeSummary,
  includeActions,
  busy,
  error,
  onBack,
  onConfirm,
}: {
  title: string;
  analysis: AnalysisResult;
  onChange: (next: AnalysisResult) => void;
  includeSummary: boolean;
  includeActions: boolean;
  busy: boolean;
  error: string | null;
  onBack: () => void;
  onConfirm: () => void;
}) {
  const [topicDraft, setTopicDraft] = useState("");

  const updateDecision = (i: number, text: string) => {
    onChange({ ...analysis, decisions: analysis.decisions.map((d, j) => (j === i ? text : d)) });
  };
  const removeDecision = (i: number) => {
    onChange({ ...analysis, decisions: analysis.decisions.filter((_, j) => j !== i) });
  };
  const addDecision = () => {
    onChange({ ...analysis, decisions: [...analysis.decisions, ""] });
  };

  const updateAction = (i: number, patch: Partial<ReviewActionItem>) => {
    onChange({
      ...analysis,
      actionItems: analysis.actionItems.map((a, j) => (j === i ? { ...a, ...patch } : a)),
    });
  };
  const removeAction = (i: number) => {
    onChange({ ...analysis, actionItems: analysis.actionItems.filter((_, j) => j !== i) });
  };
  const addAction = () => {
    onChange({ ...analysis, actionItems: [...analysis.actionItems, { task: "", owner: null, dueDate: null }] });
  };

  const removeTopic = (i: number) => {
    onChange({ ...analysis, topics: analysis.topics.filter((_, j) => j !== i) });
  };
  const addTopic = () => {
    if (!topicDraft.trim()) return;
    onChange({ ...analysis, topics: [...analysis.topics, topicDraft.trim()] });
    setTopicDraft("");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {includeSummary && (
        <Card padding={22}>
          <Eyebrow>// TL;DR — {title || "Untitled meeting"}</Eyebrow>
          <textarea
            value={analysis.summary}
            onChange={(e) => onChange({ ...analysis, summary: e.target.value })}
            rows={4}
            style={{
              width: "100%",
              resize: "vertical",
              background: tokens.surface2,
              border: `1px solid ${tokens.border}`,
              borderRadius: 8,
              padding: "10px 12px",
              color: tokens.text,
              fontFamily: "var(--font-geist-sans)",
              fontSize: 13.5,
              lineHeight: 1.5,
              outline: "none",
            }}
          />
        </Card>
      )}

      {includeSummary && (
        <Card padding={22}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <Eyebrow accent={tokens.cyan}>// KEY DECISIONS</Eyebrow>
            <button
              onClick={addDecision}
              style={{
                background: "transparent",
                border: `1px solid ${tokens.border}`,
                color: tokens.textDim,
                borderRadius: 6,
                padding: "4px 9px",
                fontFamily: "var(--font-geist-mono)",
                fontSize: 10.5,
                cursor: "pointer",
              }}
            >
              + add
            </button>
          </div>
          {analysis.decisions.length === 0 ? (
            <div style={{ color: tokens.textMute, fontFamily: "var(--font-geist-mono)", fontSize: 11.5 }}>
              No decisions extracted.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {analysis.decisions.map((d, i) => (
                <div key={i} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <input value={d} onChange={(e) => updateDecision(i, e.target.value)} style={inputStyle()} />
                  <RemoveButton onClick={() => removeDecision(i)} />
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {includeActions && (
        <Card padding={22}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <Eyebrow accent={tokens.violet}>// ACTION ITEMS</Eyebrow>
            <button
              onClick={addAction}
              style={{
                background: "transparent",
                border: `1px solid ${tokens.border}`,
                color: tokens.textDim,
                borderRadius: 6,
                padding: "4px 9px",
                fontFamily: "var(--font-geist-mono)",
                fontSize: 10.5,
                cursor: "pointer",
              }}
            >
              + add
            </button>
          </div>
          {analysis.actionItems.length === 0 ? (
            <div style={{ color: tokens.textMute, fontFamily: "var(--font-geist-mono)", fontSize: 11.5 }}>
              No action items extracted.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {analysis.actionItems.map((a, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "2.2fr 1fr 1fr auto", gap: 8, alignItems: "center" }}>
                  <input
                    value={a.task}
                    onChange={(e) => updateAction(i, { task: e.target.value })}
                    placeholder="Task"
                    style={inputStyle()}
                  />
                  <input
                    value={a.owner ?? ""}
                    onChange={(e) => updateAction(i, { owner: e.target.value || null })}
                    placeholder="Owner"
                    style={inputStyle()}
                  />
                  <input
                    value={a.dueDate ?? ""}
                    onChange={(e) => updateAction(i, { dueDate: e.target.value || null })}
                    placeholder="Due"
                    style={inputStyle()}
                  />
                  <RemoveButton onClick={() => removeAction(i)} />
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {includeSummary && (
        <Card padding={22}>
          <SectionLabel>// TOPICS</SectionLabel>
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
            {analysis.topics.map((t, i) => (
              <span
                key={i}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                  padding: "3px 4px 3px 9px",
                  borderRadius: 99,
                  background: `${tokens.cyan}1a`,
                  border: `1px solid ${tokens.cyan}44`,
                  fontFamily: "var(--font-geist-mono)",
                  fontSize: 11,
                  color: tokens.cyan,
                }}
              >
                #{t}
                <button
                  onClick={() => removeTopic(i)}
                  style={{ width: 16, height: 16, borderRadius: 99, background: "transparent", border: "none", color: tokens.cyan, cursor: "pointer" }}
                >
                  ×
                </button>
              </span>
            ))}
            <input
              value={topicDraft}
              onChange={(e) => setTopicDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === ",") {
                  e.preventDefault();
                  addTopic();
                }
              }}
              placeholder={analysis.topics.length === 0 ? "add a topic…" : ""}
              style={{ flex: 1, minWidth: 100, background: "transparent", border: "none", outline: "none", fontFamily: "var(--font-geist-sans)", fontSize: 12.5, color: tokens.text }}
            />
          </div>
        </Card>
      )}

      {error && (
        <div
          style={{
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

      <div style={{ display: "flex", gap: 10 }}>
        <button
          onClick={onBack}
          disabled={busy}
          style={{
            background: "transparent",
            border: `1px solid ${tokens.border}`,
            color: tokens.textDim,
            padding: "11px 16px",
            borderRadius: 8,
            fontFamily: "var(--font-geist-sans)",
            fontSize: 13.5,
            cursor: busy ? "not-allowed" : "pointer",
          }}
        >
          ← Back
        </button>
        <button
          onClick={onConfirm}
          disabled={busy}
          style={{
            flex: 1,
            background: busy ? tokens.surface2 : tokens.text,
            color: busy ? tokens.textMute : tokens.bg,
            border: busy ? `1px solid ${tokens.border}` : "none",
            padding: "11px 18px",
            borderRadius: 8,
            fontFamily: "var(--font-geist-sans)",
            fontSize: 14,
            fontWeight: 500,
            cursor: busy ? "not-allowed" : "pointer",
            boxShadow: busy ? "none" : `0 8px 20px ${tokens.cyan}25`,
          }}
        >
          {busy ? "Saving…" : "Confirm & save meeting"}
        </button>
      </div>
    </div>
  );
}
