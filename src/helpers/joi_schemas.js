import Joi from "joi";
export const email = Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ['com'] }
}).required()

export const password = Joi.string().min(6).required()

export const title = Joi.string().required()
export const price = Joi.number().required()
export const available = Joi.number().required()
export const quantity = Joi.number().required()
// export const category_code = Joi.string().uppercase().alphanum().required()
export const category_code = Joi.string().required()
export const image = Joi.string().required()
export const bid = Joi.string().required() //book id 
export const cartBookId = Joi.string().required() //bookCartId id 
export const bids = Joi.array().required() //book id 
export const filename = Joi.array().required()
export const description = Joi.string().required()
export const refreshToken = Joi.string().required()
export const role_code = Joi.string().required()
export const avatar = Joi.string().required()
export const name = Joi.string().required()
export const address = Joi.string().required()
export const totalPrices = Joi.number().required()
export const isChecked = Joi.string().required()
export const isPaid = Joi.string().required()
export const isDelivered = Joi.string().required()
export const paymentMethod = Joi.string().required()
export const total = Joi.number().required()
export const status = Joi.string().required()
