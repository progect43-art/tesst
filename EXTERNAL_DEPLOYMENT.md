# تشغيل ZON Store على استضافة خارجية

هذا المشروع تطبيق Node.js كامل، وليس واجهة ثابتة فقط. يتطلب خادماً يشغّل Express وtRPC، وقاعدة MySQL أو TiDB، وبيئة HTTPS قبل استلام طلبات حقيقية.

## الحزمة المطلوبة

استخدم الأرشيف المرفق من مجلد المشروع، ثم أنشئ ملف `.env` اعتماداً على `.env.example`. لا ترفع ملف `.env` أو أي مفاتيح وصول إلى GitHub أو إلى المستودع.

## أوامر البناء والتشغيل

```bash
corepack enable
pnpm install --frozen-lockfile
pnpm check
pnpm test
pnpm build
pnpm start
```

عيّن أمر البناء إلى `pnpm build` وأمر التشغيل إلى `pnpm start`. يجب أن يمرر مزود الاستضافة منفذ الخدمة عبر متغير `PORT`؛ لا تثبت رقماً داخل الكود.

## متغيرات البيئة الأساسية

| المتغير | الغرض |
|---|---|
| `SHOPIFY_STORE_DOMAIN` | نطاق متجر Shopify بصيغة `your-store.myshopify.com` فقط. |
| `SHOPIFY_STOREFRONT_API_ACCESS_TOKEN` | رمز Storefront API لقراءة المنتجات والسلة وإتمام Checkout. |
| `DATABASE_URL` | اتصال MySQL/TiDB لمستخدمي التطبيق وتتبع الطلبات. |
| `JWT_SECRET` | سر طويل وعشوائي لجلسات التطبيق. |
| `VITE_APP_ID` و`OAUTH_SERVER_URL` و`VITE_OAUTH_PORTAL_URL` | إعدادات تسجيل الدخول. |
| `OWNER_OPEN_ID` | معرّف مالك المتجر وصلاحية الإدارة. |

## فحوصات ما قبل الإطلاق

بعد النشر، اختبر المسارات `/` و`/shop` و`/product/:handle` و`/track-order`. اختبر إضافة منتج للسلة ثم فتح Checkout. في وضع الاختبار الحالي، تعرض `/admin/discounts` و`/admin/orders` واجهات عامة من دون بيانات أو صلاحيات فعلية؛ أعد حمايتهما قبل إدخال طلبات عملاء حقيقية.

> تتوفر الاستضافة المدمجة للمشروع وتدعم هذا التطبيق مباشرة. إن اخترت مزوداً خارجياً، فتأكد من إعداد قاعدة البيانات وOAuth وShopify وHTTPS لأن هذه الأجزاء لا تنتقل تلقائياً مع ملفات الواجهة.

