const moment = require('moment');
const countryList = require('country-list');

const formatDate = function (date, targetFormat) {
    return moment(date).format(targetFormat);
};

const replaceCommas = function (value) {
    return value ? value.replace(/,/g, ' | ') : 'None';
};

const selectOption = function(value, selectValue) {
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

// const countrySelect = function(){
//     const countryNameList = countryList.getNames();
//     const countryCodeList = countryList.getCodes();

//     for (const name in countryCodeList) {
//         return `<option value="countryList.getCodes(name)">name</option>`;
    
// }

module.exports = { formatDate, replaceCommas, selectOption, checkboxCheck, radioCheck, star, equalsTo, firstChar}

