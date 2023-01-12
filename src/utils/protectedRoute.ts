import {NextFunction, Request, Response} from 'express';
import passport from 'passport';
import {UserRole} from '../constants/types';

export const checkIfUser = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return res.status(401).json({error: 'Not authorized.' });
    }

    req.user = user;
    return next();
  })(req, res, next);
};

export const checkIfAdmin = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return res.status(401).json({ reason: 'Not authorized.' });
    }

    const isAdmin = user.role === UserRole.Admin;

    if (!isAdmin) {
      return res.status(401).json({ error: 'Not authorized.' });
    }

    req.user = user;
    return next();
  })(req, res, next);
};
