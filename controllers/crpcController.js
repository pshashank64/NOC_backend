const passport = require("passport");
const bcrypt = require('bcrypt');
const CRPC = require('../models/crpc');

module.exports.login = async (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
      if (err) {
          console.error(err); // Log the error for debugging
          return res.status(500).json({ error: 'Internal server error' });
      }
      if (!user) {
          console.error('Invalid credentials:', info); // Log the info for debugging
          return res.status(401).json({ message: 'Invalid credentials', error: info });
      }
      req.logIn(user, (err) => {
          if (err) {
              console.error(err); // Log the error for debugging
              return res.status(500).json({ error: 'Internal server error' });
          }
          const sessionData = {
            user: {
              email: req.user.email,
              name: req.user.name,
              role: req.user.role
            },
            sessionID: req.sessionID
          }
          return res.status(200).json({ message: 'Login successful', session: sessionData });
      });
  })(req, res, next);
}


module.exports.signup = async (req, res) => { 
    try {
        const crpc = await CRPC.findOne({ email: req.body.email });
        if(crpc){
            return res.status(409).json({message: "User already exists"});
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        const newUser = await CRPC.create({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
            role: req.body.role
        });

        return res.status(200).json({ user: newUser });
      } catch (err) {
        return res.status(500).json({ error: "Error in finding/creating the user!" });
    }
}