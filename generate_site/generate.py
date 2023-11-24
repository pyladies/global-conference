import csv
import sys
import random

from datetime import datetime
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

with open("sponsors.csv") as f:
    reader = csv.DictReader(f)
    _sponsors = list(reader)

sponsors = {}
for s in _sponsors:
    _type = s["type"]
    if _type not in sponsors:
        sponsors[_type] = []
    sponsors[_type].append({
        "name": s["name"],
        "image": s["image"],
        "url": s["url"],
    })

# TODO: Download images? 'Headshot image' is the column name

# Assuming https://github.com/pyladies/global-conference/pull/60 gets merged
with open("speakers.csv", encoding="utf-8-sig") as f:
    reader = csv.DictReader(f)
    speakers = list(reader)
    random.shuffle(speakers)

with open("sessions.csv", encoding="utf-8-sig") as f:
    reader = csv.DictReader(f)
    sessions_list = list(reader)

sessions = {}
for s in sessions_list:
    idx = s["ID"]
    if idx not in sessions:
        sessions[idx] = {}
    for k, v in s.items():
        if k == "ID":
            continue
        if k in ("Start", "End"):
            # 2023-12-02T20:15:00+00:00
            try:
                dtime = datetime.fromisoformat(v)
                day = "1st" if dtime.day == 1 else "2nd"
                sessions[idx][k] = f"{day};{dtime.hour:02}:{dtime.minute:02}"
            except:
                print(f"Empty Start/End time for talk: {s['Proposal title']}")
                sessions[idx][k] = f"TBD;TBD"
        else:
            sessions[idx][k] = v

##### Template configuration
conf = {
    "ORG": df_org,
    "SPEAKERS_ENABLED": True, # Toggle the "Speakers" section in the homepage
    "SPEAKERS": speakers,
    "KEYNOTES": keynotes,
    "SPONSORS": sponsors,
    "SESSIONS": sessions,
}

templates = {
    "schedule": {
        "og_title": "PyLadiesCon 2023 - Schedule",
        "og_description": "Schedule PyLadiesCon.",
        "og_type": "article",
        "og_url": "https://conference.pyladies.com/schedule.html",
        "og_image_url": "https://conference.pyladies.com/img/icon.png",
        "og_image_alt": "PyLadiesCon logo",
    },
    "speakers": {
        "og_title": "PyLadiesCon 2023 - Speakers",
        "og_description": "Speakers PyLadiesCon.",
        "og_type": "article",
        "og_url": "https://conference.pyladies.com/speakers.html",
        "og_image_url": "https://conference.pyladies.com/img/icon.png",
        "og_image_alt": "PyLadiesCon logo",
    },
    "about": {
        "og_title": "PyLadiesCon 2023 - About Us",
        "og_description": "About PyLadiesCon.",
        "og_type": "article",
        "og_url": "https://conference.pyladies.com/about.html",
        "og_image_url": "https://conference.pyladies.com/img/icon.png",
        "og_image_alt": "PyLadiesCon logo",
    },
    "coc-enforcement": {
        "og_title": "PyLadiesCon 2023 - Code of Conduct Enforcement Procedure",
        "og_description": "Code of Conduct Enforcement Procedure.",
        "og_type": "article",
        "og_url": "https://conference.pyladies.com/coc-enforcement.html",
        "og_image_url": "https://conference.pyladies.com/img/icon.png",
        "og_image_alt": "PyLadiesCon logo",
    },
    "coc-reporting": {
        "og_title": "PyLadiesCon 2023 - Code of Conduct Reporting Procedure",
        "og_description": "Code of Conduct Reporting Procedure.",
        "og_type": "article",
        "og_url": "https://conference.pyladies.com/coc-reporting.html",
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
