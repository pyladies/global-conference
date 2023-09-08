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
df_org = pd.read_csv("organizers.csv", na_values="-")[["Name", "Role", "Biography"]]
df_org.fillna("", inplace=True)
# TODO: Download images? 'Headshot image' is the column name

##### Template configuration
conf = {
    "ORG": df_org.to_dict("records"),
}

templates = ["about", "index"]
environment = Environment(loader=FileSystemLoader("templates/"))

for _template in templates:
    _t = environment.from_string(open(f"templates/{_template}-base.html").read())

    # Write final HTML
    with open(Path("..") / f"{_template}.html", "w") as f:
        f.write(_t.render(conf))
