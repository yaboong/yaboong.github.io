---
layout: page
title: CFI Lesson Plan
description: CFI lesson plans organized by the Flight Instructor ACS areas of operation and tasks.
permalink: /cfi-lesson-plan/
sitemap: false
---
Lesson plans organized by the Flight Instructor ACS (Airplane) areas of operation and tasks.

{% for area in site.data.cfi_acs.areas %}
<h3>Area of Operation {{ area.roman }}. {{ area.title }}</h3>
<ul>
{% for task in area.tasks %}
{% assign doc = nil %}{% if task.doc %}{% assign doc = site.cfi_lessons | where_exp: "d", "d.slug == task.doc" | first %}{% endif %}
<li>{% if doc %}<a href="{{ doc.url | prepend: site.baseurl }}"><strong>Task {{ task.id }}.</strong> {{ task.title }}</a>{% else %}<span style="opacity:.5;"><strong>Task {{ task.id }}.</strong> {{ task.title }}</span>{% endif %}</li>
{% endfor %}
</ul>
{% endfor %}
