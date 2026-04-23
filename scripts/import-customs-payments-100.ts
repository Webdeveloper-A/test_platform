import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type Difficulty = "MEDIUM" | "HARD" | "VERY_HARD";
type CorrectOption = "A" | "B" | "C" | "D";

const SUBJECT_CODE = "CUSTOMS_PAYMENTS";

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
  q(1, "MEDIUM", "Bojxona to‘lovlari tarkibiga qaysi to‘lovlar kiradi?", "Faqat import boji", "Import/eksport bojlari, QQS, aksiz va bojxona yig‘imlari", "Faqat QQS va aksiz", "Faqat bojxona yig‘imlari", "B"),
  q(2, "MEDIUM", "Import bojxona boji qaysi holatda undiriladi?", "Tovar O‘zbekiston hududiga olib kirilganda", "Tovar ichki bozorda sotilganda", "Faqat reeksportda", "Faqat vaqtincha olib chiqishda", "A"),
  q(3, "MEDIUM", "Eksport bojxona boji qaysi holatda undiriladi?", "Tovar bojxona hududiga olib kirilganda", "Tovar bojxona hududidan olib chiqilganda", "Har qanday tranzitda", "Faqat bojxona omborida", "B"),
  q(4, "MEDIUM", "Alohida bojxona bojlari nimaga xizmat qiladi?", "Faqat statistika yuritishga", "Bojxona organlari xarajatini qoplashga", "Milliy iqtisodiy manfaatlarni himoya qilishga", "Faqat eksportni rag‘batlantirishga", "C"),
  q(5, "MEDIUM", "Mavsumiy bojxona bojlari asosan nimani tartibga soladi?", "Tovarlar importi va eksportini tezkor tartibga solishni", "Faqat bojxona yig‘imini", "Faqat QQSni", "Faqat aksizni", "A"),
  q(6, "MEDIUM", "Boj tarifi nimani anglatadi?", "Bojxona yig‘imlari ro‘yxatini", "TIF TN bo‘yicha tizimlashtirilgan boj stavkalari majmuini", "Faqat import QQS jadvalini", "Faqat aksiz stavkalarini", "B"),
  q(7, "MEDIUM", "Bojxona yig‘imlari stavkalarini kim belgilaydi?", "Bojxona posti boshlig‘i", "Markaziy bank", "Vazirlar Mahkamasi", "Tadbirkorning o‘zi", "C"),
  q(8, "MEDIUM", "Bojxona chegarasi orqali olib o‘tiladigan tovarlarga qanday soliqlar solinishi mumkin?", "Foyda solig‘i va yer solig‘i", "QQS va aksiz solig‘i", "Faqat ijtimoiy soliq", "Faqat aylanmadan olinadigan soliq", "B"),
  q(9, "MEDIUM", "Xalqaro shartnomada bojxona qonunchiligidan boshqacha qoida bo‘lsa, qaysi qoida qo‘llaniladi?", "Har doim ichki qonun", "Har doim bojxona posti ko‘rsatmasi", "Xalqaro shartnoma qoidasi", "Faqat soliq organi xati", "C"),
  q(10, "MEDIUM", "Quyidagilardan qaysi biri bojxona boji emas?", "Import boji", "Eksport boji", "Mavsumiy boj", "Bojxona yig‘imi", "D"),

  q(11, "MEDIUM", "Bojxona to‘lovlarini undirish bilan bog‘liq munosabatlar qaysi hujjatda tartibga solinadi?", "Faqat Mehnat kodeksida", "Bojxona kodeksida", "Faqat Fuqarolik kodeksida", "Faqat Banklar to‘g‘risidagi qonunda", "B"),
  q(12, "MEDIUM", "Bojxona maqsadlaridan biri nima?", "Faqat statistik hisobot tayyorlash", "Bojxona to‘lovlari o‘z vaqtida va to‘g‘ri to‘lanishini ta’minlash", "Faqat tadbirkorlarni ro‘yxatga olish", "Faqat valyuta kursini belgilash", "B"),
  q(13, "MEDIUM", "Tarif kvotalari qaysi maqsadda joriy etilishi mumkin?", "Faqat yuk mashinalari sonini cheklash uchun", "Tashqi savdo siyosatini amalga oshirish uchun", "Faqat sertifikatlashni bekor qilish uchun", "Faqat brokerlik haqini kamaytirish uchun", "B"),
  q(14, "MEDIUM", "Bojxona to‘lovlari bo‘yicha eng to‘g‘ri yondashuv qaysi?", "Faqat eski konspektga tayanish", "Faqat forumdagi izohga tayanish", "Amaldagi normativ hujjatga tayanish", "Faqat amaliyotchining og‘zaki fikriga tayanish", "C"),
  q(15, "MEDIUM", "Bojxona yig‘imi ko‘proq nimaga bog‘liq bo‘ladi?", "Bojxona rasmiylashtiruvi bilan bog‘liq harakatlarga", "Faqat sof foydaga", "Faqat ishlab chiqaruvchi davlatga", "Faqat sotuvchi brendiga", "A"),
  q(16, "HARD", "Import QQS hisoblashda quyidagilardan qaysi biri muhim?", "Tovar egasining yashash joyi", "Bojxona qiymati va qonundagi soliq bazasi qoidalari", "Faqat shartnoma tili", "Faqat yuk markirovkasi", "B"),
  q(17, "MEDIUM", "Aksiz solig‘i qachon dolzarb bo‘ladi?", "Har qanday tovarga", "Faqat aksiz osti tovarlariga", "Faqat eksportga", "Faqat bojxona yig‘imlariga", "B"),
  q(18, "HARD", "Bojxona to‘lovlari bo‘yicha noaniqliklar kimning foydasiga talqin qilinadi?", "Faqat bojxona organi foydasiga", "TIF ishtirokchisi foydasiga", "Faqat sud foydasiga", "Faqat bank foydasiga", "B"),
  q(19, "MEDIUM", "Quyidagilardan qaysi biri bojxona to‘lovlariga kirmaydi?", "Import boji", "Aksiz solig‘i", "Foyda solig‘i", "Bojxona yig‘imi", "C"),
  q(20, "MEDIUM", "Bojxona qonunchiligi qachondan qo‘llaniladi?", "Tovar sotilgandan", "Deklaratsiya va hujjatlar qabul qilingan kunda amalda bo‘lgan qonunchilik bo‘yicha", "Yil yakunida", "Faqat kontrakt tuzilgan sanadagi qonun bo‘yicha", "B"),

  q(21, "MEDIUM", "Advalor stavka qo‘llanganda bojxona boji nimaga nisbatan hisoblanadi?", "Tovar soniga", "Netto vaznga", "Bojxona qiymatiga foiz hisobida", "Faqat transport xarajatiga", "C"),
  q(22, "MEDIUM", "Spetsifik stavka qo‘llanganda bojxona boji odatda nimaga nisbatan hisoblanadi?", "Tovar birligi, vazni yoki hajmiga", "Faqat bojxona qiymatiga", "Faqat foyda miqdoriga", "Faqat QQS bazasiga", "A"),
  q(23, "HARD", "Kombinatsiyalashgan stavka nimani anglatadi?", "Faqat aksiz stavkasini", "Bir nechta hisoblash usullarining qo‘shib qo‘llanishini", "Faqat mavsumiy bojni", "Faqat bojxona yig‘imini", "B"),
  q(24, "MEDIUM", "Import QQS bojxona chegarasida nima bilan bog‘liq ravishda yuzaga keladi?", "Tovarni ichki bozorda reklama qilish bilan", "Tovarni bojxona hududiga olib kirish bilan", "Faqat ombordan chiqarish bilan", "Faqat qayta eksport bilan", "B"),
  q(25, "MEDIUM", "Aksiz to‘lanadigan tovar import qilinganda qaysi to‘lov yuzaga kelishi mumkin?", "Faqat bojxona yig‘imi", "Aksiz solig‘i", "Faqat foyda solig‘i", "Faqat jarima", "B"),
  q(26, "HARD", "Bojxona yig‘imi va bojxona boji o‘rtasidagi asosiy farq nimada?", "Ular mutlaqo bir xil", "Yig‘im — bojxona harakatlari uchun, boj — tarif to‘lovi sifatida", "Boj faqat eksportda, yig‘im faqat importda", "Yig‘im doim foizda hisoblanadi", "B"),
  q(27, "MEDIUM", "To‘lovlarni hisoblashda hujjatlarning to‘liqligi nima uchun muhim?", "Faqat arxiv uchun", "Hisob-kitob asoslanganligini ta’minlash uchun", "Faqat tarjima uchun", "Faqat dizayn uchun", "B"),
  q(28, "HARD", "Bojxona to‘lovlari bo‘yicha dastlabki qaror amaliyotda nimaga xizmat qiladi?", "Faqat ombor joyini tanlashga", "Oldindan to‘lov miqdorini aniqlashtirishga", "Faqat yuk mashinasini almashtirishga", "Faqat sug‘urtani bekor qilishga", "B"),
  q(29, "MEDIUM", "Bojxona to‘lovlari hisobida imtiyoz qo‘llanishi uchun odatda nima talab etiladi?", "Og‘zaki va’da", "Qonuniy asos va tasdiqlovchi hujjatlar", "Faqat broker tavsiyasi", "Faqat telefon xabari", "B"),
  q(30, "HARD", "Bojxona boji bo‘yicha stavka nol bo‘lsa, qaysi xulosa to‘g‘ri?", "Hech qanday boshqa to‘lov bo‘lmaydi", "Faqat import boji bo‘lmasligi mumkin, boshqa to‘lovlar alohida baholanadi", "QQS ham avtomatik nol bo‘ladi", "Bojxona yig‘imi ham bo‘lmaydi", "B"),

  q(31, "HARD", "Tovarning bojxona qiymati aniqlanayotganda faqat faktura summasi bilan cheklanib qolmaslik sababi nima?", "Chunki qonunda ayrim qo‘shimcha elementlar ham inobatga olinishi mumkin", "Chunki faqat vazn kerak", "Chunki faqat son kerak", "Chunki faktura qonunda taqiqlangan", "A"),
  q(32, "MEDIUM", "Qaysi holatda bojxona to‘lovlari kam hisoblab chiqilishi ehtimoli yuqori?", "Kod va qiymat to‘g‘ri bo‘lsa", "Kod noto‘g‘ri va qiymat pasaytirilsa", "Barcha hujjatlar to‘liq bo‘lsa", "Imtiyoz hujjati qonuniy bo‘lsa", "B"),
  q(33, "MEDIUM", "Bojxona yig‘imlari stavkalari nima bilan asoslantiriladi?", "Bojxona organlari amalga oshiradigan harakatlar xarajatining taxminiy qiymati bilan", "Faqat valyuta kursi bilan", "Faqat kontrakt soni bilan", "Faqat reklama xarajatlari bilan", "A"),
  q(34, "HARD", "Import va eksport rasmiylashtiruvi uchun yig‘imlar bo‘yicha 55-son qaror nimani ko‘zlaydi?", "Ularni o‘zaro muvofiqlashtirishni", "Faqat eksportni bekor qilishni", "QQSni bojga aylantirishni", "Aksizni kamaytirishni", "A"),
  q(35, "VERY_HARD", "Bojxona to‘lovlari bo‘yicha hisob-kitobning yakuniy to‘g‘riligi eng ko‘p nimaga bog‘liq?", "Brend ommabopligiga", "To‘g‘ri tasnif, to‘g‘ri qiymat va to‘g‘ri imtiyozga", "Faqat broker tajribasiga", "Faqat ombor joylashuviga", "B"),
  q(36, "MEDIUM", "Bojxona to‘lovlari bo‘yicha majburiyatni ta’minlashdan asosiy maqsad nima?", "Faqat statistik ma’lumot yig‘ish", "To‘lovlarning bajarilishini kafolatlash", "Faqat ombor xarajatini qoplash", "Faqat transportni sug‘urtalash", "B"),
  q(37, "MEDIUM", "To‘lovlarni ta’minlash vositalari amaliyotda nimaga xizmat qiladi?", "Bojxona organi to‘lovni undira olishini kafolatlashga", "Faqat kontrakt narxini oshirishga", "Faqat tovarni tez chiqarishga", "Faqat hisob-faktura tuzishga", "A"),
  q(38, "MEDIUM", "Import QQSni bo‘lib-bo‘lib to‘lash yoki muddatini uzaytirish masalasi qaysi hujjatlar bilan tartibga solinishi mumkin?", "Faqat ichki yo‘riqnoma bilan", "Soliq kodeksi va vakolatli normativ hujjatlar bilan", "Faqat bank nizomi bilan", "Faqat broker kelishuvi bilan", "B"),
  q(39, "MEDIUM", "Soliq to‘lash muddatini keyinroq muddatga ko‘chirish nimani anglatadi?", "Soliqni bekor qilishni", "Soliq to‘lash muddatini o‘zgartirishni", "Jarimani oshirishni", "Valyutani almashtirishni", "B"),
  q(40, "HARD", "Bosh ta’minot to‘g‘risidagi 3579-son nizom nimaga aloqador?", "Bojxona to‘lovlarini to‘lash majburiyatining bosh ta’minotiga", "Faqat ish haqi to‘loviga", "Faqat bank krediti foiziga", "Faqat transport tarifiga", "A"),

  q(41, "MEDIUM", "Bojxona to‘lovlari muddatida to‘lanmasa umumiy oqibat nimadan iborat bo‘lishi mumkin?", "Majburiy undirish choralari va javobgarlik", "Hech qanday oqibat bo‘lmaydi", "Faqat tovarning markasi o‘zgaradi", "Faqat statistika tuzatiladi", "A"),
  q(42, "MEDIUM", "To‘lovni kechiktirish imtiyozi avtomatik beriladimi?", "Ha, har doim", "Yo‘q, qonuniy asos va belgilangan tartib zarur", "Faqat broker so‘rasa", "Faqat 1 mln so‘mdan yuqori yuklarda", "B"),
  q(43, "MEDIUM", "Bojxona to‘lovlarining ta’minoti qachon ayniqsa muhim bo‘ladi?", "Majburiyat kechiktirilganda yoki shartli tartib qo‘llanganda", "Faqat eksportda", "Faqat bojsiz tovarlarda", "Faqat ommaviy axborot uchun", "A"),
  q(44, "MEDIUM", "Bojxona organi uchun to‘lov ta’minoti mavjud bo‘lishining amaliy afzalligi nima?", "Qarz yuzaga kelsa undirish xavfi kamayadi", "Faqat hujjatlar soni oshadi", "Faqat valyuta almashadi", "Hech qanday afzallik yo‘q", "A"),
  q(45, "MEDIUM", "Import QQS bo‘yicha muddatni uzaytirish masalasi qanday ko‘riladi?", "Faqat telefon orqali", "Belgilangan tartib va mezonlar asosida", "Faqat og‘zaki ariza bilan", "Faqat shaxsiy tanish orqali", "B"),
  q(46, "MEDIUM", "To‘lov bo‘yicha imtiyoz yoki kechiktirish berilganda hujjatlashtirish nima uchun zarur?", "Keyinchalik nazorat va isbot uchun", "Faqat printer ishlatish uchun", "Faqat bojxona xodimi qulayligi uchun", "Shart emas", "A"),
  q(47, "HARD", "Bojxona to‘lovlari bo‘yicha shartli ozod etish deganda nima tushuniladi?", "To‘lov abadiy bekor qilinadi", "Shartlar buzilsa to‘lov majburiyati tiklanishi mumkin", "Faqat yig‘im bekor bo‘ladi", "Faqat aksiz qoladi", "B"),
  q(48, "MEDIUM", "Agar to‘lovni kechiktirish shartlari buzilsa, qanday oqibat yuzaga kelishi mumkin?", "Hech narsa bo‘lmaydi", "Asosiy to‘lov va qonundagi oqibatlar qo‘llanadi", "Faqat statistik hisobot o‘zgaradi", "Faqat kontrakt qayta yoziladi", "B"),
  q(49, "MEDIUM", "Bojxona to‘lovlari bo‘yicha eng xavfli xatolardan biri qaysi?", "Imtiyozni hujjatsiz qo‘llash", "Savolni sekin o‘qish", "Hujjatni stapler bilan biriktirish", "Tovarni suratga olish", "A"),
  q(50, "MEDIUM", "Tovarlar chiqarib yuborilishidan oldin bojxona organi nimani tekshirishi mumkin?", "To‘lovlar to‘langanini yoki ta’minot mavjudligini", "Faqat kompaniya logotipini", "Faqat reklama dizaynini", "Faqat direktorning yoshi nechada ekanini", "A"),

  q(51, "MEDIUM", "Bojxona to‘lovlari bo‘yicha garov, kafillik yoki boshqa vositalar nimani bajaradi?", "Majburiyatni ta’minlash funksiyasini", "Faqat reklama funksiyasini", "Faqat statistika funksiyasini", "Faqat valyuta kursini belgilash funksiyasini", "A"),
  q(52, "MEDIUM", "Tovarni chiqarib yuborishning to‘lovlar bilan bog‘liq asosiy sharti nima?", "Faqat haydovchi guvohnomasi", "To‘lovlarning bajarilganligi yoki zarur ta’minotning mavjudligi", "Faqat kontrakt muhrlanganligi", "Faqat yuk mashinasi hajmi", "B"),
  q(53, "MEDIUM", "Bojxona to‘lovlari bo‘yicha qarzdorlik yuzaga kelsa, bu nimani bildiradi?", "Majburiyat to‘liq va o‘z vaqtida bajarilmaganini", "Har doim imtiyoz borligini", "Tovar avtomatik reeksport bo‘lishini", "QQS bekor qilinganini", "A"),
  q(54, "MEDIUM", "Qonunchilikdagi to‘lov muddatini o‘zgartirish qoidalari qaysi manbada ham mavjud?", "Soliq kodeksida", "Faqat Mehnat kodeksida", "Faqat Jinoyat kodeksida", "Faqat Yer kodeksida", "A"),
  q(55, "VERY_HARD", "Bojxona to‘lovlarini to‘lashning bosh ta’minoti bo‘yicha hujjatlar nima uchun ahamiyatli?", "Yirik va takrorlanuvchi operatsiyalar uchun kafolat mexanizmi sifatida", "Faqat bir martalik reklama uchun", "Faqat eksport statistikasini to‘ldirish uchun", "Faqat haydovchini almashtirish uchun", "A"),
  q(56, "MEDIUM", "Reeksport rejimiga joylashtiriladigan tovarlar bo‘yicha umumiy qoida qaysi?", "Import boji to‘lanadi", "Bojxona bojlari va soliqlar to‘lashdan ozod etilishi mumkin", "Faqat aksiz olinadi", "Faqat QQS olinadi", "B"),
  q(57, "MEDIUM", "Ilgari import rejimiga joylashtirilgan tovar reeksport qilinsa, qachon to‘langan to‘lovlar qaytarilishi mumkin?", "Qonunda nazarda tutilgan shartlar bajarilganda", "Hech qachon", "Faqat ikki yildan keyin", "Faqat og‘zaki murojaat bilan", "A"),
  q(58, "MEDIUM", "Vaqtincha olib kirish rejimining to‘lovlar nuqtai nazaridan xos belgisi nima?", "Har doim to‘liq import boji olinadi", "Shartli ozod etish yoki davriy to‘lovlar qo‘llanishi mumkin", "Faqat eksport boji olinadi", "Hech qanday nazorat bo‘lmaydi", "B"),
  q(59, "MEDIUM", "Davriy bojxona to‘lovlari qaysi rejim bilan eng ko‘p bog‘liq?", "Tranzit", "Vaqtincha olib kirish", "Reeksport", "Yo‘q qilish", "B"),
  q(60, "MEDIUM", "Davriy bojxona to‘lovlari har bir to‘liq va to‘liq bo‘lmagan kalendar oy uchun qancha qilib hisoblanadi?", "3 foiz", "5 foiz", "10 foiz", "15 foiz", "B"),

  q(61, "MEDIUM", "Davriy bojxona to‘lovlari nimaning foizi sifatida olinadi?", "Faqat bojxona yig‘imining", "Import rejimida to‘lanishi lozim bo‘lgan bojlar va soliqlar summasining", "Faqat QQSning", "Faqat aksizning", "B"),
  q(62, "MEDIUM", "Erkin ombor rejimida eksport uchun mo‘ljallangan tovarlar bo‘yicha nima bo‘lishi mumkin?", "Bojlar va soliqlardan ozod etish yoki qaytarish", "Har doim ikki marta boj undirish", "Faqat QQSni bekor qilish", "Faqat aksizni oshirish", "A"),
  q(63, "MEDIUM", "Erkin ombor bo‘yicha qaytarilgan yoki ozod etilgan summalar mavjud bo‘lsa, tovar belgilangan muddatda olib chiqilmasa nima bo‘ladi?", "Hech narsa bo‘lmaydi", "Bojxona bojlari va soliqlar to‘lanadi", "Faqat yig‘im qoladi", "Faqat ogohlantirish beriladi", "B"),
  q(64, "HARD", "Erkin bojxona zonasi rejimida tovarlar qayerda joylashgan deb qaralishi mumkin?", "Bojxona hududidan tashqarida joylashgandek", "Har doim ichki bozor deb", "Faqat eksport ombori deb", "Faqat tranzit hududi deb", "A"),
  q(65, "MEDIUM", "Erkin bojxona zonasi rejimida iqtisodiy siyosat choralari odatda qanday qo‘llanadi?", "Qo‘llanilmaydi", "Har doim ikki baravar qo‘llanadi", "Faqat jismoniy shaxslarga qo‘llanadi", "Faqat QQSga qo‘llanadi", "A"),
  q(66, "MEDIUM", "Shartli ozod etishning eng muhim xususiyati qaysi?", "Shart buzilsa to‘lov majburiyati tiklanishi mumkin", "Har doim butunlay kechiriladi", "Faqat eksportda ishlaydi", "Faqat statistik maqsadda qo‘llanadi", "A"),
  q(67, "MEDIUM", "Imtiyozdan foydalanishda hujjatlarni noto‘g‘ri rasmiylashtirish nimaga olib kelishi mumkin?", "Asossiz ozod etish deb baholanishiga", "Har doim imtiyozning saqlanishiga", "To‘lovlarning kamayishiga", "Hech qanday oqibat yo‘q", "A"),
  q(68, "MEDIUM", "Bojxona to‘lovlari qaytarilishi haqidagi da’vo qachon asoslidir?", "Ortiqcha to‘langan yoki undirilgan summa mavjud bo‘lsa", "Har safar import qilinganda", "Faqat eksportdan keyin", "Faqat broker so‘rasa", "A"),
  q(69, "MEDIUM", "Qaytarish tartibida eng muhim narsa nima?", "To‘lov ortiqcha yoki asossiz undirilganini isbotlash", "Faqat telefon orqali xabar berish", "Faqat kassa chekini yo‘qotish", "Faqat shaxsiy tanish", "A"),
  q(70, "MEDIUM", "Bojxona to‘lovlari bo‘yicha imtiyozlar qayerdan kelib chiqishi mumkin?", "Qonun, xalqaro shartnoma yoki vakolatli normativ hujjatdan", "Faqat og‘zaki topshiriqdan", "Faqat broker reklamasidan", "Faqat internet forumdan", "A"),

  q(71, "HARD", "Nol stavka va ozod etish bir xil tushunchami?", "Ha, doim bir xil", "Yo‘q, ularning huquqiy mazmuni har doim bir xil emas", "Faqat QQSda bir xil", "Faqat aksizda bir xil", "B"),
  q(72, "MEDIUM", "Reeksport qilinayotgan tovar bo‘yicha qaysi masala amaliyotda muhim?", "Ilgari to‘langan to‘lovlarni qaytarish shartlari", "Faqat reklama shakli", "Faqat yuklash usuli", "Faqat omborning rangi", "A"),
  q(73, "MEDIUM", "Vaqtincha olib kirishda davriy to‘lovlar qo‘llansa, bu nimani anglatadi?", "To‘liq import to‘lovi birdan undirilmaydi, lekin davriy majburiyat paydo bo‘ladi", "Hech qanday to‘lov yo‘q", "Faqat yig‘im ikki baravar bo‘ladi", "Faqat eksport boji qo‘llanadi", "A"),
  q(74, "VERY_HARD", "Bojxona ombori, erkin ombor va erkin bojxona zonasi bo‘yicha testlarda eng ko‘p nimaga e’tibor berish kerak?", "Qaysi rejimda to‘lovlar kechiktiriladi, ozod etiladi yoki qayta tiklanadi", "Faqat nomining uzunligiga", "Faqat ombor maydoniga", "Faqat transport markasiga", "A"),
  q(75, "MEDIUM", "Ortiqcha to‘langan bojxona to‘lovlarini qaytarishda eng noto‘g‘ri yondashuv qaysi?", "Asoslovchi hujjatlarni taqdim etish", "Qonundagi tartibga rioya qilish", "Faqat og‘zaki da’vo bilan cheklanib qolish", "Hisob-kitobni qayta tekshirtirish", "C"),
  q(76, "MEDIUM", "Bojxona to‘lovlari bo‘yicha vakolatli shaxs kim bo‘lishi mumkin?", "Faqat bojxona xodimi", "Tovar egasi yoki qonuniy vakolatga ega shaxs", "Faqat bank xodimi", "Faqat tashuvchi", "B"),
  q(77, "MEDIUM", "Deklarant bojxona to‘lovlari nuqtai nazaridan nimaga javobgar bo‘lishi mumkin?", "Taqdim etilgan ma’lumotlarning to‘g‘riligi va to‘lovlarning hisobiga", "Faqat reklama xarajatiga", "Faqat ombor ijara haqiga", "Faqat haydovchi dam olishiga", "A"),
  q(78, "HARD", "Bojxona brokeri ishtiroki deklarantning javobgarligini to‘liq yo‘qotadimi?", "Ha, har doim", "Yo‘q, deklarantning majburiyatlari saqlanib qolishi mumkin", "Faqat QQS bo‘yicha yo‘qotadi", "Faqat aksiz bo‘yicha yo‘qotadi", "B"),
  q(79, "MEDIUM", "Bojxona to‘lovlari bo‘yicha noto‘g‘ri deklaratsiya qanday xavf tug‘diradi?", "To‘lovlarning kam yoki ortiqcha hisoblanishiga", "Faqat logotip xatosiga", "Faqat ombor joyi almashishiga", "Hech qanday xavf yo‘q", "A"),
  q(80, "MEDIUM", "Bojxona organi to‘lovlarni tekshirishda nimalarga e’tibor beradi?", "Kod, qiymat, imtiyoz va hujjatlarning asosliligiga", "Faqat tovar rangi va o‘lchamiga", "Faqat kompaniya ofis dizayniga", "Faqat yuk mashinasi raqamiga", "A"),

  q(81, "MEDIUM", "To‘lovlar bo‘yicha nizolar kelib chiqsa, eng to‘g‘ri birinchi qadam nima?", "Hisob-kitob va qo‘llangan normani aniqlab olish", "Darhol ijtimoiy tarmoqqa yozish", "Faqat brokerni ayblash", "Hujjatlarni yo‘qotib yuborish", "A"),
  q(82, "MEDIUM", "Bojxona to‘lovlarini kamaytirish maqsadida ma’lumotlarni qasddan buzib ko‘rsatish nimaga olib kelishi mumkin?", "Javobgarlik choralariga", "Har doim imtiyozga", "Tovarni avtomatik eksportga", "Faqat ogohlantirishga", "A"),
  q(83, "MEDIUM", "Bojxona to‘lovlari masalasida hujjat sanasi nima uchun muhim?", "Qaysi qonunchilik qo‘llanishini aniqlash uchun", "Faqat papka tartibi uchun", "Faqat printer uchun", "Faqat imzo rangi uchun", "A"),
  q(84, "HARD", "Bojxona qonunchiligi orqaga qaytish kuchiga ega emas degan qoida nimani anglatadi?", "Yangi qoida odatda oldingi munosabatlarga tatbiq etilmaydi", "Har doim eski qoida bekor bo‘ladi", "Jarimalar yo‘q bo‘ladi", "Faqat eksportga tatbiq etiladi", "A"),
  q(85, "VERY_HARD", "Qaysi holatda bojxona qonunchiligi yengillashtiruvchi qoidasi orqaga qaytish kuchiga ega bo‘lishi mumkin?", "Agar bu bevosita qonunda nazarda tutilgan bo‘lsa", "Har doim", "Hech qachon", "Faqat bank roziligi bilan", "A"),
  q(86, "MEDIUM", "Bojxona to‘lovlari bo‘yicha xatoni to‘g‘rilashda eng muhim narsa nima?", "Rasmiy tartibda qayta hisob-kitob qilish", "Faqat telefon qilish", "Faqat yangi kontrakt tuzish", "Faqat omborni almashtirish", "A"),
  q(87, "MEDIUM", "Tovar bo‘yicha imtiyoz mavjudligini kim isbotlashi kerak bo‘ladi?", "Odatda manfaatdor shaxs tasdiqlovchi hujjatlar bilan", "Hech kim", "Faqat bank", "Faqat tashuvchi", "A"),
  q(88, "MEDIUM", "Bojxona to‘lovlari bo‘yicha elektron tizimlardan foydalanish nimani beradi?", "Hisob-kitob va nazoratni soddalashtiradi", "Qonunni bekor qiladi", "Jarimalarni yo‘q qiladi", "Faqat qog‘ozni ko‘paytiradi", "A"),
  q(89, "MEDIUM", "Bojxona to‘lovlari bo‘yicha noto‘g‘ri TIF TN kodi tanlashning amaliy oqibati nimada ko‘rinadi?", "Stavka, imtiyoz va to‘lov summasi xato bo‘lishida", "Faqat yuk etiketi o‘zgarishida", "Faqat transport turi o‘zgarishida", "Faqat imzo joyida", "A"),
  q(90, "MEDIUM", "Bojxona organlari tomonidan to‘lovlar bo‘yicha tekshiruvdan asosiy maqsad nima?", "To‘lovlarning to‘g‘ri va o‘z vaqtida undirilishini ta’minlash", "Faqat jarima yozish", "Faqat hisobot sonini oshirish", "Faqat omborlarni yopish", "A"),

  q(91, "MEDIUM", "Bojxona to‘lovlari bo‘yicha huquqbuzarlikning oldini olishning eng yaxshi yo‘li qaysi?", "To‘g‘ri tasnif, to‘g‘ri qiymat va hujjatlarning to‘liqligi", "Faqat yukni tez yuborish", "Faqat brokerga to‘liq topshirish", "Faqat narxni pasaytirish", "A"),
  q(92, "MEDIUM", "Bojxona to‘lovlari bo‘yicha rasmiy manba sifatida eng ishonchlisi qaysi?", "LexUZ va vakolatli organlarning amaldagi hujjatlari", "Telegramdagi izohlar", "Forumdagi anonim postlar", "Og‘zaki maslahat", "A"),
  q(93, "MEDIUM", "Bojxona to‘lovlari fanidan test yechishda eng ko‘p uchraydigan xato nima?", "Boj, soliq va yig‘im tushunchalarini aralashtirish", "Savol raqamini ko‘rish", "Variantlarni o‘qish", "Fanga oid hujjatni ochish", "A"),
  q(94, "MEDIUM", "Qaysi holatda 30, 50 yoki 100 talik random test varianti foydali?", "Savollar banki katta bo‘lib, bilimni turli kombinatsiyada tekshirish kerak bo‘lganda", "Faqat 3 ta savol bo‘lganda", "Faqat bitta variant kerak bo‘lganda", "Faqat eksport testlarida", "A"),
  q(95, "VERY_HARD", "Bojxona to‘lovlari bo‘yicha yakuniy xulosa qaysi?", "Hisob-kitob faqat bir ko‘rsatkichga bog‘liq", "To‘g‘ri natija uchun kodeks, stavka, qiymat, tasnif va imtiyoz birgalikda tahlil qilinadi", "Faqat broker hamma narsani hal qiladi", "Faqat transport xarajati hammasini belgilaydi", "B"),
  q(96, "MEDIUM", "Bojxona to‘lovlarining noto‘g‘ri hisoblanishi ko‘proq nimaning kombinatsiyasidan kelib chiqadi?", "Faqat valyuta kursidan", "Noto‘g‘ri tasnif, noto‘g‘ri qiymat yoki noto‘g‘ri imtiyozdan", "Faqat hujjat tili sababli", "Faqat yuk qadoqlanishidan", "B"),
  q(97, "MEDIUM", "Bojxona to‘lovlarini to‘lashdagi asosiy prinsip qaysi?", "To‘lovlar belgilangan tartibda, o‘z vaqtida va to‘g‘ri to‘lanishi kerak", "Faqat yirik korxonalar to‘laydi", "Faqat davlat korxonalari to‘laydi", "Faqat eksportchilar to‘laydi", "A"),
  q(98, "HARD", "Imtiyoz mavjud bo‘lsa ham, qaysi holat imtiyozni qo‘llamaslikka sabab bo‘lishi mumkin?", "Tasdiqlovchi hujjatlar mavjud bo‘lmasa", "Kontrakt qisqa bo‘lsa", "Tovar qadoq rangi boshqacha bo‘lsa", "Haydovchi boshqa viloyatdan bo‘lsa", "A"),
  q(99, "MEDIUM", "Bojxona yig‘imi to‘lanishi qaysi mazmunga ko‘proq ega?", "Bojxona organlari tomonidan bajariladigan rasmiy harakatlar bilan bog‘liq to‘lovga", "Foyda taqsimotiga", "Ish haqi fondiga", "Valyuta ayirboshlashga", "A"),
  q(100, "VERY_HARD", "Bojxona to‘lovlari bo‘yicha professional yondashuvning eng to‘g‘ri formulasi qaysi?", "TIF TN + bojxona qiymati + stavka + imtiyoz + muddat + hujjat", "Faqat kontrakt summasi", "Faqat broker xulosasi", "Faqat bojxona yig‘imi", "A"),
] as const;

