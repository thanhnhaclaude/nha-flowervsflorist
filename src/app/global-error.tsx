"use client";

/** Last-resort error page when the root layout itself fails. Uses inline styles (no app CSS available). */
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en-US">
      <body style={{ margin: 0, fontFamily: "system-ui, sans-serif", background: "#fff5f8", color: "#2a1520", display: "grid", placeItems: "center", minHeight: "100vh", textAlign: "center", padding: 24 }}>
        <div>
          <h1 style={{ fontFamily: "Georgia, serif", color: "#63184a" }}>Something went wrong</h1>
          <p>Please try again in a moment, or call us at (478) 219-8398.</p>
          <button onClick={reset} style={{ marginTop: 16, background: "#d0103d", color: "#fff", border: 0, borderRadius: 999, padding: "12px 24px", fontWeight: 700, cursor: "pointer" }}>
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
