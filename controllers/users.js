const bcrypt = require('bcrypt');
const UserDbModel = require('../models/users');
const userModel = new UserDbModel();

class userController {
  async register(req, res) {
    try {
    const { username, password, email, role } = req.body;

    const newRole = (req.session.user?.role === 'admin' && role === 'admin') ? 'admin' : 'user';
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
      email: email.trim(),
      password: cryptedPassword,
      role: newRole
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
    } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Internal server error' });
    }
    }
    async login(req, res) {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: 'Kasutajanimi ja parool on nõutud' });
      }
      //leia kasutaja
        const user = await userModel.findByUsername(username.trim());
        if (!user) {
        return res.status(400).json({ message: 'Vale kasutajanimi või parool' });
        }
        //võrdle paroole
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
        return res.status(400).json({ message: 'Vale kasutajanimi või parool' });
        }
        //lisa sessiooni
   req.session.user = {
    username: user.username,
    user_id: user.id,
    role: user.role
  };

  
  return res.status(200).json({
    message: 'Sisselogimine õnnestus',
    user: {
      user_id: user.id,
      username: user.username,
      email: user.email,
      role: user.role
    }
  });
    }
}



module.exports = new userController();
