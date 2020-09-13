const MongoLib = require('../lib/mongo');

class UserPostsService {
  constructor() {
    this.collection = 'user-posts';
    this.mongoDB = new MongoLib();
  }

  async getUserPosts({ userId }) {
    const query = userId && { userId };
    const userPosts = await this.mongoDB.getAll(this.collection, query);

    return userPosts;
  }

  async createUserPost({ userPost }) {
    const createdUserPostId = await this.mongoDB.create(
      this.collection,
      userPost
    );

    return createdUserPostId;
  }

  async deleteUserPost({ userPostId }) {
    const deletedUserPostId = await this.mongoDB.delete(
      this.collection,
      userPostId
    );

    return deletedUserPostId;
  }
}

module.exports = UserPostsService;