// app/(auth)/login/page.tsx
import { signIn } from "@/lib/auth";
import { tokens } from "@/components/landing/tokens";
import { Logo } from "@/components/landing/Logo";
import { AuroraBg } from "@/components/upload/AuroraBg";
import { Card } from "@/components/upload/primitives";

const ERROR_MESSAGES: Record<string, string> = {
  OAuthSignin: "Couldn't start the Google sign-in flow. Please try again.",
  OAuthCallback: "Google sign-in didn't complete. Please try again.",
  OAuthAccountNotLinked: "That email is already linked to a different sign-in method.",
  AccessDenied: "Access was denied by Google.",
  Default: "Something went wrong signing you in. Please try again.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const errorMessage = error ? ERROR_MESSAGES[error] || ERROR_MESSAGES.Default : null;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: tokens.bg,
        color: tokens.text,
        position: "relative",
        display: "grid",
        placeItems: "center",
        padding: 24,
      }}
    >
      <AuroraBg />

      <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 380 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 28 }}>
          <Logo size={32} accent={tokens.cyan} />
          <span
            style={{
              fontFamily: "var(--font-geist-sans)",
              fontWeight: 600,
              fontSize: 19,
              letterSpacing: "-0.02em",
              color: tokens.text,
            }}
          >
            Recalled
          </span>
        </div>

        <Card accent={tokens.cyan} padding={32}>
          <div style={{ textAlign: "center", marginBottom: 26 }}>
            <h1
              style={{
                fontFamily: "var(--font-geist-sans)",
                fontSize: 22,
                fontWeight: 600,
                letterSpacing: "-0.02em",
                color: tokens.text,
                margin: "0 0 8px",
              }}
            >
              Welcome back
            </h1>
            <p
              style={{
                fontFamily: "var(--font-geist-sans)",
                fontSize: 13.5,
                color: tokens.textDim,
                margin: 0,
                lineHeight: 1.5,
              }}
            >
              Sign in to manage your meeting intelligence
            </p>
          </div>

          {errorMessage && (
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 8,
                padding: "10px 12px",
                marginBottom: 18,
                borderRadius: 8,
                background: "#f8717115",
                border: "1px solid #f8717140",
                color: "#fca5a5",
                fontFamily: "var(--font-geist-sans)",
                fontSize: 12.5,
                lineHeight: 1.45,
              }}
            >
              {errorMessage}
            </div>
          )}

          <form
            action={async () => {
              "use server";
              await signIn("google", { redirectTo: "/dashboard" });
            }}
          >
            <button
              type="submit"
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                background: tokens.text,
                color: tokens.bg,
                border: "none",
                borderRadius: 10,
                padding: "12px 16px",
                fontFamily: "var(--font-geist-sans)",
                fontSize: 14,
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              <GoogleIcon />
              Continue with Google
            </button>
          </form>
        </Card>

        <p
          style={{
            textAlign: "center",
            marginTop: 20,
            fontFamily: "var(--font-geist-mono)",
            fontSize: 10.5,
            color: tokens.textMute,
            letterSpacing: "0.02em",
          }}
        >
          Private by default · Powered by Whisper + Claude
        </p>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M23.52 12.27c0-.85-.07-1.66-.21-2.44H12v4.62h6.47a5.53 5.53 0 01-2.4 3.63v3h3.88c2.27-2.09 3.57-5.17 3.57-8.81z" />
      <path fill="#34A853" d="M12 24c3.24 0 5.96-1.07 7.95-2.92l-3.88-3c-1.08.72-2.45 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.96H1.27v3.11A11.997 11.997 0 0012 24z" />
      <path fill="#FBBC05" d="M5.27 14.27a7.2 7.2 0 010-4.54v-3.1H1.27a12 12 0 000 10.75l4-3.11z" />
      <path fill="#EA4335" d="M12 4.77c1.77 0 3.35.61 4.6 1.8l3.44-3.44C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.69 1.27 6.63l4 3.1c.95-2.85 3.6-4.96 6.73-4.96z" />
    </svg>
  );
}
