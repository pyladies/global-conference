+++
title = 'Schedule'
draft = false
layout = 3
description = "The dropdown next to the button will allow changing timezone from UTC to local timezone."
image = "/img/about-photo-2.png"
imagealt = "Three racially diverse women sitting on a sofa each with a laptop on their lap and smiling."
+++

{{< pageheader
  "Schedule"
  "The dropdown next to the button will allow changing timezone from UTC to local timezone."
  "/img/schedule-icon.png"
  >}}

# PyLadiesCon Schedule 2024

Below is the finalized schedule for the conference happening between 6-8 Dec 2024.
Some prerecorded videos might not be shown on this list but they will be broadcast during breaks.   

{{< rawhtml >}}
  <!-- begin pretalx -->
    <script type="text/javascript" src="https://pretalx.com/pyladiescon-2024/schedule/widget/v2.en.js"></script>
<pretalx-schedule event-url="https://pretalx.com/pyladiescon-2024/" locale="en" format="grid" style="--pretalx-clr-primary: #ee264d"></pretalx-schedule>
<noscript>
    <div class="pretalx-widget">
        <div class="pretalx-widget-info-message">
            JavaScript is disabled in your browser. To access our schedule without JavaScript,
            please <a target="_blank" href="https://pretalx.com/pyladiescon-2024/schedule/">click here</a>.
        </div>
    </div>
</noscript>

<script>
    // Because pretalx uses a shadow dom element, we need to inject the style tag programmatically
    const style = document.createElement('style');
    style.innerHTML = ".pretalx-schedule .settings { margin-left: 0; width: auto; }";
    style.innerHTML += ".pretalx-schedule .settings .filter-tracks { margin-right: 20px; }";

    const pretalxWrapper = document.querySelector('pretalx-schedule');
    const pretalxRoot = pretalxWrapper.shadowRoot;
    pretalxRoot.appendChild(style);
</script>
  <!-- end pretalx -->
{{< /rawhtml >}}
