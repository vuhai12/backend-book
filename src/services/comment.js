import db from '../models';
import { v4 as generateId } from 'uuid';
import { Op } from 'sequelize';
//CRUD = CREATE - READ - UPDATE - DELETE

//CREATE
export const createComment = (userId, bookId, content, parentId) =>
  new Promise(async (resolve, reject) => {
    try {
      const user = await db.User.findByPk(userId);
      const book = await db.Book.findByPk(bookId);
      if (!user) {
        resolve({
          error: 1,
          message: 'Người dùng không tồn tại',
        });
      }
      if (!book) {
        resolve({
          error: 1,
          message: 'Sách không tồn tại',
        });
      }

      const response = await db.Comment.create({
        id: generateId(),
        content,
        userId,
        bookId,
        parentId,
      });

      resolve({
        error: response ? 0 : 1,
        message: response ? 'Bình luận được tạo' : 'Bình luận không tạo được',
        comment: response,
      });
    } catch (error) {
      console.log('error', error);
      reject(error);
    }
  });

//READ

export const getComments = ({ idBook, limit, pageCurrent, id, ...query }) =>
  new Promise(async (resolve, reject) => {
    try {
      pageCurrent = parseInt(pageCurrent) || 1;
      limit = parseInt(limit) || 10;

      if (pageCurrent < 1) pageCurrent = 1;
      if (limit < 1) limit = 10;

      const offset = (pageCurrent - 1) * limit; // Tính vị trí bắt đầu lấy dữ liệu

      // Lấy tổng số bình luận để tính tổng số trang

      const comments = await db.Comment.findAndCountAll({
        where: { bookId: idBook },
        // limit,
        // offset,
        order: [['createdAt', 'DESC']], // Sắp xếp mới nhất trước
        raw: true, // Chuyển dữ liệu về object thuần
        nest: true, // Gộp các kết quả lồng nhau
        include: [
          { model: db.User, as: 'user', attributes: ['id', 'name', 'avatar'] },
          { model: db.Like, as: 'likes', attributes: ['userId'] },
        ],
      });

      // const comments = await db.Comment.findAndCountAll({
      //   where: { bookId: idBook }, // Lọc comment theo bookId
      //   limit,
      //   offset,
      //   order: [['createdAt', 'DESC']], // Sắp xếp mới nhất trước
      //   include: [
      //     {
      //       model: db.User,
      //       attributes: ['id', 'name', 'avatar'], // Lấy thông tin người bình luận
      //       as: 'user',
      //     },
      //   ],
      //   include: [
      //     {
      //       model: db.Like,
      //       attributes: ['id'], // Lấy thông tin người bình luận
      //       as: 'likes',
      //     },
      //   ],
      // });

      // console.log('comments', comments);
      // comments.rows.map((comment) => {
      //   console.log('comment222', comment.content);
      // });

      if (comments.rows.length > 0) {
        let likes = [];
        let likeCount = 0;
        let reply = [];
        const commentsWithLikes = comments.rows.map((comment) => {
          // const likeCount = comment.likes.length;
          // const isLike = comment.likes.userId == id ? true : false;

          likes.push(comment.likes);
          if (comment.likes.user != null) {
            likeCount++;
          }

          if (comment.parentId != null) {
            reply.push(comment);
          }

          // const isLike = comment.likes.some((like) => like.userId === id); // Kiểm tra user đã like chưa
          return {
            ...comment,
            likeCount,
            isLike: comment.likes.userId == id ? true : false, // Thêm vào kết quả trả về
            reply,
          };
        });

        const commentsWithLikesAndReply = commentsWithLikes
          .map((comment) => {
            const newCommentReply = comment.reply.filter((commentReply) => commentReply.parentId == comment.id);
            return {
              ...comment,
              reply: newCommentReply,
            };
          })
          .filter((comment) => comment.parentId == null);
        // .filter((comment) => comment.parentId == null);

        resolve({
          error: commentsWithLikesAndReply ? 0 : 1,
          message: commentsWithLikesAndReply ? 'Bình luận được tạo' : 'Bình luận không tạo được',
          pageCurrent,
          totalPages: Math.ceil(commentsWithLikesAndReply.count / limit),
          total: commentsWithLikesAndReply.count,
          comments: commentsWithLikesAndReply,
        });
      }
    } catch (error) {
      console.log('error', error);
      reject(error);
    }
  });

export const deleteComment = (idComment) =>
  new Promise(async (resolve, reject) => {
    try {
      const comment = await db.Comment.findByPk(idComment);
      if (comment) {
        await comment.destroy();
      }

      resolve({
        error: comment ? 0 : 1,
        message: comment ? 'Xóa comment success' : 'Xóa comment fail',
      });
    } catch (error) {
      reject(error);
    }
  });
