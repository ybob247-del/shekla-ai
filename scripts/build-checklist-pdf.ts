// Generates the Money Pattern Checklist lead magnet.
//
// This is the "free tool in the description" the Hidden Patterns video script
// promises: "a simple way to build that kind of system for your own money —
// one that decides before you feel." Every rule is a decision made while calm
// so it runs when the viewer is not.
//
// Needs pdf-lib, which is not a project dependency because nothing else uses
// it: npm i -D pdf-lib && npx tsx scripts/build-checklist-pdf.ts
import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from "pdf-lib";
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

const CHARCOAL = rgb(0.13, 0.13, 0.15);
const GOLD = rgb(0.72, 0.56, 0.24);
const MUTED = rgb(0.42, 0.42, 0.46);
const RULE = rgb(0.85, 0.85, 0.87);
const CREAM = rgb(0.99, 0.98, 0.96);

const PAGE_W = 595.28; // A4
const PAGE_H = 841.89;
const MARGIN = 56;
const CONTENT_W = PAGE_W - MARGIN * 2;

interface Rule {
  title: string;
  body: string;
  blank?: string;
}

const RULES: Rule[] = [
  {
    title: "Wait seventy-two hours",
    body:
      "Any purchase you did not plan, above a number you set today, waits three days. Write it down with the date you wanted it. If you still want it on day three, buy it without guilt. Most wants do not survive the wait.",
    blank: "My number: $",
  },
  {
    title: "Ask whether you want it, or want in",
    body:
      "Before you buy anything that other people are excited about, answer one question in writing: would I want this if nobody else were buying it? If the honest answer is no, you are buying the crowd, not the thing.",
  },
  {
    title: "Write the exit before the entry",
    body:
      "Never put money into anything without deciding two numbers first: the gain where you walk away, and the loss you will accept. Newton had neither. He had a fortune, and then he had a lesson.",
    blank: "I sell at a gain of ______ or a loss of ______",
  },
  {
    title: "Separate the money you cannot lose",
    body:
      "Money you need lives in a different account from money you are willing to risk. Not a line in your head. A different account, with a different login, that takes effort to raid.",
  },
  {
    title: "Ban your own re-entry",
    body:
      "If you sold and it kept climbing, you may not buy back in for thirty days. This is the precise move that broke Newton. What re-entry buys is relief from watching other people win. That is not an investment.",
  },
  {
    title: "Automate the boring part",
    body:
      "One transfer, on the day you are paid, before you see the balance. Any amount you can survive. Automation beats discipline because it never gets tired, jealous, or excited.",
    blank: "Transfer $______ every payday",
  },
  {
    title: "Five minutes, once a month",
    body:
      "Same date every month. Write down everything you bought that you had not planned. You are not judging it. You are collecting the only evidence that will ever show you your own pattern.",
    blank: "My review date: the ______ of each month",
  },
];

function wrap(text: string, font: PDFFont, size: number, maxWidth: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = "";

  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (font.widthOfTextAtSize(candidate, size) > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = candidate;
    }
  }
  if (line) lines.push(line);
  return lines;
}

