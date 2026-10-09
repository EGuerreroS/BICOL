"""
BICOL site builder.

Assembles src/index.html into a single self-contained file at index.html (next to this script):
  <!-- @include sections/x.html -->        -> contents of src/sections/x.html
  <link rel="stylesheet" href="styles/..."> -> inline <style>
  <script src="scripts/..."></script>      -> inline <script>
  src="assets/..." (local images)          -> base64 data URI

External URLs (Google Fonts, WordPress images) are left untouched.

Usage:
  python build.py            build once
  python build.py --watch    rebuild whenever a file in src/ changes
"""
import base64
import mimetypes
import re
import sys
import time
from pathlib import Path

ROOT = Path(__file__).parent
SRC = ROOT / "src"
OUT = ROOT / "index.html"

mimetypes.add_type("image/webp", ".webp")


def read(rel: str) -> str:
    return (SRC / rel).read_text(encoding="utf-8")


def build() -> None:
    html = read("index.html")
    # Drop the "this is the source" notice shown when src/index.html is opened directly
    html = re.sub(r"<!-- dev:start.*?<!-- dev:end -->\n?", "", html, flags=re.S)

    html = re.sub(
        r"<!-- @include (\S+) -->",
        lambda m: read(m.group(1)).rstrip(),
        html,
    )
    html = re.sub(
        r'<link rel="stylesheet" href="((?!https?:)[^"]+)">',
        lambda m: f"<style>/* {m.group(1)} */\n{read(m.group(1)).rstrip()}\n</style>",
        html,
    )
    html = re.sub(
        r'<script src="((?!https?:)[^"]+)"></script>',
        lambda m: f"<script>/* {m.group(1)} */\n{read(m.group(1)).rstrip()}\n</script>",
        html,
    )

    def inline_asset(m: re.Match) -> str:
        path = SRC / m.group(1)
        mime = mimetypes.guess_type(path.name)[0] or "application/octet-stream"
        data = base64.b64encode(path.read_bytes()).decode()
        return f'src="data:{mime};base64,{data}"'

    html = re.sub(r'src="(assets/[^"]+)"', inline_asset, html)

    OUT.write_text(html, encoding="utf-8")
    print(f"Built {OUT.relative_to(ROOT)} ({OUT.stat().st_size / 1024:.0f} KB)")


def watch() -> None:
    def snapshot():
        return {p: p.stat().st_mtime for p in SRC.rglob("*") if p.is_file()}

    last = snapshot()
    build()
    print("Watching src/ for changes (Ctrl+C to stop)...")
    while True:
        time.sleep(0.5)
        current = snapshot()
        if current != last:
            last = current
            try:
                build()
            except Exception as err:  # keep watching on errors
                print(f"Build failed: {err}")


if __name__ == "__main__":
    watch() if "--watch" in sys.argv else build()
