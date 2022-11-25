---
title: Category
custom: true
comments: disabled
---
<Head :title="$attrs.category" />
<Banner :title="$attrs.category" />
<Space :size="64" />
<ListPosts :category="$attrs.category" />