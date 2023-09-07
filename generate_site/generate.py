import sys
import requests
import pandas as pd

from pathlib import Path

from jinja2 import Environment, FileSystemLoader, Template


# Files
ORG = "organization.csv"

# It is a dev run?
dev = True if len(sys.argv) > 1 else False

# Organization info
df_org = pd.read_csv("organizers.csv")[["Name", "Role", "Biography"]]
df_org.fillna("", inplace=True)
# TODO: Download images? 'Headshot image' is the column name

##### Template configuration
conf = {
    "ORG": df_org.to_dict("records"),
}

templates = {"about":
    {
        "og_title": "PyLadiesCon 2023 - About Us",
        "og_description": "About PyLadiesCon.",
        "og_type": "article",
        "og_url": "https://conference.pyladies.com/about.html",
        "og_image_url": "https://conference.pyladies.com/img/icon.png",
    },
    "index": {
        "og_title": "PyLadiesCon 2023",
        "og_description": "PyLadiesCon 2023. Global PyLadies Community Conference.",
        "og_type": "website",
        "og_url": "https://conference.pyladies.com/index.html",
        "og_image_url": "https://conference.pyladies.com/img/icon.png",
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
    with open(Path("..") / f"{key}.html", "w") as f:
        print(f"writing {f=}")
        print(template_params)
        f.write(_t.render(template_params))
