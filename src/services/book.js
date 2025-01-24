import db from '../models';
import { Op } from 'sequelize';
import { v4 as generateId } from 'uuid';
require('dotenv').config();

//CRUD = CREATE - READ - UPDATE - DELETE

//READ
export const getBooks = ({ page, limit, order, name, available, ...query }) =>
  new Promise(async (resolve, reject) => {
    //limit: mỗi lần lấy bao nhiêu
    //page, limit, order không phải để filter mà là để phân trang, nên dùng queries
    //name hay các biến khác (nếu có) cần filter nên dùng query
    console.log('query', query);
    console.log('page', page);
    console.log('limit', limit);
    console.log('available', available);

    try {
      //tạo 1 object là queries để thiết lập việc truy vấn cho sequelize
      //xuyên suốt quá trình thì object sẽ được thêm thắt các cặp key/value để phục vụ việc truy vấn được chính xác như yêu cầu
      const queries = { raw: true, nest: true };
      //offset: vị trí mà mình muốn lấy, ví dụ offset = 10 thì sẽ lấy từ 10 trở đi và bỏ qua 9 cái trước
      const offset = !page || +page <= 1 ? 0 : +page - 1;
      const fLimit = +limit || +process.env.LIMIT_BOOK; //nếu truyền vào limit thì lấy, còn nếu không thì lấy limit trong file .env
      queries.offset = offset * fLimit;
      queries.limit = fLimit;
      if (order) queries.order = [order];
      if (name) query.title = { [Op.substring]: name }; //op là viết tắt của operator
      if (available) query.available = { [Op.between]: available };
      const response = await db.Book.findAndCountAll({
        where: query,
        ...queries, //sử dụng destructuring rải các thuộc tính của queries ra
        attributes: {
          // exclude: ['category_code', 'description'],
          exclude: ['category_code'],
        },
        //Nếu đứng từ bảng book mà chỉ cần chọc tới 1 bảng nữa thôi thì ko cần truyền mảng, truyền object là được
        //Còn nếu muốn lấy từ 2 bảng trở lên thì phải để vào một cái mảng, trong mảng sẽ chứa các object tương ứng với từng bảng muốn lấy.
        //có thể viết bọc trong mảng như bên dưới
        // include: [
        //   {
        //     model: db.Category,
        //     attributes: { exclude: ['createdAt', 'updatedAt'] },
        //     as: 'categoryData',
        //   },
        // ],
      });
      console.log('response', response);
      resolve({
        error: response ? 0 : 1,
        message: response ? 'Got' : 'Cannot found',
        bookData: response,
      });
    } catch (error) {
      reject(error);
    }
  });

export const getBookById = (bookID) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.Book.findOne({
        where: { id: bookID },
        attributes: {
          exclude: ['createdAt', 'updatedAt', 'categoryId', 'filename'],
        },
        include: [{ model: db.Category, as: 'categoryData', attributes: ['id', 'code', 'value'] }],
      });

      resolve({
        error: response ? 0 : 1,
        message: response ? 'Got' : 'Book not found',
        bookData: response,
      });
    } catch (error) {
      reject(error);
    }
  });

export const createNewBook = (body, fileData) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.Book.findOrCreate({
        where: { title: body?.title },
        //default (số ít): tạo 1 cột theo key/value đầu tiên trong object
        //defaults (số nhiều): tạo nhiều cột theo số cặp key/value trong object
        defaults: {
          ...body,
          id: generateId(),
          // image:  fileData?.path,
          image: `http://localhost:${process.env.PORT}/${fileData?.filename}`,
          // filename: fileData
        },
      });

      resolve({
        error: response[1] ? 0 : 1, //true: 0 false: 1
        message: response[1] ? 'Created' : 'Cannot create new book',
      });
    } catch (error) {
      reject(error);
    }
  });

export const updateBook = ({ bid, ...body }, fileData) =>
  new Promise(async (resolve, reject) => {
    try {
      // if (fileData) body.image = fileData?.path;
      if (fileData) body.image = `http://localhost:${process.env.PORT}/${fileData?.filename}`;
      const response = await db.Book.update(body, {
        where: { id: bid },
      });
      resolve({
        error: response[0] > 0 ? 0 : 1, //true: 0 false: 1
        message: response[0] ? `${response[0]} updated` : 'Cannot update',
      });
      // if (fileData && !response[0] === 0) cloudinary.uploader.destroy(fileData.filename);
    } catch (error) {
      reject(error);
      // if (fileData) cloudinary.uploader.destroy(fileData.filename);
    }
  });

//DELETE
//bids có s vì dữ liệu truyền vào là một mảng, trong trường hợp muốn xóa nhiều sách một lúc
//[id1, id2]

/*
params = {
  bids = [id1, id2],
  filename = [filename1, filename2]
}
*/
// export const deleteBook = (bids, filename) =>
//   new Promise(async (resolve, reject) => {
//     try {
//       const response = await db.Book.destroy({
//         where: { id: bids },
//       });
//       resolve({
//         error: response > 0 ? 0 : 1, //true: 0 false: 1
//         message: `${response} book(s) deleted`,
//       });
//       //cloudinary.uploader.destroy chỉ xóa được một element
//       //muốn xóa nhiều element cần dùng cloudinary.api.delete_resources(mảng các element)
//       if (filename) cloudinary.api.delete_resources(filename);
//     } catch (error) {
//       reject(error);
//     }
//   });

//Delete khi ảnh lưu trực tiếp trên db

export const deleteBook = (bids) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.Book.destroy({
        where: { id: bids },
      });
      resolve({
        error: response > 0 ? 0 : 1, //true: 0 false: 1
        message: `${response} book(s) deleted`,
      });
      //cloudinary.uploader.destroy chỉ xóa được một element
      //muốn xóa nhiều element cần dùng cloudinary.api.delete_resources(mảng các element)
      // if (filename) cloudinary.api.delete_resources(filename);
    } catch (error) {
      reject(error);
    }
  });
