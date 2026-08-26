# نظام إدارة مخازن الجماز

نظام متكامل لإدارة المخازن والمبيعات مبني باستخدام **Next.js (App Router)**، **Tailwind CSS**، و **MongoDB**.

## المميزات
- 📦 إدارة المنتجات والمخزون
- 🧾 نظام فواتير ومبيعات (POS مبسط)
- 🔒 مصادقة Google OAuth وآمنة (JWT HttpOnly Cookies)
- 📊 لوحة تحكم مع إحصائيات ورسوم بيانية
- 🌍 واجهة عربية بالكامل (RTL)

## المتطلبات
- Node.js 18+
- MongoDB (محلي أو Atlas)

## تعليمات التشغيل

1. **تثبيت الاعتمادات**
   ```bash
   npm install
   ```

2. **إعداد البيئة (.env)**
   - انسخ ملف الامثلة:
     ```bash
     cp EXAMPLE.env .env.local
     ```
   - املأ البيانات المطلوبة (`MONGODB_URI`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`).

3. **تجهيز قاعدة البيانات (Seeding)**
   لتوليد بيانات تجريبية (منتجات، مستخدمين، فواتير):
   ```bash
   node scripts/seed.js
   ```

4. **تشغيل المشروع**
   ```bash
   npm run dev
   ```
   افتح [http://localhost:3000](http://localhost:3000) في المتصفح.

## هيكلية المشروع

يرجى مراجعة [ARCHITECTURE.md](file:///c:/Users/DRC/Desktop/Next.js/Nkl/transfer/ARCHITECTURE.md) للحصول على تفاصيل كاملة حول بنية المشروع.

- `src/app/(public)`: الصفحات العامة (تسجيل الدخول).
- `src/app/(protected)`: صفحات لوحة التحكم المحمية.
- `src/app/api`: منطق الخلفية وواجهات البرمجيات.
- `src/lib/services`: منطق الأعمال المستقل.
- `src/models`: مخططات MongoDB.
- `src/config/navigation.js`: إعدادات التنقل المركزية.

## المصادقة (Authentication)
يعتمد النظام على Google OAuth. عند تسجيل الدخول:
1. يتم تحويل المستخدم لصفحة Google.
2. عند العودة، يتم التحقق من المستخدم وإنشاءه في قاعدة البيانات إذا كان جديداً.
3. يتم إصدار رمز **JWT** وتخزينه في **HttpOnly Cookie** آمن.
4. يتم حماية المسارات (`middleware.js`) للتحقق من وجود الرمز.

---.

## الاختبارات (Testing)

```bash
pnpm test            # تشغيل كامل (<60 ثانية)
pnpm test --watch    # وضع المراقبة
pnpm test -- src/lib/api-utils.test.js   # ملف محدد
```

- **الأدوات المساعدة:** `src/test/utils.jsx` — `renderWithProviders` (QueryClient جديد لكل اختبار، retry معطّل) وأشكال الاستجابة (`envelopeOk`/`envelopeFail`/`jsonResponse`) لمحاكاة طبقة الـ API.
- **مصفوفة الـ fetcher:** `src/lib/api-utils.test.js` — يثبّت سلوك فك الغلاف، إلغاء تكرار GET فقط، انتهاء المهلة (408)، وتوجيه 401 لمرة واحدة عبر seam ‏`__internals`.
- **الصلاحيات والجلسة:** `src/lib/permissions.test.js` و `src/hooks/useUserRole.test.js`.
- **المكونات:** `RoleGate.test.jsx` و `confirm-dialog.test.jsx` بجانب مصادرها.
- **التدفقات الحرجة:** حسابات بنود الفاتورة (`useInvoiceItems.test.js`) وبوابة إشعارات الجلسة (`useNotifications.test.js`).

> ملاحظة: اختبارات تستخدم `jest.mock()` يجب أن تُكتب بأسلوب CommonJS (`require`) — تحويل SWC في `next/jest` لا يرفع (hoist) الـ mock لملفات ES Modules.
