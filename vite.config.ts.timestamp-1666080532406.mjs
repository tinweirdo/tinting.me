// vite.config.ts
import { resolve } from "path";
import fs3 from "file:///wayne/node_modules/fs-extra/lib/index.js";
import { defineConfig } from "file:///wayne/node_modules/vite/dist/node/index.js";
import Vue from "file:///wayne/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import WindiCSS from "file:///wayne/node_modules/vite-plugin-windicss/dist/index.mjs";
import SVG from "file:///wayne/node_modules/vite-svg-loader/index.js";
import Inspect from "file:///wayne/node_modules/vite-plugin-inspect/dist/index.mjs";
import Components from "file:///wayne/node_modules/unplugin-vue-components/dist/vite.mjs";
import eslint from "file:///wayne/node_modules/vite-plugin-eslint/dist/index.mjs";
import Pages from "file:///wayne/node_modules/vite-plugin-pages/dist/index.mjs";
import matter2 from "file:///wayne/node_modules/gray-matter/index.js";
import MarkdownIt from "file:///wayne/node_modules/markdown-it/index.js";
import Markdown from "file:///wayne/node_modules/vite-plugin-vue-markdown/dist/index.mjs";
import Shiki from "file:///wayne/node_modules/markdown-it-shiki/dist/index.mjs";
import Anchor from "file:///wayne/node_modules/markdown-it-anchor/dist/markdownItAnchor.js";
import LinkAttributes from "file:///wayne/node_modules/markdown-it-link-attributes/index.js";
import TOC from "file:///wayne/node_modules/markdown-it-table-of-contents/index.js";
import TaskLists from "file:///wayne/node_modules/markdown-it-task-lists/index.js";

