const moment = require('moment');

const formatDate = function (date, targetFormat) {
    return moment(date).format(targetFormat);
};

const replaceCommas = function (value) {
    return value ? value.replace(/,/g, ' | ') : 'None';
}

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

module.exports = { formatDate, replaceCommas, checkboxCheck, radioCheck, star, equalsTo }

