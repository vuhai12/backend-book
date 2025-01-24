import db from '../models';
require('dotenv').config();

//CRUD = CREATE - READ - UPDATE - DELETE

//READ

export const getProfileUserById = (profileUserID) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.ProfileUser.findOne({
        where: { profileUserID },
        attributes: {
          exclude: ['createdAt', 'updatedAt'],
        },
      });
      resolve({
        error: response ? 0 : 1,
        message: response ? 'Got' : 'profileUserData not found',
        profileUserData: response,
      });
    } catch (error) {
      reject(error);
    }
  });
