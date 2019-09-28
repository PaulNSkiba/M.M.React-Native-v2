/**
 * Created by Paul on 27.08.2019.
 */
import { store } from '../store/configureStore'
import axios from 'axios';
import {AUTH_URL, API_URL, BASE_HOST, WEBSOCKETPORT, LOCALPUSHERPWD} from '../config/config'
import Echo from 'laravel-echo'
import Pusher from 'pusher-js/react-native'
window.Pusher = Pusher

export let arrOfWeekDays = ['Вс','Пн','Вт','Ср','Чт','Пт','Сб']
export const msgTimeOut = 4000

// AddDay function (format MM-DD-YYY)
export function AddDay(strDate,intNum)
{
    var sdate =  new Date(strDate);
    sdate.setDate(sdate.getDate()+intNum);
    return new Date(sdate.getFullYear(), sdate.getMonth(), sdate.getDate());
}

export const instanceAxios=()=>{
    let {token} = store.getState().user
    // let token = null
    return (axios.create({
        baseURL: AUTH_URL + '/api/',
        timeout: 0,
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin' : '*',
            'Access-Control-Allow-Methods' : 'GET, POST, PUT, DELETE, OPTIONS',
        }
    }));

};

export const mapStateToProps = store => {
    // console.log(store) // посмотрим, что же у нас в store?
    return {
        user:       store.user,
        userSetup:  store.userSetup,
        chat :      store.chat,
    }
}

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
        step : "Шаг"
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
export function dateFromYYYYMMDD(str) {
    str = str.replace('-','')
    const   yyyy = str.substr(0, 4),
        mm = str.substr(4, 2),
        dd = str.substr(6, 2)
    // console.log("dateFromYYYYMMDD", yyyy, mm, dd)
    return new Date(Number(yyyy), Number(mm) -1, Number(dd))
}

