const bcrypt = require('bcrypt');
const UserDbModel = require('../models/users');
const userModel = new UserDbModel();

class userController {
  async register(req, res) {
    const { username, password } = req.body;

    // username olemas
    if (!username || username.trim().length === 0) {
      return res.status(400).json({ message: 'Kasutajanimi on nõutud' });
    }

    // password olemas
    if (!password) {
      return res.status(400).json({ message: 'Parool on nõutud' });
    }
    if (!req.body.email || req.body.email.trim().length === 0) {
        return res.status(400).json({ message: 'Email is required' });
    }
    // parooli pikkus
    const MIN_PASSWORD_LENGTH = 8;
    if (password.length < MIN_PASSWORD_LENGTH) {
      return res.status(400).json({
        message: `Parool peab olema vähemalt ${MIN_PASSWORD_LENGTH} tähemärki`
      });
    }

    // parooli keerukus
    if (!/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
      return res.status(400).json({
        message: 'Parool peab sisaldama vähemalt ühte suurt tähte ja ühte numbrit'
      });
    }

    // kas kasutajanimi juba olemas
    const existingUser = await userModel.findByUsername(username.trim());
    if (existingUser) {
      return res.status(400).json({ message: 'Kasutajanimi on juba kasutusel' });
    }

    // Kui kõik kontrollid ok, loo kasutaja
    const cryptedPassword = await bcrypt.hash(password, 10);
    const registeredId = await userModel.create({
      username: username.trim(),
      email: req.body.email,
      password: cryptedPassword
    });

    if (registeredId) {
      const userData = await userModel.findById(registeredId);
      req.session.user = {
        username: userData.username,
        user_id: userData.id
      };
      return res.status(201).json({
        message: 'User registered successfully',
        user: { user_id: registeredId, username: userData.username }
      });
    }

    res.status(500).json({ message: 'Registreerimine ebaõnnestus' });
  }
}

module.exports = new userController();
