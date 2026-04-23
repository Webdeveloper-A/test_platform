import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type Difficulty = "MEDIUM" | "HARD" | "VERY_HARD";
type CorrectOption = "A" | "B" | "C" | "D";

const SUBJECT_CODE = "CUSTOMS_VALUE";

function q(
  sortOrder: number,
  difficulty: Difficulty,
  textUz: string,
  optionAUz: string,
  optionBUz: string,
  optionCUz: string,
  optionDUz: string,
  correctOption: CorrectOption
) {
  return {
    sortOrder,
    difficulty,
    textUz,
    textRu: null,
    optionAUz,
    optionARu: null,
    optionBUz,
    optionBRu: null,
    optionCUz,
    optionCRu: null,
    optionDUz,
    optionDRu: null,
    correctOption,
  };
}

const questions = [
  // 272-son hujjat bo‘yicha 30 ta
  q(1, "MEDIUM", "272-son buyruq bilan nima tasdiqlangan?", "Eksport bojxona bojlari stavkalari", "Olib kiriladigan tovarlarning bojxona qiymatini nazorat qilish tartibi to‘g‘risidagi yo‘riqnoma", "Bojxona yig‘imlari stavkalari", "TIF TN nomenklaturasi", "B"),
  q(2, "MEDIUM", "272-son yo‘riqnoma qaysi tovarlarga nisbatan qo‘llaniladi?", "Faqat eksport qilinadigan tovarlarga", "O‘zbekiston bojxona hududiga olib kiriladigan tovarlarga", "Faqat tranzit tovarlarga", "Faqat jismoniy shaxslar yukiga", "B"),
  q(3, "MEDIUM", "272-son yo‘riqnomaga ko‘ra bojxona qiymatini nazorat qilishda nechta usul qo‘llanilishi nazorat qilinadi?", "4 ta", "5 ta", "6 ta", "7 ta", "C"),
  q(4, "MEDIUM", "1-usul nimaga asoslanadi?", "Aynan bir xil tovar qiymatiga", "Olib kiriladigan tovar bitim qiymatiga", "Chegirib tashlash usuliga", "Zaxira usuliga", "B"),
  q(5, "MEDIUM", "2-usul nimaga asoslanadi?", "O‘xshash tovar qiymatiga", "Aynan bir xil tovar bitim qiymatiga", "Qo‘shish usuliga", "Zaxira usuliga", "B"),
  q(6, "MEDIUM", "3-usul nimaga asoslanadi?", "O‘xshash tovar bitim qiymatiga", "Aynan bir xil tovar qiymatiga", "Chegirib tashlash usuliga", "Bitim qiymatiga", "A"),
  q(7, "MEDIUM", "4-usul nima deb yuritiladi?", "Qo‘shish usuli", "Chegirib tashlash usuli", "Zaxira usuli", "Aynan bir xil tovar usuli", "B"),
  q(8, "MEDIUM", "5-usul nima deb yuritiladi?", "Chegirib tashlash usuli", "Qo‘shish usuli", "Zaxira usuli", "Bitim qiymati usuli", "B"),
  q(9, "MEDIUM", "6-usul nima deb yuritiladi?", "Rezerv yoki zaxira usul", "Aksiz usuli", "QQS usuli", "Brokerlik usuli", "A"),
  q(10, "MEDIUM", "BQD nima?", "Bojxona qiymati deklaratsiyasi", "Bojxona yuk deklaratsiyasi", "Boj yig‘imi dalolatnomasi", "Bitim qiymati daftari", "A"),
  q(11, "MEDIUM", "BYUD nima?", "Bojxona yuk deklaratsiyasi", "Bojxona qiymati deklaratsiyasi", "Bojxona yengillik hujjati", "Boj tarifi jurnali", "A"),
  q(12, "MEDIUM", "BQD qaysi hujjatning ajralmas qismi hisoblanadi?", "Invoysning", "BYUDning", "Sertifikatning", "Konosamentning", "B"),
  q(13, "MEDIUM", "Bojxona qiymati nimaga xizmat qiladi?", "Faqat statistika uchun", "Bojxona to‘lovlarini hisoblash uchun", "Faqat omborga joylash uchun", "Faqat transport to‘lovini aniqlash uchun", "B"),
  q(14, "MEDIUM", "Deklarnat kim?", "Faqat bojxona xodimi", "Tovarlarni o‘z nomidan yoki nomidan deklaratsiyalovchi shaxs", "Faqat broker", "Faqat tashuvchi", "B"),
  q(15, "HARD", "Bojxona qiymati strukturasi formulasida A nimani anglatadi?", "Alohida to‘lovlarni", "Asos qilib olinadigan narxni", "Aksiz summasini", "Avtotransport xarajatini", "B"),
  q(16, "HARD", "Bojxona qiymati strukturasi formulasida QX nimani anglatadi?", "Qaytariladigan xarajatlar", "Qo‘shiladigan xarajatlar yoki elementlar", "Qisman hisoblanadigan xarajatlar", "Qarz xarajatlari", "B"),
  q(17, "HARD", "Bojxona qiymati strukturasi formulasida ChTX nimani anglatadi?", "Chegirib tashlanadigan xarajatlar yoki elementlar", "Chet transport xarajatlari", "Chakana to‘lov xarajatlari", "Cheksiz tarif xarajatlari", "A"),
  q(18, "MEDIUM", "Maslahatlashuv qachon o‘tkazilishi mumkin?", "Bojxona organi tanlangan usulga rozi bo‘lmaganda", "Har doim deklaratsiya berilganda", "Faqat sud qaroridan keyin", "Faqat eksportda", "A"),
  q(19, "MEDIUM", "Bojxona qiymatini tuzatish uchun qaytarish qachon yuboriladi?", "Hujjatlar yetarli bo‘lmaganda yoki uslubiyotda xato bo‘lganda", "Har bir importda", "Faqat aksiz tovarlarda", "Faqat transport vositalarida", "A"),
  q(20, "HARD", "Bojxona qiymatini shartli belgilash nimani anglatadi?", "Qiymatni deklarant o‘zi vaqtincha tanlashini", "Yakuniy qiymat aniqlanguncha mavjud ma’lumotlarga tayangan holda shartli hisoblashni", "Faqat brokerning yozma fikrini", "Qiymatni butunlay bekor qilishni", "B"),
  q(21, "MEDIUM", "272-son yo‘riqnoma qaysi hollarda qo‘llaniladi?", "Har qanday deklaratsiyada", "Xavfni boshqarish tizimi o‘rta yoki yuqori darajadagi xavf profilini ko‘rsatganda", "Faqat jismoniy shaxslar uchun", "Faqat post-auditda", "B"),
  q(22, "MEDIUM", "Boshqa hollarda bojxona qiymati qachon nazorat qilinadi?", "Faqat rasmiylashtirishgacha", "Tovar chiqarib yuborilgandan so‘ng ham", "Hech qachon", "Faqat sudda", "B"),
  q(23, "HARD", "Mansabdor shaxs qachon tanlangan usulga rozi bo‘lmasligi mumkin?", "Hujjatlar va ma’lumotlar yetarli tasdiq bermasa", "Deklarant hujjatlarni vaqtida topshirsa", "Risk past bo‘lsa", "Tovar bojxona omborida bo‘lsa", "A"),
  q(24, "MEDIUM", "Qo‘shimcha hujjatlar taqdim etilmasa qanday oqibat bo‘lishi mumkin?", "Usul o‘zgartirish taklif qilinmaydi", "Boshqa usuldan foydalanish taklif etilishi mumkin", "Deklaratsiya avtomatik tasdiqlanadi", "Bojxona qiymati bekor qilinadi", "B"),
  q(25, "HARD", "Taqdim etilgan ma’lumotlar noto‘g‘ri ekani alomatlari aniqlansa nima bo‘lishi mumkin?", "Tanlangan usul qabul qilinishi shart", "Bojxona organi boshqa usulni taklif qilishi mumkin", "Faqat ogohlantirish beriladi", "Deklarant istagan usulda qoladi", "B"),
  q(26, "MEDIUM", "272-son yo‘riqnomadagi asosiy e’tibor qaysilarga qaratiladi?", "Faqat BQD blankasiga", "Usul tanlash, qiymat strukturasi, hujjatlar bilan tasdiqlanish va individual risk profillariga", "Faqat invoysga", "Faqat tashuv hujjatlariga", "B"),
  q(27, "HARD", "DBQ YAAAT nimaga xizmat qiladi?", "Faqat statistika chiqarishga", "Bojxona nazorati uchun hujjat va ma’lumotlarni kiritish, hisobga olish va monitoring qilishga", "Faqat to‘lovni qabul qilishga", "Faqat sertifikat tekshirishga", "B"),
  q(28, "MEDIUM", "Deklaratsiyalovchi shaxs kim bo‘lishi mumkin?", "Faqat bojxona brokeri", "Deklarant, broker mutaxassisi yoki vakolatli boshqa shaxs", "Faqat tashuvchi", "Faqat sotuvchi", "B"),
  q(29, "HARD", "1-usul qo‘llanganda formuladagi asos narx sifatida nima olinadi?", "Aynan bir xil tovarlarning bozordagi narxi", "Sotib olingan tovar narxi", "Mahalliy bozordagi chakana narx", "Faqat tashish xarajatlari", "B"),
  q(30, "HARD", "272-son yo‘riqnoma bojxona qiymatini nazorat qilishni qaysi ikki bosqichda qamrab oladi?", "Faqat deklaratsiyadan oldin va keyin", "Rasmiylashtirish jarayonida va chiqarib yuborilgandan so‘ng", "Faqat post-audit va sudda", "Faqat omborda va transportda", "B"),

  // 160-son hujjat bo‘yicha 30 ta
  q(31, "MEDIUM", "160-son qaror qaysi masalani tartibga soladi?", "Eksport bojlari stavkalarini", "Olib kiriladigan tovarning bojxona qiymatini aniqlash tartibini", "Faqat BQD blankasini", "Bojxona brokerlari litsenziyasini", "B"),
  q(32, "MEDIUM", "Import bojxona qiymatini aniqlashda asosiy ustuvor usul qaysi?", "Zaxira usul", "Bitim qiymati usuli", "Chegirib tashlash usuli", "Qo‘shish usuli", "B"),
  q(33, "HARD", "Bitim qiymati usulini qo‘llash uchun eng muhim talab nima?", "Har doim broker bo‘lishi", "Narx haqiqatan to‘langan yoki to‘lanishi lozim bo‘lgan qiymatga asoslanishi", "Faqat naqd to‘lov bo‘lishi", "Faqat davlat kontrakti bo‘lishi", "B"),
  q(34, "MEDIUM", "Bojxona qiymatiga qaysi xarajatlar qo‘shilishi mumkin?", "Faqat ichki reklama xarajatlari", "Qonunda nazarda tutilgan qo‘shimcha elementlar", "Faqat maosh xarajatlari", "Faqat foyda solig‘i", "B"),
  q(35, "MEDIUM", "Quyidagilardan qaysi biri ayrim hollarda bojxona qiymatidan chegirilishi mumkin?", "Qonunda ko‘rsatilgan ayrim chiqarib tashlanadigan elementlar", "Har qanday deklarant istagan summa", "Foyda solig‘i", "Ichki audit xarajati", "A"),
  q(36, "HARD", "Bojxona qiymatini aniqlash ketma-ketligi qanday?", "Istalgan usuldan boshlash mumkin", "Usullar qonunda belgilangan izchillikda qo‘llanadi", "Faqat 6-usuldan boshlanadi", "Faqat 4-usuldan boshlanadi", "B"),
  q(37, "MEDIUM", "1-usul qo‘llanmasa keyingi qanday yo‘l tutiladi?", "To‘g‘ridan to‘g‘ri 6-usulga o‘tiladi", "Keyingi usullar qonundagi ketma-ketlikda ko‘rib chiqiladi", "Faqat deklarant xohlagani tanlanadi", "Faqat sud qarori bilan tanlanadi", "B"),
  q(38, "HARD", "Aynan bir xil tovarlar usuli qachon qo‘llaniladi?", "1-usulni qo‘llash imkoni bo‘lmaganda va shartlar mavjud bo‘lsa", "Har doim importda", "Faqat eksportda", "Faqat aksiz tovarlarda", "A"),
  q(39, "HARD", "O‘xshash tovarlar usuli qachon qo‘llaniladi?", "2-usulni qo‘llash mumkin bo‘lmaganda va shartlar mavjud bo‘lsa", "Faqat deklarant roziligida", "Har doim broker so‘rasa", "Faqat jismoniy shaxslarga", "A"),
  q(40, "MEDIUM", "Chegirib tashlash usulining mantiqi nimaga yaqin?", "Ichki sotuv narxidan qonuniy elementlarni ayirishga", "Faqat tashish narxini qo‘shishga", "Faqat bojxona yig‘imini aniqlashga", "Faqat aksiz hisoblashga", "A"),
  q(41, "MEDIUM", "Qo‘shish usuli nimaga yaqin?", "Tovar yaratish/ishlab chiqarish bilan bog‘liq qiymat elementlarini jamlashga", "Faqat mahalliy bozordagi chakana narxga", "Faqat eksport statistikasi ma’lumotiga", "Faqat transport hujjatiga", "A"),
  q(42, "HARD", "Zaxira usuli qanday qo‘llaniladi?", "Qolgan usullarni qo‘llash imkoni bo‘lmaganda moslashuvchan ravishda", "Har doim birinchi usul sifatida", "Faqat deklarant talab qilganda", "Faqat bir xil tovar mavjud bo‘lsa", "A"),
  q(43, "MEDIUM", "Bojxona qiymatini aniqlashda invoys qanday rol o‘ynaydi?", "Faqat yordamchi hujjat", "Asosiy hujjatlardan biri, ammo yagona hujjat emas", "Hech qanday rol o‘ynamaydi", "Faqat eksportda kerak bo‘ladi", "B"),
  q(44, "HARD", "To‘lov shartlari bojxona qiymatiga nima uchun ta’sir qilishi mumkin?", "Narxning haqiqiy iqtisodiy mazmunini aniqlashga yordam beradi", "Faqat bojxona yig‘imini belgilaydi", "Faqat aksizni bekor qiladi", "Hech qanday ta’siri yo‘q", "A"),
  q(45, "MEDIUM", "Bojxona qiymatiga transport xarajatlari qachon qo‘shilishi mumkin?", "Qonunda nazarda tutilgan hollarda", "Har doim qo‘shiladi", "Hech qachon qo‘shilmaydi", "Faqat eksportda", "A"),
  q(46, "MEDIUM", "Sug‘urta xarajatlari bojxona qiymatiga nisbatan qanday baholanadi?", "Hech qachon inobatga olinmaydi", "Qonunchilikdagi qoidalarga ko‘ra inobatga olinishi mumkin", "Faqat broker qaror qiladi", "Faqat sud belgilaydi", "B"),
  q(47, "HARD", "Komissiya yoki vositachilik to‘lovlari bojxona qiymatida qanday ahamiyatga ega bo‘lishi mumkin?", "Umuman yo‘q", "Qonunda belgilangan shartlarda qo‘shiladigan element bo‘lishi mumkin", "Faqat eksport bo‘yicha", "Faqat statistik ma’lumot sifatida", "B"),
  q(48, "MEDIUM", "Qadoqlash xarajatlari har doim bojxona qiymatiga kiradimi?", "Hech qachon", "Qonundagi shartlarga qarab kirishi mumkin", "Faqat chakana savdoda", "Faqat ichki bozorda", "B"),
  q(49, "HARD", "Royalti va litsenziya to‘lovlari qachon dolzarb bo‘ladi?", "Tovar bitimi bilan bog‘liq bo‘lib, qonundagi shartlar mavjud bo‘lsa", "Hech qachon", "Faqat eksportda", "Faqat tovar omborda turganda", "A"),
  q(50, "MEDIUM", "Bojxona qiymatini aniqlashda chegirib tashlanadigan xarajatlarni inobatga olish uchun nima kerak bo‘ladi?", "Ularning hujjatlar bilan tasdiqlanishi", "Faqat deklarantning og‘zaki izohi", "Faqat tashuvchining xati", "Faqat bank ma’lumoti", "A"),
  q(51, "HARD", "1-usulni qo‘llamaslikka sabab bo‘luvchi omillardan biri qaysi?", "Bitim narxining ishonchli tasdiqlanmasligi", "Tovar yangi bo‘lishi", "Tovar soni ko‘p bo‘lishi", "Tovar konteynerda kelishi", "A"),
  q(52, "MEDIUM", "Tovar va to‘lovlarga doir munosabatlar o‘zaro bog‘liqligi nimaga ta’sir qilishi mumkin?", "Bitim qiymatining qabul qilinishiga", "Faqat tashish narxiga", "Faqat BQD blankasiga", "Faqat markirovkaga", "A"),
  q(53, "HARD", "Agar tomonlar o‘zaro bog‘liq bo‘lsa, 1-usul avtomatik rad etiladimi?", "Ha, har doim", "Yo‘q, lekin narxga ta’sir etmaganini ko‘rsatish muhim", "Faqat eksportda rad etiladi", "Faqat broker bo‘lsa rad etiladi", "B"),
  q(54, "MEDIUM", "Bojxona qiymatini aniqlashda hujjatlar majmuasi nimani ta’minlaydi?", "Narx, xarajat va shartlarning ishonchli tasdig‘ini", "Faqat statistika tuzishni", "Faqat to‘lovni kechiktirishni", "Faqat omborga joylashni", "A"),
  q(55, "VERY_HARD", "160-son qaror amaliyotida eng muhim masala qaysi?", "Qaysi elementlar asos narxga qo‘shilishi yoki chegirilishini to‘g‘ri ajratish", "Faqat blankani chiroyli to‘ldirish", "Faqat import boji stavkasini yodlash", "Faqat tashuvchi nomini yozish", "A"),
  q(56, "MEDIUM", "Bojxona qiymati noto‘g‘ri aniqlansa eng katta oqibat nima bo‘ladi?", "Bojxona to‘lovlari xato hisoblanadi", "Faqat transport kechikadi", "Faqat ombor o‘zgaradi", "Hech narsa bo‘lmaydi", "A"),
  q(57, "HARD", "Bir xil tovar va o‘xshash tovar usullari orasidagi asosiy farq nima?", "Biri aynan bir xil, ikkinchisi o‘xshash xususiyatli tovarlarga tayanadi", "Farqi yo‘q", "Biri faqat eksportga tegishli", "Biri faqat aksizga tegishli", "A"),
  q(58, "MEDIUM", "Chegirib tashlash usuli uchun amaliy manba ko‘proq nima bo‘lishi mumkin?", "Ichki bozordagi sotuv qiymati", "Faqat eksport qiymati", "Faqat bojxona yig‘imi", "Faqat transport narxi", "A"),
  q(59, "MEDIUM", "Qo‘shish usuli uchun amaliy manba ko‘proq nima bo‘lishi mumkin?", "Ishlab chiqarish bilan bog‘liq xarajat va foyda elementlari", "Faqat mahalliy chakana narx", "Faqat tashish narxi", "Faqat sertifikat bahosi", "A"),
  q(60, "HARD", "Bojxona qiymatini aniqlashda asosiy mezonlardan biri qaysi?", "Haqiqiy, hujjatlar bilan tasdiqlangan va qonunchilikka mos qiymat", "Faqat eng past narx", "Faqat eng yuqori narx", "Faqat broker aytgan qiymat", "A"),

  // 2868-son hujjat bo‘yicha 30 ta
  q(61, "MEDIUM", "2868-son hujjat asosan nimani tartibga soladi?", "Bojxona qiymati deklaratsiyasini to‘ldirish tartibini", "Eksport bojxona boji stavkalarini", "Bojxona ombori rejimini", "Tranzit tartibini", "A"),
  q(62, "MEDIUM", "BQD qachon taqdim etiladi?", "BYUD bilan bir vaqtda", "Faqat tovar chiqarilgandan keyin", "Faqat sud so‘raganda", "Faqat broker istasa", "A"),
  q(63, "MEDIUM", "BQDning asosiy vazifasi nima?", "Tovarning bojxona qiymati to‘g‘risidagi ma’lumotlarni aks ettirish", "Faqat transport ma’lumotlarini yozish", "Faqat ombor kodini ko‘rsatish", "Faqat eksport davlatini belgilash", "A"),
  q(64, "MEDIUM", "BQDni kim to‘ldiradi?", "Deklarant yoki bojxona brokeri", "Faqat bojxona inspektori", "Faqat tashuvchi", "Faqat bank xodimi", "A"),
  q(65, "HARD", "BQDda qiymat ko‘rsatkichlari qaysi maqsadda aniq aks ettiriladi?", "Bojxona to‘lovlarini to‘g‘ri hisoblash uchun", "Faqat statistika uchun", "Faqat ichki audit uchun", "Faqat sertifikatlash uchun", "A"),
  q(66, "MEDIUM", "BQDda ko‘rsatilgan ma’lumotlar nimaga mos bo‘lishi kerak?", "Taqdim etilgan tijorat va transport hujjatlariga", "Faqat brokerning fikriga", "Faqat importyor xohishiga", "Faqat internet narxlariga", "A"),
  q(67, "MEDIUM", "BQDda bojxona qiymati strukturasi nimani aks ettiradi?", "Asos narx, qo‘shiladigan va chegiriladigan elementlarni", "Faqat QQSni", "Faqat aksizni", "Faqat bojxona yig‘imini", "A"),
  q(68, "HARD", "BQD noto‘g‘ri to‘ldirilsa birinchi navbatda nima zarar ko‘radi?", "Bojxona qiymati hisobining ishonchliligi", "Faqat tashuvchi manzili", "Faqat ombor nomi", "Faqat tovar rangi", "A"),
  q(69, "MEDIUM", "BQDdagi ma’lumotlar qaysi hujjat bilan uzviy bog‘liq?", "BYUD bilan", "Faqat invoys bilan", "Faqat CMR bilan", "Faqat sertifikat bilan", "A"),
  q(70, "MEDIUM", "BQD to‘ldirishda hujjatlardagi tafovutlar aniqlansa nima qilish kerak?", "Izoh va tasdiqlovchi hujjatlar bilan masalani aniqlashtirish kerak", "Hech narsaga e’tibor bermaslik kerak", "Faqat brokerga telefon qilish kerak", "Faqat tashuvchini almashtirish kerak", "A"),
  q(71, "HARD", "BQDda asosiy qiymat elementi noto‘g‘ri ko‘rsatilsa nima yuzaga keladi?", "Bojxona qiymati va to‘lovlar noto‘g‘ri hisoblanadi", "Faqat statistik kod o‘zgaradi", "Faqat ombor muddati uzayadi", "Hech qanday oqibat bo‘lmaydi", "A"),
  q(72, "MEDIUM", "BQDda qo‘shimcha elementlarni ko‘rsatishdagi asosiy mezon nima?", "Qonunchilikda ularning qo‘shilishi nazarda tutilgan bo‘lishi", "Har qanday xarajatni yozish", "Faqat importyor xohishi", "Faqat tashuvchi xohishi", "A"),
  q(73, "MEDIUM", "BQDda chegiriladigan elementlar qachon ko‘rsatiladi?", "Qonunda bunga yo‘l qo‘yilgan va hujjatlar bilan tasdiqlangan bo‘lsa", "Har doim", "Hech qachon", "Faqat eksportda", "A"),
  q(74, "MEDIUM", "BQDni tuzishda asosiy tamoyil nima?", "To‘liq, aniq va hujjatlar bilan tasdiqlangan ma’lumot berish", "Faqat eng past qiymatni yozish", "Faqat bojxona organi aytgan summani yozish", "Faqat taxminiy qiymat kiritish", "A"),
  q(75, "HARD", "BQD bo‘yicha mas’uliyat kim zimmasida bo‘ladi?", "Deklarant yoki uni vakillik qiluvchi shaxs zimmasida", "Faqat bojxona xodimi zimmasida", "Faqat bank zimmasida", "Faqat tashuvchi zimmasida", "A"),
  q(76, "MEDIUM", "BQD ma’lumotlari nimani tasdiqlashga xizmat qiladi?", "Tovar bojxona qiymati qanday shakllanganini", "Faqat tovar sonini", "Faqat transport turini", "Faqat ombor manzilini", "A"),
  q(77, "MEDIUM", "BQDni noto‘g‘ri to‘ldirishning oldini olish uchun eng muhim yo‘l qaysi?", "Hujjatlardagi ma’lumotlarni o‘zaro solishtirish", "Faqat eski shablondan foydalanish", "Faqat og‘zaki ma’lumotga tayanish", "Faqat brokerga topshirish", "A"),
  q(78, "HARD", "BQDdagi qiymat va invoys qiymati farq qilsa bu nimani anglatishi mumkin?", "Qo‘shimcha yoki chegiriladigan elementlar mavjud bo‘lishi mumkin", "Har doim xatolik", "Har doim firibgarlik", "Hech qanday farq bo‘lishi mumkin emas", "A"),
  q(79, "MEDIUM", "BQD qaysi holatda talab etilmasligi mumkin?", "Qonunchilikda alohida istisno nazarda tutilgan bo‘lsa", "Har qanday importda", "Har qanday eksportda", "Broker bo‘lmasa", "A"),
  q(80, "MEDIUM", "BQDdagi ma’lumotlar qaysi maqsadda keyinchalik ham tekshirilishi mumkin?", "Post-audit va bojxona qiymati nazoratida", "Faqat ombor hisobida", "Faqat bank nazoratida", "Faqat transport inspeksiyasida", "A"),
  q(81, "HARD", "BQD bo‘yicha asosiy xatolardan biri qaysi?", "Qonuniy asos bo‘lmagan xarajatlarni qo‘shish yoki zarur elementni kiritmaslik", "Faqat sana yozilmasligi", "Faqat muhr rangi", "Faqat shrift turini almashtirish", "A"),
  q(82, "MEDIUM", "BQDda qaysi ko‘rsatkich bojxona qiymati formulasi uchun markaziy hisoblanadi?", "Asos qilib olinadigan narx", "Faqat aksiz stavkasi", "Faqat bojxona yig‘imi", "Faqat CMR raqami", "A"),
  q(83, "MEDIUM", "BQD to‘ldirishda o‘lchov va summa birliklarining to‘g‘riligi nima uchun muhim?", "Hisob-kitob xatosining oldini olish uchun", "Faqat chiroyli ko‘rinish uchun", "Faqat arxiv uchun", "Hech qanday farqi yo‘q", "A"),
  q(84, "VERY_HARD", "BQDda ko‘rsatilgan ma’lumotlar va 160-son qaror o‘rtasidagi bog‘liqlik nimada?", "BQDda aynan shu qarordagi baholash yondashuvi aks ettiriladi", "Ular bir-biriga bog‘liq emas", "BQD faqat transportga oid", "160-son qaror faqat eksportga oid", "A"),
  q(85, "MEDIUM", "BQDda ko‘rsatilgan ma’lumotlar qachon ayniqsa sinchiklab tekshiriladi?", "Risk profili va qiymatga oid shubhalar mavjud bo‘lganda", "Har doim bir xil darajada", "Faqat eksportda", "Faqat broker bo‘lmaganda", "A"),
  q(86, "MEDIUM", "BQD to‘ldirishda dalolatli hujjatlar to‘liq bo‘lmasa nima xavf yuzaga keladi?", "Qiymat isbotlanmasligi xavfi", "Faqat logistika kechikishi", "Faqat ombor muammosi", "Hech qanday xavf yo‘q", "A"),
  q(87, "HARD", "BQDni to‘ldirishda deklarantning maqsadi nimadan iborat bo‘lishi kerak?", "Qiymatni yashirish", "Qonunga mos, isbotlangan qiymatni ko‘rsatish", "Faqat eng past summani tanlash", "Faqat brokerga moslashish", "B"),
  q(88, "MEDIUM", "BQDda import shartlari va to‘lov shartlari aks etishi nimaga yordam beradi?", "Narxning mazmunini tushunishga", "Faqat tashuvchini tanlashga", "Faqat omborni almashtirishga", "Faqat statistik guruhlashga", "A"),
  q(89, "HARD", "BQD bo‘yicha keyingi tuzatishlar qachon dolzarb bo‘lishi mumkin?", "Yangi hujjatlar yoki aniqlashtirilgan qiymat elementlari yuzaga kelsa", "Hech qachon", "Faqat eksportda", "Faqat suddan keyin", "A"),
  q(90, "MEDIUM", "2868-son yo‘riqnomani yaxshi bilish amaliyotda nimaga yordam beradi?", "Bojxona qiymati deklaratsiyasini xatosiz to‘ldirishga", "Faqat tashuvni tezlashtirishga", "Faqat aksizni kamaytirishga", "Faqat ombor to‘lovini yo‘qotishga", "A"),

  // 560-son hujjat bo‘yicha 30 ta
  q(91, "MEDIUM", "560-son hujjat qaysi yo‘nalishga ko‘proq tegishli?", "Eksport qilinadigan tovarlarning bojxona qiymatini aniqlashga", "Faqat import QQSga", "Faqat bojxona yig‘imlariga", "Faqat tranzitga", "A"),
  q(92, "MEDIUM", "Eksport bojxona qiymati bilan import bojxona qiymati o‘rtasidagi asosiy farq nimada namoyon bo‘lishi mumkin?", "Baholash maqsadi va ayrim qiymat elementlarida", "Ular mutlaqo bir xil va farqsiz", "Faqat tilida", "Faqat blanka rangida", "A"),
  q(93, "HARD", "Eksport qilinadigan tovarlar bo‘yicha bojxona qiymatini aniqlashda nimaga alohida e’tibor beriladi?", "Eksport bitimi va qiymatni tasdiqlovchi hujjatlarga", "Faqat import boji stavkasiga", "Faqat aksiz markasiga", "Faqat ichki bozor narxiga", "A"),
  q(94, "MEDIUM", "Eksport qiymatini belgilashda invoysning o‘rni qanday?", "Asosiy dalillardan biri", "Umuman kerak emas", "Faqat transport uchun kerak", "Faqat importga kerak", "A"),
  q(95, "MEDIUM", "Eksport qilinadigan tovarlar qiymatini aniqlashda hujjatlar nega muhim?", "Qiymatning ishonchliligini tekshirish uchun", "Faqat arxiv uchun", "Faqat bank ko‘rishi uchun", "Faqat statistika uchun", "A"),
  q(96, "HARD", "Eksport bo‘yicha qiymatni aniqlashda shartnoma shartlari nimani ochib beradi?", "Narxning iqtisodiy asosini va to‘lov sharoitini", "Faqat transport markasini", "Faqat ombor kodini", "Faqat aksiz stavkasini", "A"),
  q(97, "MEDIUM", "Eksport bojxona qiymati noto‘g‘ri ko‘rsatilsa qanday oqibat bo‘lishi mumkin?", "Rasmiylashtirish va nazoratda xatoliklar yuzaga keladi", "Hech narsa bo‘lmaydi", "Faqat tashuvchi almashadi", "Faqat ombor o‘zgaradi", "A"),
  q(98, "HARD", "Eksport qiymatini tasdiqlashda qaysi yondashuv to‘g‘ri?", "Faqat deklarantning aytganiga ishonish", "Hujjatlar o‘zaro mosligi va iqtisodiy mantiqni tekshirish", "Faqat bank rekvizitiga qarash", "Faqat markirovkaga qarash", "B"),
  q(99, "MEDIUM", "Eksport qilinadigan tovar bo‘yicha qiymatni pasaytirib ko‘rsatish xavfi nimada?", "Nazorat va hisobot ma’lumotlarining buzilishida", "Faqat ombor to‘lovi oshishida", "Faqat transport kechikishida", "Hech qanday xavf yo‘q", "A"),
  q(100, "MEDIUM", "560-son hujjat amaliyotda qaysi ehtiyojni qoplaydi?", "Eksport qiymatini bir xil yondashuvda aniqlashni", "Faqat import bojlari hisobini", "Faqat aksiz markirovkasini", "Faqat brokerlik xizmatini", "A"),
  q(101, "HARD", "Eksportda bojxona qiymatini aniqlashda transport hujjatlari nima uchun ahamiyatli bo‘lishi mumkin?", "Bitim va jo‘natish shartlarini tasdiqlashi mumkinligi uchun", "Faqat haydovchi ismini ko‘rsatish uchun", "Faqat ombor narxini belgilash uchun", "Hech qanday ahamiyati yo‘q", "A"),
  q(102, "MEDIUM", "Eksport qiymati deklaratsiya qilinayotganda eng to‘g‘ri usul qaysi?", "Qonunchilikda belgilangan tartibga qat’iy rioya qilish", "Faqat eng past narxni tanlash", "Faqat eng yuqori narxni tanlash", "Faqat og‘zaki bayon qilish", "A"),
  q(103, "MEDIUM", "Eksport bojxona qiymati qaysi ma’lumotlarga tayangan holda tekshiriladi?", "Shartnoma, invoys va boshqa tasdiqlovchi hujjatlarga", "Faqat reklama katalogiga", "Faqat ichki narxnomaga", "Faqat brokerning shaxsiy fikriga", "A"),
  q(104, "HARD", "Eksportda qiymatni aniqlashning noto‘g‘ri usuli nimaga olib kelishi mumkin?", "Noto‘g‘ri rasmiylashtirish qarorlariga", "Faqat ombor joyi o‘zgarishiga", "Faqat mashina kechikishiga", "Faqat qadoq almashtirishga", "A"),
  q(105, "MEDIUM", "Eksport qilinadigan tovarlar qiymati bo‘yicha savollarda nimalar markaziy?", "Haqiqiy bitim, hujjatlar va qiymat mantiqi", "Faqat tashuvchi manzili", "Faqat eksportchi logotipi", "Faqat konteyner raqami", "A"),
  q(106, "MEDIUM", "Eksportda qiymatni aniqlashda hujjatlar o‘rtasidagi ziddiyat nimani talab qiladi?", "Qo‘shimcha aniqlashtirish va tekshiruvni", "Hech narsani", "Faqat tashuvchini almashtirishni", "Faqat yangi blankani", "A"),
  q(107, "HARD", "Eksport bojxona qiymatiga doir noto‘g‘ri ma’lumot berishning asosiy xavfi nima?", "Nazorat va rasmiy statistikaning buzilishi", "Faqat yuk vaznining ortishi", "Faqat ombor narxining kamayishi", "Faqat tovar yorlig‘ining o‘zgarishi", "A"),
  q(108, "MEDIUM", "Eksport qiymatini aniqlash tartibining mavjudligi nimani ta’minlaydi?", "Bir xillik va huquqiy aniqlikni", "Faqat qog‘oz ko‘payishini", "Faqat bank komissiyasini", "Faqat ombor ijara haqini", "A"),
  q(109, "HARD", "Eksport qiymati bilan bog‘liq masalada qaysi dalil kuchliroq?", "Tasdiqlovchi hujjatlar majmuasi", "Faqat og‘zaki tushuntirish", "Faqat reklama bukleti", "Faqat internet skrinshoti", "A"),
  q(110, "MEDIUM", "Eksport bo‘yicha qiymat noto‘g‘ri ko‘rsatilganida qaysi tamoyil qo‘llanadi?", "Qonuniy hujjatlar va isbotlovchi materiallar asosida qayta baholash", "Faqat broker fikri bilan qaror qilish", "Faqat tashuvchi so‘zi bilan", "Hech narsa qilinmaydi", "A"),
  q(111, "MEDIUM", "Eksport qilinadigan tovarlar bo‘yicha qiymat deklaratsiyasi nimaga xizmat qiladi?", "Qiymat haqidagi ma’lumotlarni rasmiy aks ettirishga", "Faqat transportni hisoblashga", "Faqat omborga joylashga", "Faqat aksizni hisoblashga", "A"),
  q(112, "HARD", "Eksport qiymatini aniqlashda valyuta va hisob-kitob shartlari nega muhim?", "Narxning haqiqiy mazmunini anglash uchun", "Faqat bankka qulay bo‘lishi uchun", "Faqat yuk tashuvchiga kerak", "Hech qachon muhim emas", "A"),
  q(113, "MEDIUM", "Eksport qiymatiga doir nazoratning maqsadi nima?", "To‘g‘ri va ishonchli qiymatni ta’minlash", "Faqat to‘lovni oshirish", "Faqat hujjat sonini ko‘paytirish", "Faqat omborlarni tekshirish", "A"),
  q(114, "HARD", "Eksport qiymatini aniqlashda qonunchilikdagi tartiblar nega alohida belgilangan?", "Eksportning o‘ziga xos xususiyatlari mavjudligi uchun", "Faqat importni murakkablashtirish uchun", "Faqat bojxona yig‘imini ko‘paytirish uchun", "Faqat brokerlar foydasi uchun", "A"),
  q(115, "MEDIUM", "Eksport qiymatini tekshirishda ma’lumotlarning hujjatlar bilan tasdiqlanishi nimani ta’minlaydi?", "Qarorning asoslanganligini", "Faqat dizayn yaxshiligini", "Faqat saqlash qulayligini", "Faqat bojxona yig‘imini", "A"),
  q(116, "MEDIUM", "Eksport bo‘yicha qiymat nazoratining zaif nuqtasi ko‘proq qayerda bo‘lishi mumkin?", "Narx va hujjatlar o‘rtasidagi nomuvofiqlikda", "Faqat konteyner rangida", "Faqat transport sonida", "Faqat ombor qavatida", "A"),
  q(117, "VERY_HARD", "560-son hujjat bo‘yicha testlarda eng muhim tafovut nimada?", "Import tartiblari bilan aralashtirib yubormaslik kerak", "Fark yo‘q", "Faqat blanka o‘zgaradi", "Faqat shrift o‘zgaradi", "A"),
  q(118, "MEDIUM", "Eksport qiymati bo‘yicha xulosa chiqarishda eng muhim omil qaysi?", "Hujjatlar va bitim ma’lumotlarining izchilligi", "Faqat tashuvchi imzosi", "Faqat konteyner raqami", "Faqat yuk rangi", "A"),
  q(119, "HARD", "Eksport baholash qoidalari amaliyotda nimaga yordam beradi?", "Qiymatga oid bir xil yondashuvni ta’minlashga", "Faqat omborni tez bo‘shatishga", "Faqat markirovkani tekshirishga", "Faqat statistik jadval tuzishga", "A"),
  q(120, "MEDIUM", "Eksport bo‘yicha bojxona qiymati savollarida noto‘g‘ri variantni ajratish uchun nima kerak?", "Import va eksport tartiblarining farqini tushunish", "Faqat yodlash", "Faqat stavkani bilish", "Faqat tovar nomini bilish", "A"),

  // 3711-son hujjat bo‘yicha 30 ta
  q(121, "MEDIUM", "3711-son hujjat asosan nimaga bag‘ishlangan?", "Eksport bo‘yicha bojxona qiymati deklaratsiyasini to‘ldirish tartibiga", "Import QQS hisoblashga", "Bojxona yig‘imlarini undirishga", "Bojxona brokerlari litsenziyasiga", "A"),
  q(122, "MEDIUM", "Eksport BQD nima uchun kerak?", "Eksport qilinayotgan tovar qiymati haqidagi ma’lumotlarni rasmiy aks ettirish uchun", "Faqat tashuv xarajatini yozish uchun", "Faqat ombor kodini yozish uchun", "Faqat bankka yuborish uchun", "A"),
  q(123, "MEDIUM", "Eksport BQD qaysi hujjat bilan birga bog‘liq bo‘ladi?", "Eksport deklaratsiyasi bilan", "Faqat import deklaratsiyasi bilan", "Faqat CMR bilan", "Faqat sertifikat bilan", "A"),
  q(124, "HARD", "Eksport BQDdagi ma’lumotlar nimaga mos bo‘lishi kerak?", "Eksport bitimi va tasdiqlovchi hujjatlarga", "Faqat tashuvchi og‘zaki ma’lumotiga", "Faqat broker fikriga", "Faqat ichki bozor narxiga", "A"),
  q(125, "MEDIUM", "Eksport BQDni kim to‘ldiradi?", "Deklarant yoki vakolatli shaxs", "Faqat bojxona inspektori", "Faqat bank xodimi", "Faqat ishlab chiqaruvchi", "A"),
  q(126, "MEDIUM", "Eksport BQDdagi qiymat ma’lumotlari nimaga xizmat qiladi?", "Nazorat va rasmiylashtirish uchun", "Faqat ombor hisobi uchun", "Faqat transportni taqsimlash uchun", "Faqat aksiz markasini tekshirish uchun", "A"),
  q(127, "HARD", "Eksport BQD noto‘g‘ri to‘ldirilsa eng katta xavf nima?", "Qiymat va nazoratga oid noto‘g‘ri xulosalar", "Faqat printer xatosi", "Faqat ombordagi joy o‘zgarishi", "Faqat yuklash kechikishi", "A"),
  q(128, "MEDIUM", "Eksport BQDdagi qiymat va invoys ma’lumotlari o‘rtasidagi farq nimani ko‘rsatishi mumkin?", "Qo‘shimcha tushuntirish zarurligini", "Har doim firibgarlikni", "Hech qachon muammo emasligini", "Faqat transport xatoligini", "A"),
  q(129, "MEDIUM", "Eksport BQDni to‘ldirishda asosiy tamoyil qaysi?", "Aniqlik va hujjatlar bilan tasdiqlanganlik", "Faqat tez to‘ldirish", "Faqat umumiy summa yozish", "Faqat eng qulay variantni tanlash", "A"),
  q(130, "MEDIUM", "Eksport BQD bo‘yicha tuzatishlar qachon dolzarb bo‘ladi?", "Ma’lumot aniqlashtirilganda yoki xato topilganda", "Hech qachon", "Faqat importda", "Faqat sud qarori bilan", "A"),
  q(131, "HARD", "Eksport BQD amaliyotida eng murakkab masalalardan biri qaysi?", "Qiymatning hujjatlar bilan ishonchli asoslanganligini ko‘rsatish", "Faqat sana kiritish", "Faqat muhr bosish", "Faqat yuk raqamini yozish", "A"),
  q(132, "MEDIUM", "Eksport BQDdagi ma’lumotlarni keyinchalik ham tekshirish mumkinmi?", "Ha, zarur hollarda", "Yo‘q, bir marta topshirilgach bo‘lmaydi", "Faqat importda mumkin", "Faqat bank tekshiradi", "A"),
  q(133, "MEDIUM", "Eksport BQDdagi blankani to‘g‘ri to‘ldirish nimani kamaytiradi?", "Rasmiylashtirishdagi xatolar xavfini", "Faqat logistika xarajatini", "Faqat ombor muddatini", "Faqat bojxona yig‘imini", "A"),
  q(134, "HARD", "Eksport BQDda qiymat bo‘yicha noto‘g‘ri ma’lumot berishning asosiy salbiy tomoni nima?", "Nazorat tizimining noto‘g‘ri ishlashiga olib kelishi", "Faqat yuk rangi o‘zgarishi", "Faqat blanka almashishi", "Faqat tashuvchi nomi o‘zgarishi", "A"),
  q(135, "MEDIUM", "Eksport BQDdagi ma’lumotlar qaysi jarayonning bir qismi?", "Eksport bojxona rasmiylashtiruvining", "Faqat import nazoratining", "Faqat ombor hisobi", "Faqat aksiz nazorati", "A"),
  q(136, "MEDIUM", "Eksport BQDni to‘ldirishni bilish amaliyotda nimaga yordam beradi?", "Eksport qiymati bo‘yicha hujjatlarni xatosiz rasmiylashtirishga", "Faqat tashuvchini topishga", "Faqat ombor narxini bilishga", "Faqat marka tanlashga", "A"),
  q(137, "HARD", "Eksport BQD bilan 560-son hujjat o‘rtasidagi bog‘liqlik nimada?", "Biri qiymatni aniqlash tartibi, ikkinchisi uni deklaratsiyada aks ettirish tartibi", "Ular mutlaqo bog‘liq emas", "Ikkalasi faqat importga tegishli", "Ikkalasi faqat yig‘imlarga tegishli", "A"),
  q(138, "MEDIUM", "Eksport BQDdagi ma’lumotlarning hujjatlar bilan mos bo‘lishi nega kerak?", "Qiymatning asoslanganligini isbotlash uchun", "Faqat printer uchun", "Faqat arxiv uchun", "Faqat tashuvchi uchun", "A"),
  q(139, "MEDIUM", "Eksport BQDda umumiy qoidabuzarlikning oldini olishning asosiy yo‘li qaysi?", "Hujjatlarni o‘zaro solishtirish va normaga tayangan holda to‘ldirish", "Faqat blankani tez yuborish", "Faqat nusxa sonini ko‘paytirish", "Faqat tashuvchi bilan gaplashish", "A"),
  q(140, "HARD", "Eksport BQD bo‘yicha nazorat nimani aniqlashga qaratilgan?", "Qiymat to‘g‘ri shakllantirilganini", "Faqat yuk sonini", "Faqat avtomobil markasini", "Faqat ombor kodini", "A"),
  q(141, "MEDIUM", "Eksport BQDda ma’lumotlarni haddan tashqari soddalashtirib yozish nima uchun xavfli?", "Qiymat elementlari yo‘qolib ketishi mumkin", "Faqat chiroyli ko‘rinadi", "Faqat printer siyohi tejaladi", "Hech qanday xavf yo‘q", "A"),
  q(142, "MEDIUM", "Eksport BQD bo‘yicha savollarda eng ko‘p uchraydigan xato nima?", "Import BQD qoidalari bilan aralashtirish", "Faqat variant A ni tanlash", "Faqat summani yodlash", "Faqat sanani unutish", "A"),
  q(143, "MEDIUM", "Eksport BQDda qiymat ma’lumotlari noto‘g‘ri bo‘lsa nima qilish kerak?", "Tuzatish va qo‘shimcha hujjatlar bilan aniqlashtirish", "Hech narsa qilmaslik", "Faqat blankani yirtib tashlash", "Faqat brokerga topshirish", "A"),
  q(144, "HARD", "Eksport BQDning yuridik ahamiyati nimada?", "U rasmiy deklaratsiya qismi sifatida qiymat to‘g‘risidagi ma’lumotni tasdiqlaydi", "Faqat norasmiy ma’lumotnoma", "Faqat ichki xizmat xati", "Faqat statistik qog‘oz", "A"),
  q(145, "MEDIUM", "Eksport BQD bo‘yicha muammo chiqsa eng to‘g‘ri yo‘l qaysi?", "Normativ hujjat va asoslovchi hujjatlarga qaytish", "Faqat internetdan qidirish", "Faqat tashuvchini almashtirish", "Faqat blankani qayta chop etish", "A"),
  q(146, "VERY_HARD", "Eksport BQDga doir savollarda murakkab nuqta qaysi?", "Qiymatni aniqlash tartibi va deklaratsiyada aks ettirish tartibini farqlash", "Faqat A va B variantni ajratish", "Faqat sana yodlash", "Faqat hujjat raqamini eslab qolish", "A"),
  q(147, "MEDIUM", "Eksport BQD qaysi fanning amaliy qismiga eng yaqin?", "Bojxona qiymati", "Bojxona statistikasi", "Bojxona etikasi", "Mehnat muhofazasi", "A"),
  q(148, "HARD", "Eksport BQD bo‘yicha professional yondashuv nimani talab qiladi?", "Qiymat va deklaratsiya ma’lumotlarining o‘zaro uyg‘unligini", "Faqat tezlikni", "Faqat muhrni", "Faqat elektron imzoni", "A"),
  q(149, "MEDIUM", "Eksport BQD bo‘yicha to‘g‘ri rasmiylashtirish natijasi nima?", "Nazoratda barqaror va asoslangan ma’lumotlar", "Faqat omborning bo‘shashi", "Faqat yuk mashinasi almashishi", "Faqat bank xabar yuborishi", "A"),
  q(150, "VERY_HARD", "3711-son hujjat bo‘yicha testlarda to‘g‘ri yondashuv qaysi?", "Eksport qiymati deklaratsiyasining mazmuni, tuzilishi va hujjatlar bilan bog‘liqligini tushunish", "Faqat hujjat raqamini yod olish", "Faqat variantlarni taxmin qilish", "Faqat import qoidalarini ishlatish", "A"),
] as const;

