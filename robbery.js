'use strict';

/**
 * Сделано задание на звездочку
 * Реализовано оба метода и tryLater
 */
exports.isStar = false;

/**
 * @param {Object} schedule – Расписание Банды
 * @param {Number} duration - Время на ограбление в минутах
 * @param {Object} workingHours – Время работы банка
 * @param {String} workingHours.from – Время открытия, например, "10:00+5"
 * @param {String} workingHours.to – Время закрытия, например, "18:00+5"
 * @returns {Object}
 */

const weekDays = ['ВС', 'ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ'];
const timeMask = /[0-2][0-9]:[0-5][0-9]/;
const startPoint = new Date(2020, 4, 11);

let timeExistance = false;
let appropriateMoment;

function getTimeHours(str) {
    let result = str.match(timeMask).join();

    return result.slice(0, 2);
}

function getTimeMinutes(str) {
    let result = str.match(timeMask).join();

    return result.slice(3, 5);
}

function getWeekDay(str) {
    return str.slice(0, 2);
}

function checkWeekDaysEqual(firstDay, secondDay) {
    if (firstDay === secondDay) {
        return true;
    }

    return false;
}

function extractDate(str) {
    let mayWeekDays = [10, 11, 12, 13, 14, 15, 16];
    let weekDay = mayWeekDays[weekDays.indexOf(str.slice(0, 2))];
    let hours = getTimeHours(str);
    let minutes = getTimeMinutes(str);
    let date = new Date(2020, 4, weekDay, hours, minutes);

    return date;
}

function checkTimezone(bankTimezone, memberTimezone, memberDateToChangeFrom, memberDateToChangeTo) {
    if (bankTimezone.slice(-1) > memberTimezone.slice(-1)) {
        let differenceOfTimezone = bankTimezone.slice(-1) - memberTimezone.slice(-1);
        memberDateToChangeFrom.setHours(memberDateToChangeFrom.getHours() + differenceOfTimezone);
        memberDateToChangeTo.setHours(memberDateToChangeTo.getHours() + differenceOfTimezone);
    }

    if (bankTimezone.slice(-1) < memberTimezone.slice(-1)) {
        let differenceOfTimezone = memberTimezone.slice(-1) - bankTimezone.slice(-1);
        memberDateToChangeFrom.setHours(memberDateToChangeFrom.getHours() + differenceOfTimezone);
        memberDateToChangeTo.setHours(memberDateToChangeTo.getHours() + differenceOfTimezone);
    }
}

function increaseDateOnMinute(date) {
    date.from.setMinutes(date.from.getMinutes() + 1);
    date.to.setMinutes(date.to.getMinutes() + 1);
}

function increaseDayOfDate(date) {
    date.setDate(date.getDate() + 1);
}

function increaseAllDayOfDate(date1, date2, date3, date4) {
    increaseDayOfDate(date1);
    increaseDayOfDate(date2);
    increaseDayOfDate(date3);
    increaseDayOfDate(date4);
}

function checkDatesEqual(date1, date2) {
    if ((date1.getHours() === date2.getHours()) && (date1.getMinutes() === date2.getMinutes())) {
        return true;
    }

    return false;
}

function checkCurrentMemberIsFree(currentMemberSchedule, workingHours, timePoints) {
    for (let i = 0; i < currentMemberSchedule.length; i++) {
        let currentDaySchedule = currentMemberSchedule[i];
        let memberDateFrom = extractDate(currentDaySchedule.from);
        let memberDateTo = extractDate(currentDaySchedule.to);

        checkTimezone(workingHours.from, currentDaySchedule.from,
                                 memberDateFrom, memberDateTo);

        if (!(checkWeekDaysEqual(getWeekDay(currentDaySchedule.from),
                    weekDays[timePoints.currentDayPoint.from.getDay()])) &&
                    (checkWeekDaysEqual(getWeekDay(currentDaySchedule.from),
                    getWeekDay(currentDaySchedule.to)))) {
            continue;
        }

        if ((memberDateFrom >= timePoints.currentDayPoint.to) ||
            (memberDateTo <= timePoints.currentDayPoint.from)) {
            return true;
        }

        return false;
    }
}

