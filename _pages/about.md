---
permalink: /
title: ""
excerpt: ""
author_profile: true
redirect_from: 
  - /about/
  - /about.html
---

{% if site.google_scholar_stats_use_cdn %}
{% assign gsDataBaseUrl = "https://cdn.jsdelivr.net/gh/" | append: site.repository | append: "@" %}
{% else %}
{% assign gsDataBaseUrl = "https://raw.githubusercontent.com/" | append: site.repository | append: "/" %}
{% endif %}
{% assign url = gsDataBaseUrl | append: "google-scholar-stats/gs_data_shieldsio.json" %}

<span class='anchor' id='about-me'></span>
<div class="about-hero-card">
  <p class="about-hero-card__lead">I am currently an M.S. student at Korea University, co-advised by Prof. <a href="https://cs-people.bu.edu/donhk/">Donghyun Kim</a> and Prof. <a href="https://kdst.re.kr/">Suhyun Kim</a> at Kyung Hee University (formerly at KIST), and will join The University of Texas at Austin as an incoming Ph.D. student.</p>

  <p><strong>My research interest is to leverage image/video generation models to solve challenging and complex real-world tasks, especially those related to human perception.</strong> I am driven by the philosophy of <strong>"Generate to Understand"</strong>, echoing Feynman's dictum, <em>"What I cannot create, I do not understand"</em>.</p>

  <p>Beyond mere content creation, I aim to leverage generative models as fundamental instruments to solve complex real-world tasks. I believe that just as LLMs have evolved to reason and solve problems, vision generative models will ultimately serve as the key to perceiving, reasoning about, and understanding the physical world.</p>
</div>

<!-- My research interests lie in generative modeling, diffusion models, and their applications to visual understanding and generation. Beyond various content generation, **my research interest is to leverage image/video generation models to solve challenging and complex real-world tasks, especially those related to human perception.** I believe that image/video generation models will ultimately solve most computer vision tasks that perceive, understand, and reason based on images or videos. In the Natural Language Processing (NLP) field, we have already seen Large Language Models (LLMs) go beyond simply generating natural (human-like) text to writing thousands of lines of code, solving extremely difficult mathematical problems, and even conducting deep research. I anticipate a similar evolution in the vision domain. Image/video generation models will become even more powerful, establishing themselves not merely as tools for generation, but as tools that solve many challenging multimodal perception, physics-based problems or real world applications such as inverse problems.

**Generate to Understand.** My long-term goal is to build intelligent systems that can understand the real world in ways human would. To achieve this, generative models are the most powerful and essential instruments for approximating the complex distributions of the physical world, which directly echoes Feynman's dictum, *"What I cannot create, I do not understand"*. Namely, my research philosophy is "Generate to Understand". To truly understand a system; whether it be the data manifold, the behavior of a deep neural network, or the physical real-world; we must be able to synthesize it, approximate its representations, and reconstruct it. Given this philosophy, how can we best utilize and advance generative models as fundamental instruments for understanding, and which challenging real-world problems can we solve by doing so? -->

<p class="about-contact">Email: <em>climba (at) korea (dot) edu</em> <span class="about-contact__divider">|</span> <a href="images/HyunsooKim_CV_1217.pdf">Curriculum Vitae</a></p>

# 📝 Publications 