async function main() {
  console.log("Import boshlandi...");

  const subject = await prisma.subject.upsert({
    where: { code: SUBJECT_CODE },
    update: {
      titleUz: "Bojxona qiymati",
      titleRu: "Таможенная стоимость",
      descriptionUz: "Bojxona qiymati faniga oid savollar banki",
      descriptionRu: "Банк вопросов по таможенной стоимости",
    },
    create: {
      code: SUBJECT_CODE,
      titleUz: "Bojxona qiymati",
      titleRu: "Таможенная стоимость",
      descriptionUz: "Bojxona qiymati faniga oid savollar banki",
      descriptionRu: "Банк вопросов по таможенной стоимости",
    },
  });

  console.log("Fan tayyor:", subject.titleUz);

  const existingQuestions = await prisma.question.findMany({
    where: { subjectId: subject.id },
    select: { textUz: true },
  });

  const existingSet = new Set(existingQuestions.map((q) => q.textUz.trim().toLowerCase()));

  let created = 0;
  let skipped = 0;

  for (const item of questions) {
    const key = item.textUz.trim().toLowerCase();

    if (existingSet.has(key)) {
      skipped += 1;
      continue;
    }

    await prisma.question.create({
      data: {
        subjectId: subject.id,
        sortOrder: item.sortOrder,
        difficulty: item.difficulty,
        textUz: item.textUz,
        textRu: item.textRu,
        optionAUz: item.optionAUz,
        optionARu: item.optionARu,
        optionBUz: item.optionBUz,
        optionBRu: item.optionBRu,
        optionCUz: item.optionCUz,
        optionCRu: item.optionCRu,
        optionDUz: item.optionDUz,
        optionDRu: item.optionDRu,
        correctOption: item.correctOption,
        isActive: true,
      },
    });

    existingSet.add(key);
    created += 1;
  }

  const totalActiveQuestions = await prisma.question.count({
    where: {
      subjectId: subject.id,
      isActive: true,
    },
  });

  await prisma.test.upsert({
    where: { id: "customs-value-30" },
    update: {
      subjectId: subject.id,
      titleUz: "Bojxona qiymati — 30 ta savol",
      titleRu: "Таможенная стоимость — 30 вопросов",
      descriptionUz: "30 ta random savoldan iborat test varianti",
      descriptionRu: "Тестовый вариант из 30 случайных вопросов",
      durationMinutes: 30,
      questionCount: Math.min(30, totalActiveQuestions),
      randomizeQuestions: true,
      isActive: true,
    },
    create: {
      id: "customs-value-30",
      subjectId: subject.id,
      titleUz: "Bojxona qiymati — 30 ta savol",
      titleRu: "Таможенная стоимость — 30 вопросов",
      descriptionUz: "30 ta random savoldan iborat test varianti",
      descriptionRu: "Тестовый вариант из 30 случайных вопросов",
      durationMinutes: 30,
      questionCount: Math.min(30, totalActiveQuestions),
      randomizeQuestions: true,
      isActive: true,
    },
  });

  await prisma.test.upsert({
    where: { id: "customs-value-50" },
    update: {
      subjectId: subject.id,
      titleUz: "Bojxona qiymati — 50 ta savol",
      titleRu: "Таможенная стоимость — 50 вопросов",
      descriptionUz: "50 ta random savoldan iborat test varianti",
      descriptionRu: "Тестовый вариант из 50 случайных вопросов",
      durationMinutes: 50,
      questionCount: Math.min(50, totalActiveQuestions),
      randomizeQuestions: true,
      isActive: true,
    },
    create: {
      id: "customs-value-50",
      subjectId: subject.id,
      titleUz: "Bojxona qiymati — 50 ta savol",
      titleRu: "Таможенная стоимость — 50 вопросов",
      descriptionUz: "50 ta random savoldan iborat test varianti",
      descriptionRu: "Тестовый вариант из 50 случайных вопросов",
      durationMinutes: 50,
      questionCount: Math.min(50, totalActiveQuestions),
      randomizeQuestions: true,
      isActive: true,
    },
  });

  await prisma.test.upsert({
    where: { id: "customs-value-100" },
    update: {
      subjectId: subject.id,
      titleUz: "Bojxona qiymati — 100 ta savol",
      titleRu: "Таможенная стоимость — 100 вопросов",
      descriptionUz: "100 ta random savoldan iborat test varianti",
      descriptionRu: "Тестовый вариант из 100 случайных вопросов",
      durationMinutes: 90,
      questionCount: Math.min(100, totalActiveQuestions),
      randomizeQuestions: true,
      isActive: true,
    },
    create: {
      id: "customs-value-100",
      subjectId: subject.id,
      titleUz: "Bojxona qiymati — 100 ta savol",
      titleRu: "Таможенная стоимость — 100 вопросов",
      descriptionUz: "100 ta random savoldan iborat test varianti",
      descriptionRu: "Тестовый вариант из 100 случайных вопросов",
      durationMinutes: 90,
      questionCount: Math.min(100, totalActiveQuestions),
      randomizeQuestions: true,
      isActive: true,
    },
  });

  console.log("Yangi qo‘shilgan savollar:", created);
  console.log("Skip qilingan savollar:", skipped);
  console.log("Jami faol savollar:", totalActiveQuestions);
  console.log("Import yakunlandi.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });