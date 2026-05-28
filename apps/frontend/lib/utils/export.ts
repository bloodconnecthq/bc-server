// ── CSV ──────────────────────────────────────────────────────────────────────

function escapeCSV(val: unknown): string {
  const s = val == null ? "" : String(val);
  if (s.includes(",") || s.includes('"') || s.includes("\n")) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

export interface CSVSection {
  title: string;
  headers: string[];
  rows: (string | number | null | undefined)[][];
}

export function buildCSV(sections: CSVSection[]): string {
  return (sections ?? [])
    .map((sec) => {
      const headers = sec?.headers ?? [];
      const rows    = sec?.rows    ?? [];
      const lines: string[] = [
        `## ${sec?.title ?? ""}`,
        headers.map(escapeCSV).join(","),
        ...rows.map((row) => (row ?? []).map(escapeCSV).join(",")),
        "",
      ];
      return lines.join("\n");
    })
    .join("\n");
}

// ── Excel (HTML table → .xls that Excel/LibreOffice can open) ────────────────

export function buildExcel(sections: CSVSection[], title: string): string {
  const tableStyle = `
    table { border-collapse: collapse; width: 100%; font-family: Arial, sans-serif; font-size: 12px; }
    th { background: #c0392b; color: white; padding: 8px 12px; text-align: left; font-weight: bold; border: 1px solid #c0392b; }
    td { padding: 6px 12px; border: 1px solid #ddd; }
    tr:nth-child(even) td { background: #fafafa; }
    h2 { font-family: Arial, sans-serif; font-size: 14px; color: #c0392b; margin: 24px 0 8px; font-weight: bold; }
    h1 { font-family: Arial, sans-serif; font-size: 18px; color: #333; margin-bottom: 4px; }
    p  { font-family: Arial, sans-serif; font-size: 11px; color: #888; }
  `;

  const tables = (sections ?? [])
    .map((sec) => {
      const headers = sec?.headers ?? [];
      const rows    = sec?.rows    ?? [];
      const thead = `<tr>${headers.map((h) => `<th>${h ?? ""}</th>`).join("")}</tr>`;
      const tbody = rows
        .map((row) => `<tr>${(row ?? []).map((c) => `<td>${c ?? ""}</td>`).join("")}</tr>`)
        .join("");
      return `<h2>${sec?.title ?? ""}</h2><table><thead>${thead}</thead><tbody>${tbody}</tbody></table>`;
    })
    .join("");

  return `
    <html xmlns:o="urn:schemas-microsoft-com:office:office"
          xmlns:x="urn:schemas-microsoft-com:office:excel"
          xmlns="http://www.w3.org/TR/REC-html40">
    <head><meta charset="utf-8"><style>${tableStyle}</style></head>
    <body>
      <h1>${title}</h1>
      <p>Exporté le ${new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })} — Blood-Connect CNTS Bénin</p>
      ${tables}
    </body>
    </html>
  `;
}

// ── PDF (print window) ───────────────────────────────────────────────────────

export function printPDF(sections: CSVSection[], title: string): void {
  const tableStyle = `
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: Arial, sans-serif; font-size: 11px; color: #1a1a1a; padding: 24px; }
    .header { border-bottom: 3px solid #c0392b; padding-bottom: 12px; margin-bottom: 20px; }
    .header h1 { font-size: 20px; color: #c0392b; font-weight: 900; }
    .header p { font-size: 10px; color: #888; margin-top: 4px; }
    .section-title { font-size: 13px; font-weight: bold; color: #c0392b; margin: 20px 0 8px; padding-left: 8px; border-left: 3px solid #c0392b; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 16px; page-break-inside: avoid; }
    th { background: #c0392b; color: white; padding: 7px 10px; text-align: left; font-weight: bold; font-size: 10px; border: 1px solid #c0392b; }
    td { padding: 6px 10px; border: 1px solid #e5e7eb; font-size: 10px; }
    tr:nth-child(even) td { background: #fef2f2; }
    .footer { margin-top: 24px; border-top: 1px solid #e5e7eb; padding-top: 8px; font-size: 9px; color: #bbb; text-align: center; }
    @page { margin: 1.5cm; }
  `;

  const tables = (sections ?? [])
    .map((sec) => {
      const headers = sec?.headers ?? [];
      const rows    = sec?.rows    ?? [];
      const thead = `<tr>${headers.map((h) => `<th>${h ?? ""}</th>`).join("")}</tr>`;
      const tbody = rows
        .map((row) => `<tr>${(row ?? []).map((c) => `<td>${c ?? "—"}</td>`).join("")}</tr>`)
        .join("");
      return `
        <p class="section-title">${sec?.title ?? ""}</p>
        <table><thead>${thead}</thead><tbody>${tbody}</tbody></table>
      `;
    })
    .join("");

  const html = `
    <!DOCTYPE html>
    <html lang="fr">
    <head><meta charset="utf-8"><title>${title}</title><style>${tableStyle}</style></head>
    <body>
      <div class="header">
        <h1>${title}</h1>
        <p>Exporté le ${new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })} — Blood-Connect CNTS Bénin</p>
      </div>
      ${tables}
      <div class="footer">Blood-Connect — Système de Gestion des Dons de Sang — CNTS Bénin</div>
    </body>
    </html>
  `;

  const win = window.open("", "_blank");
  if (!win) return;
  win.document.write(html);
  win.document.close();
  win.focus();
  setTimeout(() => { win.print(); }, 400);
}

// ── Download trigger ─────────────────────────────────────────────────────────

export function downloadBlob(content: string, filename: string, mime: string) {
  const BOM = mime.includes("csv") ? "﻿" : "";
  const blob = new Blob([BOM + content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
