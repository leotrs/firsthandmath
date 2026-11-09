"""Refuse to publish a widget whose static picture is older than its figure.

    check_statics.py

A widget's static pictures (figs/X-static.png and figs/X-static-dark.png, made by `just statics`)
show its figure X.mtp at its starting position. When X.mtp has changed since, the pictures may show
an old figure, so this lists them and fails.
"""
import sys
from pathlib import Path

stale = []
for figure in sorted(Path("explorations").glob("*/*.mtp")):
    for suffix in ("-static.png", "-static-dark.png"):
        picture = figure.parent / "figs" / f"{figure.stem}{suffix}"
        if picture.exists() and picture.stat().st_mtime < figure.stat().st_mtime:
            stale.append(picture)
if stale:
    print("Static pictures older than their figures; run `just statics NAME`:")
    for picture in stale:
        print(f"  {picture}")
    sys.exit(1)
