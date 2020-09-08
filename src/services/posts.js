const MongoLib = require('../lib/mongo');

class PostsService {
  constructor() {
    this.collection = 'posts';
    this.mongoDB = new MongoLib();
  }

  async getPosts({ tags }) {
    const query = tags && { tags: { $in: tags } };
    const posts = await this.mongoDB.getAll(this.collection, query);
    return posts || [];
  }

  async getPost({ postId }) {
    const post = await this.mongoDB.get(this.collection, postId);
    return post || {};
  }

  async createPost({ post }) {
    const createPostId = await this.mongoDB.create(this.collection, post);
    return createPostId;
  }

  async updatePost({ postId, post } = {}) {
    const updatedPostId = await this.mongoDB.update(
      this.collection,
      postId,
      post
    );
    return updatedPostId;
  }

  async deletePost({ postId }) {
    const deletedPostId = await this.mongoDB.delete(this.collection, postId);
    return deletedPostId;
  }
}

module.exports = PostsService;
