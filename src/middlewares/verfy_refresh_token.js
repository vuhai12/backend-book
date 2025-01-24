import jwt, { TokenExpiredError } from "jsonwebtoken";
import { notAuthorized } from "./handle_errors"
require('dotenv').config();
const verifyRefreshToken = (req, res, next) => {
    const {refresh_token} = req.body
    if(!refresh_token) return notAuthorized('Require authorization', res)
    // const accessToken = token.split(' ')[1] //vì token ở dạng bearer, nên phải chém nó ra thành mảng, lấy ở vị trí thứ 1
    jwt.verify(refresh_token, process.env.JWT_SECRET, (err, user) => {
        if(err){
            const isChecked = err instanceof TokenExpiredError 
            if(!isChecked) return notAuthorized('Refresh token invalid', res, isChecked)
            if(isChecked) return notAuthorized('Refresh token expired', res, isChecked)
        }
        req.user = user
        next()
    })
}

export default verifyRefreshToken