const express = require('express');
const PostsService = require('../services/posts')

const postsApi = (app) => {
  const router = express.Router();
  app.use('/api/posts', router);

  const postsService = new PostsService();

  router.get('/', async (req, res, next) => {
    const { tags } = req.query;

    try {
      const posts = await postsService.getposts({ tags });

      res.status(200).json({
        data: posts,
        message: 'posts listed',
      });

    } catch (err) {
      next(err)
    }
  });

  router.post('/', async(req, res, next) => {
    const { body: post } = req;

    try {
      const createdPost = await postsService.createPost({ post });

      res.status(201).json({
        data: createdPost,
        message: 'post created'
      });
    } catch(err) {
      next(err);
    };
  });
};

module.exports = postsApi