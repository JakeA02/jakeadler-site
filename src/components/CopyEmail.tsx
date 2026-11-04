"use client";
import { useState } from "react";

export function CopyEmail({ email }: { email: string }) {
  const [ok, setOk] = useState(false);
  return (
    <button
      onClick={() => navigator.clipboard.writeText(email).then(() => { setOk(true); setTimeout(() => setOk(false), 1800); })}
      className="rounded-full border border-paper/30 px-5 py-3 text-sm transition hover:border-paper"
    >
      {ok ? "Copied" : "Copy email"}
    </button>
  );
}
