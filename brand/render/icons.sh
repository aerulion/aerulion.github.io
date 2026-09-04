#!/bin/bash
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
PUB="$HERE/../../public"
TMP="$HERE/.icons"

# box = the mark's square box as a fraction of the canvas.
# 0.86 matches the site favicon; apple rounds its corners so it gets more air;
# a maskable icon must survive a circular crop at 80% of the canvas, and the
# box's diagonal is what has to fit inside that circle.
jobs='[
  {"page":"icon.html","query":"?box=0.86","width":16,"height":16,"scale":1,"out":".icons/favicon-16x16.png"},
  {"page":"icon.html","query":"?box=0.86","width":32,"height":32,"scale":1,"out":".icons/favicon-32x32.png"},
  {"page":"icon.html","query":"?box=0.86","width":48,"height":48,"scale":1,"out":".icons/favicon-48x48.png"},
  {"page":"icon.html","query":"?box=0.78","width":180,"height":180,"scale":1,"out":".icons/apple-touch-icon.png"},
  {"page":"icon.html","query":"?box=0.86","width":192,"height":192,"scale":1,"out":".icons/android-chrome-192x192.png"},
  {"page":"icon.html","query":"?box=0.86","width":512,"height":512,"scale":1,"out":".icons/android-chrome-512x512.png"},
  {"page":"icon.html","query":"?box=0.56","width":512,"height":512,"scale":1,"out":".icons/maskable-512x512.png"},
  {"page":"og.html","width":1200,"height":630,"scale":1,"out":".icons/og.png"},
  {"page":"og.html","query":"?variant=design","width":1200,"height":630,"scale":1,"out":".icons/og-design.png"}
]'

rm -rf "$TMP"
bun "$HERE/shoot.mjs" "$jobs"

bun "$HERE/ico.mjs" "$TMP/favicon.ico" \
    "$TMP/favicon-16x16.png" "$TMP/favicon-32x32.png" "$TMP/favicon-48x48.png"

cp -f "$TMP/favicon-16x16.png" "$TMP/favicon-32x32.png" "$TMP/favicon.ico" \
      "$TMP/apple-touch-icon.png" \
      "$TMP/android-chrome-192x192.png" "$TMP/android-chrome-512x512.png" \
      "$TMP/maskable-512x512.png" "$PUB/"
cp -f "$TMP/apple-touch-icon.png" "$PUB/apple-touch-icon-precomposed.png"
cp -f "$TMP/og.png" "$PUB/assets/images/og.png"
cp -f "$TMP/og-design.png" "$PUB/assets/images/og-design.png"

bun "$HERE/favicon-svg.mjs" > "$PUB/favicon.svg"

rm -rf "$TMP"
echo "== icons done =="
ls -lh "$PUB"/*.png "$PUB"/*.ico "$PUB"/favicon.svg "$PUB/assets/images/og.png" "$PUB/assets/images/og-design.png"
