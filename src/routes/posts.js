const express = require("express");
const PostsService = require("../services/posts");

const {
  postIdSchema,
  createPostSchema,
  updatePostSchema,
} = require("../utils/schemas/posts");

const validationHandler = require("../utils/middleware/validationHandler");

const postsApi = (app) => {
  const router = express.Router();
  app.use("/api/posts", router);

  const postsService = new PostsService();

  router.get("/", async (req, res, next) => {
    const { tags } = req.query;

    try {
      const posts = await postsService.getPosts({ tags });

      res.status(200).json({
        data: posts,
        message: "posts listed",
      });
    } catch (err) {
      next(err);
    }
  });

  router.get(
    "/:postId",
    validationHandler({ postId: postIdSchema }, "params"),
    async (req, res, next) => {
      const { postId } = req.params;

      try {
        const posts = await postsService.getPost({ postId });

        res.status(200).json({
          data: posts,
          message: "post retrieved",
        });
      } catch (err) {
        next(err);
      }
    }
  );

  router.post(
    "/",
    validationHandler(createPostSchema),
    async (req, res, next) => {
      const { body: post } = req;

      try {
        const createdPost = await postsService.createPost({ post });

        res.status(201).json({
          data: createdPost,
          message: "post created",
        });
      } catch (err) {
        next(err);
      }
    }
  );

  router.put(
    "/:postId",
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
          message: "post updated",
        });
      } catch (err) {
        next(err);
      }
    }
  );

  router.delete(
    "/:postId",
    validationHandler({ postId: postIdSchema }, "params"),
    async (req, res, next) => {
      const { postId } = req.params;

      try {
        const deletePostId = await postsService.deletePost({ postId });

        res.status(200).json({
          data: deletePostId,
          message: "post deleted",
        });
      } catch (err) {
        next(err);
      }
    }
  );
};

module.exports = postsApi;
