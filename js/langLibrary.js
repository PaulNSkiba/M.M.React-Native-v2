/**
 * Created by Paul on 19.01.2020.
 */
export function langLibrary(lang){
    let langObj = {
        siteName : "Мои оценки",
        lang : "Язык",
        introBegin : "Данное приложение поможет учителям и родителям вести дневник и следить за успеваемостью учеников. Для этого нужно сделать всего лишь ",
        introEnd : " маленьких шагов",
        entry : "Вход",
        exit : "Выход",
        mainSite : "Главная",
        adminSite : "Aдминка",
        adminSiteClass : "Админка класса",
        homework : "Домашка",
        project : "Проект",
        refNewStudentBegin : "Cсылка для",
        refNewStudentEnd: " добавления новых студентов",
        step1Descr : ". Выберите класс:",
        step2Descr : ". Количество учеников:",
        step3Descr : ". Изучаемые предметы:",
        step4Descr : ". Предмет для оценок:",
        step5Descr : ". Маркер для оценок:",
        step6Descr : ". Дополнительные настройки:",
        step7Descr : ". Журнал и установка оценок:",
        step8Descr : ". Импорт/экспорт оценок в Эксель:",
        step9Descr : ". Диаграммы:",
        step10Descr : "Сохранить данные на будущее?",
        step1DescrMob : ".Класс",
        step2DescrMob : ".Ученики",
        step3DescrMob : ".Предметы",
        step4DescrMob : ".Выбранный",
        step5DescrMob : ".Маркер оценок",
        step6DescrMob : ".Настройки",
        step7DescrMob : ".Журнал",
        step8DescrMob : ".Excel-обмен",
        step9DescrMob : ".Диаграммы",
        step10DescrMob : "Сохранить?",
        yes : "Да",
        no : "Нет",
        speedByMark : "сек/оценку",
        top : "ТОП",
        step : "Шаг",
        mobMsgHint : "Введите сообщение..."
    }
    switch (lang) {
        case "UA":
            langObj.siteName = "Мої оцінки"
            langObj.lang = "Мова"
            langObj.introBegin = "Цей додаток допоможе вчителям і батькам вести щоденник і стежити за успішністю учнів. Для цього потрібно зробити всього лише"
            langObj.introEnd = " маленьких кроків"
            langObj.entry = "Вхід"
            langObj.exit = "Вихід"
            langObj.mainSite = "Головна"
            langObj.adminSite = "Aдмінка"
            langObj.adminSiteClass = "Адмінка класу"
            langObj.homework = "Домашка"
            langObj.project = "Проект"
            langObj.refNewStudentBegin = "Посилання для"
            langObj.refNewStudentEnd = " додавання нових студентів"
            langObj.step1Descr = ". Виберіть клас:"
            langObj.step2Descr = ". Кількість учнів:"
            langObj.step3Descr = ". Предмети для навчання:"
            langObj.step4Descr = ". Предмет для оцінок:"
            langObj.step5Descr = ". Маркер для оцінок:"
            langObj.step6Descr = ". Додаткові налаштування:"
            langObj.step7Descr = ". Журнал та установка оцінок:"
            langObj.step8Descr = ". Імпорт/експорт оцінок в Ексель:"
            langObj.step9Descr = ". Діаграмми"
            langObj.step10Descr = "Зберегти дані на майбутнє?"
            langObj.step1DescrMob = ".Клас"
            langObj.step2DescrMob = ".Учні"
            langObj.step3DescrMob = ".Предмети"
            langObj.step4DescrMob = ".Обраний"
            langObj.step5DescrMob = ".Маркер оцінок"
            langObj.step6DescrMob = ".Налаштування"
            langObj.step7DescrMob = ".Журнал"
            langObj.step8DescrMob = ".Excel-обмін"
            langObj.step9DescrMob = ".Діаграмми"
            langObj.step10DescrMob = "Зберегти?"
            langObj.yes = "Так"
            langObj.no = "Ні"
            langObj.speedByMark = "сек/оцінку"
            langObj.top = "ТОП"
            langObj.step = "Крок"
            break;
        case "RU":

            break;
        case "PL":
            langObj.siteName = "Moje stopnie"
            langObj.lang = "Język"
            langObj.introBegin = "Ta aplikacja pomoże nauczycielom i rodzicom prowadzić dziennik i monitorować wyniki uczniów. Aby to zrobić, po prostu"
            langObj.introEnd = " małe kroki"
            langObj.entry = "Wejdź"
            langObj.exit = "Wyjdź"
            langObj.mainSite = "Główna"
            langObj.adminSite = "Admin",
                langObj.adminSiteClass = "Admin klasy",
                langObj.homework = "Domowe",
                langObj.project = "Project"
            langObj.refNewStudentBegin = "Link do",
                langObj.refNewStudentEnd = " dodawania nowych studentów"
            langObj.step1Descr = ". Wybierz klasę:",
                langObj.step2Descr = ". Liczba studentów:",
                langObj.step3Descr = ". Przedmioty do nauki:",
                langObj.step4Descr = ". Przedmiot do oceny:",
                langObj.step5Descr = ". Marker do oceny:",
                langObj.step6Descr = ". Ustawienia zaawansowane:",
                langObj.step7Descr = ". Dziennik i ustawienie klasy:",
                langObj.step8Descr = ". Importuj/eksportuj oceny w Excelu:",
                langObj.step9Descr = ". Wykresy",
                langObj.step10Descr = "Zaberti Dani?",
                langObj.step1DescrMob = ".Klasa",
                langObj.step2DescrMob = ".Studenci",
                langObj.step3DescrMob = ".Przedmioty",
                langObj.step4DescrMob = ".Wybrano",
                langObj.step5DescrMob = ".Marker do oceny",
                langObj.step6DescrMob = ".Ustawienia",
                langObj.step7DescrMob = ".Dziennik",
                langObj.step8DescrMob = ".Wymiana Excel",
                langObj.step9DescrMob = ".Wykresy"
            langObj.step10DescrMob = "Zaberti?",
                langObj.yes = "Tak",
                langObj.no = "Nie",
                langObj.speedByMark = "sec/klasa "
            langObj.top = "TOP"
            langObj.step = "Krok"
            break;
        case "ES":
            langObj.siteName = "Mis calificaciones"
            langObj.lang = "Idioma"
            langObj.introBegin = "Esta aplicación ayudará a los maestros y padres a llevar un diario y realizar un seguimiento del rendimiento de los estudiantes. Todo lo que tienes que hacer es hacerlo "
            langObj.introEnd = " pequeños pasos"
            langObj.entry = "Login"
            langObj.exit = "Logout"
            langObj.mainSite = "Inicio"
            langObj.adminSite = "Admin"
            langObj.adminSiteClass = "Admin de la clase"
            langObj.homework = "Deberes"
            langObj.project = "Proyecto"
            langObj.refNewStudentBegin = "Enlace para"
            langObj.refNewStudentEnd = " agregar nuevos estudiantes"
            langObj.step1Descr = ". Elige una clase:"
            langObj.step2Descr = ". Numero de estudiantes:"
            langObj.step3Descr = ". Sujetos para estudio:"
            langObj.step4Descr = ". Grados:"
            langObj.step5Descr = ". Marcador:"
            langObj.step6Descr = ". Ajustes adicionales:"
            langObj.step7Descr = ". Diario escolar y ajuste de grado:"
            langObj.step8Descr = ". Importar/Exportar estimación en Excel:"
            langObj.step9Descr = ". Diagramas"
            langObj.step10Descr = "¿Guardar datos para el futuro?"
            langObj.step1DescrMob = ".Clase"
            langObj.step2DescrMob = ".Estudiantes"
            langObj.step3DescrMob = ".Asignaturas"
            langObj.step4DescrMob = ".Seleccionado"
            langObj.step5DescrMob = ".Marcador"
            langObj.step6DescrMob = ".Configuraciones"
            langObj.step7DescrMob = ".Diario escolar"
            langObj.step8DescrMob = ".Excel"
            langObj.step9DescrMob = ".Diagramas"
            langObj.step10DescrMob = "Guardar?"
            langObj.yes = "Si"
            langObj.no = "No"
            langObj.speedByMark = "seg/eval"
            langObj.top = "TOP"
            langObj.step = "Paso"
            break;
        case "DE":
            langObj.siteName = "Meine Schulnoten"
            langObj.lang = "Sprache"
            langObj.introBegin = "Цей додаток допоможе вчителям і батькам вести щоденник і стежити за успішністю учнів. Для цього потрібно зробити всього лише"
            langObj.introEnd = " маленьких кроків"
            langObj.entry = "Вхід"
            langObj.exit = "Вихід"
            langObj.mainSite = "Головна"
            langObj.adminSite = "Aдмінка"
            langObj.adminSiteClass = "Адмінка класу"
            langObj.homework = "Домашка"
            langObj.project = "Проект"
            langObj.refNewStudentBegin = "Посилання для"
            langObj.refNewStudentEnd = " додавання нових студентів"
            langObj.step1Descr = ". Виберіть клас:"
            langObj.step2Descr = ". Кількість учнів:"
            langObj.step3Descr = ". Предмети для навчання:"
            langObj.step4Descr = ". Предмет для оцінок:"
            langObj.step5Descr = ". Маркер для оцінок:"
            langObj.step6Descr = ". Додаткові налаштування:"
            langObj.step7Descr = ". Журнал та установка оцінок:"
            langObj.step8Descr = ". Імпорт/експорт оцінок в Ексель:"
            langObj.step9Descr = ". Діаграмми"
            langObj.step10Descr = "Зберегти дані на майбутнє?"
            langObj.step1DescrMob = ".Клас"
            langObj.step2DescrMob = ".Учні"
            langObj.step3DescrMob = ".Предмети"
            langObj.step4DescrMob = ".Обраний"
            langObj.step5DescrMob = ".Маркер оцінок"
            langObj.step6DescrMob = ".Налаштування"
            langObj.step7DescrMob = ".Журнал"
            langObj.step8DescrMob = ".Excel-обмін"
            langObj.step9DescrMob = ".Діаграмми"
            langObj.step10DescrMob = "Зберегти?"
            langObj.yes = "Так"
            langObj.no = "Ні"
            langObj.speedByMark = "сек/оцінку"
            langObj.top = "ТОП"
            langObj.step = "Крок"
            break;
        case "FR":
            langObj.siteName = "Mes notes"
            langObj.lang = "Langue"
            langObj.introBegin = "Цей додаток допоможе вчителям і батькам вести щоденник і стежити за успішністю учнів. Для цього потрібно зробити всього лише"
            langObj.introEnd = " маленьких кроків"
            langObj.entry = "Вхід"
            langObj.exit = "Вихід"
            langObj.mainSite = "Головна"
            langObj.adminSite = "Aдмінка"
            langObj.adminSiteClass = "Адмінка класу"
            langObj.homework = "Домашка"
            langObj.project = "Проект"
            langObj.refNewStudentBegin = "Посилання для"
            langObj.refNewStudentEnd = " додавання нових студентів"
            langObj.step1Descr = ". Виберіть клас:"
            langObj.step2Descr = ". Кількість учнів:"
            langObj.step3Descr = ". Предмети для навчання:"
            langObj.step4Descr = ". Предмет для оцінок:"
            langObj.step5Descr = ". Маркер для оцінок:"
            langObj.step6Descr = ". Додаткові налаштування:"
            langObj.step7Descr = ". Журнал та установка оцінок:"
            langObj.step8Descr = ". Імпорт/експорт оцінок в Ексель:"
            langObj.step9Descr = ". Діаграмми"
            langObj.step10Descr = "Зберегти дані на майбутнє?"
            langObj.step1DescrMob = ".Клас"
            langObj.step2DescrMob = ".Учні"
            langObj.step3DescrMob = ".Предмети"
            langObj.step4DescrMob = ".Обраний"
            langObj.step5DescrMob = ".Маркер оцінок"
            langObj.step6DescrMob = ".Налаштування"
            langObj.step7DescrMob = ".Журнал"
            langObj.step8DescrMob = ".Excel-обмін"
            langObj.step9DescrMob = ".Діаграмми"
            langObj.step10DescrMob = "Зберегти?"
            langObj.yes = "Так"
            langObj.no = "Ні"
            langObj.speedByMark = "сек/оцінку"
            langObj.top = "ТОП"
            langObj.step = "Крок"
            break;
        case "IT":
            langObj.siteName = "I miei voti"
            langObj.lang = "Lingua"
            langObj.introBegin = "Цей додаток допоможе вчителям і батькам вести щоденник і стежити за успішністю учнів. Для цього потрібно зробити всього лише"
            langObj.introEnd = " маленьких кроків"
            langObj.entry = "Вхід"
            langObj.exit = "Вихід"
            langObj.mainSite = "Головна"
            langObj.adminSite = "Aдмінка"
            langObj.adminSiteClass = "Адмінка класу"
            langObj.homework = "Домашка"
            langObj.project = "Проект"
            langObj.refNewStudentBegin = "Посилання для"
            langObj.refNewStudentEnd = " додавання нових студентів"
            langObj.step1Descr = ". Виберіть клас:"
            langObj.step2Descr = ". Кількість учнів:"
            langObj.step3Descr = ". Предмети для навчання:"
            langObj.step4Descr = ". Предмет для оцінок:"
            langObj.step5Descr = ". Маркер для оцінок:"
            langObj.step6Descr = ". Додаткові налаштування:"
            langObj.step7Descr = ". Журнал та установка оцінок:"
            langObj.step8Descr = ". Імпорт/експорт оцінок в Ексель:"
            langObj.step9Descr = ". Діаграмми"
            langObj.step10Descr = "Зберегти дані на майбутнє?"
            langObj.step1DescrMob = ".Клас"
            langObj.step2DescrMob = ".Учні"
            langObj.step3DescrMob = ".Предмети"
            langObj.step4DescrMob = ".Обраний"
            langObj.step5DescrMob = ".Маркер оцінок"
            langObj.step6DescrMob = ".Налаштування"
            langObj.step7DescrMob = ".Журнал"
            langObj.step8DescrMob = ".Excel-обмін"
            langObj.step9DescrMob = ".Діаграмми"
            langObj.step10DescrMob = "Зберегти?"
            langObj.yes = "Так"
            langObj.no = "Ні"
            langObj.speedByMark = "сек/оцінку"
            langObj.top = "ТОП"
            langObj.step = "Крок"
            break;
        case "EN":
            langObj.siteName = "Мy marks"
            langObj.lang = "Lang"
            langObj.introBegin = "This application will help teachers and parents keep a diary and monitor student performance. To do this, just "
            langObj.introEnd = " small steps"
            langObj.entry = "Login"
            langObj.exit = "Logout"
            langObj.mainSite = "Main"
            langObj.adminSite = "Admin"
            langObj.adminSiteClass = "Class admin"
            langObj.homework = "Homework"
            langObj.project = "Project"
            langObj.refNewStudentBegin = "Link for"
            langObj.refNewStudentEnd = " adding new students"
            langObj.step1Descr = ". Choose a class:"
            langObj.step2Descr = ". Number of students:"
            langObj.step3Descr = ". Subjects for study:"
            langObj.step4Descr = ". Grade subject:"
            langObj.step5Descr = ". Marker for grades:"
            langObj.step6Descr = ". Additional settings:"
            langObj.step7Descr = ". A register and grade setting:"
            langObj.step8Descr = ". Import/Export grades to Excel:"
            langObj.step9Descr = ". Diagrams"
            langObj.step10Descr = "Save data for the future??"
            langObj.step1DescrMob = ".Class"
            langObj.step2DescrMob = ".Students"
            langObj.step3DescrMob = ".Subjects"
            langObj.step4DescrMob = ".Selected"
            langObj.step5DescrMob = ".Grade marker"
            langObj.step6DescrMob = ".Settings"
            langObj.step7DescrMob = ".Register"
            langObj.step8DescrMob = ".Excel-in/out"
            langObj.step9DescrMob = ".Diagrams"
            langObj.step10DescrMob = "Save?"
            langObj.yes = "Yes"
            langObj.no = "No"
            langObj.speedByMark = "sec/mark"
            langObj.top = "TOP"
            langObj.step = "Step"
            break;
        default:
            langObj.siteName = "My marks"
            langObj.lang = "Lang"
            langObj.introBegin = "This application will help teachers and parents keep a diary and monitor student performance. To do this, just "
            langObj.introEnd = " small steps"
            langObj.entry = "Login"
            langObj.exit = "Logout"
            langObj.mainSite = "Main"
            langObj.adminSite = "Admin"
            langObj.adminSiteClass = "Class admin"
            langObj.homework = "Homework"
            langObj.project = "Project"
            langObj.refNewStudentBegin = "Link for"
            langObj.refNewStudentEnd = " adding new students"
            langObj.step1Descr = ". Choose a class:"
            langObj.step2Descr = ". Number of students:"
            langObj.step3Descr = ". Subjects for study:"
            langObj.step4Descr = ". Grade subject:"
            langObj.step5Descr = ". Marker for grades:"
            langObj.step6Descr = ". Additional settings:"
            langObj.step7Descr = ". A register and grade setting:"
            langObj.step8Descr = ". Import/Export grades to Excel:"
            langObj.step9Descr = ". Diagrams"
            langObj.step10Descr = "Save data for the future??"
            langObj.step1DescrMob = ".Class"
            langObj.step2DescrMob = ".Students"
            langObj.step3DescrMob = ".Subjects"
            langObj.step4DescrMob = ".Selected"
            langObj.step5DescrMob = ".Grade marker"
            langObj.step6DescrMob = ".Settings"
            langObj.step7DescrMob = ".Register"
            langObj.step8DescrMob = ".Excel-in/out"
            langObj.step9DescrMob = ".Diagrams"
            langObj.step10DescrMob = "Save?"
            langObj.yes = "Yes"
            langObj.no = "No"
            langObj.speedByMark = "sec/mark"
            langObj.top = "TOP"
            langObj.step = "Step"
            break
    }
    return langObj
}