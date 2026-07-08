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

  // Has the user supplied a valid source?
  const hasSource =
    (activeSource === "audio" && !!file) ||
    (activeSource === "paste" && pasteText.trim().length > 50) ||
    (activeSource === "url"   && /^https?:\/\//.test(url));

  const handleSubmit = async () => {
    if (!hasSource || busy) return;
    setBusy(true);
    setError(null);

    try {
      // 1. Get a transcript — from Whisper for audio/video, or straight from
      //    pasted text. (url source isn't wired up yet.)
      let transcript: string;
      if (activeSource === "audio" && file?.raw) {
        const formData = new FormData();
        formData.append("audio", file.raw);
        const res = await fetch("/api/transcribe", { method: "POST", body: formData });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "Transcription failed");
        transcript = data.transcript;
      } else if (activeSource === "paste") {
        transcript = pasteText.trim();
      } else {
        throw new Error("This source isn't supported yet — use audio or pasted text.");
      }

      if (!transcript) throw new Error("No transcript to analyze.");

      // 2. Analyze the transcript → { summary, decisions, actionItems, topics }
      const analyzeRes = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript }),
      });
      const analysis = await analyzeRes.json();
      if (!analyzeRes.ok) throw new Error(analysis?.error || "Analysis failed");

      // 3. Persist the meeting + its action items
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

      // 4. Off to the meeting detail page
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
        <UploadHeader step={1} />

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
              onSubmit={handleSubmit}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
