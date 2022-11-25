## Personal Website for Wayne Wu

**[Click here to Take a look](https://wayne-wu.com)**

With tech-stacks: [Vite SSG](https://github.com/antfu/vite-ssg), [Vue.js](https://vuejs.org/), [Vite](https://vitejs.dev/), [Windi CSS](https://windicss.org/). And hosting in [Netlify](https://www.netlify.com/).

Code is licensed under [MIT](./LICENSE), and the words are licensed under [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/).

## Usage

> Project supports hosting in Vercel or other platforms, but comments feature only works in Netlify, actually, I code for it.

### Dev in Local

```shell
# run functions and web (with netlify)
npm run dev

# run functions only (with netlify)
npm run dev:functions

# run web only
npm run dev:web
```

### Environment Variables

Set these environment variables in the `.env` file, it helps to generate the site static files for vue-ssg.

1. VITE_SITE_NAME
2. VITE_SITE_DESCRIPTION
3. VITE_SITE_DOMAIN
4. VITE_AUTHOR_NAME
5. VITE_AUTHOR_EMAIL
6. VITE_DEFAULT_THEME_MODE

Set these environment variables in netlify.

1. AUTH_PASSWORD
2. AUTH_USERNAME
3. JWT_SECRET
4. LEANCLOUD_APP_ID
5. LEANCLOUD_APP_KEY
7. LEANCLOUD_REST_API
8. SMTP_EMAIL
9. SMTP_HOST
10. SMTP_PASSWORD
11. SMTP_PORT

`AUTH_*` are the keys to login in admin role to manage the comments. `LEANCLOUD_*` is about database to store comment data, You can get from [LeanCloud](https://leancloud.app) or [LeanCloud_cn](https://www.leancloud.cn). It is clear what `SMTP_*` for.

### Invasive Configuration

Even though most of options can configure with `.env`, but something is hard-coded, I assume you are good at Vue, so there is no more explanations.

### Others

1. In logined status, the comment that posted email is same with `VITE_AUTHOR_EMAIL` will set as **Manager Role**.
2. Manager's login entry is exposed if url contains params `?admin`.

## References

 - [https://github.com/antfu/antfu.me](https://github.com/antfu/antfu.me)