---
title: Projects
custom: true
comment: hidden
items:
  - name: Canvaskit
    desc: A cross-platform canvas based on wasm!!!
    status: upcoming
    link: https://github.com/WayneWu98/canvaskit
  - name: Keyshorts
    desc: Keyshorts helps you add keyboard shortcuts to your website quickly and easily!!!
    status: maintaining
    link: https://github.com/WayneWu98/keyshorts
  - name: wayne-wu.com
    desc: My personal website.
    status: maintaining
    link: https://github.com/WayneWu98/wayne-wu.com
  - name: Perzine
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