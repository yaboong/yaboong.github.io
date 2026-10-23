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
{% assign prev_doc = "" %}
{% for task in area.tasks %}
{% if task.doc and task.doc == prev_doc %}{% continue %}{% endif %}
{% assign doc = nil %}{% assign group = nil %}
{% if task.doc %}{% assign prev_doc = task.doc %}{% assign doc = site.cfi_lessons | where_exp: "d", "d.slug == task.doc" | first %}{% assign group = area.tasks | where: "doc", task.doc %}{% endif %}
{% if doc and group.size > 1 %}
<li><a href="{{ doc.url | prepend: site.baseurl }}"><strong>Task {{ group | map: "id" | join: "/" }}.</strong> {{ doc.title | split: ". " | last }}</a>
<ul>{% for t in group %}<li><strong>Task {{ t.id }}.</strong> {{ t.title }}</li>{% endfor %}</ul></li>
{% elsif doc %}
<li><a href="{{ doc.url | prepend: site.baseurl }}"><strong>Task {{ task.id }}.</strong> {{ task.title }}</a></li>
{% else %}
<li><span style="opacity:.5;"><strong>Task {{ task.id }}.</strong> {{ task.title }}</span></li>
{% endif %}
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
