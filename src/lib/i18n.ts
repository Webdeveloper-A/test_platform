export const locales = ["uz", "ru"] as const;
export type Locale = (typeof locales)[number];

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export function pickText(locale: Locale, uz: string | null | undefined, ru?: string | null) {
  if (locale === "ru") {
    return ru && ru.trim() ? ru : uz || "";
  }
  return uz || ru || "";
}

export const dictionary = {
  uz: {
    appName: "Customs Test Platform",
    loginTitle: "Tizimga kirish",
    username: "Login",
    password: "Parol",
    signIn: "Kirish",
    logout: "Chiqish",
    adminPanel: "Admin panel",
    studentPanel: "Talaba paneli",
    users: "Foydalanuvchilar",
    questions: "Savollar banki",
    results: "Natijalar",
    tests: "Testlar",
    history: "Urinishlar tarixi",
    profile: "Profil",
    leaderboard: "Reyting",
    fullName: "F.I.Sh.",
    role: "Rol",
    createUser: "Foydalanuvchi yaratish",
    resetPassword: "Parolni almashtirish",
    delete: "O‘chirish",
    duration: "Davomiyligi",
    questionCount: "Savollar soni",
    difficulty: "Murakkablik",
    startTest: "Testni boshlash",
    submitTest: "Yakunlash",
    correct: "To‘g‘ri",
    total: "Jami",
    score: "Natija",
    activeTests: "Faol testlar",
    latestAttempts: "So‘nggi urinishlar",
    addQuestion: "Savol qo‘shish",
    correctOption: "To‘g‘ri javob",
    language: "Til",
    noData: "Ma’lumot topilmadi",
    dashboard: "Bosh sahifa",
    subject: "Fan",
    create: "Saqlash",
  },
  ru: {
    appName: "Customs Test Platform",
    loginTitle: "Вход в систему",
    username: "Логин",
    password: "Пароль",
    signIn: "Войти",
    logout: "Выход",
    adminPanel: "Панель администратора",
    studentPanel: "Панель студента",
    users: "Пользователи",
    questions: "База вопросов",
    results: "Результаты",
    tests: "Тесты",
    history: "История попыток",
    profile: "Профиль",
    leaderboard: "Рейтинг",
    fullName: "Ф.И.О.",
    role: "Роль",
    createUser: "Создать пользователя",
    resetPassword: "Сменить пароль",
    delete: "Удалить",
    duration: "Длительность",
    questionCount: "Количество вопросов",
    difficulty: "Сложность",
    startTest: "Начать тест",
    submitTest: "Завершить",
    correct: "Верно",
    total: "Всего",
    score: "Результат",
    activeTests: "Активные тесты",
    latestAttempts: "Последние попытки",
    addQuestion: "Добавить вопрос",
    correctOption: "Правильный ответ",
    language: "Язык",
    noData: "Данные не найдены",
    dashboard: "Главная",
    subject: "Предмет",
    create: "Сохранить",
  },
} as const;