// scripts/slugify.ts
import { remove } from "file:///wayne/node_modules/diacritics/index.js";
var rControl = /[\u0000-\u001F]/g;
var rSpecial = /[\s~`!@#$%^&*()\-_+=[\]{}|\\;:"'<>,.?/]+/g;
var slugify_default = (str) => {
  return remove(str).replace(rControl, "").replace(rSpecial, "-").replace(/-{2,}/g, "-").replace(/^-+|-+$/g, "").replace(/^(\d)/, "_$1").toLowerCase();
};

// scripts/excludePosts.ts
import fs from "file:///wayne/node_modules/fs-extra/lib/index.js";
import matter from "file:///wayne/node_modules/gray-matter/index.js";
var path = "./pages/posts/";
var excludePosts_default = () => {
  return fs.readdirSync(path).filter((item) => item.endsWith(".md")).filter((post) => {
    const { data } = matter(fs.readFileSync(path + post).toString());
    return data.hidden;
  }).map((post) => "**/posts/" + post);
};

// vite.config.ts
import generateSitemap from "file:///wayne/node_modules/vite-ssg-sitemap/dist/index.js";

// scripts/env.ts
import dotenv from "file:///wayne/node_modules/dotenv/lib/main.js";
import fs2 from "file:///wayne/node_modules/fs-extra/lib/index.js";
var content = fs2.readFileSync("./.env").toString();
var env_default = dotenv.parse(content);

// vite.config.ts
var __vite_injected_original_dirname = "/wayne";
var vite_config_default = defineConfig({
  resolve: {
    alias: [
      { find: "~/", replacement: `${resolve(__vite_injected_original_dirname, "src")}/` }
    ]
  },
  optimizeDeps: {
    include: [
      "vue",
      "vue-router",
      "@vueuse/core",
      "dayjs",
      "dayjs/plugin/localizedFormat"
    ]
  },
  plugins: [
    Vue({
      include: [/\.vue$/, /\.md$/],
      reactivityTransform: true
    }),
    WindiCSS({
      scan: {
        dirs: ["./src"],
        fileExtensions: ["vue", "js", "ts", "md"]
      }
    }),
    eslint(),
    Inspect(),
    Components({
      extensions: ["vue", "md"],
      dts: true,
      include: [/\.vue$/, /\.vue\?vue/, /\.md$/]
    }),
    SVG({ svgo: false }),
    Pages({
      extensions: ["vue", "md"],
      pagesDir: "pages",
      exclude: excludePosts_default(),
      importMode: "async",
      extendRoute(route) {
        const path2 = resolve(__vite_injected_original_dirname, route.component.slice(1));
        const md = fs3.readFileSync(path2, "utf-8");
        const { data, excerpt } = matter2(md, { excerpt: (file) => {
          const content2 = file.content.replace(/<[^>]*>/g, "").replace(/\[\[toc\]\]/g, "");
          file.excerpt = MarkdownIt().render(content2).replace(/<[^>]*>/g, "").replace(/\n/g, " ").replace(/\s+/, " ").slice(0, 280).concat("...");
          return file;
        } });
        route.meta = Object.assign(route.meta || {}, { frontmatter: data, excerpt });
        return route;
      }
    }),
    Markdown({
      wrapperComponent: "markdown",
      wrapperClasses: "prose m-auto",
      headEnabled: true,
      markdownItOptions: {
        quotes: `""''`
      },
      markdownItSetup(md) {
        md.use(Shiki, {
          theme: {
            dark: "github-dark",
            light: "github-light"
          }
        });
        md.use(Anchor, {
          slugify: slugify_default,
          permalink: Anchor.permalink.linkInsideHeader({
            symbol: "#",
            renderAttrs: () => ({ "aria-hidden": "true" })
          })
        });
        md.use(LinkAttributes, {
          matcher: (link) => /^https?:\/\//.test(link),
          attrs: {
            target: "_blank",
            rel: "noopener"
          }
        });
        md.use(TOC, {
          includeLevel: [1, 2, 3],
          slugify: slugify_default
        });
        md.use(TaskLists, { label: false });
      }
    })
  ],
  ssgOptions: {
    formatting: "minify",
    format: "cjs",
    onFinished() {
      generateSitemap({ hostname: env_default.VITE_DOMAIN });
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAic2NyaXB0cy9zbHVnaWZ5LnRzIiwgInNjcmlwdHMvZXhjbHVkZVBvc3RzLnRzIiwgInNjcmlwdHMvZW52LnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL3dheW5lXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvd2F5bmUvdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL3dheW5lL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgcmVzb2x2ZSB9IGZyb20gJ3BhdGgnXG5pbXBvcnQgZnMgZnJvbSAnZnMtZXh0cmEnXG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xuaW1wb3J0IFZ1ZSBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUnXG5pbXBvcnQgV2luZGlDU1MgZnJvbSAndml0ZS1wbHVnaW4td2luZGljc3MnXG5pbXBvcnQgU1ZHIGZyb20gJ3ZpdGUtc3ZnLWxvYWRlcidcbmltcG9ydCBJbnNwZWN0IGZyb20gJ3ZpdGUtcGx1Z2luLWluc3BlY3QnXG5pbXBvcnQgQ29tcG9uZW50cyBmcm9tICd1bnBsdWdpbi12dWUtY29tcG9uZW50cy92aXRlJ1xuaW1wb3J0IGVzbGludCBmcm9tICd2aXRlLXBsdWdpbi1lc2xpbnQnXG5pbXBvcnQgUGFnZXMgZnJvbSAndml0ZS1wbHVnaW4tcGFnZXMnXG5pbXBvcnQgbWF0dGVyIGZyb20gJ2dyYXktbWF0dGVyJ1xuaW1wb3J0IE1hcmtkb3duSXQgZnJvbSAnbWFya2Rvd24taXQnXG5pbXBvcnQgTWFya2Rvd24gZnJvbSAndml0ZS1wbHVnaW4tdnVlLW1hcmtkb3duJ1xuaW1wb3J0IFNoaWtpIGZyb20gJ21hcmtkb3duLWl0LXNoaWtpJ1xuaW1wb3J0IEFuY2hvciBmcm9tICdtYXJrZG93bi1pdC1hbmNob3InXG5pbXBvcnQgTGlua0F0dHJpYnV0ZXMgZnJvbSAnbWFya2Rvd24taXQtbGluay1hdHRyaWJ1dGVzJ1xuaW1wb3J0IFRPQyBmcm9tICdtYXJrZG93bi1pdC10YWJsZS1vZi1jb250ZW50cydcbmltcG9ydCBUYXNrTGlzdHMgZnJvbSAnbWFya2Rvd24taXQtdGFzay1saXN0cydcbmltcG9ydCBzbHVnaWZ5IGZyb20gJy4vc2NyaXB0cy9zbHVnaWZ5J1xuaW1wb3J0IGV4Y2x1ZGVQb3N0cyBmcm9tICcuL3NjcmlwdHMvZXhjbHVkZVBvc3RzJ1xuaW1wb3J0IGdlbmVyYXRlU2l0ZW1hcCBmcm9tICd2aXRlLXNzZy1zaXRlbWFwJ1xuaW1wb3J0IGVudiBmcm9tICcuL3NjcmlwdHMvZW52J1xuXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcmVzb2x2ZToge1xuICAgIGFsaWFzOiBbXG4gICAgICB7IGZpbmQ6ICd+LycsIHJlcGxhY2VtZW50OiBgJHtyZXNvbHZlKF9fZGlybmFtZSwgJ3NyYycpfS9gIH0sXG4gICAgXSxcbiAgfSxcbiAgb3B0aW1pemVEZXBzOiB7XG4gICAgaW5jbHVkZTogW1xuICAgICAgJ3Z1ZScsXG4gICAgICAndnVlLXJvdXRlcicsXG4gICAgICAnQHZ1ZXVzZS9jb3JlJyxcbiAgICAgICdkYXlqcycsXG4gICAgICAnZGF5anMvcGx1Z2luL2xvY2FsaXplZEZvcm1hdCcsXG4gICAgXSxcbiAgfSxcbiAgcGx1Z2luczogW1xuICAgIFZ1ZSh7XG4gICAgICBpbmNsdWRlOiBbL1xcLnZ1ZSQvLCAvXFwubWQkL10sXG4gICAgICByZWFjdGl2aXR5VHJhbnNmb3JtOiB0cnVlLFxuICAgIH0pLFxuICAgIFdpbmRpQ1NTKHtcbiAgICAgIHNjYW46IHtcbiAgICAgICAgZGlyczogWycuL3NyYyddLFxuICAgICAgICBmaWxlRXh0ZW5zaW9uczogWyd2dWUnLCAnanMnLCAndHMnLCAnbWQnXSwgLy8gYWxzbyBlbmFibGVkIHNjYW5uaW5nIGZvciBqcy90c1xuICAgICAgfSxcbiAgICB9KSxcbiAgICBlc2xpbnQoKSxcbiAgICBJbnNwZWN0KCksXG4gICAgQ29tcG9uZW50cyh7XG4gICAgICBleHRlbnNpb25zOiBbJ3Z1ZScsICdtZCddLFxuICAgICAgZHRzOiB0cnVlLFxuICAgICAgaW5jbHVkZTogWy9cXC52dWUkLywgL1xcLnZ1ZVxcP3Z1ZS8sIC9cXC5tZCQvXSxcbiAgICB9KSxcbiAgICBTVkcoeyBzdmdvOiBmYWxzZSB9KSxcbiAgICBQYWdlcyh7XG4gICAgICBleHRlbnNpb25zOiBbJ3Z1ZScsICdtZCddLFxuICAgICAgcGFnZXNEaXI6ICdwYWdlcycsXG4gICAgICBleGNsdWRlOiBleGNsdWRlUG9zdHMoKSxcbiAgICAgIGltcG9ydE1vZGU6ICdhc3luYycsXG4gICAgICBleHRlbmRSb3V0ZShyb3V0ZSkge1xuICAgICAgICBjb25zdCBwYXRoID0gcmVzb2x2ZShfX2Rpcm5hbWUsIHJvdXRlLmNvbXBvbmVudC5zbGljZSgxKSlcbiAgICAgICAgY29uc3QgbWQgPSBmcy5yZWFkRmlsZVN5bmMocGF0aCwgJ3V0Zi04JylcbiAgICAgICAgY29uc3QgeyBkYXRhLCBleGNlcnB0IH0gPSBtYXR0ZXIobWQsIHsgZXhjZXJwdDogKGZpbGUpID0+IHtcbiAgICAgICAgICBjb25zdCBjb250ZW50ID0gKChmaWxlIGFzIGFueSkuY29udGVudCBhcyBzdHJpbmcpLnJlcGxhY2UoLzxbXj5dKj4vZywgJycpLnJlcGxhY2UoL1xcW1xcW3RvY1xcXVxcXS9nLCAnJylcbiAgICAgICAgICA7KGZpbGUgYXMgYW55KS5leGNlcnB0ID0gIE1hcmtkb3duSXQoKVxuICAgICAgICAgICAgLnJlbmRlcihjb250ZW50KVxuICAgICAgICAgICAgLnJlcGxhY2UoLzxbXj5dKj4vZywgJycpXG4gICAgICAgICAgICAucmVwbGFjZSgvXFxuL2csICcgJylcbiAgICAgICAgICAgIC5yZXBsYWNlKC9cXHMrLywgJyAnKVxuICAgICAgICAgICAgLnNsaWNlKDAsIDI4MClcbiAgICAgICAgICAgIC5jb25jYXQoJy4uLicpXG4gICAgICAgICAgcmV0dXJuIGZpbGVcbiAgICAgICAgfSB9KVxuICAgICAgICByb3V0ZS5tZXRhID0gT2JqZWN0LmFzc2lnbihyb3V0ZS5tZXRhIHx8IHt9LCB7IGZyb250bWF0dGVyOiBkYXRhLCBleGNlcnB0IH0pXG4gICAgICAgIHJldHVybiByb3V0ZVxuICAgICAgfSxcbiAgICB9KSxcbiAgICBNYXJrZG93bih7XG4gICAgICB3cmFwcGVyQ29tcG9uZW50OiAnbWFya2Rvd24nLFxuICAgICAgd3JhcHBlckNsYXNzZXM6ICdwcm9zZSBtLWF1dG8nLFxuICAgICAgaGVhZEVuYWJsZWQ6IHRydWUsXG4gICAgICBtYXJrZG93bkl0T3B0aW9uczoge1xuICAgICAgICBxdW90ZXM6ICdcIlwiXFwnXFwnJyxcbiAgICAgIH0sXG4gICAgICBtYXJrZG93bkl0U2V0dXAobWQpIHtcbiAgICAgICAgbWQudXNlKFNoaWtpLCB7XG4gICAgICAgICAgdGhlbWU6IHtcbiAgICAgICAgICAgIGRhcms6ICdnaXRodWItZGFyaycsXG4gICAgICAgICAgICBsaWdodDogJ2dpdGh1Yi1saWdodCcsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSlcblxuICAgICAgICBtZC51c2UoQW5jaG9yLCB7XG4gICAgICAgICAgc2x1Z2lmeSxcbiAgICAgICAgICBwZXJtYWxpbms6IEFuY2hvci5wZXJtYWxpbmsubGlua0luc2lkZUhlYWRlcih7XG4gICAgICAgICAgICBzeW1ib2w6ICcjJyxcbiAgICAgICAgICAgIHJlbmRlckF0dHJzOiAoKSA9PiAoeyAnYXJpYS1oaWRkZW4nOiAndHJ1ZScgfSksXG4gICAgICAgICAgfSksXG4gICAgICAgIH0pXG5cbiAgICAgICAgbWQudXNlKExpbmtBdHRyaWJ1dGVzLCB7XG4gICAgICAgICAgbWF0Y2hlcjogKGxpbms6IHN0cmluZykgPT4gL15odHRwcz86XFwvXFwvLy50ZXN0KGxpbmspLFxuICAgICAgICAgIGF0dHJzOiB7XG4gICAgICAgICAgICB0YXJnZXQ6ICdfYmxhbmsnLFxuICAgICAgICAgICAgcmVsOiAnbm9vcGVuZXInLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0pXG5cbiAgICAgICAgbWQudXNlKFRPQywge1xuICAgICAgICAgIGluY2x1ZGVMZXZlbDogWzEsIDIsIDNdLFxuICAgICAgICAgIHNsdWdpZnksXG4gICAgICAgIH0pXG5cbiAgICAgICAgbWQudXNlKFRhc2tMaXN0cywgeyBsYWJlbDogZmFsc2UgfSlcblxuICAgICAgfSxcbiAgICB9KSxcbiAgXSxcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9iYW4tdHMtY29tbWVudFxuICAvLyBAdHMtaWdub3JlXG4gIHNzZ09wdGlvbnM6IHtcbiAgICBmb3JtYXR0aW5nOiAnbWluaWZ5JyxcbiAgICBmb3JtYXQ6ICdjanMnLFxuICAgIG9uRmluaXNoZWQoKSB7XG4gICAgICBnZW5lcmF0ZVNpdGVtYXAoeyBob3N0bmFtZTogZW52LlZJVEVfRE9NQUlOIH0pXG4gICAgfSxcbiAgfSxcbn0pXG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi93YXluZS9zY3JpcHRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvd2F5bmUvc2NyaXB0cy9zbHVnaWZ5LnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy93YXluZS9zY3JpcHRzL3NsdWdpZnkudHNcIjsvLyBzdHJpbmcuanMgc2x1Z2lmeSBkcm9wcyBub24gYXNjaWkgY2hhcnMgc28gd2UgaGF2ZSB0b1xuLy8gdXNlIGEgY3VzdG9tIGltcGxlbWVudGF0aW9uIGhlcmVcbmltcG9ydCB7IHJlbW92ZSB9IGZyb20gJ2RpYWNyaXRpY3MnXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29udHJvbC1yZWdleFxuY29uc3QgckNvbnRyb2wgPSAvW1xcdTAwMDAtXFx1MDAxRl0vZ1xuY29uc3QgclNwZWNpYWwgPSAvW1xcc35gIUAjJCVeJiooKVxcLV8rPVtcXF17fXxcXFxcOzpcIic8PiwuPy9dKy9nXG5cbmV4cG9ydCBkZWZhdWx0IChzdHI6IHN0cmluZyk6IHN0cmluZyA9PiB7XG4gIHJldHVybiAoXG4gICAgcmVtb3ZlKHN0cilcbiAgICAgIC8vIFJlbW92ZSBjb250cm9sIGNoYXJhY3RlcnNcbiAgICAgIC5yZXBsYWNlKHJDb250cm9sLCAnJylcbiAgICAgIC8vIFJlcGxhY2Ugc3BlY2lhbCBjaGFyYWN0ZXJzXG4gICAgICAucmVwbGFjZShyU3BlY2lhbCwgJy0nKVxuICAgICAgLy8gUmVtb3ZlIGNvbnRpbnVvcyBzZXBhcmF0b3JzXG4gICAgICAucmVwbGFjZSgvLXsyLH0vZywgJy0nKVxuICAgICAgLy8gUmVtb3ZlIHByZWZpeGluZyBhbmQgdHJhaWxpbmcgc2VwYXJ0b3JzXG4gICAgICAucmVwbGFjZSgvXi0rfC0rJC9nLCAnJylcbiAgICAgIC8vIGVuc3VyZSBpdCBkb2Vzbid0IHN0YXJ0IHdpdGggYSBudW1iZXIgKCMxMjEpXG4gICAgICAucmVwbGFjZSgvXihcXGQpLywgJ18kMScpXG4gICAgICAvLyBsb3dlcmNhc2VcbiAgICAgIC50b0xvd2VyQ2FzZSgpXG4gIClcbn1cbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL3dheW5lL3NjcmlwdHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi93YXluZS9zY3JpcHRzL2V4Y2x1ZGVQb3N0cy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vd2F5bmUvc2NyaXB0cy9leGNsdWRlUG9zdHMudHNcIjtpbXBvcnQgZnMgZnJvbSAnZnMtZXh0cmEnXG5pbXBvcnQgbWF0dGVyIGZyb20gJ2dyYXktbWF0dGVyJ1xuXG5jb25zdCBwYXRoID0gJy4vcGFnZXMvcG9zdHMvJ1xuXG5leHBvcnQgZGVmYXVsdCAoKSA9PiB7XG4gIHJldHVybiBmcy5yZWFkZGlyU3luYyhwYXRoKVxuICAgIC5maWx0ZXIoKGl0ZW0pID0+IGl0ZW0uZW5kc1dpdGgoJy5tZCcpKVxuICAgIC5maWx0ZXIoKHBvc3QpID0+IHtcbiAgICAgIGNvbnN0IHsgZGF0YSB9ID0gbWF0dGVyKGZzLnJlYWRGaWxlU3luYyhwYXRoICsgcG9zdCkudG9TdHJpbmcoKSlcbiAgICAgIHJldHVybiBkYXRhLmhpZGRlblxuICAgIH0pXG4gICAgLm1hcCgocG9zdCkgPT4gXCIqKi9wb3N0cy9cIiArIHBvc3QpXG59XG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi93YXluZS9zY3JpcHRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvd2F5bmUvc2NyaXB0cy9lbnYudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL3dheW5lL3NjcmlwdHMvZW52LnRzXCI7aW1wb3J0IGRvdGVudiBmcm9tICdkb3RlbnYnXG5pbXBvcnQgZnMgZnJvbSAnZnMtZXh0cmEnXG5cbmNvbnN0IGNvbnRlbnQgPSBmcy5yZWFkRmlsZVN5bmMoJy4vLmVudicpLnRvU3RyaW5nKClcblxuZXhwb3J0IGRlZmF1bHQgZG90ZW52LnBhcnNlPHsgVklURV9TSVRFX05BTUU6IHN0cmluZywgVklURV9ET01BSU46IHN0cmluZywgVklURV9BVVRIT1I6IHN0cmluZywgVklURV9FTUFJTDogc3RyaW5nLCBWSVRFX0RFU0NSSVBUSU9OOiBzdHJpbmd9Pihjb250ZW50KVxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFvTSxTQUFTLGVBQWU7QUFDNU4sT0FBT0EsU0FBUTtBQUNmLFNBQVMsb0JBQW9CO0FBQzdCLE9BQU8sU0FB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QU1DLFdBQVksS0FBYSxRQUFtQixRQUFRLFlBQVksRUFBRSxFQUFFLFFBQVEsZ0JBQWdCLEVBQUU7QUFDbkcsVUFBQyxLQUFhLFVBQVcsV0FBVyxFQUNsQyxPQUFPQSxRQUFPLEVBQ2QsUUFBUSxZQUFZLEVBQUUsRUFDdEIsUUFBUSxPQUFPLEdBQUcsRUFDbEIsUUFBUSxPQUFPLEdBQUcsRUFDbEIsTUFBTSxHQUFHLEdBQUcsRUFDWixPQUFPLEtBQUs7QUFDZixpQkFBTztBQUFBLFFBQ1QsRUFBRSxDQUFDO0FBQ0gsY0FBTSxPQUFPLE9BQU8sT0FBTyxNQUFNLFFBQVEsQ0FBQyxHQUFHLEVBQUUsYUFBYSxNQUFNLFFBQVEsQ0FBQztBQUMzRSxlQUFPO0FBQUEsTUFDVDtBQUFBLElBQ0YsQ0FBQztBQUFBLElBQ0QsU0FBUztBQUFBLE1BQ1Asa0JBQWtCO0FBQUEsTUFDbEIsZ0JBQWdCO0FBQUEsTUFDaEIsYUFBYTtBQUFBLE1BQ2IsbUJBQW1CO0FBQUEsUUFDakIsUUFBUTtBQUFBLE1BQ1Y7QUFBQSxNQUNBLGdCQUFnQixJQUFJO0FBQ2xCLFdBQUcsSUFBSSxPQUFPO0FBQUEsVUFDWixPQUFPO0FBQUEsWUFDTCxNQUFNO0FBQUEsWUFDTixPQUFPO0FBQUEsVUFDVDtBQUFBLFFBQ0YsQ0FBQztBQUVELFdBQUcsSUFBSSxRQUFRO0FBQUEsVUFDYjtBQUFBLFVBQ0EsV0FBVyxPQUFPLFVBQVUsaUJBQWlCO0FBQUEsWUFDM0MsUUFBUTtBQUFBLFlBQ1IsYUFBYSxPQUFPLEVBQUUsZUFBZSxPQUFPO0FBQUEsVUFDOUMsQ0FBQztBQUFBLFFBQ0gsQ0FBQztBQUVELFdBQUcsSUFBSSxnQkFBZ0I7QUFBQSxVQUNyQixTQUFTLENBQUMsU0FBaUIsZUFBZSxLQUFLLElBQUk7QUFBQSxVQUNuRCxPQUFPO0FBQUEsWUFDTCxRQUFRO0FBQUEsWUFDUixLQUFLO0FBQUEsVUFDUDtBQUFBLFFBQ0YsQ0FBQztBQUVELFdBQUcsSUFBSSxLQUFLO0FBQUEsVUFDVixjQUFjLENBQUMsR0FBRyxHQUFHLENBQUM7QUFBQSxVQUN0QjtBQUFBLFFBQ0YsQ0FBQztBQUVELFdBQUcsSUFBSSxXQUFXLEVBQUUsT0FBTyxNQUFNLENBQUM7QUFBQSxNQUVwQztBQUFBLElBQ0YsQ0FBQztBQUFBLEVBQ0g7QUFBQSxFQUdBLFlBQVk7QUFBQSxJQUNWLFlBQVk7QUFBQSxJQUNaLFFBQVE7QUFBQSxJQUNSLGFBQWE7QUFDWCxzQkFBZ0IsRUFBRSxVQUFVLFlBQUksWUFBWSxDQUFDO0FBQUEsSUFDL0M7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFsiZnMiLCAibWF0dGVyIiwgImZzIiwgImZzIiwgInBhdGgiLCAiZnMiLCAibWF0dGVyIiwgImNvbnRlbnQiXQp9Cg==
