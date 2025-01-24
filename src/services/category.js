import db from '../models';

//CRUD = CREATE - READ - UPDATE - DELETE

//READ
export const getCategory = () =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.Category.findAll();
      resolve({
        error: response ? 0 : 1,
        message: response ? 'Got' : 'Cannot found',
        categoryData: response,
      });
    } catch (error) {
      reject(error);
    }
  });
