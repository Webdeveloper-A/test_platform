# Customs Test Platform

Bojxona statistikasi fanidan test platformasi uchun kengaytirilgan loyiha.

## Hozir ishlaydigan modullar
- login/logout
- admin panel
- foydalanuvchi yaratish, o‘chirish, parol almashtirish
- fanlar boshqaruvi: qo‘shish, tahrirlash, o‘chirish
- savollar banki: qo‘shish, tahrirlash, o‘chirish
- testlar boshqaruvi: qo‘shish, tahrirlash, o‘chirish
- student panel
- random test boshlash
- vaqtli test
- darhol natija
- urinishlar tarixi
- reyting
- 110 ta tozalangan savol seed ko‘rinishida

## Texnologiyalar
- Next.js App Router
- Prisma + SQLite
- Cookie asosidagi autentifikatsiya

## Ishga tushirish
```bash
npm install
copy .env.example .env
npm run prisma:migrate -- --name init
npm run prisma:seed
npm run dev
```

## Demo loginlar
- Admin: `admin` / `admin123`
- Student: `student` / `student123`

## Asosiy yangi sahifalar
- `/uz/admin/subjects`
- `/uz/admin/questions`
- `/uz/admin/questions/[id]/edit`
- `/uz/admin/tests`

## Muhim eslatma
- Savollar banki hozircha asosan o‘zbek tilida, ruscha maydonlar qo‘shilgan.
- `role` va `difficulty` Prisma sxemasida `String` saqlanadi, chunki loyiha SQLite + Prisma 5.x bilan mos ishlashi kerak.
- Next config fayli `next.config.mjs` orqali ishlaydi.
