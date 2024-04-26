const Student = require('../models/student');
const passport = require("passport");
const bcrypt = require('bcrypt');

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
              role: req.user.role,
              roll: req.user.roll,
              id: req.user._id
            },
            sessionID: req.sessionID
          }
          return res.status(200).json({ message: 'Login successful', session: sessionData });
      });
  })(req, res, next);
}


module.exports.signup = async (req, res) => { 
    try {
        const student = await Student.findOne({ email: req.body.email });
        if(student){
            return res.status(409).json({message: "Student already exists"});
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        // console.log(req.body);
        const newUser = await Student.create({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
            roll: req.body.roll,
            role: req.body.role
        });

        // console.log(newUser);

        return res.status(200).json({ user: newUser });
      } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Error in finding/creating the student!: "});
    }
}


module.exports.logout = async (req, res, next) => {
    console.log(res);
    await req.logout(function(err) {
        if (err) {
            return res.status(500).json({ error: 'Logout failed' });
        }
        req.session = null;
        res.clearCookie('connect.sid');
        return res.status(200).json({"message": "Logout done!"});
    });
};



module.exports.getUser = async (req, res) => {
    try {
        // console.log(req.query.id);
        const student = await Student.findById(req.query.id);
        if(!student){
            return res.status(401).json({error: "Student not found!"});
        }
        return res.status(200).json(student);
    } catch (error) {
        console.log(error);
        return res.status(500).json({"error": error});
    }
}

module.exports.getAllStudents = async (req, res) => {
    try {
        let students = {};
        students = await Student.find();
        if(!students){
            return res.status(401).json({error: "No Student Found"});
        }
        // console.log(students)
        return res.status(200).json(students);
    } catch (error) {
        console.log(error);
        return res.status(500).json({"message": "Unable to fetch Students"})
    }
}