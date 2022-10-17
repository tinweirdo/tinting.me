// vite.config.ts
import { resolve } from "path";
import fs2 from "file:///wayne/node_modules/fs-extra/lib/index.js";
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
        const md = fs2.readFileSync(path2, "utf-8");
        const { data, excerpt } = matter2(md, { excerpt: (file) => {
          const content = file.content.replace(/<[^>]*>/g, "").replace(/\[\[toc\]\]/g, "");
          file.excerpt = MarkdownIt().render(content).replace(/<[^>]*>/g, "").replace(/\n/g, " ").replace(/\s+/, " ").slice(0, 280).concat("...");
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
    format: "cjs"
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAic2NyaXB0cy9zbHVnaWZ5LnRzIiwgInNjcmlwdHMvZXhjbHVkZVBvc3RzLnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL3dheW5lXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvd2F5bmUvdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL3dheW5lL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgcmVzb2x2ZSB9IGZyb20gJ3BhdGgnXG5pbXBvcnQgZnMgZnJvbSAnZnMtZXh0cmEnXG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xuaW1wb3J0IFZ1ZSBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUnXG5pbXBvcnQgV2luZGlDU1MgZnJvbSAndml0ZS1wbHVnaW4td2luZGljc3MnXG5pbXBvcnQgU1ZHIGZyb20gJ3ZpdGUtc3ZnLWxvYWRlcidcbmltcG9ydCBJbnNwZWN0IGZyb20gJ3ZpdGUtcGx1Z2luLWluc3BlY3QnXG5pbXBvcnQgQ29tcG9uZW50cyBmcm9tICd1bnBsdWdpbi12dWUtY29tcG9uZW50cy92aXRlJ1xuaW1wb3J0IGVzbGludCBmcm9tICd2aXRlLXBsdWdpbi1lc2xpbnQnXG5pbXBvcnQgUGFnZXMgZnJvbSAndml0ZS1wbHVnaW4tcGFnZXMnXG5pbXBvcnQgbWF0dGVyIGZyb20gJ2dyYXktbWF0dGVyJ1xuaW1wb3J0IE1hcmtkb3duSXQgZnJvbSAnbWFya2Rvd24taXQnXG5pbXBvcnQgTWFya2Rvd24gZnJvbSAndml0ZS1wbHVnaW4tdnVlLW1hcmtkb3duJ1xuaW1wb3J0IFNoaWtpIGZyb20gJ21hcmtkb3duLWl0LXNoaWtpJ1xuaW1wb3J0IEFuY2hvciBmcm9tICdtYXJrZG93bi1pdC1hbmNob3InXG5pbXBvcnQgTGlua0F0dHJpYnV0ZXMgZnJvbSAnbWFya2Rvd24taXQtbGluay1hdHRyaWJ1dGVzJ1xuaW1wb3J0IFRPQyBmcm9tICdtYXJrZG93bi1pdC10YWJsZS1vZi1jb250ZW50cydcbmltcG9ydCBUYXNrTGlzdHMgZnJvbSAnbWFya2Rvd24taXQtdGFzay1saXN0cydcbmltcG9ydCBzbHVnaWZ5IGZyb20gJy4vc2NyaXB0cy9zbHVnaWZ5J1xuaW1wb3J0IGV4Y2x1ZGVQb3N0cyBmcm9tICcuL3NjcmlwdHMvZXhjbHVkZVBvc3RzJ1xuXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcmVzb2x2ZToge1xuICAgIGFsaWFzOiBbXG4gICAgICB7IGZpbmQ6ICd+LycsIHJlcGxhY2VtZW50OiBgJHtyZXNvbHZlKF9fZGlybmFtZSwgJ3NyYycpfS9gIH0sXG4gICAgXSxcbiAgfSxcbiAgb3B0aW1pemVEZXBzOiB7XG4gICAgaW5jbHVkZTogW1xuICAgICAgJ3Z1ZScsXG4gICAgICAndnVlLXJvdXRlcicsXG4gICAgICAnQHZ1ZXVzZS9jb3JlJyxcbiAgICAgICdkYXlqcycsXG4gICAgICAnZGF5anMvcGx1Z2luL2xvY2FsaXplZEZvcm1hdCcsXG4gICAgXSxcbiAgfSxcbiAgcGx1Z2luczogW1xuICAgIFZ1ZSh7XG4gICAgICBpbmNsdWRlOiBbL1xcLnZ1ZSQvLCAvXFwubWQkL10sXG4gICAgICByZWFjdGl2aXR5VHJhbnNmb3JtOiB0cnVlLFxuICAgIH0pLFxuICAgIFdpbmRpQ1NTKHtcbiAgICAgIHNjYW46IHtcbiAgICAgICAgZGlyczogWycuL3NyYyddLFxuICAgICAgICBmaWxlRXh0ZW5zaW9uczogWyd2dWUnLCAnanMnLCAndHMnLCAnbWQnXSwgLy8gYWxzbyBlbmFibGVkIHNjYW5uaW5nIGZvciBqcy90c1xuICAgICAgfSxcbiAgICB9KSxcbiAgICBlc2xpbnQoKSxcbiAgICBJbnNwZWN0KCksXG4gICAgQ29tcG9uZW50cyh7XG4gICAgICBleHRlbnNpb25zOiBbJ3Z1ZScsICdtZCddLFxuICAgICAgZHRzOiB0cnVlLFxuICAgICAgaW5jbHVkZTogWy9cXC52dWUkLywgL1xcLnZ1ZVxcP3Z1ZS8sIC9cXC5tZCQvXSxcbiAgICB9KSxcbiAgICBTVkcoeyBzdmdvOiBmYWxzZSB9KSxcbiAgICBQYWdlcyh7XG4gICAgICBleHRlbnNpb25zOiBbJ3Z1ZScsICdtZCddLFxuICAgICAgcGFnZXNEaXI6ICdwYWdlcycsXG4gICAgICBleGNsdWRlOiBleGNsdWRlUG9zdHMoKSxcbiAgICAgIGltcG9ydE1vZGU6ICdhc3luYycsXG4gICAgICBleHRlbmRSb3V0ZShyb3V0ZSkge1xuICAgICAgICBjb25zdCBwYXRoID0gcmVzb2x2ZShfX2Rpcm5hbWUsIHJvdXRlLmNvbXBvbmVudC5zbGljZSgxKSlcbiAgICAgICAgY29uc3QgbWQgPSBmcy5yZWFkRmlsZVN5bmMocGF0aCwgJ3V0Zi04JylcbiAgICAgICAgY29uc3QgeyBkYXRhLCBleGNlcnB0IH0gPSBtYXR0ZXIobWQsIHsgZXhjZXJwdDogKGZpbGUpID0+IHtcbiAgICAgICAgICBjb25zdCBjb250ZW50ID0gKChmaWxlIGFzIGFueSkuY29udGVudCBhcyBzdHJpbmcpLnJlcGxhY2UoLzxbXj5dKj4vZywgJycpLnJlcGxhY2UoL1xcW1xcW3RvY1xcXVxcXS9nLCAnJylcbiAgICAgICAgICA7KGZpbGUgYXMgYW55KS5leGNlcnB0ID0gIE1hcmtkb3duSXQoKVxuICAgICAgICAgICAgLnJlbmRlcihjb250ZW50KVxuICAgICAgICAgICAgLnJlcGxhY2UoLzxbXj5dKj4vZywgJycpXG4gICAgICAgICAgICAucmVwbGFjZSgvXFxuL2csICcgJylcbiAgICAgICAgICAgIC5yZXBsYWNlKC9cXHMrLywgJyAnKVxuICAgICAgICAgICAgLnNsaWNlKDAsIDI4MClcbiAgICAgICAgICAgIC5jb25jYXQoJy4uLicpXG4gICAgICAgICAgcmV0dXJuIGZpbGVcbiAgICAgICAgfSB9KVxuICAgICAgICByb3V0ZS5tZXRhID0gT2JqZWN0LmFzc2lnbihyb3V0ZS5tZXRhIHx8IHt9LCB7IGZyb250bWF0dGVyOiBkYXRhLCBleGNlcnB0IH0pXG4gICAgICAgIHJldHVybiByb3V0ZVxuICAgICAgfSxcbiAgICB9KSxcbiAgICBNYXJrZG93bih7XG4gICAgICB3cmFwcGVyQ29tcG9uZW50OiAnbWFya2Rvd24nLFxuICAgICAgd3JhcHBlckNsYXNzZXM6ICdwcm9zZSBtLWF1dG8nLFxuICAgICAgaGVhZEVuYWJsZWQ6IHRydWUsXG4gICAgICBtYXJrZG93bkl0T3B0aW9uczoge1xuICAgICAgICBxdW90ZXM6ICdcIlwiXFwnXFwnJyxcbiAgICAgIH0sXG4gICAgICBtYXJrZG93bkl0U2V0dXAobWQpIHtcbiAgICAgICAgbWQudXNlKFNoaWtpLCB7XG4gICAgICAgICAgdGhlbWU6IHtcbiAgICAgICAgICAgIGRhcms6ICdnaXRodWItZGFyaycsXG4gICAgICAgICAgICBsaWdodDogJ2dpdGh1Yi1saWdodCcsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSlcblxuICAgICAgICBtZC51c2UoQW5jaG9yLCB7XG4gICAgICAgICAgc2x1Z2lmeSxcbiAgICAgICAgICBwZXJtYWxpbms6IEFuY2hvci5wZXJtYWxpbmsubGlua0luc2lkZUhlYWRlcih7XG4gICAgICAgICAgICBzeW1ib2w6ICcjJyxcbiAgICAgICAgICAgIHJlbmRlckF0dHJzOiAoKSA9PiAoeyAnYXJpYS1oaWRkZW4nOiAndHJ1ZScgfSksXG4gICAgICAgICAgfSksXG4gICAgICAgIH0pXG5cbiAgICAgICAgbWQudXNlKExpbmtBdHRyaWJ1dGVzLCB7XG4gICAgICAgICAgbWF0Y2hlcjogKGxpbms6IHN0cmluZykgPT4gL15odHRwcz86XFwvXFwvLy50ZXN0KGxpbmspLFxuICAgICAgICAgIGF0dHJzOiB7XG4gICAgICAgICAgICB0YXJnZXQ6ICdfYmxhbmsnLFxuICAgICAgICAgICAgcmVsOiAnbm9vcGVuZXInLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0pXG5cbiAgICAgICAgbWQudXNlKFRPQywge1xuICAgICAgICAgIGluY2x1ZGVMZXZlbDogWzEsIDIsIDNdLFxuICAgICAgICAgIHNsdWdpZnksXG4gICAgICAgIH0pXG5cbiAgICAgICAgbWQudXNlKFRhc2tMaXN0cywgeyBsYWJlbDogZmFsc2UgfSlcblxuICAgICAgfSxcbiAgICB9KSxcbiAgXSxcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9iYW4tdHMtY29tbWVudFxuICAvLyBAdHMtaWdub3JlXG4gIHNzZ09wdGlvbnM6IHtcbiAgICBmb3JtYXR0aW5nOiAnbWluaWZ5JyxcbiAgICBmb3JtYXQ6ICdjanMnLFxuICB9LFxufSlcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL3dheW5lL3NjcmlwdHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi93YXluZS9zY3JpcHRzL3NsdWdpZnkudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL3dheW5lL3NjcmlwdHMvc2x1Z2lmeS50c1wiOy8vIHN0cmluZy5qcyBzbHVnaWZ5IGRyb3BzIG5vbiBhc2NpaSBjaGFycyBzbyB3ZSBoYXZlIHRvXG4vLyB1c2UgYSBjdXN0b20gaW1wbGVtZW50YXRpb24gaGVyZVxuaW1wb3J0IHsgcmVtb3ZlIH0gZnJvbSAnZGlhY3JpdGljcydcbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb250cm9sLXJlZ2V4XG5jb25zdCByQ29udHJvbCA9IC9bXFx1MDAwMC1cXHUwMDFGXS9nXG5jb25zdCByU3BlY2lhbCA9IC9bXFxzfmAhQCMkJV4mKigpXFwtXys9W1xcXXt9fFxcXFw7OlwiJzw+LC4/L10rL2dcblxuZXhwb3J0IGRlZmF1bHQgKHN0cjogc3RyaW5nKTogc3RyaW5nID0+IHtcbiAgcmV0dXJuIChcbiAgICByZW1vdmUoc3RyKVxuICAgICAgLy8gUmVtb3ZlIGNvbnRyb2wgY2hhcmFjdGVyc1xuICAgICAgLnJlcGxhY2UockNvbnRyb2wsICcnKVxuICAgICAgLy8gUmVwbGFjZSBzcGVjaWFsIGNoYXJhY3RlcnNcbiAgICAgIC5yZXBsYWNlKHJTcGVjaWFsLCAnLScpXG4gICAgICAvLyBSZW1vdmUgY29udGludW9zIHNlcGFyYXRvcnNcbiAgICAgIC5yZXBsYWNlKC8tezIsfS9nLCAnLScpXG4gICAgICAvLyBSZW1vdmUgcHJlZml4aW5nIGFuZCB0cmFpbGluZyBzZXBhcnRvcnNcbiAgICAgIC5yZXBsYWNlKC9eLSt8LSskL2csICcnKVxuICAgICAgLy8gZW5zdXJlIGl0IGRvZXNuJ3Qgc3RhcnQgd2l0aCBhIG51bWJlciAoIzEyMSlcbiAgICAgIC5yZXBsYWNlKC9eKFxcZCkvLCAnXyQxJylcbiAgICAgIC8vIGxvd2VyY2FzZVxuICAgICAgLnRvTG93ZXJDYXNlKClcbiAgKVxufVxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvd2F5bmUvc2NyaXB0c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL3dheW5lL3NjcmlwdHMvZXhjbHVkZVBvc3RzLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy93YXluZS9zY3JpcHRzL2V4Y2x1ZGVQb3N0cy50c1wiO2ltcG9ydCBmcyBmcm9tICdmcy1leHRyYSdcbmltcG9ydCBtYXR0ZXIgZnJvbSAnZ3JheS1tYXR0ZXInXG5cbmNvbnN0IHBhdGggPSAnLi9wYWdlcy9wb3N0cy8nXG5cbmV4cG9ydCBkZWZhdWx0ICgpID0+IHtcbiAgcmV0dXJuIGZzLnJlYWRkaXJTeW5jKHBhdGgpXG4gICAgLmZpbHRlcigoaXRlbSkgPT4gaXRlbS5lbmRzV2l0aCgnLm1kJykpXG4gICAgLmZpbHRlcigocG9zdCkgPT4ge1xuICAgICAgY29uc3QgeyBkYXRhIH0gPSBtYXR0ZXIoZnMucmVhZEZpbGVTeW5jKHBhdGggKyBwb3N0KS50b1N0cmluZygpKVxuICAgICAgcmV0dXJuIGRhdGEuaGlkZGVuXG4gICAgfSlcbiAgICAubWFwKChwb3N0KSA9PiBcIioqL3Bvc3RzL1wiICsgcG9zdClcbn1cbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBb00sU0FBUyxlQUFlO0FBQzVOLE9BQU9BLFNBQVE7QUFDZixTQUFTLG9CQUFvQjtBQUM3QixPQUFPLFNBQVM7QUFDaEIsT0FBTyxjQUFjO0FBQ3JCLE9BQU8sU0FBUztBQUNoQixPQUFPLGFBQWE7QUFDcEIsT0FBTyxnQkFBZ0I7QUFDdkIsT0FBTyxZQUFZO0FBQ25CLE9BQU8sV0FBVztBQUNsQixPQUFPQyxhQUFZO0FBQ25CLE9BQU8sZ0JBQWdCO0FBQ3ZCLE9BQU8sY0FBYztBQUNyQixPQUFPLFdBQVc7QUFDbEIsT0FBTyxZQUFZO0FBQ25CLE9BQU8sb0JBQW9CO0FBQzNCLE9BQU8sU0FBUztBQUNoQixPQUFPLGVBQWU7OztBQ2Z0QixTQUFTLGNBQWM7QUFFdkIsSUFBTSxXQUFXO0FBQ2pCLElBQU0sV0FBVztBQUVqQixJQUFPLGtCQUFRLENBQUMsUUFBd0I7QUFDdEMsU0FDRSxPQUFPLEdBQUcsRUFFUCxRQUFRLFVBQVUsRUFBRSxFQUVwQixRQUFRLFVBQVUsR0FBRyxFQUVyQixRQUFRLFVBQVUsR0FBRyxFQUVyQixRQUFRLFlBQVksRUFBRSxFQUV0QixRQUFRLFNBQVMsS0FBSyxFQUV0QixZQUFZO0FBRW5COzs7QUN2QjhOLE9BQU8sUUFBUTtBQUM3TyxPQUFPLFlBQVk7QUFFbkIsSUFBTSxPQUFPO0FBRWIsSUFBTyx1QkFBUSxNQUFNO0FBQ25CLFNBQU8sR0FBRyxZQUFZLElBQUksRUFDdkIsT0FBTyxDQUFDLFNBQVMsS0FBSyxTQUFTLEtBQUssQ0FBQyxFQUNyQyxPQUFPLENBQUMsU0FBUztBQUNoQixVQUFNLEVBQUUsS0FBSyxJQUFJLE9BQU8sR0FBRyxhQUFhLE9BQU8sSUFBSSxFQUFFLFNBQVMsQ0FBQztBQUMvRCxXQUFPLEtBQUs7QUFBQSxFQUNkLENBQUMsRUFDQSxJQUFJLENBQUMsU0FBUyxjQUFjLElBQUk7QUFDckM7OztBRmJBLElBQU0sbUNBQW1DO0FBc0J6QyxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTCxFQUFFLE1BQU0sTUFBTSxhQUFhLEdBQUcsUUFBUSxrQ0FBVyxLQUFLLEtBQUs7QUFBQSxJQUM3RDtBQUFBLEVBQ0Y7QUFBQSxFQUNBLGNBQWM7QUFBQSxJQUNaLFNBQVM7QUFBQSxNQUNQO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxJQUFJO0FBQUEsTUFDRixTQUFTLENBQUMsVUFBVSxPQUFPO0FBQUEsTUFDM0IscUJBQXFCO0FBQUEsSUFDdkIsQ0FBQztBQUFBLElBQ0QsU0FBUztBQUFBLE1BQ1AsTUFBTTtBQUFBLFFBQ0osTUFBTSxDQUFDLE9BQU87QUFBQSxRQUNkLGdCQUFnQixDQUFDLE9BQU8sTUFBTSxNQUFNLElBQUk7QUFBQSxNQUMxQztBQUFBLElBQ0YsQ0FBQztBQUFBLElBQ0QsT0FBTztBQUFBLElBQ1AsUUFBUTtBQUFBLElBQ1IsV0FBVztBQUFBLE1BQ1QsWUFBWSxDQUFDLE9BQU8sSUFBSTtBQUFBLE1BQ3hCLEtBQUs7QUFBQSxNQUNMLFNBQVMsQ0FBQyxVQUFVLGNBQWMsT0FBTztBQUFBLElBQzNDLENBQUM7QUFBQSxJQUNELElBQUksRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUFBLElBQ25CLE1BQU07QUFBQSxNQUNKLFlBQVksQ0FBQyxPQUFPLElBQUk7QUFBQSxNQUN4QixVQUFVO0FBQUEsTUFDVixTQUFTLHFCQUFhO0FBQUEsTUFDdEIsWUFBWTtBQUFBLE1BQ1osWUFBWSxPQUFPO0FBQ2pCLGNBQU1DLFFBQU8sUUFBUSxrQ0FBVyxNQUFNLFVBQVUsTUFBTSxDQUFDLENBQUM7QUFDeEQsY0FBTSxLQUFLQyxJQUFHLGFBQWFELE9BQU0sT0FBTztBQUN4QyxjQUFNLEVBQUUsTUFBTSxRQUFRLElBQUlFLFFBQU8sSUFBSSxFQUFFLFNBQVMsQ0FBQyxTQUFTO0FBQ3hELGdCQUFNLFVBQVksS0FBYSxRQUFtQixRQUFRLFlBQVksRUFBRSxFQUFFLFFBQVEsZ0JBQWdCLEVBQUU7QUFDbkcsVUFBQyxLQUFhLFVBQVcsV0FBVyxFQUNsQyxPQUFPLE9BQU8sRUFDZCxRQUFRLFlBQVksRUFBRSxFQUN0QixRQUFRLE9BQU8sR0FBRyxFQUNsQixRQUFRLE9BQU8sR0FBRyxFQUNsQixNQUFNLEdBQUcsR0FBRyxFQUNaLE9BQU8sS0FBSztBQUNmLGlCQUFPO0FBQUEsUUFDVCxFQUFFLENBQUM7QUFDSCxjQUFNLE9BQU8sT0FBTyxPQUFPLE1BQU0sUUFBUSxDQUFDLEdBQUcsRUFBRSxhQUFhLE1BQU0sUUFBUSxDQUFDO0FBQzNFLGVBQU87QUFBQSxNQUNUO0FBQUEsSUFDRixDQUFDO0FBQUEsSUFDRCxTQUFTO0FBQUEsTUFDUCxrQkFBa0I7QUFBQSxNQUNsQixnQkFBZ0I7QUFBQSxNQUNoQixhQUFhO0FBQUEsTUFDYixtQkFBbUI7QUFBQSxRQUNqQixRQUFRO0FBQUEsTUFDVjtBQUFBLE1BQ0EsZ0JBQWdCLElBQUk7QUFDbEIsV0FBRyxJQUFJLE9BQU87QUFBQSxVQUNaLE9BQU87QUFBQSxZQUNMLE1BQU07QUFBQSxZQUNOLE9BQU87QUFBQSxVQUNUO0FBQUEsUUFDRixDQUFDO0FBRUQsV0FBRyxJQUFJLFFBQVE7QUFBQSxVQUNiO0FBQUEsVUFDQSxXQUFXLE9BQU8sVUFBVSxpQkFBaUI7QUFBQSxZQUMzQyxRQUFRO0FBQUEsWUFDUixhQUFhLE9BQU8sRUFBRSxlQUFlLE9BQU87QUFBQSxVQUM5QyxDQUFDO0FBQUEsUUFDSCxDQUFDO0FBRUQsV0FBRyxJQUFJLGdCQUFnQjtBQUFBLFVBQ3JCLFNBQVMsQ0FBQyxTQUFpQixlQUFlLEtBQUssSUFBSTtBQUFBLFVBQ25ELE9BQU87QUFBQSxZQUNMLFFBQVE7QUFBQSxZQUNSLEtBQUs7QUFBQSxVQUNQO0FBQUEsUUFDRixDQUFDO0FBRUQsV0FBRyxJQUFJLEtBQUs7QUFBQSxVQUNWLGNBQWMsQ0FBQyxHQUFHLEdBQUcsQ0FBQztBQUFBLFVBQ3RCO0FBQUEsUUFDRixDQUFDO0FBRUQsV0FBRyxJQUFJLFdBQVcsRUFBRSxPQUFPLE1BQU0sQ0FBQztBQUFBLE1BRXBDO0FBQUEsSUFDRixDQUFDO0FBQUEsRUFDSDtBQUFBLEVBR0EsWUFBWTtBQUFBLElBQ1YsWUFBWTtBQUFBLElBQ1osUUFBUTtBQUFBLEVBQ1Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogWyJmcyIsICJtYXR0ZXIiLCAicGF0aCIsICJmcyIsICJtYXR0ZXIiXQp9Cg==
