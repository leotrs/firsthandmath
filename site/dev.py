"""Serve _site/ and rebuild one exploration on every change, reloading the open pages.

    just dev NAME
"""
import subprocess
import sys

from livereload import Server

NAME = sys.argv[1]
PORT = 8790


def site():
    subprocess.run(["just", "site"], check=False)


def build():
    subprocess.run(["just", "build", NAME], check=False)


site()
build()
server = Server()
server.watch("public/", site, delay=0.3)
for path in [f"explorations/{NAME}/", "house.mtp", "theme/", "site/content-page.html", "site/compose.py"]:
    server.watch(path, build, delay=0.3)
server.serve(root="_site", port=PORT, host="localhost", open_url_delay=None)
