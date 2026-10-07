// lib/exportMeeting.ts
// Client-side "Export" — builds a Markdown file for a meeting (summary,
// decisions, action items, topics, Ask AI chat, transcript) and downloads it.

export type AskChatMessage = { q: string; a: string; error?: boolean };

export function askStorageKey(meetingId: string) {
  return `recalled:ask:${meetingId}`;
}

export type MeetingExport = {
  id: string;
  title: string;
  date: string;
  summary: string;
  decisions: string[];
  actions: { what: string; who: string; due: string; done: boolean }[];
  topics: string[];
  transcript: string;
};

function loadChat(meetingId: string): AskChatMessage[] {
  try {
    const saved = localStorage.getItem(askStorageKey(meetingId));
    const history: AskChatMessage[] = saved ? JSON.parse(saved) : [];
    return history.filter((m) => !m.error && m.a.trim());
  } catch {
    return [];
  }
}

export function meetingToMarkdown(m: MeetingExport): string {
  const chat = loadChat(m.id);
  const lines: string[] = [`# ${m.title}`, "", `_${m.date} · Exported from Recalled_`, ""];

  lines.push("## Summary", "", m.summary || "No summary.", "");

  lines.push("## Decisions", "");
  if (m.decisions.length) m.decisions.forEach((d, i) => lines.push(`${i + 1}. ${d}`));
  else lines.push("None recorded.");
  lines.push("");

  lines.push("## Action items", "");
  if (m.actions.length) {
    m.actions.forEach((a) => lines.push(`- [${a.done ? "x" : " "}] ${a.what} — **${a.who}** · ${a.due}`));
  } else {
    lines.push("None recorded.");
  }
  lines.push("");

  if (m.topics.length) lines.push("## Topics", "", m.topics.join(", "), "");

  if (chat.length) {
    lines.push("## Ask AI", "");
    chat.forEach((c) => lines.push(`**Q:** ${c.q}`, "", c.a, "", "---", ""));
  }

  lines.push("## Transcript", "", m.transcript, "");
  return lines.join("\n");
}

export function downloadMeetingMarkdown(m: MeetingExport) {
  const blob = new Blob([meetingToMarkdown(m)], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const slug = m.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "meeting";

  const a = document.createElement("a");
  a.href = url;
  a.download = `${slug}.md`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 0);
}
