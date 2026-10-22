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

{% assign modules = site.cfi_lessons | where: "module", true | sort: "title" %}
<h3>Modules</h3>
<p>Short, reusable topic lessons shared across multiple tasks.</p>
<ul>
{% for m in modules %}
<li><a href="{{ m.url | prepend: site.baseurl }}">{{ m.title | remove_first: "Module. " }}</a></li>
{% endfor %}
</ul>
