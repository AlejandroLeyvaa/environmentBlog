const MongoLib = require('../lib/mongo');

class PostsService {
  constructor() {
    this.collection = 'posts';
    this.mongoDB = new MongoLib();
  };

  async getposts({ title }) {
    const query = title && { title: { $in: title } };
    const posts = await this.mongoDB.getAll(this.collection, query);
    return posts || [];
  };

  async createPost({ post }) {
    const createPostId = await this.mongoDB.create(this.collection, post);
    return createPostId;
  };
};

module.exports = PostsService;