/**
 * Created by CTT VNPAY
 */
let express = require('express');
let router = express.Router();
const moment = require('moment');
require('dotenv').config();

router.post('/create_payment_url', function (req, res, next) {
  process.env.TZ = 'Asia/Ho_Chi_Minh';

  let date = new Date();
  let createDate = moment(date).format('YYYYMMDDHHmmss');

  let ipAddr = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;

  let tmnCode = process.env.VNP_TMN_CODE;
  let secretKey = process.env.VNP_HASH_SECRET;
  let vnpUrl = process.env.VNP_URL;
  let returnUrl = process.env.VNP_RETURN_URL;
  let orderId = moment(date).format('DDHHmmss');
  let amount = req.body.amount;
  let bankCode = req.body.bankCode;

  let locale = 'vn';
  if (locale === null || locale === '') {
    locale = 'vn';
  }
  let currCode = 'VND';
  let vnp_Params = {};
  vnp_Params['vnp_Version'] = '2.1.0';
  vnp_Params['vnp_Command'] = 'pay';
  vnp_Params['vnp_TmnCode'] = tmnCode;
  vnp_Params['vnp_Locale'] = locale;
  vnp_Params['vnp_CurrCode'] = currCode;
  vnp_Params['vnp_TxnRef'] = orderId;
  vnp_Params['vnp_OrderInfo'] = 'Thanh toan cho ma GD:' + orderId;
  vnp_Params['vnp_OrderType'] = 'other';
  vnp_Params['vnp_Amount'] = amount * 100;
  vnp_Params['vnp_ReturnUrl'] = returnUrl;
  vnp_Params['vnp_IpAddr'] = ipAddr;
  vnp_Params['vnp_CreateDate'] = createDate;
  if (bankCode !== null && bankCode !== '') {
    vnp_Params['vnp_BankCode'] = bankCode;
  }

  vnp_Params = sortObject(vnp_Params);

  let querystring = require('qs');
  let signData = querystring.stringify(vnp_Params, { encode: false });
  let crypto = require('crypto');
  let hmac = crypto.createHmac('sha512', secretKey);
  let signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
  vnp_Params['vnp_SecureHash'] = signed;
  vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });
  //   res.redirect(vnpUrl);
});

// router.get('/vnpay_return', function (req, res, next) {
//   console.log('chạy vào vnpay_return');
//   let vnp_Params = req.query;

//   let secureHash = vnp_Params['vnp_SecureHash'];

//   delete vnp_Params['vnp_SecureHash'];
//   delete vnp_Params['vnp_SecureHashType'];

//   vnp_Params = sortObject(vnp_Params);

//   //   let config = require('config');
//   let secretKey = process.env.VNP_HASH_SECRET;

//   //   let querystring = require('qs');
//   let signData = querystring.stringify(vnp_Params, { encode: false });
//   //   let crypto = require('crypto');
//   let hmac = crypto.createHmac('sha512', secretKey);
//   let signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

//   if (secureHash === signed) {
//     //Kiem tra xem du lieu trong db co hop le hay khong va thong bao ket qua

//     res.render('success', { code: vnp_Params['vnp_ResponseCode'] });
//   } else {
//     res.render('success', { code: '97' });
//   }
// });

function sortObject(obj) {
  let sorted = {};
  let str = [];
  let key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, '+');
  }
  return sorted;
}

module.exports = router;
