---
title: Category
custom: true
---
<Head :title="$attrs.category" />
<Banner :title="$attrs.category" />
<Space :size="64" />
<ListPosts :category="$attrs.category" />