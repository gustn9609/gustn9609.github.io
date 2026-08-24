---
layout: default
title: Hyunsoo Kim
subtitle: Ph.D. Student, Electrical and Computer Engineering, The University of Texas at Austin
permalink: /
redirect_from:
  - /about/
  - /about.html
---

<div class="profile">
  <img src="{{ '/assets/img/avatar.png' | relative_url }}" alt="Hyunsoo Kim">
  {% include social.html %}
</div>

I am a Ph.D. student in the Department of Electrical and Computer Engineering at [The University of Texas at Austin](https://www.ece.utexas.edu/), advised by Prof. [Guandao Yang](https://www.guandaoyang.com/) and Prof. [Diana Marculescu](https://users.ece.utexas.edu/~dianam/). Before joining UT Austin, I received my M.S. in Artificial Intelligence from Korea University, where I was co-advised by Prof. [Donghyun Kim](https://cs-people.bu.edu/donhk/) and Prof. [Suhyun Kim](https://kdst.re.kr/), and my B.S. in Statistics from Inha University.

**My research aims to leverage image and video generation models to solve challenging real-world tasks, especially those related to human perception.** I am driven by the philosophy of **"Generate to Understand"**, echoing Feynman's dictum, *"What I cannot create, I do not understand."*

Beyond content creation, I see generative models as fundamental instruments for perceiving, reasoning about, and understanding the physical world. Just as large language models have grown from producing fluent text into systems that reason and solve problems, I believe vision generative models will become the key to understanding the world we live in.

<p class="contact-line">Email: <em>climba (at) utexas (dot) edu</em> &nbsp;·&nbsp; <a href="{{ '/assets/files/curriculum_vitae3.pdf' | relative_url }}">Curriculum Vitae</a></p>

## news

{% include news.html %}

## selected publications

{% assign pubs = site.data.publications.main | where: "selected", true %}
{% include publications.html %}

<p><a href="{{ '/publications/' | relative_url }}">See all publications →</a></p>

## education

<ul class="entry-list">
  <li>
    <span class="entry__when">2026 &ndash; present</span>
    <p class="entry__what"><strong>Ph.D. in Electrical and Computer Engineering</strong><span class="entry__meta">The University of Texas at Austin</span></p>
  </li>
  <li>
    <span class="entry__when">2024 &ndash; 2026</span>
    <p class="entry__what"><strong>M.S. in Artificial Intelligence</strong><span class="entry__meta">Korea University</span></p>
  </li>
  <li>
    <span class="entry__when">2018 &ndash; 2024</span>
    <p class="entry__what"><strong>B.S. in Statistics</strong><span class="entry__meta">Inha University</span></p>
  </li>
</ul>

## experience

<ul class="entry-list">
  <li>
    <span class="entry__when">2024 &ndash; 2026</span>
    <p class="entry__what"><strong>Graduate Researcher</strong><span class="entry__meta">Korea Institute of Science and Technology (KIST), Seoul, Korea</span></p>
  </li>
  <li>
    <span class="entry__when">2024</span>
    <p class="entry__what"><strong>Undergraduate Research Intern</strong><span class="entry__meta">Korea Institute of Science and Technology (KIST), Seoul, Korea</span></p>
  </li>
</ul>
