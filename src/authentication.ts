import passport from 'passport';
import {Strategy as JwtStrategy, ExtractJwt} from 'passport-jwt';

export const initPassport = (): void => {
  // https://www.passportjs.org/packages/passport-jwt/
  passport.use(
    'jwt',
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.SECRET,
      },
      async (decoded, done) => {
         done(null, decoded.user)
      }
    )
  );
};
