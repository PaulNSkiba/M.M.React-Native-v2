/**
 * Created by Paul on 20.01.2019.
 */
import {themeOptions} from '../js/helpersLight'
import { offlineActionTypes } from 'react-native-offline';

const initialState = {
        // console.log("initialState", themeOptions)
        // let obj = {}
        // if (window.localStorage.getItem("userSetup")&&window.localStorage.getItem("userSetupDate")===toYYYYMMDD(new Date())&&check) {
        //     obj = JSON.parse(window.localStorage.getItem("userSetup"))
        //     obj.loading = false }
        // else
        //     obj =
        //     {
            curClass: 0, classNumber : 0, classID : 0,
            pupilCount: 0, students : [], currentYear: "", curYearDone: 0, subjCount: "0/0", userID: 0,
            selectedSubjsArray: [], selectedSubjects:[], selectedSubj : {id:0, subj_key:"#null"},
            subjects_list : [], markBlank : {id: "", alias: "", pk: 1},
            currentPeriodDateCount : 5, marks : [], direction : "UPDOWN", titlekind : "NICK",
            withoutholidays : true, token: "", userName: "",
            isadmin: 0, studentName : "", studentId : 0,
            studSubj : new Map(), mark_dates : [], best_lines : [], avg_lines : [], avg_marks : [],
            addUserToken : "", cnt_marks : 0, stud_cnt : 0, subj_cnt : 0,
            lastmarkssent : "", emails : [], homework : [],
            stats2 : [], stats3 : [], mark_date : {date : new Date()},
            avgclassmarks : [], loading : -1, stepsLeft : 6,
            chatSessionID : '', classObj : { chatroom_id : 0},
            newMsgCount : 0, countryCode : "EN", langLibrary : {}, chatSSL : true,
            localChatMessages : [], isMobile : true, photoPath : [], markscount : 0,
            needRenew : false, chatTags : [], budget : [], budgetpays : [], renderBudget : 1, classNews : [],
            statsBudget : null, statsBudgetPays : null, selectedFooter : 0, showLogin : false, logoutToken : '',
            timetable : [], subjects : [], headerHeight : 0, footerHeight : 0, online : false, langCode : "",
            offlineMsgs : [],
            themeColor : "#46b5be",
            theme : {
                primaryColor : '#47b5be',
                primaryLightColor : '#9bd7dc',
                primaryDarkColor : '#007ba4',
                primaryBorderColor : '#6ddce5',
                secondaryColor : '#ffc909',
                secondaryLightColor : '#fff674',
                secondaryDarkColor : '#faa41b',
                primaryTextColor : '#ffffff',
                secondaryTextColor : '#000000',
                primaryMsgColor : '#007ba4',
                borderColor : "#A9A9A9",
                navbarColor : "#f0f0f0",
                facebookColor : '#007ba4',
                googleColor : '#fff674',
                photoButtonColor : '#33ccff',
                errorColor : "#b40530",
            }
    //         }
    // return obj
}