<div class="publication-list">
  <article class="publication-card publication-card--preprint">
    <div class="publication-card__header">
      <span class="pub-badge pub-badge--preprint" style="display:inline-block;padding:0.28rem 0.7rem;border-radius:999px;border:1px solid rgba(154,90,0,0.12);background:rgba(212,138,37,0.14);color:#9a5a00;font-size:0.78em;font-weight:700;letter-spacing:0.04em;text-transform:uppercase;">preprint</span>
    </div>
    <h3 class="publication-card__title">Correlation-Weighted Multi-Reward Optimization for Compositional Generation</h3>
    <p class="publication-card__authors">Jungmyung Wi, <strong>Hyunsoo Kim</strong>, Donghyun Kim.</p>
    <div class="publication-card__links">
      <a href="https://arxiv.org/abs/2603.18528">arxiv</a>
    </div>
  </article>

  <article class="publication-card publication-card--preprint">
    <div class="publication-card__header">
      <span class="pub-badge pub-badge--preprint" style="display:inline-block;padding:0.28rem 0.7rem;border-radius:999px;border:1px solid rgba(154,90,0,0.12);background:rgba(212,138,37,0.14);color:#9a5a00;font-size:0.78em;font-weight:700;letter-spacing:0.04em;text-transform:uppercase;">preprint</span>
    </div>
    <h3 class="publication-card__title">Consistency-Preserving Concept Erasure via Unsafe-Safe Pairing and Directional Fisher-weighted Adaptation</h3>
    <p class="publication-card__authors">Yongwoo Kim*, Sungmin Cha*, <strong>Hyunsoo Kim</strong>, Jaewon Lee, Donghyun Kim. <span class="publication-card__note">(*: Equal contribution)</span></p>
    <div class="publication-card__links">
      <a href="https://arxiv.org/abs/2602.05339">arxiv</a>
    </div>
  </article>

  <article class="publication-card publication-card--preprint">
    <div class="publication-card__header">
      <span class="pub-badge pub-badge--preprint" style="display:inline-block;padding:0.28rem 0.7rem;border-radius:999px;border:1px solid rgba(154,90,0,0.12);background:rgba(212,138,37,0.14);color:#9a5a00;font-size:0.78em;font-weight:700;letter-spacing:0.04em;text-transform:uppercase;">preprint</span>
    </div>
    <h3 class="publication-card__title">Self-Improving Diffusion Classifiers with Minority Preference Optimization</h3>
    <p class="publication-card__authors"><strong>Hyunsoo Kim*</strong>, Jungmyung Wi*, Soobin Um, Donghyun Kim†, Suhyun Kim†.</p>
  </article>

  <article class="publication-card publication-card--preprint">
    <div class="publication-card__header">
      <span class="pub-badge pub-badge--preprint" style="display:inline-block;padding:0.28rem 0.7rem;border-radius:999px;border:1px solid rgba(154,90,0,0.12);background:rgba(212,138,37,0.14);color:#9a5a00;font-size:0.78em;font-weight:700;letter-spacing:0.04em;text-transform:uppercase;">preprint</span>
    </div>
    <h3 class="publication-card__title">Safety-Aware Image-to-Image Translation without Paired Data</h3>
    <p class="publication-card__authors"><strong>Hyunsoo Kim</strong>, Wonjun Lee, Donghyun Kim, Suhyun Kim.</p>
  </article>

  <article class="publication-card publication-card--icml">
    <div class="publication-card__header">
      <span class="pub-badge pub-badge--icml" style="display:inline-block;padding:0.28rem 0.7rem;border-radius:999px;border:1px solid rgba(11,87,208,0.12);background:rgba(26,115,232,0.14);color:#0b57d0;font-size:0.78em;font-weight:700;letter-spacing:0.04em;text-transform:uppercase;">ICML 2025</span>
    </div>
    <h3 class="publication-card__title">When Model Knowledge meets Diffusion Model: Diffusion-assisted Data-free Image Synthesis with Alignment of Domain and Class</h3>
    <p class="publication-card__authors">Yujin Kim*, <strong>Hyunsoo Kim*</strong>, Hyunsoo J. Kim, Suhyun Kim. <span class="publication-card__note">(*: Equal contribution)</span></p>
    <div class="publication-card__links">
      <a href="https://kdst-team.github.io/DDIS/">project</a>
      <a href="https://arxiv.org/abs/2506.15381">arxiv</a>
    </div>
  </article>

  <article class="publication-card publication-card--cvpr">
    <div class="publication-card__header">
      <span class="pub-badge pub-badge--cvpr" style="display:inline-block;padding:0.28rem 0.7rem;border-radius:999px;border:1px solid rgba(13,107,86,0.12);background:rgba(20,134,109,0.14);color:#0d6b56;font-size:0.78em;font-weight:700;letter-spacing:0.04em;text-transform:uppercase;">CVPR 2025</span>
    </div>
    <h3 class="publication-card__title">Difference Inversion: Interpolate and Isolate the Difference with Token Consistency for Image Analogy Generation</h3>
    <p class="publication-card__authors"><strong>Hyunsoo Kim</strong>, Donghyun Kim†, Suhyun Kim†.</p>
    <div class="publication-card__links">
      <a href="https://kdst-team.github.io/DifferenceInversion/">project</a>
      <a href="https://arxiv.org/abs/2506.07750">arxiv</a>
    </div>
  </article>
</div>

# 💻 Work Experience
- *2024.09 - Present*, Korea Institute of Science and Technology, Graduate Researcher, Seoul, Korea.
- *2024.03 - 2024.06*, Korea Institute of Science and Technology, Undergraduate Research Intern, Seoul, Korea.
<!-- Add your work experience here -->

# 🤝 Academic Services
- Conference reviewer: `AAAI`, `ICLR`, `CVPR`
<!-- Add your academic services here -->

# 📖 Educations

- *2024.09 - Present*, Korea University, M.S. in Computer Science (in progress).
- *2018.03 - 2024.08*, Inha University, B.S. in Statistics.

<!-- # 💬 Invited Talks
- *2021.06*, Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus ornare aliquet ipsum, ac tempus justo dapibus sit amet. 
- *2021.03*, Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus ornare aliquet ipsum, ac tempus justo dapibus sit amet.  \| [\[video\]](https://github.com/) -->
