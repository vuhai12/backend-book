import * as controllers from '../controllers';
import express from 'express';
import verifyToken from '../middlewares/verfy_token';
const router = express.Router();
require('dotenv').config();

// router.use(verifyToken);

router.post('/create_payment_url', controllers.createPayment);
router.get('/vnpay_return', controllers.paymentReturn);

// router.get('/vnpay_return', function (req, res, next) {
//   console.log('chạy vào vnpay_return');
//   let vnp_Params = req.query;

//   let secureHash = vnp_Params['vnp_SecureHash'];

//   delete vnp_Params['vnp_SecureHash'];
//   delete vnp_Params['vnp_SecureHashType'];

//   vnp_Params = sortObject(vnp_Params);

//   //   let config = require('config');
//   let tmnCode = process.env.VNP_TMN_CODE;
//   let secretKey = process.env.VNP_HASH_SECRET;

//   let querystring = require('qs');
//   let signData = querystring.stringify(vnp_Params, { encode: false });
//   let crypto = require('crypto');
//   let hmac = crypto.createHmac('sha512', secretKey);
//   let signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

//   if (secureHash === signed) {
//     //Kiem tra xem du lieu trong db co hop le hay khong va thong bao ket qua

//     res.render('success', { code: vnp_Params['vnp_ResponseCode'] });
//   } else {
//     res.render('success', { code: '97' });
//   }
// });

module.exports = router;
