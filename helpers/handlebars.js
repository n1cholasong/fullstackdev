const moment = require('moment');
const countryList = require('country-list');


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
    return (v1 == v2) ? true : false
};

const firstChar = function (str) {
    return str[0];
};

const getCountry = function (code) {
    return countryList.getName(code);
};

function setVariable(varName, varValue, options) {
    options.data.root[varName] = varValue;
};

module.exports = { formatDate, replaceCommas, isSelected, checkboxCheck, radioCheck, star, equalsTo, firstChar, getCountry, setVariable }

