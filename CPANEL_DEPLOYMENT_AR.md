# نشر ZON Store على cPanel

## قبل الرفع

يتطلب هذا المشروع استضافة cPanel تدعم **Application Manager** أو **Setup Node.js App** مع Phusion Passenger، وNode.js 20 أو 22، وطرفية أو SSH، وقاعدة MySQL. لا يمكن رفعه إلى استضافة PHP/HTML ثابتة فقط؛ فالواجهة تحتاج خادم Node.js لتشغيل tRPC وShopify وOAuth.

> إذا لم تجد **Application Manager** أو **Setup Node.js App** في cPanel، تواصل مع الاستضافة واطلب تفعيل Node.js وPassenger و`mod_env`. هذه المتطلبات يحددها cPanel رسمياً. [1] [2]

## محتويات الحزمة

بعد فك أرشيف cPanel، يجب أن ترى الملفات التالية في مجلد التطبيق:

| الملف | الغرض |
|---|---|
| `app.js` | نقطة تشغيل Passenger الافتراضية؛ تشغّل `dist/index.js`. |
| `dist/` | مخرجات البناء الجاهزة للإنتاج. |
| `package.json` و`pnpm-lock.yaml` | الاعتمادات وأوامر التشغيل. |
| `CPANEL_ENVIRONMENT_VARIABLES_TEMPLATE.md` | أسماء المتغيرات وقواعد وضعها في cPanel، بلا أسرار. |
| `CPANEL_DEPLOYMENT_AR.md` | هذا الدليل. |

## خطوات الرفع المباشر

1. من **File Manager**، أنشئ مجلداً خارج `public_html` مثل `/home/CPANEL_USER/zon-store`، ثم ارفع الأرشيف وافك ضغطه فيه. لا تضع المشروع داخل `public_html` عندما تستخدم Application Manager.
2. افتح **Terminal** في cPanel ثم انتقل إلى مجلد المشروع وشغّل الأوامر التالية. استخدم Node.js 22 متى كانت متاحة؛ Node.js 20 مناسب أيضاً إذا كان مزودك لا يوفّر 22.

```bash
cd ~/zon-store
corepack enable
pnpm install --frozen-lockfile
pnpm build
```

3. افتح **Software → Application Manager → Register Application** ثم اضبط القيم التالية:

| حقل cPanel | القيمة |
|---|---|
| Application Name | `zon-store` |
| Deployment Domain | نطاق المتجر أو نطاقه الفرعي |
| Base Application URL | `/` أو المسار الذي اخترته |
| Application Path | `zon-store` |
| Environment | `Production` |

4. تأكد أن ملف البداية هو `app.js`. يبحث Passenger عن هذا الاسم افتراضياً، وهذا الملف موجود في المشروع ويشغّل الخادم المبني. [1]
5. من قسم **Environment Variables** داخل التطبيق، أضف القيم وفق `CPANEL_ENVIRONMENT_VARIABLES_TEMPLATE.md`. لا ترفع `.env` ولا ترسل قيمة أي رمز في المحادثة.
6. بعد حفظ المتغيرات اختر **Deploy** أو **Restart Application**. إن لم يظهر زر إعادة التشغيل، شغّل:

```bash
mkdir -p tmp
touch tmp/restart.txt
```

يعيد ملف `tmp/restart.txt` تشغيل Passenger بعد التعديل. [1]

## قاعدة البيانات

أنشئ قاعدة MySQL ومستخدماً من **MySQL Database Wizard**، ثم امنح المستخدم كل الصلاحيات على قاعدة المشروع. أدخل رابط الاتصال في `DATABASE_URL` في Application Manager، بصيغة مثل:

```text
mysql://zon_app:URL_ENCODED_PASSWORD@localhost:3306/zon_store
```

بعد ضبط الرابط، شغّل الترحيلات من الطرفية:

```bash
cd ~/zon-store
pnpm db:push
```

لا تشغّل الترحيلات على قاعدة إنتاج تتضمن تغييرات يدوية قبل أخذ نسخة احتياطية.

## Shopify وOAuth بعد تغيير النطاق

ضع `SHOPIFY_STORE_DOMAIN` من دون `https://`، وضع رمز **Storefront API** الخاص بمتجرك في `SHOPIFY_STOREFRONT_API_ACCESS_TOKEN`. بعد معرفة نطاق cPanel النهائي، أضف هذا العنوان في إعدادات OAuth:

```text
https://YOUR_DOMAIN/api/oauth/callback
```

ثم اختبر `/shop`، وإضافة منتج للسلة، وفتح Shopify Checkout. لا تنفذ دفعاً حقيقياً أثناء الاختبار.

## استكشاف الأعطال

| العرض | الإجراء |
|---|---|
| 503 أو صفحة Passenger | راجع `~/zon-store/logs/` ثم تأكد من `app.js` ووجود `dist/index.js`. |
| تعذر تثبيت الحزم | شغّل `corepack enable` ثم `pnpm install --frozen-lockfile` من Terminal، أو اطلب من الاستضافة تفعيل Node 20/22. |
| خطأ في قاعدة البيانات | راجع `DATABASE_URL` واسم المضيف والصلاحيات، ثم نفّذ `pnpm db:push`. |
| OAuth يعيد إلى نطاق خاطئ | حدّث Redirect URL إلى نطاق cPanel بالمسار `/api/oauth/callback`. |
| تغييرات لا تظهر | نفّذ `touch ~/zon-store/tmp/restart.txt` ثم أعد تحميل الصفحة. |

## ملاحظة أمان قبل الإطلاق

لا تضع رموز Shopify أو أسرار JWT في `VITE_*` أو في ملفات يقرأها المتصفح. كذلك تحقّق من حماية مسارات الإدارة وإيقاف أي وضع تجريبي عام قبل فتح الموقع للجمهور.

## المراجع

[1]: https://docs.cpanel.net/knowledge-base/web-services/how-to-install-a-node.js-application/ "cPanel — How to Install a Node.js Application"
[2]: https://docs.cpanel.net/cpanel/software/application-manager/ "cPanel — Application Manager"