async function main() {
  const subject = await prisma.subject.upsert({
    where: { code: SUBJECT_CODE },
    update: {
      titleUz: "Bojxona to‘lovlari",
      titleRu: "Таможенные платежи",
      descriptionUz: "Bojxona to‘lovlari faniga oid savollar banki",
      descriptionRu: "Банк вопросов по таможенным платежам",
    },
    create: {
      code: SUBJECT_CODE,
      titleUz: "Bojxona to‘lovlari",
      titleRu: "Таможенные платежи",
      descriptionUz: "Bojxona to‘lovlari faniga oid savollar banki",
      descriptionRu: "Банк вопросов по таможенным платежам",
    },
  });

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
    where: { id: "customs-payments-30" },
    update: {
      subjectId: subject.id,
      titleUz: "Bojxona to‘lovlari — 30 ta savol",
      titleRu: "Таможенные платежи — 30 вопросов",
      descriptionUz: "30 ta random savoldan iborat test varianti",
      descriptionRu: "Тестовый вариант из 30 случайных вопросов",
      durationMinutes: 30,
      questionCount: Math.min(30, totalActiveQuestions),
      randomizeQuestions: true,
      isActive: true,
    },
    create: {
      id: "customs-payments-30",
      subjectId: subject.id,
      titleUz: "Bojxona to‘lovlari — 30 ta savol",
      titleRu: "Таможенные платежи — 30 вопросов",
      descriptionUz: "30 ta random savoldan iborat test varianti",
      descriptionRu: "Тестовый вариант из 30 случайных вопросов",
      durationMinutes: 30,
      questionCount: Math.min(30, totalActiveQuestions),
      randomizeQuestions: true,
      isActive: true,
    },
  });

  await prisma.test.upsert({
    where: { id: "customs-payments-50" },
    update: {
      subjectId: subject.id,
      titleUz: "Bojxona to‘lovlari — 50 ta savol",
      titleRu: "Таможенные платежи — 50 вопросов",
      descriptionUz: "50 ta random savoldan iborat test varianti",
      descriptionRu: "Тестовый вариант из 50 случайных вопросов",
      durationMinutes: 50,
      questionCount: Math.min(50, totalActiveQuestions),
      randomizeQuestions: true,
      isActive: true,
    },
    create: {
      id: "customs-payments-50",
      subjectId: subject.id,
      titleUz: "Bojxona to‘lovlari — 50 ta savol",
      titleRu: "Таможенные платежи — 50 вопросов",
      descriptionUz: "50 ta random savoldan iborat test varianti",
      descriptionRu: "Тестовый вариант из 50 случайных вопросов",
      durationMinutes: 50,
      questionCount: Math.min(50, totalActiveQuestions),
      randomizeQuestions: true,
      isActive: true,
    },
  });

  await prisma.test.upsert({
    where: { id: "customs-payments-100" },
    update: {
      subjectId: subject.id,
      titleUz: "Bojxona to‘lovlari — 100 ta savol",
      titleRu: "Таможенные платежи — 100 вопросов",
      descriptionUz: "100 ta random savoldan iborat test varianti",
      descriptionRu: "Тестовый вариант из 100 случайных вопросов",
      durationMinutes: 90,
      questionCount: Math.min(100, totalActiveQuestions),
      randomizeQuestions: true,
      isActive: true,
    },
    create: {
      id: "customs-payments-100",
      subjectId: subject.id,
      titleUz: "Bojxona to‘lovlari — 100 ta savol",
      titleRu: "Таможенные платежи — 100 вопросов",
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
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });