"use client";

import { useState, useRef, useEffect } from "react";
import { Download, ChevronDown, Link2 } from "lucide-react";

type ActionMenuProps = {
  onExportPdf: () => void;
  shareToken: string;
};

export default function ActionMenu({
  onExportPdf,
  shareToken,
}: ActionMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Tutup ketika klik di luar
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleCopyLink = async () => {
    const url = `${window.location.origin}/share/${shareToken}`;
    await navigator.clipboard.writeText(url);
    setOpen(false);
    // optional: tambahkan toast notification di sini
  };

  const handleExport = () => {
    onExportPdf();
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="inline-flex items-center gap-2 rounded-2xl border border-border bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
      >
        Share
        <ChevronDown
          size={15}
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-48 overflow-hidden rounded-2xl border border-border bg-popover shadow-xl">
          <button
            onClick={handleCopyLink}
            className="flex w-full items-center gap-3 px-4 py-3 text-sm text-popover-foreground transition hover:bg-accent hover:text-accent-foreground"
          >
            <Link2 size={15} />
            Copy Share Link
          </button>

          <div className="h-px bg-border" />

          <button
            onClick={handleExport}
            className="flex w-full items-center gap-3 px-4 py-3 text-sm text-popover-foreground transition hover:bg-accent hover:text-accent-foreground"
          >
            <Download size={15} />
            Export to PDF
          </button>
        </div>
      )}
    </div>
  );
}