export const prepareMessageToFormat=(msg, returnObject)=>{
    let obj = {}
    obj.senderId = msg.user_name
    obj.text = msg.message
    obj.time = msg.msg_time
    obj.userID = msg.user_id
    obj.userName = msg.user_name
    obj.uniqid = msg.uniqid
    // obj.msg_date = new Date(msg.msg_date)
    obj.attachment1 = msg.attachment1
    obj.attachment2 = msg.attachment2
    obj.attachment3 = msg.attachment3
    obj.attachment4 = msg.attachment4
    obj.attachment5 = msg.attachment5
    if (msg.hasOwnProperty('homework_date')) {
        if (!(msg.homework_date === null)) {
            obj.hwdate = new Date(msg.homework_date.length===8?dateFromYYYYMMDD(msg.homework_date):msg.homework_date)
            obj.subjkey = msg.homework_subj_key
            obj.subjname = msg.homework_subj_name
            obj.subjid = msg.homework_subj_id
        }
    }
    obj.id = msg.id
    //"{"senderId":"my-marks","text":"выучить параграф 12","time":"14:59","userID":209,"userName":"Menen",
    // "hwdate":"2019-07-16T21:00:00.000Z","subjkey":"#lngukr","subjname":"Українська мова"}"
    // console.log('obj', JSON.stringify(obj))
    return returnObject?obj:JSON.stringify(obj)
}
export function toYYYYMMDD(d) {
    const   yyyy = d.getFullYear().toString(),
        mm = (d.getMonth() + 101).toString().slice(-2),
        dd = (d.getDate() + 100).toString().slice(-2)
    return yyyy + mm + dd;
}
export function dateFromTimestamp(timestamp) {
    // Split timestamp into [ Y, M, D, h, m, s ]
    let t = timestamp.split(/[- :]/);
// Apply each element to the Date function
    return new Date(Date.UTC(t[0], t[1]-1, t[2], t[3], t[4], t[5]));


// -> Wed Jun 09 2010 14:12:01 GMT+0100 (BST)
}
export function toLocalDate(d, countryCode, withTime, withOutYear) {
    const   yyyy = d.getFullYear().toString().slice(-2),
            mm = (d.getMonth() + 101).toString().slice(-2),
            dd = (d.getDate() + 100).toString().slice(-2),
            hh = (d.getHours() + 100).toString().slice(-2),
            mi = (d.getMinutes() + 100).toString().slice(-2)
    let date = '', time = ''

    // console.log("toLocalDate", `${dd}/${mm}/${yyyy}${withTime?(' ' +hh+':'+mi):""}`)
    switch (countryCode) {
        case 'UA':
            date = withOutYear?`${dd}/${mm}`:`${dd}/${mm}/${yyyy}`
            if (withTime)
                return date + ' ' + `${hh}:${mi}`
            else
                return date
            break;
        default :
            date = withOutYear?`${dd}/${mm}`:`${dd}/${mm}/${yyyy}`
            if (withTime)
                return date + ' ' + `${hh}:${mi}`
            else
                return date
            break;
    }
}
export function dateDiff(date1, date2) {
    let dt1 = new Date(date1);
    let dt2 = new Date(date2);
    return Math.floor((Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) - Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate()) ) /(1000 * 60 * 60 * 24));
}
export const echoClient = (token, chatSSL) => {
    return new Echo(
        {
            broadcaster: 'pusher',
            key: LOCALPUSHERPWD,
            cluster: 'mt1',
            wsHost: BASE_HOST,
            wsPort: WEBSOCKETPORT,
            wssPort: WEBSOCKETPORT,
            disableStats: true,
            enabledTransports: chatSSL ? ['ws', 'wss'] : ['ws'],
            encrypted: chatSSL,
            authEndpoint: AUTH_URL + '/broadcasting/auth',
            namespace: "App.Events",
            auth: {
                headers: {
                    'V-Auth': true,
                    Authorization: `Bearer ${token}`,
                }
            }
        }
    )
}
export const daysList=()=>{
    let daysArr = []
    for (let i = -2; i < 8; i++) {
        let obj = {}
        obj.id = i
        obj.name = dateString(AddDay(new Date(), i))
        // console.log("AddDay", AddDay(new Date(), i).getDay())
        if (AddDay(new Date(), i).getDay()) {
            daysArr.push(obj)
        }
    }
    return daysArr
    // console.log("daysArr", daysArr)
    // return daysArr.map((item, i)=>(<div key={i} onClick={()=>{this.setState({curDate : AddDay(this.now, item.id), selDate : true, dayUp: !this.state.dayUp})}} className="add-msg-homework-day" id={item.id}>{item.name}</div>))
}
const dateString = curDate => {
    let datediff = dateDiff((new Date()), curDate)+2;
    let daysArr = ["Позавчера","Вчера","Сегодня","Завтра","Послезавтра"]
    // Date.prototype.getWeek = function() {
    //     let onejan = new Date(this.getFullYear(),0,1);
    //     return Math.ceil((((this - onejan) / 86400000) + onejan.getDay())/7);
    // }
    // console.log("datediff", datediff, curDate);
    if (datediff>=0&&datediff<5)
        return daysArr[datediff].toUpperCase();
    else {
        // console.log("getWeek", curDate, getWeek(curDate), getWeek(new Date()))

        if ((getWeek(curDate) - getWeek(new Date()))>=0)
        {
            if (getWeek(new Date()) === getWeek(curDate)) {
                return arrOfWeekDays[curDate.getDay()].toUpperCase() + ' [эта.неделя]'
            }
            else {
                if ((getWeek(new Date()) + 1) === getWeek(curDate)) {
                    return arrOfWeekDays[curDate.getDay()].toUpperCase() + ' [след.неделя]'
                }
                else {
                    return arrOfWeekDays[curDate.getDay()].toUpperCase() + '  +' + (getWeek(curDate) - getWeek(new Date())) +' нед.'
                }
            }
        }
        else {
            return arrOfWeekDays[curDate.getDay()].toUpperCase() + '  ' + (getWeek(curDate) - getWeek(new Date())) +'нед.'
        }

    }
}
const getWeek = (curDate) => {
    const now = new Date(curDate)
    const firstJan = new Date(now.getFullYear(),0,1)
    return Math.ceil((((now - firstJan) / 86400000) + firstJan.getDay())/7)
}