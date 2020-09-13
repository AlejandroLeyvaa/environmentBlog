const express = require('express');
const passport = require('passport');

const UserPostsService = require('../services/userPosts');
const validationHandler = require('../utils/middleware/validationHandler');
const scopesValidationHandler = require('../utils/middleware/scopesValidationHandler');

const { postIdSchema } = require('../utils/schemas/posts');
const { userIdSchema } = require('../utils/schemas/users');
const { createUserPostSchema } = require('../utils/schemas/userPosts');

// JWT strategy
require('../utils/auth/strategies/jwt');

function userPostsApi(app) {
  const router = express.Router();
  app.use('/api/user-posts', router);

  const userPostsService = new UserPostsService();

  router.get(
    '/',
    passport.authenticate('jwt', { session: false }),
    scopesValidationHandler(['read:user-posts']),
    validationHandler({ userId: userIdSchema }, 'query'),
    async function(req, res, next) {
      const { userId } = req.query;

      try {
        const userPosts = await userPostsService.getUserPosts({ userId });

        res.status(200).json({
          data: userPosts,
          message: 'user posts listed'
        });
      } catch (error) {
        next(error);
      }
    }
  );

  router.get(
    '/:userPostId',
    passport.authenticate('jwt', { session: false }),
    scopesValidationHandler(['read:user-posts']),
    validationHandler({ userPostId: postIdSchema }, 'params'),
    async function(req, res, next) {
      const { userId } = req.query;

      try {
        const userPosts = await userPostsService.getUserPosts({ userId });

        res.status(200).json({
          data: userPosts,
          message: 'user posts listed'
        });
      } catch (error) {
        next(error);
      }
    }
  );

  router.post(
    '/',
    passport.authenticate('jwt', { session: false }),
    scopesValidationHandler(['create:user-posts']),
    validationHandler(createUserPostSchema),
    async function(req, res, next) {
      const { body: userPost } = req;

      try {
        const createdUserPostId = await userPostsService.createUserPost({
          userPost
        });

        res.status(201).json({
          data: createdUserPostId,
          message: 'user post created'
        });
      } catch (err) {
        next(err);
      }
    }
  );


  router.delete(
    '/:userPostId',
    passport.authenticate('jwt', { session: false }),
    scopesValidationHandler(['delete:user-posts']),
    validationHandler({ userPostId: postIdSchema }, 'params'),
    async function(req, res, next) {
      const { userPostId } = req.params;

      try {
        const deletedUserPostId = await userPostsService.deleteUserPost({
          userPostId
        });

        res.status(200).json({
          data: deletedUserPostId,
          message: 'user post deleted'
        });
      } catch (error) {
        next(error);
      }
    }
  );
}

module.exports = userPostsApi;
