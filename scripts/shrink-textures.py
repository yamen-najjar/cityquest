"""Shrinks the downloaded model textures to 512 px (props are small on screen) and recompresses every
JPEG, so the cutscene assets stay light on a phone connection. Surface textures (tex/) keep 1024 px.

Usage: python scripts/shrink-textures.py
"""
from pathlib import Path

from PIL import Image

root = Path(__file__).resolve().parent.parent / "public" / "assets" / "ph"
before = after = 0
for path in root.rglob("*.jpg"):
    size = path.stat().st_size
    before += size
    limit = 512 if "models" in path.parts else 1024
    with Image.open(path) as im:
        im.load()
        if max(im.size) > limit:
            im = im.resize((limit, limit * im.size[1] // im.size[0]), Image.LANCZOS)
        im.convert("RGB").save(path, "JPEG", quality=82, optimize=True, progressive=True)
    after += path.stat().st_size
print(f"JPEG total: {before / 1048576:.1f} MB -> {after / 1048576:.1f} MB")
