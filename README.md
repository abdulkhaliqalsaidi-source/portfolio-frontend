# Portfolio Frontend (Nuxt 4)

منصة معرض الأعمال والمدونة التقنية الهندسية مبنية على **Nuxt 4.5.2** مع دعم كامل للتصيير من جانب الخادم (SSR) والتوليد المسبق (SSG) وأعلى معايير الـ SEO و Core Web Vitals.

---

## الميزات التقنية
- **Nuxt 4.5.2:** بنية هجينة سريعة ومتوافقة مع أحدث معايير الويب.
- **Vuetify 3 (RTL):** دعم مدمج للغة العربية والاتجاه من اليمين لليسار.
- **SEO Suite:** دعم ديناميكي لـ Meta tags وبطاقات OpenGraph و Twitter ومخططات JSON-LD المنظمة.
- **لوحة التحكم:** معزولة كلياً في جانب العميل (CSR) لأعلى درجات الأمان والسرعة.

---

## التشغيل المحلي (Development)

```bash
# تثبيت الحزم
npm install

# تشغيل خادم التطوير
npm run dev
```

يعمل خادم التطوير افتراضياً على: `http://localhost:3000`

---

## البناء للإنتاج (Production Build)

```bash
npm run build
npm run preview
```

---

## متغيرات البيئة (Environment Variables)

قم بإنشاء ملف `.env` بناءً على `.env.example`:

```env
PORT=3000
NODE_ENV=production
NUXT_PUBLIC_SITE_URL=https://your-site.vercel.app
NUXT_PUBLIC_API_BASE_URL=https://your-backend-api.com/api
NUXT_API_SERVER_URL=https://your-backend-api.com/api
```

---

## النشر على Vercel (Deployment)

1. اربط هذا المستودع مباشرة في **Vercel**.
2. سيتعرف Vercel تلقائياً على إطار العمل كـ **Nuxt.js**.
3. أضف متغيرات البيئة (`NUXT_PUBLIC_API_BASE_URL` و `NUXT_PUBLIC_SITE_URL`).
4. اضغط **Deploy**!
