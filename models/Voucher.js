const Seqelize = require('sequelize');
const db = require('../config/DBConfig')

const Voucher = db.define('Voucher', {
    voucherName: { type: Seqelize.STRING },
    description: { type: Seqelize.STRING },
    percentage:{type: Seqelize.INTEGER},
    expiryDate: {type: Seqelize.DATE},
    quantity:{type: Seqelize.INTEGER}
});

module.exports = Voucher