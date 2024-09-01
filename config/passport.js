const localStrategy = require("passport-local").Strategy;
const Student = require('../models/student');
const CRPC = require("../models/crpc");
const Dean = require("../models/dean");
const HOD = require("../models/hod");
const bcrypt = require("bcrypt");


module.exports = (app, passport) => {
    let User;
  passport.use(new localStrategy(
    {
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    },(req, email, password, done) => {
        const {role} = req.body;
        
        switch (role) {
            case 'Student':
              User = Student;
              break;
            case 'HOD':
              User = HOD;
              break;
            case 'Dean':
              User = Dean;
              break;
            case 'CRPC':
                User = CRPC;
                break;
            default:
              return done(null, false, { message: 'Invalid role' });
          }
        User.findOne({ email: email })
            .then(user => {
                if (!user) {
                    return done(null, false, { message: 'Incorrect email' });
                }
            bcrypt.compare(password, user.password)
                .then(isPasswordMatch => {
                    if (isPasswordMatch) {
                        return done(null, user);
                    } else {
                        return done(null, false, { message: 'Incorrect password' });
                    }
                })
                .catch(err => {
                    return done(err);
                });
        })
        .catch(err => {
            return done(err);
        });
  }));

  passport.serializeUser((user, done) => {
    done(null, {id: user._id, role: user.role});
  })


  passport.deserializeUser(async (sessionData, done) => {
    const { id, role } = sessionData;
    let UserModel;

    switch (role) {
        case 'Student':
            UserModel = Student;
            break;
        case 'HOD':
            UserModel = HOD;
            break;
        case 'Dean':
            UserModel = Dean;
            break;
        case 'CRPC':
            UserModel = CRPC;
            break;
        default:
            return done(null, false); // Invalid role
    }

    try {
        const user = await UserModel.findById(id);
        if (!user) {
            return done(null, false);
        }
        done(null, user); // User found
    } catch (error) {
        done(error);
    }
});

  app.use(passport.initialize())
  app.use(passport.session())
}