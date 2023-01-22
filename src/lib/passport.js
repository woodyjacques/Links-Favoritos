
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const pool = require('../database');
const helpers = require('../lib/helpers');

passport.use('local.signin', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done) =>{
    const rows = await pool.query('Select * from users where username = ?', [username]);
    if(rows.length > 0){
    const user = rows[0];
    const validPassword = await helpers.matchPassword(password, user. password);
        if(validPassword){
        done(null, user, req.flash('success','Bienvenido jediondo' + user.username));
        }
        else{
            done(null, false, req.flash('message','Contraseña incorrecta'));
        }
    }
    else{
        return done(null, false, req.flash('message','Este usuario no existe'));
    }
}));

passport.use('local.signup', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done) =>{
    const { fullname } = req.body;
    const newUser = {
        username,
        password,
        fullname
    };
    newUser.password = await helpers.encryptPassword(password);
    const result = await pool.query('Insert into users set ?', [newUser]);
    newUser.id = result.insertId;
    return done(null, newUser);
}));

passport.serializeUser((user, done) =>{
    done(null, user.id);
});

passport.deserializeUser(async (id, done) =>{
    const rows = await pool.query('Select * from users where id = ?', [id]);
    done(null, rows[0]);
});