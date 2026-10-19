---
layout: post
title: "Convective SIGMET Valid Time Cut to 1 Hour (Effective Dec 1, 2026)"
date: 2026-10-19
banner_image: aviation-FARAIM.png
categories: [FAR/AIM]
tags: [convective-SIGMET, SIGMET, WST, aviation-weather, Aeronautical-Information-Manual, AIM]
---

## Intro
> Starting December 1, 2026, a Convective SIGMET is valid for 1 hour, not 2.

* Source: {% include href.html text="[NWS] Service Change Notice 26-85" url="https://www.weather.gov/media/notification/pdf_2026/scn26-85_Convective_SIGMET_Changes.pdf" %}, {% include href.html text="[AIM][7-1-6] Inflight Aviation Weather Advisories" url="https://www.faa.gov/air_traffic/publications/atpubs/aim_html/chap7_section_1.html" %}

<!--more-->


> ⚠️ This content is for educational and informational purposes only. 
It does not constitute legal advice or an official FAA guideline.
Always refer to the latest FAR/AIM and official regulations for actual flight operations.
The author assumes no liability for errors or omissions in the content.

### TL;DR;
* Effective: **December 1, 2026, 1200 UTC** (on or about)
* Convective SIGMET **valid time changes from 2 hours to 1 hour.**
* The **Outlook section** is replaced with a reference to other NWS products (SPC, NDFD, GFA).
* Issuance schedule stays the same: hourly at **H+55**.

<br/>

### NWS Service Change Notice 26-85
The Aviation Weather Center (AWC) announced the change on September 15, 2026, based on a joint FAA/NWS working group recommendation.

{% include image_caption_href.html title="NWS Service Change Notice 26-85" caption="NWS Service Change Notice 26-85" imageurl="/posts_image/2026-10-19/SCN_26-85.png" %}

> 1. Change the valid time from 2 hours to 1 hour.
> 2. Replace the outlook section with a reference to other NWS products that provide similar information.

<br/>

### What's Updated? -> {% include href.html text="[AIM][7-1-6] Inflight Aviation Weather Advisories" url="https://www.faa.gov/air_traffic/publications/atpubs/aim_html/chap7_section_1.html" %}
AIM 7-1-6e(3) now reads **"The forecast is valid for up to 1 hour."**

{% include image_caption_href.html title="AIM 7-1-6e Convective SIGMET" caption="AIM 7-1-6e Convective SIGMET" imageurl="/posts_image/2026-10-19/AIM-7-1-6.png" %}

The rest of 7-1-6e is unchanged. Quick review:
* **Issued for** (conterminous U.S. only, not Alaska or Hawaii):
  * Severe thunderstorm due to surface winds ≥ 50 kt, surface hail ≥ 3/4 inch, or tornadoes
  * Embedded thunderstorms
  * A line of thunderstorms
  * Thunderstorms with heavy or greater precipitation affecting 40% or more of an area of at least 3,000 square miles
* **Implies** severe or greater turbulence, severe icing, and low-level wind shear.
* **Areas**: Western (W), Central (C), and Eastern (E) U.S., divided at 87°W and 107°W.
* **Issued** hourly at H+55. Specials are issued at any time as required. "CONVECTIVE SIGMET... NONE" is issued when nothing meets the criteria.
* **Numbered** sequentially per area from 00Z each day. A continuing phenomenon is reissued every hour with a new number.

<br/>

### What It Looks Like
Example from SCN 26-85. Issued at 1755Z, valid until 1855Z, which is exactly 1 hour.

```
WSUS32 KKCI 041755
SIGC 
MKCC WST 041755
CONVECTIVE SIGMET 94C
VALID UNTIL 1855Z
TX OK KS
FROM 70NW OSW-40SSW BUM-40W FSM-40N CWK-40ENE SJT-70NW OSW
AREA SEV EMBD TS MOV FROM 21040KT. TOPS ABV FL450.
TORNADOES...HAIL TO 2 IN...WIND GUSTS TO 60KT POSS.
...
OUTLOOK VALID 041855-042355
NWS CONVECTIVE PRODUCTS ARE AVAILABLE FROM THE STORM PREDICTION 
CENTER, NATIONAL DIGITAL FORECAST DATABASE, AND 
AVIATIONWEATHER.GOV.
```

Under the old format, a WST issued at 1755Z was valid until 1955Z. The outlook section described areas where new Convective SIGMETs were expected over the next 2–6 hours. Now the outlook only points you to other products.

<br/>

### Where to Look for the Outlook Instead
SCN 26-85 lists these products for assessing the potential for future Convective SIGMETs.
1. {% include href.html text="SPC Convective Outlook (severity)" url="https://www.spc.noaa.gov/products/outlook/" %}
2. {% include href.html text="SPC Thunderstorm Outlook (probabilities)" url="https://www.spc.noaa.gov/products/exper/enhtstm/" %}
3. {% include href.html text="NDFD (weather)" url="https://digital.weather.gov/" %}
4. {% include href.html text="GFA Thunderstorms (coverage)" url="https://aviationweather.gov/gfa/#thunder" %}

<br/>

### Summary of Updates

| | Before | After (Dec 1, 2026) |
|---|---|---|
| Valid time | 2 hours | **1 hour** |
| Outlook section | 2–6 hour outlook for expected Convective SIGMET areas | Reference to SPC / NDFD / aviationweather.gov |
| Issuance | Hourly at H+55 | Hourly at H+55 (no change) |

* A Convective SIGMET now expires in 1 hour. If you're briefing well before departure, check again for the newest one.
* For anything beyond the next hour, the WST no longer helps. Use SPC outlooks and the GFA.
