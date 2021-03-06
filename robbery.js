'use strict';

/**
 * Сделано задание на звездочку
 * Реализовано оба метода и tryLater
 */
exports.isStar = true;

const weekDays = ['ВС', 'ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ'];
const timeMask = /[0-2][0-9]:[0-5][0-9]/;
const startPoint = new Date(2020, 4, 11);

let timeExistance = false;
let appropriateMoment;

// туду доклеты ко всем функциям надо бы /done
// доклет нужно писать над функцией, и в данном случа её свностоит поднять сюда, вверх
/**
 * @param {Object} schedule – Расписание Банды
 * @param {Number} duration - Время на ограбление в минутах
 * @param {Object} workingHours – Время работы банка
 * @param {String} workingHours.from – Время открытия, например, "10:00+5"
 * @param {String} workingHours.to – Время закрытия, например, "18:00+5"
 * @returns {Object}
 */
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
            // тут тоже
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
            let clonedTimePoints = {
                currentDayPoint: {
                    from: new Date(timePoints.currentDayPoint.from),
                    to: new Date(timePoints.currentDayPoint.to)
                },

                bankWorkingHours: setTime(workingHours)
            };

            timeExistance = false;
            appropriateMoment = undefined;

            increaseDateOnMinutes(timePoints.currentDayPoint, 30);

            mainIterarion(timePoints, needableElemsForRobbery);

            if (timeExistance) {
                return true;
            }

            timePoints = clonedTimePoints;
            appropriateMoment = new Date(timePoints.currentDayPoint.from);

            return false;
        }
    };
};

/**
 * @param {String} str
 * @returns {String}
 */
function getTimeHours(str) {
    let result = str.match(timeMask).join();

    return result.slice(0, 2);
}

/**
 * @param {String} str
 * @returns {String}
 */
function getTimeMinutes(str) {
    let result = str.match(timeMask).join();

    return result.slice(3, 5);
}

/**
 * @param {String} str
 * @returns {String}
 */
function getWeekDay(str) {
    return str.slice(0, 2);
}

/**
 * @param {String} firstDay
 * @param {String} secondDay
 * @returns {Boolean}
 */
function checkWeekDaysEqual(firstDay, secondDay) {
    // тут ретурнить можно без ифа, результат сравнения /done
    return firstDay === secondDay;
}

/**
 * @param {String} str
 * @returns {Date}
 */
function extractDate(str) {
    // если переменная после создания не меняется - это const /done
    const mayWeekDays = [10, 11, 12, 13, 14, 15, 16];
    let weekDay = mayWeekDays[weekDays.indexOf(str.slice(0, 2))];
    let hours = getTimeHours(str);
    let minutes = getTimeMinutes(str);
    let date = new Date(2020, 4, weekDay, hours, minutes);

    return date;
}

/**
 * @param {String} bankTimezone
 * @param {String} memberTimezone
 * @param {Date} memberDateToChangeFrom
 * @param {Date} memberDateToChangeTo
 */
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

/**
 * @param {Date} date
 * @param {Number} minutes
 */
function increaseDateOnMinutes(date, minutes) {
    date.from.setMinutes(date.from.getMinutes() + minutes);
    date.to.setMinutes(date.to.getMinutes() + minutes);
}

/**
 * @param {Date} date
 */
function increaseDayOfDate(date) {
    date.setDate(date.getDate() + 1);
}

/**
 * @param {Date} date1
 * @param {Date} date2
 * @param {Date} date3
 * @param {Date} date4
 */
function increaseAllDayOfDate(date1, date2, date3, date4) {
    increaseDayOfDate(date1);
    increaseDayOfDate(date2);
    increaseDayOfDate(date3);
    increaseDayOfDate(date4);
}

/**
 * @param {Date} currentDayPointTo
 * @param {Date} bankWorkingHoursTo
 * @returns {Boolean}
 */
function checkBankStillWorking(currentDayPointTo, bankWorkingHoursTo) {
    // тут ретурнить можно без ифа, результат сравнения /done
    return currentDayPointTo <= bankWorkingHoursTo;
}

/**
 * @param {Object} currentMemberSchedule
 * @param {Object} workingHours
 * @param {Object} timePoints
 * @returns {Boolean}
 */
