import csv
import sys

from pathlib import Path

from jinja2 import Environment, FileSystemLoader


# It is a dev run?
dev = True if len(sys.argv) > 1 else False

# Organization info from the csv
with open("organizers.csv") as f:
    reader = csv.DictReader(f)
    df_org = list(reader)

# Keynote info from the csv
with open("keynotes.csv") as f:
    reader = csv.DictReader(f)
    keynotes = list(reader)

# TODO: Download images? 'Headshot image' is the column name

##### Template configuration
conf = {
    "ORG": df_org,
    "KEYNOTES": keynotes[:2], # only two keynotes
}

templates = {
    "about": {
        "og_title": "PyLadiesCon 2023 - About Us",
        "og_description": "About PyLadiesCon.",
        "og_type": "article",
        "og_url": "https://conference.pyladies.com/about.html",
        "og_image_url": "https://conference.pyladies.com/img/icon.png",
        "og_image_alt": "PyLadiesCon logo",
    },
    "sponsors": {
        "og_title": "PyLadiesCon 2023 - Sponsors",
        "og_description": "Sponsoring PyLadiesCon.",
        "og_type": "article",
        "og_url": "https://conference.pyladies.com/sponsors.html",
        "og_image_url": "https://conference.pyladies.com/img/icon.png",
        "og_image_alt": "PyLadiesCon logo",
    },
    "index": {
        "og_title": "PyLadiesCon 2023",
        "og_description": "PyLadiesCon 2023. Global PyLadies Community Conference.",
        "og_type": "website",
        "og_url": "https://conference.pyladies.com/index.html",
        "og_image_url": "https://conference.pyladies.com/img/icon.png",
        "og_image_alt": "PyLadiesCon logo",
    },
}

environment = Environment(loader=FileSystemLoader("templates/"))

for key, value in templates.items():
    _t = environment.from_string(
        open(f"templates/{key}-base.html").read()
    )
    template_params = conf
    template_params.update(value)
    # Write final HTML
    fname = Path("..") / f"{key}.html"
    with open(fname, "w") as f:
        print(f"writing {fname}")
        f.write(_t.render(template_params))
