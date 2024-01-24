---
title: Projects
custom: true
comment: hidden
items:
  - name: map demo
    desc: Practice for GIS.
    status: upcoming #upcoming,maintaining
    link: ./mapdemo/index.html
---

<Banner title="Projects" desc="All projects maintained by me" />
<Space :size="64" />
<ListProjects :projects="frontmatter.items" />