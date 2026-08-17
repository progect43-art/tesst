# الرفع السحابي المباشر لـ ZON Store

## التوصية

لرفع ملفات المتجر مباشرة من دون إعداد خادم أو ربط GitHub، استخدم **Hostinger Business Web Hosting أو إحدى خطط Cloud** مع ميزة **Node.js Web App**. تدعم Hostinger رفع ملف ZIP لتطبيقات Node.js ثم بناء التطبيق وتشغيله من hPanel؛ وهذا يتوافق مع مشروع ZON Store الذي يحتاج Express وShopify وMySQL. [1]

> استخدم الاستضافة المُدارة الحالية إن كان هدفك هو النشر الأسرع مع نطاق مخصص ومن دون نقل أسرار أو قاعدة بيانات. اختر Hostinger فقط إذا أردت إدارة الاستضافة خارجياً.

## الرفع المباشر

1. في hPanel، افتح **Websites → Add Website → Node.js Web App → Deploy Web App**.
2. اختر **Upload your website files**، ثم ارفع `zon-store-hostinger-ready.zip`.
3. اختر نوع التطبيق **Other** أو **Express.js** وحدد Node.js 22.x أو 20.x.
4. اضبط القيم التالية عندما تطلبها الشاشة:

| الإعداد | القيمة |
|---|---|
| Build command | `pnpm install --frozen-lockfile && pnpm build` |
| Start command | `pnpm start` |
| Output directory | `dist` |
| Entry file | `dist/index.js` |

5. أضف المتغيرات السرية من `CPANEL_ENVIRONMENT_VARIABLES_TEMPLATE.md` داخل **Environment Variables** في hPanel، وليس في ملفات المشروع.
6. اضغط **Deploy**. تضع Hostinger تطبيقات Node.js ذات الخادم في مسار داخلي وتدير التوجيه إلى النطاق تلقائياً. [1]

## قاعدة البيانات وفحص أول تشغيل

استخدم قاعدة MySQL من Hostinger أو مزود متوافق، ثم أضف الرابط في `DATABASE_URL`. نفّذ ترحيل قاعدة البيانات مرة واحدة عبر واجهة Hostinger إن وفرت تنفيذ الأوامر، أو عبر SSH/VPS عند الحاجة:

```bash
pnpm db:push
```

بعد النشر، اختبر `/shop` ثم أضف منتجاً إلى السلة وافتح Shopify Checkout. أضف نطاق Hostinger النهائي إلى Redirect URL الخاص بـ OAuth مع المسار `/api/oauth/callback`.

## لماذا ليس Render أو Koyeb؟

Render وKoyeb مناسبَان للتجارب، لكن مسارهما المعتاد يعتمد على Git أو إعداد خدمة منفصل. Hostinger هو الخيار الأبسط هنا لأنه يقبل ZIP مباشرة داخل لوحة واحدة ويوفر إدارة البناء والمتغيرات وإعادة التشغيل من hPanel. [1]

## المرجع

[1]: https://www.hostinger.com/support/how-to-deploy-a-nodejs-website-in-hostinger/ "Hostinger — How to add a Node.js Web App"
