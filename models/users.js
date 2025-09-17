const BaseSQLModel = require('./base');

class UserModel extends BaseSQLModel {
    constructor() {
        super('users');
    }

    async create(user) {
    const createdUserId = await super.create({
      username: user.username,
      email: user.email,
      password: user.password,
      role: user.role || 'user' // default role is 'user'
    });
    return createdUserId;
  }

    async findById(id) {
    const user = await super.findById(id);
    return user;
    }
    async findByUsername(username) {
    return await this.findOne('username', username);
  }
  
}
module.exports = UserModel;