function setTimeCurrentPoint(workingHours, duration, bindingDate) {
    let date = new Date(bindingDate);

    return {

        from: new Date(date.setHours(getTimeHours(workingHours.from),
                                     getTimeMinutes(workingHours.from))),

        to: new Date(date.setHours(getTimeHours(workingHours.from),
                                   (getTimeMinutes(workingHours.from) + duration)))
    };
}

function setTime(workingHours) {
    let date = new Date(startPoint);

    return {

        from: new Date(date.setHours(getTimeHours(workingHours.from),
                                     getTimeMinutes(workingHours.from))),

        to: new Date(date.setHours(getTimeHours(workingHours.to),
                                   getTimeMinutes(workingHours.to)))
    };
}

function mainIterarion(timePoints, needableElemsForRobbery) {
    function nextDayWithTimeReset() {
        increaseAllDayOfDate(timePoints.currentDayPoint.from, timePoints.currentDayPoint.to,
                             timePoints.bankWorkingHours.from, timePoints.bankWorkingHours.to);
        timePoints.currentDayPoint = setTimeCurrentPoint(needableElemsForRobbery.workingHours,
                                                         needableElemsForRobbery.duration,
                                                         timePoints.currentDayPoint.from);
    }

    function checkMembersIsFree() {
        let members = Object.keys(needableElemsForRobbery.schedule);
        for (let member of members) {
            let currentMemberSchedule = needableElemsForRobbery.schedule[member];
            if (checkCurrentMemberIsFree(currentMemberSchedule,
                                         needableElemsForRobbery.workingHours,
                                         timePoints)) {
                continue;
            }

            return false;
        }

        return true;
    }

    for (; timePoints.currentDayPoint.from.getDay() < 4;) {
        if (checkMembersIsFree()) {
            timeExistance = true;
            appropriateMoment = new Date(timePoints.currentDayPoint.from);
            break;
        }

        increaseDateOnMinute(timePoints.currentDayPoint);

        if (checkDatesEqual(timePoints.currentDayPoint.to, timePoints.bankWorkingHours.to)) {
            nextDayWithTimeReset();
            continue;
        }
    }
}

exports.getAppropriateMoment = function (schedule, duration, workingHours) {
    console.info(schedule, duration, workingHours);

    let timePoints = {
        currentDayPoint: setTimeCurrentPoint(workingHours, duration, startPoint),
        bankWorkingHours: setTime(workingHours)
    };
    let needableElemsForRobbery = {
        schedule: schedule,
        duration: duration,
        workingHours: workingHours
    };

    // сбрасываем внешние переменные;
    timeExistance = false;
    appropriateMoment = undefined;

    // Главная часть функции. В ней мы пробегаемся по каждому члену банды, проверяя,
    // свободен ли он. Если все будут свободны, то timeExistance меняем на true
    mainIterarion(timePoints, needableElemsForRobbery);

    return {

        /**
         * Найдено ли время
         * @returns {Boolean}
         */
        exists: function () {
            if (timeExistance) {
                return true;
            }

            return false;
        },

        /**
         * Возвращает отформатированную строку с часами для ограбления
         * Например,
         *   "Начинаем в %HH:%MM (%DD)" -> "Начинаем в 14:59 (СР)"
         * @param {String} template
         * @returns {String}
         */
        format: function (template) {
            if (typeof appropriateMoment === 'undefined') {
                return '';
            }

            function checkAndReplaceHours() {
                if (appropriateMoment.getHours() < 10) {
                    return '0' + appropriateMoment.getHours();
                }

                return String(appropriateMoment.getHours());
            }

            function checkAndReplaceMinutes() {
                if (appropriateMoment.getMinutes() < 10) {
                    return '0' + appropriateMoment.getMinutes();
                }

                return String(appropriateMoment.getMinutes());
            }

            let result = template.replace('%DD', weekDays[appropriateMoment.getDay()])
                .replace('%HH', checkAndReplaceHours())
                .replace('%MM', checkAndReplaceMinutes());

            return result;
        },

        /**
         * Попробовать найти часы для ограбления позже [*]
         * @star
         * @returns {Boolean}
         */
        tryLater: function () {
            return false;
        }
    };
};
