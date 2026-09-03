import base64, pathlib, re, subprocess, sys

SP = pathlib.Path(__file__).parent
OUT = SP / "out"

def strip_exports(text):
    text = re.sub(r"^\s*export\s*\{[\s\S]*?\};\s*$", "", text, flags=re.M)
    return re.sub(r"^(\s*)export\s+(const|let|var|function|class)\b", r"\1\2", text, flags=re.M)

def indent(text, pad="        "):
    return "\n".join(pad + line if line.strip() else line for line in text.strip().splitlines())

def data_uri(path, mime):
    return f"data:{mime};base64," + base64.b64encode(path.read_bytes()).decode()

lattice = strip_exports((SP / "src/lattice.js").read_text())
morph = strip_exports((SP / "src/morphing-logo.js").read_text())

script = (SP / "brand-script.html").read_text()
script = script.replace("        LATTICE_MODULE", indent(lattice))
script = script.replace("        MORPH_MODULE", indent(morph))

# A trimmed lockscreen preview keeps the page light; the delivered file is @3x.
subprocess.run(
    ["ffmpeg", "-v", "error", "-y", "-i", str(OUT / "lockscreen-1290x2796.png"),
     "-vf", "scale=430:932:flags=lanczos", str(SP / "lockscreen-preview.png")],
    check=True,
)

body = (SP / "brand-body.html").read_text()
body = body.replace("BANNER_SRC", data_uri(OUT / "discord-banner-1200x480.png", "image/png"))
body = body.replace("AVATAR_STATIC_SRC", data_uri(OUT / "discord-avatar-256.png", "image/png"))
body = body.replace("AVATAR_GIF_SRC", data_uri(OUT / "discord-avatar-256x256.gif", "image/gif"))
body = body.replace("LOCKSCREEN_SRC", data_uri(SP / "lockscreen-preview.png", "image/png"))

page = (SP / "brand-head.html").read_text() + "\n" + body + "\n" + script
target = SP / "brand-system.html"
target.write_text(page)
print(f"{target}  {len(page) / 1e6:.2f} MB")
