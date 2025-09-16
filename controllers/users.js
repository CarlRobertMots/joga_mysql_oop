const bcrypt = require('bcrypt');
const userDbModel = require('../models/users');
const userModel = new userDbModel();

class userController {
    async register(req, res) {
        const cryptedPassword = await bcrypt.hash(req.body.password, 10);
        const registeredId = await userModel.create({
            username: req.body.username,
            email: req.body.email,
            password: cryptedPassword
        })
        if (registeredId) {
            const userData = await userModel.findById(registeredId);
            req.session.user ={
                username: userData.username,
                user_id: userData.id
            }
            res.json ({ 
                message: 'User registered successfully', 
                user: { user_id: registeredId, username: userData.username }
            })

        }
    }
}

module.exports = new userController();