async function main(): Promise<void> {
  const pdf = await PDFDocument.create();
  pdf.setTitle("The Money Pattern Checklist");
  pdf.setSubject("Decide before you feel");
  pdf.setAuthor("Shekla AI");
  pdf.setCreator("Shekla AI");

  const serif = await pdf.embedFont(StandardFonts.TimesRoman);
  const serifBold = await pdf.embedFont(StandardFonts.TimesRomanBold);
  const serifItalic = await pdf.embedFont(StandardFonts.TimesRomanItalic);
  const sans = await pdf.embedFont(StandardFonts.Helvetica);

  let page: PDFPage = pdf.addPage([PAGE_W, PAGE_H]);
  page.drawRectangle({ x: 0, y: 0, width: PAGE_W, height: PAGE_H, color: CREAM });
  let y = PAGE_H - MARGIN;

  const newPage = () => {
    page = pdf.addPage([PAGE_W, PAGE_H]);
    page.drawRectangle({ x: 0, y: 0, width: PAGE_W, height: PAGE_H, color: CREAM });
    y = PAGE_H - MARGIN;
  };

  // ── Masthead ──────────────────────────────────────────────────────────────
  page.drawRectangle({ x: 0, y: PAGE_H - 150, width: PAGE_W, height: 150, color: CHARCOAL });
  page.drawText("HIDDEN PATTERNS", {
    x: MARGIN,
    y: PAGE_H - 58,
    size: 9,
    font: sans,
    color: GOLD,
    characterSpacing: 2.4,
  });
  page.drawText("The Money Pattern Checklist", {
    x: MARGIN,
    y: PAGE_H - 94,
    size: 25,
    font: serifBold,
    color: rgb(1, 1, 1),
  });
  page.drawText("Decide before you feel.", {
    x: MARGIN,
    y: PAGE_H - 122,
    size: 13,
    font: serifItalic,
    color: GOLD,
  });

  y = PAGE_H - 190;

  // ── Opening ───────────────────────────────────────────────────────────────
  const intro =
    "Isaac Newton could calculate the motion of the planets. He could not calculate his own FOMO. He sold, watched the price climb without him, bought back in near the top, and lost a fortune. His intelligence was never the problem. The order of events was.";
  for (const line of wrap(intro, serif, 11.5, CONTENT_W)) {
    page.drawText(line, { x: MARGIN, y, size: 11.5, font: serif, color: CHARCOAL });
    y -= 17;
  }

  y -= 10;
  const intro2 =
    "Every rule below is a decision made now, while you are calm, so that it runs later, when you are not. Fill in the blanks. Put this somewhere you will see it before you spend, not after.";
  for (const line of wrap(intro2, serif, 11.5, CONTENT_W)) {
    page.drawText(line, { x: MARGIN, y, size: 11.5, font: serif, color: CHARCOAL });
    y -= 17;
  }

  y -= 24;

  // ── Rules ─────────────────────────────────────────────────────────────────
  RULES.forEach((rule, index) => {
    const bodyLines = wrap(rule.body, serif, 11, CONTENT_W - 46);
    const needed = 30 + bodyLines.length * 16 + (rule.blank ? 30 : 0) + 20;
    if (y - needed < MARGIN + 40) newPage();

    // Checkbox
    page.drawRectangle({
      x: MARGIN,
      y: y - 13,
      width: 15,
      height: 15,
      borderColor: GOLD,
      borderWidth: 1.2,
      color: CREAM,
    });

    page.drawText(`${index + 1}`, {
      x: MARGIN + 26,
      y: y - 10,
      size: 11,
      font: sans,
      color: GOLD,
    });

    page.drawText(rule.title, {
      x: MARGIN + 46,
      y: y - 10,
      size: 13.5,
      font: serifBold,
      color: CHARCOAL,
    });
    y -= 30;

    for (const line of bodyLines) {
      page.drawText(line, { x: MARGIN + 46, y, size: 11, font: serif, color: CHARCOAL });
      y -= 16;
    }

    if (rule.blank) {
      y -= 8;
      page.drawText(rule.blank, { x: MARGIN + 46, y, size: 11, font: sans, color: MUTED });
      const blankWidth = sans.widthOfTextAtSize(rule.blank, 11);
      page.drawLine({
        start: { x: MARGIN + 46 + blankWidth + 4, y: y - 2 },
        end: { x: MARGIN + CONTENT_W - 20, y: y - 2 },
        thickness: 0.7,
        color: RULE,
      });
      y -= 20;
    }

    y -= 16;
  });

  // ── Close ─────────────────────────────────────────────────────────────────
  if (y < MARGIN + 150) newPage();
  y -= 6;
  page.drawLine({
    start: { x: MARGIN, y },
    end: { x: PAGE_W - MARGIN, y },
    thickness: 0.8,
    color: RULE,
  });
  y -= 30;

  page.drawText("The pattern was always there. Now you can see it.", {
    x: MARGIN,
    y,
    size: 14,
    font: serifItalic,
    color: CHARCOAL,
  });
  y -= 34;

  const outro =
    "Want to know which pattern is running in your money right now? The free Money Reset Score takes three minutes and tells you where the leak is, and which rule above matters most for you.";
  for (const line of wrap(outro, serif, 11.5, CONTENT_W)) {
    page.drawText(line, { x: MARGIN, y, size: 11.5, font: serif, color: CHARCOAL });
    y -= 17;
  }

  y -= 12;
  page.drawText("www.shekla.ai/assessment", { x: MARGIN, y, size: 12, font: serifBold, color: GOLD });

  // ── Footer on every page ──────────────────────────────────────────────────
  const pages = pdf.getPages();
  pages.forEach((p, index) => {
    p.drawText("Hidden Patterns  ·  shekla.ai", {
      x: MARGIN,
      y: 30,
      size: 8.5,
      font: sans,
      color: MUTED,
    });
    p.drawText(`${index + 1} / ${pages.length}`, {
      x: PAGE_W - MARGIN - 26,
      y: 30,
      size: 8.5,
      font: sans,
      color: MUTED,
    });
  });

  const outDir = path.join(process.cwd(), "assets", "lead-magnets");
  await mkdir(outDir, { recursive: true });
  const bytes = await pdf.save();
  await writeFile(path.join(outDir, "money-pattern-checklist.pdf"), bytes);
  console.log(`Wrote money-pattern-checklist.pdf — ${pages.length} pages, ${bytes.length} bytes.`);
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
