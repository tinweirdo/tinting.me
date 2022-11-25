---
title: Projects
custom: true
comment: hidden
items:
  - name: perzine
    desc: BLOG system, includes Back-End and Front-End
    status: upcoming
    link: https://github.com/WayneWu98/perzine
  - name: wxml-canvas
    desc: A tool for wx mini program to parse wxml to canvas
    status: maintaining
    link: https://github.com/WayneWu98/wxml-canvas
  - name: raycast-youdao
    desc: A translation tool for Raycast Extension
    status: maintaining
    link: https://github.com/WayneWu98/raycast-youdao
---

<Banner title="Projects" desc="All projects maintained by me" />
<Space :size="64" />
<ListProjects :projects="frontmatter.items" />