"""Refuse to publish a widget whose static picture is older than its figure.

    check_statics.py

A widget's pictures (figs/X-*.png, made by `just statics`) show its figure X.mtp at its starting
position, or in a state listed in figs/X.states.json. When X.mtp has changed since, the pictures may show
an old figure, so this lists them and fails.
"""
import sys
from pathlib import Path

stale = []
for figure in sorted(Path("explorations").glob("*/*.mtp")):
    for picture in sorted((figure.parent / "figs").glob(f"{figure.stem}-*.png")):
        if picture.stat().st_mtime < figure.stat().st_mtime:
            stale.append(picture)
if stale:
    print("Static pictures older than their figures; run `just statics NAME`:")
    for picture in stale:
        print(f"  {picture}")
    sys.exit(1)
