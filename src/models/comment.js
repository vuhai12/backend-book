'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    static associate(models) {
      Comment.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user',
      });
      Comment.belongsTo(models.Book, {
        foreignKey: 'bookId',
        as: 'book',
      });
      Comment.hasMany(models.Like, {
        foreignKey: 'commentId',
        as: 'likes',
      });
      Comment.belongsTo(Comment, { as: 'parent', foreignKey: 'parentId' });
      Comment.hasMany(Comment, { as: 'replies', foreignKey: 'parentId' });
    }
  }
  Comment.init(
    {
      content: DataTypes.TEXT,
      parentId: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Comment',
    }
  );
  return Comment;
};
