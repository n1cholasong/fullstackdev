const moment = require('moment');
const countryList = require('country-list');

const emptyCheck = function (value, options) {
    return value == "";
}

const inc = function (value, options) {

    return parseInt(value) + 1;
}

const formatDate = function (date, targetFormat) {
    return moment(date).format(targetFormat);
};

const dateDiff = function (date) {
    var timeNow = moment(Date.now())
    var timePast = moment(date)
    var diff = moment.duration(timeNow.diff(timePast))
    
    let time = diff
    let unit = "ms"

    if (diff >= 1000) {
        time = moment.duration(timeNow.diff(timePast, 'seconds'))
        unit = "s"
    }
    if (diff >= 60000) {
        time = moment.duration(timeNow.diff(timePast, 'minutes'))
        unit = "m"
    }
    if (diff >= 3.6e+6) {
        time = moment.duration(timeNow.diff(timePast, 'hours'))
        unit = "h"
    }
    if (diff >= 8.64e+7) {
        time = moment.duration(timeNow.diff(timePast, 'days'))
        unit = "d"
    }
    if (diff >= 6.048e+8) {
        time = moment.duration(timeNow.diff(timePast, 'weeks'))
        unit = " wk."
    }
    if (diff >= 2.628e+9) {
        time = moment.duration(timeNow.diff(timePast, 'months'))
        unit = " mo."
    }
    if (diff >= 3.154e+10) {
        time = moment.duration(timeNow.diff(timePast, 'years'))
        unit = " yr."
    }
    return time + unit
}

const replaceCommas = function (value) {
    return value ? value.replace(/,/g, ' | ') : 'None';
};

const isSelected = function (value, selectValue) {
    return (value == selectValue) ? 'selected' : '';
};

const checkboxCheck = function (value, checkboxValue) {
    return (value.search(checkboxValue) >= 0) ? 'checked' : '';
};

const radioCheck = function (value, radioValue) {
    return (value == radioValue) ? 'checked' : '';
};

const star = function (value) {
    var result = ""
    for (var i = 0; i < value; i++) {
        result += '⭐'
    };
    return result;
};

const equalsTo = function (v1, v2) {
    return (v1 == v2) ? true : false;
};

const firstChar = function (str) {
    return str[0];
};

const getCountry = function (code) {
    return countryList.getName(code);
};

const setVariable = function (varName, varValue, options) {
    options.data.root[varName] = varValue;
};

const authStud = function (role) {
    return (role == 2) ? true : false;
}

const authAdmin = function (role) {
    return (role == 1) ? true : false;
}

const ifCond = function (params1, params2, options) {
    if (params1 == params2) {
        return options.fn(this);
    }
    return options.inverse(this);
}

const ifMore = function (params1, params2, options) {
    if (params1 > params2) {
        return options.fn(this);
    }
    return options.inverse(this);
}

module.exports = {
    formatDate,
    dateDiff,
    replaceCommas,
    isSelected,
    checkboxCheck,
    radioCheck,
    star,
    equalsTo,
    firstChar,
    getCountry,
    setVariable,
    authStud,
    authAdmin,
    ifCond,
    ifMore,
    inc,
    emptyCheck
}

