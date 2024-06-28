
import { useRef, useState } from "react";

type Region = { page: number; x0: number; y0: number; x1: number; y1: number };

export default function IntakePage() {
  const [caseId, setCaseId] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [regions, setRegions] = useState<Region[]>([]);
  const [status, setStatus] = useState<string | null>(null);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  function onCanvasMouseDown(e: React.MouseEvent<HTMLCanvasElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    setDragStart({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }

  function onCanvasMouseUp(e: React.MouseEvent<HTMLCanvasElement>) {
    if (!dragStart) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x1 = e.clientX - rect.left;
    const y1 = e.clientY - rect.top;
    const x0 = Math.min(dragStart.x, x1);
    const y0 = Math.min(dragStart.y, y1);
    const x2 = Math.max(dragStart.x, x1);
    const y2 = Math.max(dragStart.y, y1);
    if (Math.abs(x2 - x0) > 8 && Math.abs(y2 - y0) > 8) {
      setRegions((r) => [...r, { page: 0, x0, y0, x1: x2, y1: y2 }]);
    }
    setDragStart(null);
    drawOverlay();
  }

  function drawOverlay() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(15, 23, 42, 0.04)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "rgba(31, 111, 235, 0.9)";
    ctx.fillStyle = "rgba(31, 111, 235, 0.25)";
    regions.forEach((r) => {
      ctx.fillRect(r.x0, r.y0, r.x1 - r.x0, r.y1 - r.y0);
      ctx.strokeRect(r.x0, r.y0, r.x1 - r.x0, r.y1 - r.y0);
    });
  }

  async function upload() {
    if (!file) return;
    setStatus("Uploading and redacting…");
    const base = import.meta.env.VITE_API_BASE ?? "http://localhost:8011";
    const form = new FormData();
    form.append("file", file);
    form.append("manual_regions", JSON.stringify(regions));
    if (caseId) form.append("case_id", caseId);
    const res = await fetch(`${base}/api/v1/documents/upload`, { method: "POST", body: form });
    if (!res.ok) {
      setStatus(`Failed: ${await res.text()}`);
      return;
    }
    const data = await res.json();
    setStatus(`Ready — ${data.redaction_hits} redaction hits. Staff can review in HIM console.`);
  }

  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <div>
        <h1 className="text-3xl font-semibold">Secure intake upload</h1>
        <p className="mt-2 text-slate-600">
          Upload a PDF with <strong>synthetic demo PHI</strong>. Automatic patterns cover SSN, email, phone,
          and IDs. Drag on the preview to add manual blue-box regions.
        </p>
        <div className="mt-6 space-y-4 glass p-6">
          <label className="block text-sm font-medium">
            Case ID (from booking)
            <input className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 font-mono" placeholder="CASE-2026-XXXX" value={caseId} onChange={(e) => setCaseId(e.target.value)} />
          </label>
          <label className="block text-sm font-medium">
            PDF file
            <input type="file" accept="application/pdf" className="mt-1 block w-full text-sm" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
          </label>
          <button type="button" onClick={upload} disabled={!file} className="rounded-full bg-brand-600 px-5 py-2.5 text-sm font-medium text-white disabled:opacity-50">
            Process PDF
          </button>
          {status && <p className="text-sm text-slate-700">{status}</p>}
        </div>
      </div>
      <div className="glass p-4">
        <p className="mb-2 text-sm font-medium text-slate-700">Manual redaction preview (page 1)</p>
        <canvas ref={canvasRef} width={480} height={620} className="w-full cursor-crosshair rounded-xl border border-slate-200 bg-white" onMouseDown={onCanvasMouseDown} onMouseUp={onCanvasMouseUp} />
        <p className="mt-2 text-xs text-slate-500">{regions.length} manual region(s).</p>
        <button type="button" className="mt-2 text-xs text-brand-600" onClick={() => { setRegions([]); drawOverlay(); }}>
          Clear regions
        </button>
      </div>
    </div>
  );
}