export function userSetupReducer(state = initialState, action) {
    let setup = []
    // ToDO: При отсутствтии настроек проверить на undefined
    switch (action.type) {
        case 'INIT_STATE':
            console.log("JUST_LOGGEDIN", action.payload, themeOptions)
            return {...state, initialState}
        case 'USER_LOGGEDIN' : {
            console.log("JUST_LOGGEDIN", action.payload, themeOptions)
            let {   token, subj_count, subjects_list,
                    selected_subjects, selected_subj, students, marks,
                    mark_dates, best_lines, avg_lines, avg_marks, addUserToken,
                    lastmarkssent, emails, homework, stats2, stats3, mark_date,
                    avgclassmarks, classObj, chatrows, markscount, classNews, tags,
                    statsBudget, statsBudgetPays, timetable, subjects} = action.payload.data;
            let {   name : userName, id : userID, isadmin } = action.payload.data.user;
            let {   class_number, pupil_count, year_name, perioddayscount,
                    markblank_id, markblank_alias, selected_marker, titlekind,
                    direction, class_id } = action.payload.data.usersetup;
            let {   id : studentId, student_name : studentName} = action.payload.data.student;
            let {   cnt_marks, stud_cnt, subj_cnt } = action.payload.data.stats[0];
                    studentId = studentId?studentId:0;

            setup = {...state, userName, userID, token,
                curClass: class_number, classNumber : class_number, classID : class_id, pupilCount: pupil_count,
                currentYear: year_name, currentPeriodDateCount: perioddayscount,
                markBlank:{id: markblank_id, alias: markblank_alias, pk: selected_marker},
                titlekind: titlekind, direction : direction,
                subjCount: subj_count, subjects_list: subjects_list, selectedSubjects : selected_subjects,
                selectedSubj : selected_subj, students : students?students:[], classObj,
                isadmin, studentName, studentId, marks, mark_dates, best_lines, avg_lines, avg_marks, addUserToken,
                cnt_marks, stud_cnt, subj_cnt, lastmarkssent, emails, homework, stats2 : stats2[0], stats3 : stats3[0],
                mark_date, avgclassmarks, langLibrary : action.payload.langLibrary, localChatMessages : chatrows, markscount,
                classNews, chatTags : tags, statsBudget, statsBudgetPays, showLogin : false, timetable, subjects,
                theme : action.payload.theme?action.payload.theme:themeOptions['#46b5be'], themeColor : action.payload.themeColor?action.payload.themeColor:'#46b5be'}
            return setup
            }
        case "USER_SETUP" :
            return {...state}
        case offlineActionTypes.CONNECTION_CHANGE:
            console.log("online_event", action.payload, state, {...state, online : action.payload})
            return {...state, online : action.payload}
        case 'UPDATE_ONLINE':
            return {...state, online : action.payload}
        case 'UPDATE_SETUP_REMOTE' : {
            let {   class_number, pupil_count, year_name, perioddayscount,
                    markblank_id, markblank_alias, selected_marker, titlekind, direction} = action.payload.usersetup;
            return {...state,
                curClass: class_number, classNumber : class_number, pupilCount: pupil_count, currentYear: year_name,
                currentPeriodDateCount: perioddayscount,
                markBlank:{id: markblank_id, alias: markblank_alias, pk: selected_marker},
                titlekind: titlekind, direction : direction,
            }
        }
        case 'UPDATE_SETUP_LOCALLY' : {
            console.log('UPDATE_SETUP_LOCALLY', Object.keys(action.payload)[0], Object.values(action.payload)[0], Object.values(action.payload)[0][0])
            // if (Object.keys(action.payload)[0]==='students') {
            //     console.log(Object.values(action.payload)[0].map(value=>JSON.parse(JSON.stringify(value))))
            // }
            switch(Object.keys(action.payload)[0]) {
                case "year_name":
                    return{...state, currentYear: Object.values(action.payload)[0]};
                case "pupil_count":
                    return{...state, pupilCount: Object.values(action.payload)[0]};
                case "class_number":
                    return{...state,    curClass: Object.values(action.payload)[0],
                                        classNumber : Object.values(action.payload)[0],
                                        selectedSubjects : []};
                case "subjects_count" :
                    return{...state, subjCount: Object.values(action.payload)[0]};
                case "selected_subject" :
                    let arr = Object.values(action.payload)[0].split(",");
                    return{...state, selectedSubj: JSON.parse(`{"id":${arr[2]},"subj_key":"${arr[0]}","subj_name_ua":"${arr[1]}"}`)};
                case "selected_subjects" :
                    return{...state, selectedSubjects: Object.values(action.payload)[0]};
                case "markblank_alias" :
                    return{...state, markBlank:{alias: Object.values(action.payload)[0]}};
                case "markblank_id" :
                    return{...state, markBlank:{id: Object.values(action.payload)[0]}};
                case "selected_marker" :
                    return{...state, markBlank:{pk: Object.values(action.payload)[0]}};
                case "markblank" :
                    return{...state, markBlank:{id: Object.values(action.payload)[0][0].markblank_id,  alias: Object.values(action.payload)[0][1].markblank_alias, pk: Object.values(action.payload)[0][2].selected_marker}}
                case "students" :
                    return{...state, students: Object.values(action.payload)[0]};
                case "titlekind" :
                    return{...state, titlekind: Object.values(action.payload)[0]};
                case "perioddayscount" :
                    return{...state, currentPeriodDateCount: Object.values(action.payload)[0]};
                case "direction" :
                    return{...state, direction: Object.values(action.payload)[0]};
                case "withoutholidays" :
                    return{...state, withoutholidays: Object.values(action.payload)[0]};
                default :
                    return state
            }}
        case 'UPDATE_SETUP_LOCALLY_SUBJLIST' : {
            return{...state, subjects_list: action.payload}
        }
        case 'UPDATE_SETUP_LOCALLY_SUBJCOUNT' : {
            return{...state, subjCount: action.payload}
        }
        case 'UPDATE_STUDENTS_REMOTE' : {
            return{...state, students: action.payload}
        }
        case 'UPDATE_STUDENTS_LOCALLY' : {
            return{...state, students: action.payload}
        }
        case 'UPDATE_STUDENT_CHART_SUBJECT' : {
            return{...state, studSubj : action.payload}
        }
        case 'UPDATE_HOMEWORK' : {
            return{...state, homework : action.payload}
        }
        case 'UPDATE_CHATROOMID' : {
            let classObj = state.classObj
            classObj.chatroom_id = action.payload
            return{...state, classObj}
        }
        case 'LANG_LIBRARY' : {
            return{...state, langLibrary: action.payload}
        }
        case 'LANG_CODE' : {
            return{...state, langCode: action.payload}
        }
        case 'CHAT_SESSION_ID' : {
            return{...state, chatSessionID : action.payload}
        }
        case 'APP_LOADING' : {
            return{...state, loading : true}
        }
        case 'APP_LOADED' : {
            return{...state, loading : false}
        }
        case 'IS_MOBILE' : {
            return{...state, isMobile : action.payload}
        }
        case 'ENABLE_SAVE_STEPS' : {
            return{...state, stepsLeft : action.payload}
        }
        case 'CHAT_SSL' : {
            return{...state, chatSSL: action.payload}
        }
        case 'PHOTO_PATH' : {
            return{...state, photoPath: action.payload}
        }
        case 'CHAT_TAGS' : {
            return{...state, chatTags: action.payload}
        }
        case 'BUDGET_UPDATE' :
            return{...state, budget: action.payload}
        case 'BUDGETPAYS_UPDATE' :
            return{...state, budgetpays: action.payload}
        case 'RENDER_BUDGET' :
            return{...state, renderBudget: action.payload}
        // case "INIT_CHAT_MESSAGES" : {
        //     return{...state, localChatMessages: action.payload}
        // }
        case "ADD_CHAT_MESSAGES" : {
            return{...state, localChatMessages: action.payload}
        }
        case "ADD_MARKS" : {
            return{...state, marks: action.payload}
        }
        case "NEED_RENEW" : {
            return{...state, needRenew: action.payload}
        }
        case "UPDATE_NEWS" : {
            return{...state, classNews: action.payload}
        }
        case 'USER_LOGGEDOUT' :
            let initState = initialState
            initState.langLibrary = action.payload.langLibrary
            initState.themeColor = action.payload.themeColor
            initState.theme = action.payload.theme
            // console.log("userSetupReducer", 'USER_LOGGEDOUT', initState, action.langLibrary)
            return {...initState};
        case 'UPDATE_PAGE' :
            /*
            0 - Логин
            0 - Чат
            1 - Домашка
            2 - Оценки
            3 - Инфо
            4 - Камера
            5 - etc
             */
            return{...state, selectedFooter: action.payload}
        case "SHOW_LOGIN" :
            console.log("SHOW_LOGIN", action.payload)
            return{...state, showLogin: action.payload}
        case "UPDATE_TOKEN" :
            return{...state, token: action.payload}
        case "UPDATE_LOGOUTTOKEN" :
            return{...state, logoutToken: action.payload}
        case "HEADER_HEIGHT" :
            return{...state, headerHeight: action.payload}
        case "FOOTER_HEIGHT" :
            return{...state, footerHeight: action.payload}
        case 'CHANGE_THEME' :
            return{...state, theme : action.payload}
        case 'CHANGE_COLOR' :
            return{...state, themeColor : action.payload}
        case 'ADD_OFFLINE' :
            return{...state, offlineMsgs : action.payload}
        default :
            return state
    }
}

