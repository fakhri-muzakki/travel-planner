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
        className="flex items-center gap-2 rounded-2xl bg-cyan-500 px-4 py-2 text-sm font-medium text-black hover:opacity-90 transition"
      >
        Share & Export
        <ChevronDown
          size={15}
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 rounded-2xl border border-white/10 bg-[#141414] shadow-xl overflow-hidden z-50">
          <button
            onClick={handleCopyLink}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-white/80 hover:bg-white/5 transition"
          >
            <Link2 size={15} />
            Copy Share Link
          </button>

          <div className="h-px bg-white/10" />

          <button
            onClick={handleExport}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-white/80 hover:bg-white/5 transition"
          >
            <Download size={15} />
            Export to PDF
          </button>
        </div>
      )}
    </div>
  );
}
