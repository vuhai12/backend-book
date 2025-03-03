import db from '../models';
import { v4 as generateId } from 'uuid';
//CRUD = CREATE - READ - UPDATE - DELETE

//CREATE
export const toggleLike = (userId, commentId) =>
  new Promise(async (resolve, reject) => {
    try {
      const existingLike = await db.Like.findOne({
        where: { userId, commentId },
        raw: true, // Chuyển dữ liệu về object thuần
      });

      if (existingLike) {
        const response = await existingLike.destroy();
        resolve({
          error: response ? 0 : 1,
          message: response ? 'Đã UnLike' : 'Không UnLike được',
        });
      } else {
        const response = await db.Like.create({
          id: generateId(),
          userId,
          commentId,
        });
        resolve({
          error: response ? 0 : 1,
          message: response ? 'Đã Like' : 'Không Like được',
        });
      }
    } catch (error) {
      console.log('error', error);
      reject(error);
    }
  });
