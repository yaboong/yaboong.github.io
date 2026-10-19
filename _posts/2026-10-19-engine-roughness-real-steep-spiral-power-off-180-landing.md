---
layout: post
title: "The Day I Actually Needed a Steep Spiral: Engine Roughness on the Way Home"
date: 2026-10-19
banner_image: aviation-experience.png
categories: [aviation-experience]
tags: [engine-roughness, steep-spiral, power-off-180, emergency-descent, primer, checklist, ADM]
---

## Intro
> **The steep spiral is a maneuver most of us only practice for the checkride. This time I actually had to use it.**

I was in the **right seat** practicing for my CFI, with my instructor in the left seat.
On the way back from a canceled pattern practice flight, every time I brought the RPM below 2,000, the yoke started shaking violently in my hands.
We held 2,000 RPM and flew back to our home field at 4,000ft. Over the airport, I pulled the power to idle and never touched it again: a steep spiral down, into the downwind for RWY 32, and a power-off 180 all the way to touchdown.
A week later, maintenance found the cause. Here is what happened and what we learned.

<!--more-->

## About the Flight
- **Date**: Sep 22nd, 2026
- **Aircraft**: N79NA (Piper Cherokee, P28A)
- **Route**: 7B2 → (4B8, canceled) → 7B2
- **Time**: Takeoff 11:16 EDT, Landing 11:34 EDT
- **Purpose**: Pattern practice at 4B8 (CFI training, flying from the right seat)
- **Crew**: Me in the right seat, my instructor in the left seat
- **Flying pilot**: Me. I had the controls from takeoff to touchdown.
- **ADM**: Every decision on this flight was made together by my instructor and me.

{% include image_caption_href.html title="Flight Track (FlightAware)" caption="Flight Track (FlightAware)" imageurl="/posts_image/2026-10-19/engine-roughness-1-track.png" %}

{% include video_caption.html title="Flight Track Replay (FlightAware)" caption="Flight Track Replay (FlightAware)" videourl="/posts_image/2026-10-19/engine-roughness-3-video.mp4" %}

In the second half of the altitude/speed graph the **altitude starts dropping while the speed goes up.**

> **That's the descent with the engine problem.**

Reducing RPM below 2,000 made the shaking too severe, so we held 2,000 RPM to keep the shaking to a minimum and descended with that power.
Descending without pulling the power back meant the airspeed built up a lot more than in a normal descent.
(FlightAware shows groundspeed in mph, not indicated airspeed.)

## ⚠️ The Incident
- **Return decision**: On the way to 4B8, the cloud layer was lower than we wanted, so we canceled the practice and turned back to 7B2.
- **Symptom**: At around 4,500ft, I started reducing RPM to descend. As soon as I went below 2,000 RPM, the whole airplane started to shake, and the yoke was shaking violently in my hands. At 2,000 RPM, the shaking wasn't as severe.
- **Troubleshooting**: With the electric fuel pump on, we switched fuel tanks and tried adjusting the mixture, both leaner and richer. Neither made a noticeable difference.
- **Back to the field**: Since the shaking got severe below 2,000 RPM, we decided to keep the RPM at 2,000. I descended at about 110 kts, staying clear of the clouds, and flew to 7B2 at 4,000ft.
- **Landing**: Over 7B2, I pulled the power to idle. From there, everything was at idle: a steep spiral down over the field, entering the downwind for RWY 32, and a power-off 180 to landing.

## The Cause (Found on Sep 29th, 2026)
- All **4 cylinders** on N79NA had **cracks**.
- The **primer was not locking properly**.

The primer injects fuel directly into the cylinders. With the primer not locked, extra fuel kept going into the cylinders, so the engine was running **too rich**.
- That explains why **leaning the mixture didn't help much**. The extra fuel was coming through the primer, not through the mixture control.
- And when I **reduced the throttle**, the airflow dropped while the primer fuel kept coming, making the mixture **even richer**. That showed up as engine roughness at low RPM.

#### How Can a Primer Come Unlocked?
Another CFI told me how this can happen:
- The primer plunger is locked by pushing it all the way in and turning it so the locking pin seats in its slot.
- The primer on this airplane may have been set **too tight**. When it's that stiff, it's harder to tell by feel whether it's really pushed in and turned all the way.
- If the pin isn't fully seated on the **lock** side, engine vibration can make the plunger **creep out little by little** over time, letting extra fuel into the engine.

