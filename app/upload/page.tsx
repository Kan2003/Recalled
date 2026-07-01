// app/upload/page.tsx
// Server shell — renders the client upload form.

import { UploadShell } from "@/components/upload/UploadShell";

export const metadata = {
  title: "New meeting · Recalled",
  description: "Upload audio, paste a transcript, record live, or pull from a URL.",
};

export default function UploadPage() {
  return <UploadShell />;
}
