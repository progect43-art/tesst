# متغيرات بيئة cPanel لـ ZON Store

أضف هذه الأسماء والقيم من داخل **cPanel → Application Manager → Environment Variables**. لا تحفظ القيم الحقيقية في ملف داخل المشروع أو في مستودع Git.

| المتغير | ما يوضع فيه |
|---|---|
| `NODE_ENV` | `production` |
| `DATABASE_URL` | رابط MySQL بصيغة `mysql://USER:PASSWORD@HOST:3306/DATABASE` |
| `JWT_SECRET` | قيمة عشوائية طويلة لا تقل عن 32 حرفاً |
| `SHOPIFY_STORE_DOMAIN` | `your-store.myshopify.com` بلا `https://` |
| `SHOPIFY_STOREFRONT_API_ACCESS_TOKEN` | رمز Storefront API الخاص بالقناة Headless |
| `VITE_APP_ID` | معرّف تطبيق OAuth |
| `OAUTH_SERVER_URL` | رابط خادم OAuth |
| `VITE_OAUTH_PORTAL_URL` | رابط بوابة OAuth للواجهة |
| `OWNER_OPEN_ID` | معرّف حساب مالك المتجر |

> لا تضف `SHOPIFY_STOREFRONT_API_ACCESS_TOKEN` أو `JWT_SECRET` إلى أي متغير يبدأ بـ`VITE_`؛ المتغيرات التي تبدأ بهذه السابقة تصل إلى المتصفح.
