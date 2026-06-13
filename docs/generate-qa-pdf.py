#!/usr/bin/env python3
"""Generate PDF from qa-test-script-bn.md using Chrome headless."""

import subprocess
import sys
from pathlib import Path

import markdown

DOCS = Path(__file__).resolve().parent
MD_FILE = DOCS / "qa-test-script-bn.md"
HTML_FILE = DOCS / "qa-test-script-bn.html"
PDF_FILE = DOCS / "qa-test-script-bn.pdf"

CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

CSS = """
@page { size: A4; margin: 12mm 10mm; }
* { box-sizing: border-box; }
body {
  font-family: "Noto Sans Bengali", "Helvetica Neue", Arial, sans-serif;
  font-size: 9.5pt;
  line-height: 1.45;
  color: #111;
  max-width: 100%;
}
h1 { font-size: 18pt; margin: 0 0 8pt; color: #0d4a2e; border-bottom: 2px solid #178358; padding-bottom: 6pt; }
h2 { font-size: 12pt; margin: 14pt 0 6pt; color: #178358; page-break-after: avoid; }
p, li { margin: 4pt 0; }
hr { border: none; border-top: 1px solid #ccc; margin: 10pt 0; }
table {
  width: 100%;
  border-collapse: collapse;
  margin: 6pt 0 10pt;
  font-size: 8.5pt;
  page-break-inside: avoid;
}
th, td {
  border: 1px solid #bbb;
  padding: 4pt 5pt;
  vertical-align: top;
  text-align: left;
}
th { background: #e8f5ee; font-weight: 700; }
tr:nth-child(even) td { background: #fafafa; }
code { font-size: 8pt; background: #f0f0f0; padding: 1pt 3pt; border-radius: 2pt; }
strong { font-weight: 700; }
em { font-style: italic; color: #555; }
.meta { margin-bottom: 10pt; }
.meta p { margin: 2pt 0; }
"""

HTML_TEMPLATE = """<!DOCTYPE html>
<html lang="bn">
<head>
  <meta charset="utf-8" />
  <title>BKBaji QA Test Script (BN)</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Bengali:wght@400;600;700&display=swap" rel="stylesheet" />
  <style>{css}</style>
</head>
<body>
{body}
</body>
</html>
"""


def main() -> int:
    if not MD_FILE.exists():
        print(f"Missing: {MD_FILE}", file=sys.stderr)
        return 1

    md_text = MD_FILE.read_text(encoding="utf-8")
    body = markdown.markdown(md_text, extensions=["tables", "nl2br", "sane_lists"])
    html = HTML_TEMPLATE.format(css=CSS, body=body)
    HTML_FILE.write_text(html, encoding="utf-8")
    print(f"Wrote {HTML_FILE}")

    if not Path(CHROME).exists():
        print(f"Chrome not found at {CHROME}", file=sys.stderr)
        return 1

    cmd = [
        CHROME,
        "--headless=new",
        "--disable-gpu",
        "--no-sandbox",
        f"--print-to-pdf={PDF_FILE}",
        "--print-to-pdf-no-header",
        f"file://{HTML_FILE}",
    ]
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        print(result.stderr or result.stdout, file=sys.stderr)
        return result.returncode

    if PDF_FILE.exists():
        size_kb = PDF_FILE.stat().st_size // 1024
        print(f"Wrote {PDF_FILE} ({size_kb} KB)")
        return 0

    print("PDF was not created", file=sys.stderr)
    return 1


if __name__ == "__main__":
    raise SystemExit(main())
