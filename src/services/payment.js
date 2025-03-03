import moment from 'moment';
import sortObject from '../ultils/sortObject';
import { error } from 'console';
require('dotenv').config();

export const createPayment = ({ amount, bankCode, ipAddr }) =>
  new Promise((resolve, reject) => {
    try {
      process.env.TZ = 'Asia/Ho_Chi_Minh';

      let date = new Date();
      let createDate = moment(date).format('YYYYMMDDHHmmss');
      let tmnCode = process.env.VNP_TMN_CODE;
      let secretKey = process.env.VNP_HASH_SECRET;
      let vnpUrl = process.env.VNP_URL;
      let returnUrl = process.env.VNP_RETURN_URL;
      let orderId = moment(date).format('DDHHmmss');

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
      console.log('vnpUrl', vnpUrl);
      resolve({ error: 0, message: 'Tạo đơn hàng thành công', paymentUrl: vnpUrl });
    } catch (error) {
      reject(error);
    }
  });

export const paymentReturn = ({ query }) =>
  new Promise((resolve, reject) => {
    try {
      let vnp_Params = query;

      let secureHash = vnp_Params['vnp_SecureHash'];

      delete vnp_Params['vnp_SecureHash'];
      delete vnp_Params['vnp_SecureHashType'];

      vnp_Params = sortObject(vnp_Params);

      let tmnCode = process.env.VNP_TMN_CODE;
      let secretKey = process.env.VNP_HASH_SECRET;

      let querystring = require('qs');
      let signData = querystring.stringify(vnp_Params, { encode: false });
      let crypto = require('crypto');
      let hmac = crypto.createHmac('sha512', secretKey);
      let signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

      if (secureHash === signed) {
        //Kiem tra xem du lieu trong db co hop le hay khong va thong bao ket qua
        resolve({
          error: 0,
          message: 'Thanh toán thành công',
        });
        // res.render('success', { code: vnp_Params['vnp_ResponseCode'] });
      } else {
        resolve({
          error: 1,
          message: 'Thanh toán không thành công',
        });
        // res.render('success', { code: '97' });
      }
    } catch (error) {
      console.log('erro', error);
      reject(error);
    }
  });