That matches what maintenance found on N79NA: a primer that wasn't locking properly. It's a good reminder that "primer locked" on the checklist means physically confirming it's pushed in and turned, not just glancing at it.

## What Went Well (The Good)
#### 1. The Return Decision
We saw the low cloud layer and turned back instead of pushing on. Because of that, the problem happened on the way home, close to our home field.

#### 2. Troubleshooting
Even without recognizing it as engine roughness, we tried the basic fixes: fuel pump on, switching tanks, and adjusting the mixture.

#### 3. Keeping the Power That Worked
We found that the shaking wasn't as severe at 2,000 RPM, so we stayed there. I descended at about 100 kts and avoided the clouds instead of forcing the power back.

#### 4. 4,000ft to Touchdown, All at Idle
Instead of descending to pattern altitude with an engine we didn't trust, we decided to stay at 4,000ft until we were over 7B2. Then I pulled the power to idle and didn't touch it again:
steep spiral over the field → downwind for RWY 32 → power-off 180 → landing.

I think this is the part I did best. In training, the steep spiral and the power-off 180 are separate maneuvers. Here I flew them as **one continuous glide** from 4,000ft to touchdown.

The engine hadn't quit, so a go-around wasn't completely off the table if the approach became unstable. But with an engine we didn't trust, I didn't want to find out how it would respond to full power. I wanted to get it down on the first try, and I did.

## Areas for Improvement
#### 1. Recognizing It as Engine Roughness
Looking back, it was clearly engine roughness. At the time, though, I just thought the airplane was shaking. I didn't connect the vibration to the engine, even though it was coming through the yoke right in my hands.

> **Takeaway**: Unusual vibration **is** an engine problem until proven otherwise. Name it, so the right checklist comes to mind.

#### 2. Checklist Usage
Since we didn't think of it as engine roughness, the Engine Roughness checklist never came up, so we didn't run it.
The fuel pump, tank switch, and mixture are all on the checklist, but we did them from instinct. The items we weren't already thinking about, **carburetor heat** and the **magneto check (L-R-BOTH)**, were skipped entirely.
In this case neither would have fixed a stuck primer, but we had no way of knowing that in the air. Carb ice and a bad magneto are both common causes of roughness, and we never ruled them out.

{% include image_caption_href.html title="Engine Roughness Checklist" caption="Engine Roughness Checklist" imageurl="/posts_image/2026-10-19/engine-roughness-2-checklist.png" %}

> **Takeaway**: Once something feels wrong, put a name on it and pull the matching checklist.

## Q) Should we have declared PAN-PAN?

> **Looking back, I think yes.**

- The AIM (6-3-1) describes urgency as a condition of being concerned about safety and requiring timely but not immediate assistance. Unknown vibration that gets worse with less power, while the engine is still running, fits that well.
- We weren't talking to ATC, since this happened before we had requested flight following. But declaring PAN-PAN on CTAF would still have been worth it.
- It would have let any traffic in the pattern, waiting to take off, or inbound to the field know that we had a problem and needed priority. That matters even more when you're about to spiral down over a non-towered airport at idle and land without a go-around.

## A Similar Case on YouTube
I later found a video from {% include href.html text="The Flying Reporter" url="https://www.youtube.com/@TheFlyingReporter" %} with a very similar situation: a **primer** problem leading to a power-off glide approach and landing. If you've read this far, you'll probably enjoy it too.

{% include href.html text="The unexpected cause of our IN-FLIGHT EMERGENCY" url="https://youtu.be/LXrz2F2XdJY" %}

{% include youtube.html id="LXrz2F2XdJY" start="0" %}

## Final Thoughts
- I had practiced the steep spiral as a checkride maneuver. I didn't expect to need it for real, but when I did, it was exactly the right tool: lose altitude over the field with the power at idle and stay within gliding distance of the runway.
- Having my instructor next to me to make decisions with let me focus on flying the airplane. The flying part went fine. The gap was in recognizing the problem. Next time something feels off, I want my first thought to be "what is this called, and which checklist is it?"
