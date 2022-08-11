const moment = require('moment');
const countryList = require('country-list');

const emptyCheck = function(value,options){
    return value == "";
}

const inc = function(value, options){
    return parseInt(value) + 1;
}

const formatDate = function (date, targetFormat) {
    return moment(date).format(targetFormat);
};

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
    return (role == 'STUDENT') ? true : false;
}

const authAdmin = function (role) {
    return (role == 'ADMIN') ? true : false;
}

const ifCond = function(params1, params2, options) {
    if (params1 == params2) {
        return options.fn(this);
    }
    return options.inverse(this);
}

module.exports = {
    formatDate,
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
    inc,
    emptyCheck
}

