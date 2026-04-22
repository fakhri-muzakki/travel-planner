"use client";

import { useState } from "react";

export default function ShareButton({ shareToken }: { shareToken: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      const url = `${window.location.origin}/share/${shareToken}`;

      await navigator.clipboard.writeText(url);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      alert("Failed to copy link");
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="rounded-2xl border border-white/10 px-4 py-2 text-sm hover:bg-white/5 transition"
    >
      {copied ? "Copied" : "Share"}
    </button>
  );
}
