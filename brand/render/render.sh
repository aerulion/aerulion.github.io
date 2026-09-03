#!/bin/bash
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"

jobs='[
  {"page":"banner.html","width":600,"height":240,"scale":1,"out":"../discord-banner-600x240.png"},
  {"page":"banner.html","width":600,"height":240,"scale":2,"out":"../discord-banner-1200x480.png"},
  {"page":"banner.html","width":600,"height":240,"scale":4,"out":"../discord-banner-2400x960.png"},
  {"page":"avatar.html","width":128,"height":128,"scale":1,"out":"../discord-avatar-128.png"},
  {"page":"avatar.html","width":128,"height":128,"scale":2,"out":"../discord-avatar-256.png"},
  {"page":"avatar.html","width":128,"height":128,"scale":4,"out":"../discord-avatar-512.png"},
  {"page":"lockscreen.html","width":430,"height":932,"scale":3,"out":"../lockscreen-1290x2796.png"},
  {"page":"lockscreen.html","width":430,"height":932,"scale":6,"out":"../lockscreen-2580x5592.png"},
  {"page":"desktop.html","width":1920,"height":1080,"scale":1,"out":"../desktop-1920x1080.png"},
  {"page":"desktop.html","width":1920,"height":1080,"scale":2,"out":"../desktop-3840x2160.png"},
  {"page":"desktop.html","width":2560,"height":1440,"scale":2,"out":"../desktop-5120x2880.png"},
  {"page":"desktop.html","width":3008,"height":1692,"scale":2,"out":"../desktop-6016x3384.png"},
  {"page":"desktop.html","width":1728,"height":1117,"scale":2,"out":"../desktop-3456x2234.png"},
  {"page":"desktop.html","width":1512,"height":982,"scale":2,"out":"../desktop-3024x1964.png"},
  {"page":"banner.html","width":600,"height":240,"scale":4,"frames":112,"out":".frames-banner/%d.png"},
  {"page":"avatar.html","width":128,"height":128,"scale":4,"frames":140,"out":".frames-avatar/%d.png"}
]'

rm -rf "$HERE/.frames-banner" "$HERE/.frames-avatar"
time bun "$HERE/shoot.mjs" "$jobs"

encode() {
    local dir=$1 name=$2
    shift 2
    for size in "$@"; do
        ffmpeg -v error -y -framerate 20 -i "$HERE/$dir/%04d.png" -filter_complex \
            "[0:v]scale=${size%x*}:${size#*x}:flags=lanczos,split[a][b];[a]palettegen=max_colors=64:stats_mode=full[p];[b][p]paletteuse=dither=none:diff_mode=rectangle" \
            -loop 0 "$HERE/../$name-$size.gif"
    done
}

encode .frames-banner discord-banner 600x240 1200x480 2400x960
encode .frames-avatar discord-avatar 128x128 256x256 512x512
rm -rf "$HERE/.frames-banner" "$HERE/.frames-avatar"

ffmpeg -v error -y -i "$HERE/../lockscreen-1290x2796.png" -vf scale=430:932:flags=lanczos \
    "$HERE/../lockscreen-preview.png"

echo "== done =="
ls -lhS "$HERE/.." | head -20
