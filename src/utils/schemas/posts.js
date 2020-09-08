const joi = require('joi');

const postIdSchema = joi.string().regex(/^[0-9a-fA-F]{24}$/);
const postTitleSchema = joi.string().max(80);
const postContent = joi.string().max(6000);
const postImage = joi.string().uri();
const postAuthor = joi.string().min(5).max(64);

const createPostSchema = {
  title: postTitleSchema.required(),
  content: postContent.required(),
  image: postImage,
  author: postAuthor.required(),
};

const updatePostSchema = {
  title: postTitleSchema,
  content: postContent,
  image: postImage,
  author: postAuthor,
};

module.exports = {
  postIdSchema,
  createPostSchema,
  updatePostSchema,
};
