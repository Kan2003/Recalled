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
  RecordSource,
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

  // Has the user supplied a valid source?
  const hasSource =
    (activeSource === "audio" && !!file) ||
    (activeSource === "paste" && pasteText.trim().length > 50) ||
    (activeSource === "url"   && /^https?:\/\//.test(url)) ||
    (activeSource === "record");

  const handleSubmit = () => {
    if (!hasSource) return;
    // Real impl:
    // 1. POST source → /api/transcribe (returns meetingId)
    // 2. POST {meetingId, ...meta} → /api/analyze
    // 3. router.push(`/upload/processing/${meetingId}`)  (or wherever your processing screen lives)
    alert("Would POST to /api/transcribe → /api/analyze");
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
                Audio, text, live recording, or a URL — pick whichever you&apos;ve got. Recalled handles the rest.
              </p>
            </div>

            <Card padding={22}>
              <SourceTabs active={activeSource} onChange={setActiveSource} />
              {activeSource === "audio"  && <AudioSource file={file} onFileChange={setFile} />}
              {activeSource === "paste"  && <PasteSource value={pasteText} onChange={setPaste} />}
              {activeSource === "record" && <RecordSource />}
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
              onCancel={() => router.push("/dashboard")}
              onSubmit={handleSubmit}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