function checkCurrentMemberIsFree(currentMemberSchedule, workingHours, timePoints) {
    for (let i = 0; i < currentMemberSchedule.length; i++) {
        let currentDaySchedule = currentMemberSchedule[i];
        let memberDateFrom = extractDate(currentDaySchedule.from);
        let memberDateTo = extractDate(currentDaySchedule.to);

        checkTimezone(
            workingHours.from,
            currentDaySchedule.from,
            memberDateFrom,
            memberDateTo
        );

        if (checkMemberIsFreeThisDay(
                weekDays[timePoints.currentDayPoint.from.getDay()],
                currentMemberSchedule)) {
            return true;
        }

        if (!(checkWeekDaysEqual(getWeekDay(currentDaySchedule.from),
                    weekDays[timePoints.currentDayPoint.from.getDay()])) &&
                    !(checkWeekDaysEqual(getWeekDay(currentDaySchedule.to),
                    weekDays[timePoints.currentDayPoint.from.getDay()]))) {
            continue;
        }

        if ((memberDateFrom >= timePoints.currentDayPoint.to) ||
            (memberDateTo <= timePoints.currentDayPoint.from)) {
            return true;
        }

        return false;
    }
}

/**
 * @param {Object} workingHours
 * @param {Number} duration
 * @param {Date} bindingDate
 * @returns {Object}
 */
function setTimeCurrentPoint(workingHours, duration, bindingDate) {
    let date = new Date(bindingDate);

    // не оч понял в чем фишка отступать строки в объекте тут и далее /done
    return {
        from: new Date(date.setHours(
            getTimeHours(workingHours.from),
            getTimeMinutes(workingHours.from))
        ),
        to: new Date(date.setHours(
            getTimeHours(workingHours.from),
            (getTimeMinutes(workingHours.from) + duration))
        )
    };
}

/**
 * @param {Object} workingHours
 * @returns {Object}
 */
function setTime(workingHours) {
    let date = new Date(startPoint);

    return {
        from: new Date(date.setHours(
            getTimeHours(workingHours.from),
            getTimeMinutes(workingHours.from))
        ),
        to: new Date(date.setHours(
            getTimeHours(workingHours.to),
            getTimeMinutes(workingHours.to))
        )
    };
}

/**
 * @param {String} day
 * @param {Object} memberSchedule
 * @returns {Boolean}
 */
function checkMemberIsFreeThisDay(day, memberSchedule) {
    function iter(currentSchedule) {
        for (let j = 0; j < currentSchedule.length; j++) {
            let value = currentSchedule[j];
            if (value.indexOf(day) === -1) {
                continue;
            }

            return false;
        }

        return true;
    }

    for (let i = 0; i < memberSchedule.length; i++) {
        let currentSchedule = Object.values(memberSchedule[i]);
        if (iter(currentSchedule)) {

            continue;
        }

        return false;
    }

    return true;
}

/**
 * @param {Object} timePoints
 * @param {Object} needableElemsForRobbery
 */
function mainIterarion(timePoints, needableElemsForRobbery) {
    function nextDayWithTimeReset() {
        increaseAllDayOfDate(
            timePoints.currentDayPoint.from,
            timePoints.currentDayPoint.to,
            timePoints.bankWorkingHours.from,
            timePoints.bankWorkingHours.to
        );
        timePoints.currentDayPoint = setTimeCurrentPoint(
            needableElemsForRobbery.workingHours,
            needableElemsForRobbery.duration,
            timePoints.currentDayPoint.from);
    }

    /**
     * @returns {Boolean}
     */
    function checkMembersIsFree() {
        let members = Object.keys(needableElemsForRobbery.schedule);
        for (let member of members) {
            let currentMemberSchedule = needableElemsForRobbery.schedule[member];
            if (checkCurrentMemberIsFree(
                    currentMemberSchedule,
                    needableElemsForRobbery.workingHours,
                    timePoints)) {
                continue;
            }

            return false;
        }

        return true;
    }

    // тут явно while напрашивается /done
    while (timePoints.currentDayPoint.from.getDay() < 4) {
        if (!checkBankStillWorking(timePoints.currentDayPoint.to, timePoints.bankWorkingHours.to)) {
            nextDayWithTimeReset();
            continue;
        }

        if (checkMembersIsFree()) {
            timeExistance = true;
            appropriateMoment = new Date(timePoints.currentDayPoint.from);
            break;
        }

        increaseDateOnMinutes(timePoints.currentDayPoint, 1);
    }
}


