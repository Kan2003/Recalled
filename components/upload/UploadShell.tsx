"use client";

// components/upload/UploadShell.tsx
// Composes the upload screen — header, source picker, metadata form.

import { useState } from "react";
import { useRouter } from "next/navigation";
import { tokens } from "../landing/tokens";
import { AuroraBg } from "./AuroraBg";
import { UploadHeader } from "./UploadHeader";
import { Card, Eyebrow } from "./primitives";
import {
  SourceTabs,
  AudioSource,
  PasteSource,
  URLSource,
  type SourceKind,
  type SelectedFile,
} from "./Sources";
import { MetadataForm, META_DEFAULTS, type MetaState } from "./MetadataForm";
import { ReviewPanel, type AnalysisResult } from "./ReviewPanel";

export function UploadShell() {
  const router = useRouter();

  // Active source + per-source payload
  const [activeSource, setActiveSource] = useState<SourceKind>("audio");
  const [file, setFile]       = useState<SelectedFile | null>(null);
  const [pasteText, setPaste] = useState("");
  const [url, setUrl]         = useState("");

  // Metadata form state
  const [meta, setMeta] = useState<MetaState>(META_DEFAULTS);
  const setMetaPartial = (patch: Partial<MetaState>) => setMeta((m) => ({ ...m, ...patch }));

  // Pipeline status
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Once analysis comes back we stop and let the user review/edit it before
  // anything is persisted — `transcript`/`analysis` hold that pending state.
  const [phase, setPhase] = useState<"input" | "review">("input");
  const [transcript, setTranscript] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);

  // Has the user supplied a valid source?
  const hasSource =
    (activeSource === "audio" && !!file) ||
    (activeSource === "paste" && pasteText.trim().length > 50) ||
    (activeSource === "url"   && /^https?:\/\//.test(url));

  const step = phase === "review" ? 3 : busy ? 2 : 1;

  const handleAnalyze = async () => {
    if (!hasSource || busy) return;
    setBusy(true);
    setError(null);

    try {
      // 1. Get a transcript — from Whisper for audio/video, or straight from
      //    pasted text. (url source isn't wired up yet.)
      let text: string;
      if (activeSource === "audio" && file?.raw) {
        const formData = new FormData();
        formData.append("audio", file.raw);
        const res = await fetch("/api/transcribe", { method: "POST", body: formData });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "Transcription failed");
        text = data.transcript;
      } else if (activeSource === "paste") {
        text = pasteText.trim();
      } else {
        throw new Error("This source isn't supported yet — use audio or pasted text.");
      }

      if (!text) throw new Error("No transcript to analyze.");

      // 2. Analyze the transcript → { summary, decisions, actionItems, topics }.
      //    Stop here — don't save yet. The user reviews/edits this next.
      const analyzeRes = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript: text }),
      });
      const result = await analyzeRes.json();
      if (!analyzeRes.ok) throw new Error(result?.error || "Analysis failed");

      setTranscript(text);
      setAnalysis({
        summary: result.summary ?? "",
        decisions: Array.isArray(result.decisions) ? result.decisions : [],
        topics: Array.isArray(result.topics) ? result.topics : [],
        actionItems: Array.isArray(result.actionItems) ? result.actionItems : [],
      });
      setPhase("review");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  };

  const handleBackToEdit = () => {
    setPhase("input");
    setError(null);
  };

  const handleConfirmSave = async () => {
    if (!analysis || !transcript || busy) return;
    setBusy(true);
    setError(null);

    try {
      const saveRes = await fetch("/api/meetings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: meta.title,
          transcript,
          summary: meta.summarize ? analysis.summary : null,
          decisions: meta.summarize ? analysis.decisions : [],
          topics: meta.summarize ? analysis.topics : [],
          actionItems: meta.actions ? analysis.actionItems : [],
        }),
      });
      const meeting = await saveRes.json();
      if (!saveRes.ok) throw new Error(meeting?.error || "Failed to save meeting");

      router.push(`/dashboard/${meeting.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setBusy(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: tokens.bg, color: tokens.text, position: "relative" }}>
      <AuroraBg />
      <div style={{ position: "relative", zIndex: 1 }}>
        <UploadHeader step={step} />

        {phase === "review" && analysis ? (
          <main style={{ maxWidth: 760, margin: "0 auto", padding: "36px 40px 60px" }}>
            <div style={{ marginBottom: 22 }}>
              <Eyebrow accent={tokens.cyan}>// STEP 3 · REVIEW BEFORE SAVING</Eyebrow>
              <h1
                style={{
                  fontFamily: "var(--font-geist-sans)",
                  fontSize: 30,
                  fontWeight: 500,
                  letterSpacing: "-0.025em",
                  color: tokens.text,
                  margin: 0,
                  lineHeight: 1.1,
                }}
              >
                Here&apos;s what we heard
              </h1>
              <p
                style={{
                  fontFamily: "var(--font-geist-sans)",
                  fontSize: 14,
                  color: tokens.textDim,
                  margin: "8px 0 0",
                  maxWidth: 560,
                  lineHeight: 1.55,
                }}
              >
                Edit anything that&apos;s off, then save. Nothing is written to your dashboard until you confirm.
              </p>
            </div>

            <ReviewPanel
              title={meta.title}
              analysis={analysis}
              onChange={setAnalysis}
              includeSummary={meta.summarize}
              includeActions={meta.actions}
              busy={busy}
              error={error}
              onBack={handleBackToEdit}
              onConfirm={handleConfirmSave}
            />
          </main>
        ) : (
        <main
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            padding: "36px 40px 60px",
            display: "grid",
            gridTemplateColumns: "1.3fr 1fr",
            gap: 28,
          }}
        >
          {/* Left — source picker + active pane */}
          <div>
            <div style={{ marginBottom: 22 }}>
              <Eyebrow>// STEP 1 · BRING IN A MEETING</Eyebrow>
              <h1
                style={{
                  fontFamily: "var(--font-geist-sans)",
                  fontSize: 30,
                  fontWeight: 500,
                  letterSpacing: "-0.025em",
                  color: tokens.text,
                  margin: 0,
                  lineHeight: 1.1,
                }}
              >
                Where should we listen?
              </h1>
              <p
                style={{
                  fontFamily: "var(--font-geist-sans)",
                  fontSize: 14,
                  color: tokens.textDim,
                  margin: "8px 0 0",
                  maxWidth: 520,
                  lineHeight: 1.55,
                }}
              >
                Audio, text, or a URL — pick whichever you&apos;ve got. Recalled handles the rest.
              </p>
            </div>

            <Card padding={22}>
              <SourceTabs active={activeSource} onChange={setActiveSource} />
              {activeSource === "audio"  && <AudioSource file={file} onFileChange={setFile} />}
              {activeSource === "paste"  && <PasteSource value={pasteText} onChange={setPaste} />}
              {activeSource === "url"    && <URLSource value={url} onChange={setUrl} />}
            </Card>

            {/* Footer hints */}
            <div
              style={{
                marginTop: 18,
                display: "flex",
                gap: 12,
                flexWrap: "wrap",
                fontFamily: "var(--font-geist-mono)",
                fontSize: 10.5,
                color: tokens.textMute,
                letterSpacing: "0.04em",
              }}
            >
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" />
                  <path d="M7 11V7a5 5 0 0110 0v4" />
                </svg>
                PRIVATE BY DEFAULT
              </span>
              <span>·</span>
              <span>~12 SEC PROCESSING PER AUDIO MINUTE</span>
              <span>·</span>
              <span>POWERED BY WHISPER + CLAUDE</span>
            </div>
          </div>

          {/* Right — metadata + AI options */}
          <div>
            <MetadataForm
              state={meta}
              set={setMetaPartial}
              hasSource={hasSource}
              busy={busy}
              error={error}
              onCancel={() => router.push("/dashboard")}
              onSubmit={handleAnalyze}
            />
          </div>
        </main>
        )}
      </div>
    </div>
  );
}
