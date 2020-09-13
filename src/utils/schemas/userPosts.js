const joi = require('joi');

const { postIdSchema } = require('./posts');
const { userIdSchema } = require('./users');

const userpostIdSchema = joi.string().regex(/^[0-9a-fA-F]{24}$/);

const createUserpostSchema = {
  userId: userIdSchema,
  postId: postIdSchema
};

module.exports = {
  userpostIdSchema,
  createUserpostSchema
};
