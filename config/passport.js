const passport = require("passport");
const passportJWT = require("passport-jwt");
const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;

const User = require("../models/user");

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: "some_secret"
};

const jwtStrategy = new JwtStrategy(jwtOptions, async (jwt_payload, done) => {
  const user = await User.findOne({ _id: jwt_payload.id });
  console.log('in passport',user);
  if (user) {
    console.log('done passport');
    done(null, user);
  } else {
    done(null, false);
  }
});

passport.use(jwtStrategy);

module.exports = {
  passport,
  jwtOptions
};
