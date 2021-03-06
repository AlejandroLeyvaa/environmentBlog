const express = require('express');
const passport = require('passport');
const PostsService = require('../services/posts');

const {
  postIdSchema,
  createPostSchema,
  updatePostSchema,
} = require('../utils/schemas/posts');

const validationHandler = require('../utils/middleware/validationHandler');
const scopesValidationHandler = require('../utils/middleware/scopesValidationHandler');

const FIVE_MINUTES_IN_SECONDS = 300;
const SIXTY_MINUTES_IN_SECONDS = 3600;

const cacheResponse = require('../utils/cacheResponse');


// JWT strategy
require('../utils/auth/strategies/jwt');

const postsApi = (app) => {
  const router = express.Router();
  app.use('/api/posts', router);

  const postsService = new PostsService();

  router.get('/',
  passport.authenticate('jwt', { session: false }),
  scopesValidationHandler(['read:posts']),
  async (req, res, next) => {
    cacheResponse(res, FIVE_MINUTES_IN_SECONDS);
    const { tags } = req.query;

    try {
      const posts = await postsService.getPosts({ tags });

      res.status(200).json({
        data: posts,
        message: 'posts listed',
      });
    } catch (err) {
      next(err);
    }
  });

  router.get(
    '/:postId',
    passport.authenticate('jwt', { session: false }),
    scopesValidationHandler(['read:posts']),
    validationHandler({ postId: postIdSchema }, 'params'),
    async (req, res, next) => {
      cacheResponse(res, SIXTY_MINUTES_IN_SECONDS);
      const { postId } = req.params;

      try {
        const posts = await postsService.getPost({ postId });

        res.status(200).json({
          data: posts,
          message: 'post retrieved',
        });
      } catch (err) {
        next(err);
      }
    }
  );

  router.post(
    '/',
    passport.authenticate('jwt', { session: false }),
    scopesValidationHandler(['create:posts']),
    validationHandler(createPostSchema),
    async (req, res, next) => {
      const { body: post } = req;

      try {
        const createdPost = await postsService.createPost({ post });

        res.status(201).json({
          data: createdPost,
          message: 'post created',
        });
      } catch (err) {
        next(err);
      }
    }
  );

  router.put(
    '/:postId',
    passport.authenticate('jwt', { session: false }),
    scopesValidationHandler(['update:post']),
    validationHandler({ postId: postIdSchema }, 'params'),
    validationHandler(updatePostSchema),
    async (req, res, next) => {
      const { postId } = req.params;
      const { body: post } = req;

      try {
        const updatedPostId = await postsService.updatePost({
          postId,
          post,
        });

        res.status(200).json({
          data: updatedPostId,
          message: 'post updated',
        });
      } catch (err) {
        next(err);
      }
    }
  );

  router.delete(
    '/:postId',
    passport.authenticate('jwt', { session: false }),
    scopesValidationHandler(['delete:posts']),

    validationHandler({ postId: postIdSchema }, 'params'),
    async (req, res, next) => {
      const { postId } = req.params;

      try {
        const deletePostId = await postsService.deletePost({ postId });

        res.status(200).json({
          data: deletePostId,
          message: 'post deleted',
        });
      } catch (err) {
        next(err);
      }
    }
  );
};

module.exports = postsApi;
