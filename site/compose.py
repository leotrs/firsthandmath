"""Place an exploration page that RSM built inside the content page shell.

    compose.py SHELL PAGE_JSON RSM_HTML OUT_HTML

OUT_HTML is the shell with RSM's head added to the shell's head, RSM's body in the
shell's body slot, and the colophon filled from PAGE_JSON. The page's kind (Note, Digestion) and its date line are RSM's eyebrow and date, in the page's source.
"""
import json
import re
import sys

shell_path, page_path, rsm_path, out_path = sys.argv[1:5]
shell = open(shell_path).read()
page = json.load(open(page_path))
rsm = open(rsm_path).read()

head = re.search(r"<head>(.*?)</head>", rsm, re.S).group(1)
title = re.search(r"<title>(.*?)</title>", head, re.S)
head = re.sub(r"<title>.*?</title>", "", head, flags=re.S)
# RSM links its scripts and styles relative to the page, in static/; the site serves one copy of
# them for every page, at /rsm-static/.
head = re.sub(r"""(["'(])(?:\./)?static/""", r"\1/rsm-static/", head)
body = re.search(r"<body([^>]*)>(.*)</body>", rsm, re.S)

out = shell
# RSM's styles come first, so the shell's own stylesheet wins for the shell's markup.
out = out.replace('<link rel="stylesheet" href="/base.css">', head.strip() + '\n<link rel="stylesheet" href="/base.css">')
if title:
    out = re.sub(r"<title>.*?</title>", f"<title>{title.group(1)} · Firsthand Math</title>", out, flags=re.S)
# RSM's styles and scripts read attributes it puts on <body>.
out = out.replace("<body>", f"<body{body.group(1)}>", 1)
out = out.replace('<div class="fm-body"></div>', f'<div class="fm-body">{body.group(2)}</div>')
out = out.replace("<dd>Citation</dd>", f'<dd>{page["cite"]}</dd>')
out = out.replace("<dd>Source</dd>", f'<dd>{page["source"]}</dd>')
out = out.replace("<dd>Licence</dd>", f'<dd>{page["licence"]}</dd>')
open(out_path, "w").write(out)
