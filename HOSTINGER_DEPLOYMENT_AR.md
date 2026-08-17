# نشر ZON Store على Hostinger

## اختر المسار الصحيح

ZON Store تطبيق Node.js كامل مع Express وtRPC وShopify وقاعدة MySQL، ولذلك يجب نشره كـ **Node.js Web App** وليس كموقع ثابت. تدعم Hostinger تطبيقات Node.js على خطط Business Web Hosting وجميع خطط Cloud، عبر GitHub أو رفع ملف ZIP. كما يدعم VPS تشغيل Node.js يدوياً عند الحاجة إلى تحكم أكبر. [1] [2]

> إذا كانت خطتك لدى Hostinger هي Premium أو استضافة PHP/HTML ثابتة فقط، فلن تشغّل هذا المتجر كاملاً. استخدم Business أو Cloud أو VPS، أو أبقِ الاستضافة المُدارة الحالية مع ربط نطاقك المخصص.

## الخيار الموصى به: Hostinger Node.js Web App

1. افتح hPanel ثم **Websites → Add Website → Node.js Web App → Deploy Web App**.
2. اختر **Upload your website files** وارفع `zon-store-hostinger-ready.zip`.
3. عند اكتشاف الإطار، اختر **Other** أو **Express.js** إذا ظهر. اضبط Node.js على **22.x** أو 20.x.
4. استخدم إعدادات البناء التالية إذا طلبتها hPanel:

| الإعداد | القيمة |
|---|---|
| Build command | `pnpm build` أو أمر `build` من `package.json` |
| Start command | `pnpm start` |
| Output directory | `dist` |
| Entry file | `dist/index.js` |

5. من Dashboard الخاص بالتطبيق، أضف المتغيرات من ملف `CPANEL_ENVIRONMENT_VARIABLES_TEMPLATE.md`؛ يظل الاسم مناسباً رغم أن الإضافة تتم من hPanel. لا ترفع ملف `.env` ولا تضع الأسرار في Git.
6. اختر **Deploy**. تخزن Hostinger مخرجات تطبيقات الواجهة الخلفية خارج `public_html` وتدير توجيهها تلقائياً. [1]

## قاعدة البيانات MySQL

أنشئ قاعدة ومستخدماً من hPanel، ثم ضع رابط الاتصال في `DATABASE_URL` داخل **Environment Variables**. الصيغة النموذجية:

```text
mysql://DB_USER:URL_ENCODED_PASSWORD@DB_HOST:3306/DB_NAME
```

إذا كانت لوحة Node.js تتيح تشغيل أمر ترحيل بعد النشر أو إذا كنت تستخدم SSH/VPS، نفّذ:

```bash
pnpm db:push
```

قبل تنفيذ الترحيلات على قاعدة إنتاج، خذ نسخة احتياطية. الجداول المطلوبة حالياً هي `users` و`order_tracking`.

## متغيرات Shopify وOAuth

أضف `SHOPIFY_STORE_DOMAIN` و`SHOPIFY_STOREFRONT_API_ACCESS_TOKEN` في hPanel. بعد ظهور نطاق Hostinger النهائي، حدّث Redirect URL في OAuth إلى:

```text
https://YOUR_DOMAIN/api/oauth/callback
```

اختبر بعدها صفحة المتجر والسلة وفتح Shopify Checkout. لا تنفّذ دفعاً حقيقياً خلال الاختبار.

## بديل VPS

إذا اخترت Hostinger VPS، فستحتاج إلى إعداد Node.js وNginx وSSL وPM2 أو systemd يدوياً. هذا مناسب فقط عندما تحتاج إلى إعدادات خادم خاصة أو تحكم كامل. لخطة المتجر الحالية، Node.js Web App المُدار أسهل وأقل عرضة لأخطاء التشغيل. [2]

## فحص ما قبل الإطلاق

| الفحص | المطلوب |
|---|---|
| Build log | ينتهي بنجاح بلا أخطاء. |
| Environment Variables | لا تظهر الأسرار في الواجهة أو المستودع. |
| `/shop` | يعرض منتجات Shopify. |
| Checkout | يفتح Shopify Checkout من السلة. |
| Database | تتصل قاعدة MySQL وتنفذ الترحيلات. |
| OAuth | يرجع إلى نطاق Hostinger الجديد. |
| الإدارة | أوقف أو احمِ أي صفحة اختبار قبل الإطلاق العام. |

## المراجع

[1]: https://www.hostinger.com/support/how-to-deploy-a-nodejs-website-in-hostinger/ "Hostinger — How to add a Node.js Web App"
[2]: https://www.hostinger.com/support/node-js-hosting-options-at-hostinger/ "Hostinger — Node.js hosting options"
