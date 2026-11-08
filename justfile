# Firsthand Math. The site is built into _site/:
#   just site          the site's own pages (public/) and the one copy of the mathterpiece runtime
#   just build NAME    one exploration, explorations/NAME/, into _site/NAME/
#   just dev NAME      serve the site and rebuild NAME on every change
#   just all           the site and every exploration
#   just deploy        build everything and publish _site/ to Netlify
# Every tool runs through uv from the local development checkouts of mathterpiece and RSM.
# Each exploration is a folder holding NAME.rsm, its figures' .mtp files, figs/*.html placing
# them, and page.json with its colophon.

mtp := env("MATHTERPIECE", home_directory() / "aris/mathterpiece")
rsm := env("RSM", home_directory() / "aris/rsm")

site:
    mkdir -p _site
    cp -R public/. _site/
    # The runtime is built from the local mathterpiece checkout, so the site runs its current source.
    cd {{mtp}}/web && pnpm build >/dev/null
    cp {{mtp}}/web/dist/mathterpiece.js _site/mathterpiece.js
    # The empty content page, to look at while it is designed.
    mkdir -p _site/content-page
    cp site/content-page.html _site/content-page/index.html
    # One copy of RSM's scripts, styles and MathJax for every page, from the local RSM checkout.
    mkdir -p _site/rsm-static
    cp -R {{rsm}}/rsm/static/. _site/rsm-static/
    # RSM's build puts BRAIID's stylesheet in static/ too, from its own folder.
    cp {{rsm}}/braiid/braiid.css _site/rsm-static/braiid.css

build name:
    #!/usr/bin/env bash
    set -euo pipefail
    dir=explorations/{{name}}
    stage=_build/{{name}}
    mkdir -p "$stage" "_site/{{name}}"
    cp -R "$dir"/. "$stage"/
    # A figure imports house.mtp from its own folder.
    cp house.mtp "$stage"/
    for fig in "$stage"/*.mtp; do
      [ "$(basename "$fig")" = house.mtp ] && continue
      uv run --project {{mtp}} mtp compile "$fig" -o "$stage/figs/$(basename "$fig" .mtp).mtpc"
    done
    # RSM writes the page, its assets and its own copy of static/ into the build folder. Only the
    # page's assets go to the site; static/ is served once, at /rsm-static/ (just site).
    (cd "$stage" && uv run --project {{rsm}} rsm build {{name}}.rsm --sidebar --css ../../theme/page.css -o out/index.html)
    mkdir -p "_site/{{name}}/assets"
    cp -R "$stage"/out/assets/. "_site/{{name}}/assets/"
    uv run --no-project python site/compose.py site/content-page.html "$dir"/page.json "$stage"/out/index.html "_site/{{name}}/index.html"

# The site's own pages and every exploration.
all:
    #!/usr/bin/env bash
    set -euo pipefail
    # From an empty _site/, so that nothing left from an earlier build is published.
    if [ -d _site ]; then rm -r _site; fi
    just site
    for dir in explorations/*/; do just build "$(basename "$dir")"; done

# Build everything and publish it to the Netlify site this folder is linked to (netlify link).
deploy: all
    # The empty content page is only for designing the shell.
    rm -r _site/content-page
    npx -y netlify-cli@27.16.2 deploy --dir _site --prod

# Serve the site, rebuild NAME on every change to it, and reload the open pages.
dev name:
    uv run --no-project --with livereload python site/dev.py {{name}}

# Serve the built site.
serve port="8790":
    cd _site && uv run --no-project python -m http.server {{port}}
