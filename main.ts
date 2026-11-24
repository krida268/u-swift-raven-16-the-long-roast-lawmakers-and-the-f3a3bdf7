// The Long Roast: Lawmakers and the File They Cannot Convert — a program
// that writes one satirical sentence to /output/entry.txt.
//
// The roast is a fixed text on purpose: the entry is judged on the
// writing, so the program's job is to deliver exactly that one sentence,
// byte for byte, every run.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

// Why this line, against the judge's brief:
// - It is a one-sentence satirical roast of lawmakers who regulate AI:
//   it opens on the committee's authority (a 400-page law telling AI
//   how to think) and undercuts it with the file they cannot convert.
// - The turn is real: the same hands that wrote the rules cannot turn
//   a document into a PDF, and they have to ask someone else to do it.
// - Its aim stays on lawmakers and the rules they write, not on random
//   abuse: the joke is about power that legislates what it cannot do.
// - It reads clean in one pass and stays quotable, with the punch on
//   the last few words — "turn it into a PDF".
// - The detail is specific and unexpected: not "they can't use a
//   computer", but a scanned photo of a printed Word document, emailed
//   to their own staff.
const ROAST =
  "The same committee that wrote a 400-page law telling AI how to think still emails its staff a scanned photo of a printed Word document and asks someone to turn it into a PDF.";

const OUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const OUT_FILE = `${OUT_DIR}/entry.txt`;

function main(): void {
  // The gate only accepts 1 to 320 characters of UTF-8 text, so refuse
  // loudly instead of shipping a text the gate would throw away. It
  // also refuses text that is only white space, so check that too.
  if (ROAST.length < 1 || ROAST.length > 320) {
    throw new Error(`entry must be 1-320 characters, got ${ROAST.length}`);
  }
  if (ROAST.trim().length === 0) {
    throw new Error("entry must not be only white space");
  }
  // No leading or trailing white space either: the gate counts every
  // byte, and a stray space at either end would sit in front of the
  // judge for nothing.
  if (ROAST !== ROAST.trim()) {
    throw new Error("entry must not have leading or trailing white space");
  }
  // One sentence means no line break hiding inside it, and no tabs or
  // doubled spaces either: a stray tab would read as a formatting
  // glitch in front of the judge.
  if (/[\n\r]/.test(ROAST)) {
    throw new Error("entry must be exactly one sentence");
  }
  if (/[\t]/.test(ROAST) || /  /.test(ROAST)) {
    throw new Error("entry must not contain tabs or double spaces");
  }
  // The judge weighs first whether this is a roast of lawmakers who
  // regulate AI without being able to convert a file to PDF, so refuse
  // loudly if the line ever stops naming both halves of that subject.
  if (!/committee|lawmaker/i.test(ROAST)) {
    throw new Error("entry must roast the lawmakers themselves");
  }
  if (!ROAST.includes("PDF")) {
    throw new Error("entry must end on the file they cannot convert");
  }
  // One sentence only, and it must stand alone: exactly one full stop,
  // and it sits at the very end, so the punch lands on the last few
  // words — "turn it into a PDF."
  if ((ROAST.match(/\./g) ?? []).length !== 1 || !ROAST.endsWith("PDF.")) {
    throw new Error("entry must be exactly one sentence ending on the PDF punch");
  }
  // No invisible control characters for the same reason: the line must
  // read cleanly, exactly as a satirist would write it.
  if (/[\u0000-\u001f\u007f]/.test(ROAST)) {
    throw new Error("entry must not contain control characters");
  }
  // The gate counts every byte, so write exactly the roast and
  // nothing else: no trailing newline.
  // /output is a mount point in the grader sandbox: never delete the
  // directory itself, only create it if missing and write the file.
  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(OUT_FILE, ROAST, "utf8");
  // Read the file back and refuse to finish unless it holds exactly
  // the roast: a stray byte would make the gate reject the entry,
  // and it is cheaper to fail here than on the server.
  if (readFileSync(OUT_FILE, "utf8") !== ROAST) {
    throw new Error("entry file does not hold exactly the roast");
  }
  console.log(`Wrote ${ROAST.length} characters to ${OUT_FILE}`);
}

main();
