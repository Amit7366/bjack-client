#!/usr/bin/env python3
"""Generate PDF from apivexo-client-feature-report.html using Chrome headless."""

import subprocess
import sys
from pathlib import Path

DOCS = Path(__file__).resolve().parent
HTML_FILE = DOCS / "apivexo-client-feature-report.html"
PDF_FILE = DOCS / "Apivexo-Client-Feature-Report.pdf"

CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"


def main() -> int:
    if not HTML_FILE.exists():
        print(f"Missing: {HTML_FILE}", file=sys.stderr)
        return 1

    if not Path(CHROME).exists():
        print(f"Chrome not found at {CHROME}", file=sys.stderr)
        print(f"HTML report is available at: {HTML_FILE}", file=sys.stderr)
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
        print(f"Generated: {PDF_FILE} ({size_kb} KB)")
        return 0

    print("PDF was not created", file=sys.stderr)
    return 1


if __name__ == "__main__":
    raise SystemExit(main())
