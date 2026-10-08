# US GLOBAL IMPEX website and custom CMS

The public site is a Next.js application. Strapi runs as the content, database, authentication, and media backend. Editors use the custom US GLOBAL IMPEX interface at `/admin`; Strapi's standard admin panel is disabled.

## Local development

Use two terminals from the project root:

```bash
npm run dev:cms
npm run dev
```

Open `http://localhost:3000/admin/login`. CMS credentials are configured in `cms/.env` with `CMS_ADMIN_EMAIL` and `CMS_ADMIN_PASSWORD`. Change the initial local password before deployment.

The public site reads Strapi from `STRAPI_URL` and defaults to `http://127.0.0.1:1337`. If the CMS is temporarily unavailable, the public pages keep rendering their built-in fallback content.

## Content areas

The dashboard manages Home Page, Header & Footer, Website Pages, Services, Projects, News Articles, Offices, and uploaded images. Saving an entry publishes it immediately and the public site refreshes CMS content within approximately 60 seconds.

For production, set `STRAPI_URL`, secure Strapi secrets, a strong `CMS_ADMIN_PASSWORD`, and a production database. Uploaded files live under `cms/public/uploads` when using the default local provider.
