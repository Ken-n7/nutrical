import { readFileSync } from "node:fs";
import { join, dirname, basename, extname } from "node:path";
import { jsPDF } from "jspdf";

const ACCENT = [13, 148, 136];
const DARK = [17, 45, 43];
const GRAY = [90, 105, 103];
const LIGHT = [230, 245, 243];

const doc = new jsPDF({ unit: "pt", format: "a4" });
const W = doc.internal.pageSize.getWidth();
const H = doc.internal.pageSize.getHeight();
const MARGIN = 64;
const CONTENT_W = W - MARGIN * 2;
let y = 0;

function ensureSpace(needed) {
  if (y + needed > H - 64) {
    doc.addPage();
    y = 64;
  }
}

function text(line, { size = 11, style = "normal", color = DARK, font = "Times", indent = 0, lh = 1.5, spacing = 6 } = {}) {
  doc.setFont(font, style);
  doc.setFontSize(size);
  doc.setTextColor(...color);
  const lines = doc.splitTextToSize(line, CONTENT_W - indent);
  for (const ln of lines) {
    ensureSpace(size * lh + spacing);
    doc.text(ln, MARGIN + indent, y);
    y += size * lh + spacing;
  }
}

function headerPage() {
  doc.setFillColor(...ACCENT);
  doc.rect(0, 0, W, 6, "F");
  doc.setFillColor(...DARK);
  doc.rect(0, H - 6, W, 6, "F");

  doc.setFont("Times", "bold");
  doc.setFontSize(34);
  doc.setTextColor(...DARK);
  doc.text("NutriCal", MARGIN, 110);

  doc.setFillColor(...ACCENT);
  doc.rect(MARGIN, 128, 60, 3, "F");

  doc.setFont("Times", "bold");
  doc.setFontSize(42);
  doc.setTextColor(...ACCENT);
  doc.text("What's New", MARGIN, 172);

  doc.setFont("Times", "normal");
  doc.setFontSize(13);
  doc.setTextColor(...GRAY);
  doc.text("Functional Exchange Logic Calculator", MARGIN, 200);
  doc.text(`Version 1.0.0  ·  September 16, 2026`, MARGIN, 222);

  doc.setFillColor(...LIGHT);
  doc.roundedRect(MARGIN, 252, CONTENT_W, 130, 12, 12, "F");
  doc.setFont("Times", "italic");
  doc.setFontSize(12);
  doc.setTextColor(...DARK);
  const intro =
    "This release adds a complete save-as-PDF workflow, a redesigned visual experience, " +
    "and significant mobile and stability improvements. The six commits delivered since the " +
    "last published build (cbde783) are summarized below.";
  const boxLines = doc.splitTextToSize(intro, CONTENT_W - 48);
  doc.text(boxLines, MARGIN + 24, 282);
  y = 430;
}

function section(title) {
  ensureSpace(60);
  y += 14;
  doc.setFillColor(...ACCENT);
  doc.rect(MARGIN, y - 11, 8, 8, "F");
  doc.setFont("Times", "bold");
  doc.setFontSize(17);
  doc.setTextColor(...DARK);
  doc.text(title.toUpperCase(), MARGIN + 20, y);
  y += 30;
  doc.setDrawColor(...ACCENT);
  doc.setLineWidth(1);
  doc.line(MARGIN, y, MARGIN + CONTENT_W, y);
  y += 18;
}

function bullet(line, sub = false) {
  ensureSpace(40);
  const indent = sub ? 26 : 14;
  doc.setFont("Times", sub ? "italic" : "normal");
  doc.setFontSize(11);
  doc.setTextColor(...(sub ? GRAY : DARK));
  doc.setFillColor(...(sub ? GRAY : ACCENT));
  doc.circle(MARGIN + 6, y - 4, sub ? 1.8 : 2.5, "F");
  const lines = doc.splitTextToSize(line, CONTENT_W - indent - 16);
  for (const ln of lines) {
    ensureSpace(11 * 1.35 + 5);
    doc.text(ln, MARGIN + indent, y);
    y += 11 * 1.35 + 5;
  }
  y += 4;
}

function footer() {
  const pages = doc.getNumberOfPages();
  for (let i = 1; i <= pages; i++) {
    doc.setPage(i);
    doc.setFont("Times", "italic");
    doc.setFontSize(9);
    doc.setTextColor(...GRAY);
    doc.text("NutriCal Release Notes v1.0.0", MARGIN, H - 24);
    doc.text(`Page ${i} of ${pages}`, W - MARGIN, H - 24, { align: "right" });
  }
}

function clean(s) {
  return s.replace(/\*\*([^*]+)\*\*/g, "$1").replace(/`([^`]+)`/g, "$1");
}

function render(mdPath) {
  const content = readFileSync(mdPath, "utf8");
  const lines = content.split("\n");
  let inSections = false;

  headerPage();

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;
    if (line.startsWith("# ") || line.startsWith("**Version") || line.startsWith("**Release")) continue;
    if (line === "---") { inSections = true; continue; }
    if (!inSections) continue;
    if (line.startsWith("## ")) { section(clean(line.replace(/^##\s+/, ""))); continue; }
    if (line.startsWith("- ")) { bullet(clean(line.replace(/^-\s+/, ""))); continue; }
  }

  footer();
  const out = join(dirname(mdPath), basename(mdPath, extname(mdPath)) + ".pdf");
  doc.save(out);
  console.log(`Generated ${out}`);
}

render(process.argv[2] ?? join(process.cwd(), "docs/release-notes.md"));