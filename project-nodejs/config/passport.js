const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/User');
const Admin = require('../models/Admin');

// Local Strategy cho login
passport.use(new LocalStrategy(
  {
    usernameField: 'email', 
    passwordField: 'password'
  },
  async (email, password, done) => {
    try {
      // Tìm user theo email
      const user = await User.findOne({ email: email.toLowerCase() });
      
      if (!user) {
        return done(null, false, { message: 'Email không tồn tại' });
      }

      if (!user.isActive) {
        return done(null, false, { message: 'Tài khoản đã bị vô hiệu hóa' });
      }

      const isMatch = await user.comparePassword(password);
      
      if (!isMatch) {
        return done(null, false, { message: 'Mật khẩu không đúng' });
      }

      user.lastLogin = new Date();
      await user.save();

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
));

passport.use('jwt', new JwtStrategy(
  {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_ACCESS_SECRET,
    ignoreExpiration: false
  },
  async (payload, done) => {
    try {
      // Tìm trong User trước
      let user = await User.findById(payload.id);
      
      // If not found in User, search in Admin
      if (!user) {
        user = await Admin.findById(payload.id).select('-password -refreshTokens').populate('role');
      }

      if (!user) {
        return done(null, false);
      }

      if (!user.isActive) {
        return done(null, false);
      }

      // Add role from payload to user object
      user.role = payload.role;

      return done(null, user);
    } catch (error) {
      return done(error, false);
    }
  }
));

passport.use('jwt-refresh', new JwtStrategy(
  {
    jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
    secretOrKey: process.env.JWT_REFRESH_SECRET,
    ignoreExpiration: false
  },
  async (payload, done) => {
    try {
      const user = await User.findByRefreshToken(payload.token);
      
      if (!user) {
        return done(null, false);
      }

      if (!user.isActive) {
        return done(null, false);
      }

      return done(null, user);
    } catch (error) {
      return done(error, false);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;