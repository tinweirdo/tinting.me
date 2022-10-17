---
title: Projects
custom: true
items:
  - name: perzine
    desc: BLOG system, includes Back-End and Front-End
    status: upcoming
    link: https://github.com/WayneWu98/perzine
    icon: 
  - name: wxml-canvas
    desc: a tool for wx mini program to parse wxml to canvas
    status: maintaining
    link: https://github.com/WayneWu98/wxml-canvas
    icon: data:image/svg+xml,%3Csvg xmlns="http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg" width="0.88em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 448 512"%3E%3Cpath fill="currentColor" d="M448 360V24c0-13.3-10.7-24-24-24H96C43 0 0 43 0 96v320c0 53 43 96 96 96h328c13.3 0 24-10.7 24-24v-16c0-7.5-3.5-14.3-8.9-18.7c-4.2-15.4-4.2-59.3 0-74.7c5.4-4.3 8.9-11.1 8.9-18.6zM128 134c0-3.3 2.7-6 6-6h212c3.3 0 6 2.7 6 6v20c0 3.3-2.7 6-6 6H134c-3.3 0-6-2.7-6-6v-20zm0 64c0-3.3 2.7-6 6-6h212c3.3 0 6 2.7 6 6v20c0 3.3-2.7 6-6 6H134c-3.3 0-6-2.7-6-6v-20zm253.4 250H96c-17.7 0-32-14.3-32-32c0-17.6 14.4-32 32-32h285.4c-1.9 17.1-1.9 46.9 0 64z"%2F%3E%3C%2Fsvg%3E
---

<Banner title="Projects" desc="All projects maintained by me" />
<Space :size="64" />
<ListProjects :projects="frontmatter.items" />