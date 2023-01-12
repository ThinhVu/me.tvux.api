import {Router} from 'express';
import {
   AuthController,
   PostController,
   UserController,
   CategoryController,
} from './controllers';
import {checkIfAdmin, checkIfUser} from './utils/protectedRoute';
import rateLimit from "express-rate-limit";
// @ts-ignore
import packageJson from '../package.json';

const router = Router();
router.get('/', async (req, res) => res.send(`Api version: ${packageJson.version}`));

/**
 * Authentication
 */
router.get('/can-use-email', rateLimit({windowMs: 15 * 60 * 1000, max: 50, standardHeaders: true, legacyHeaders: false}), AuthController.canUseEmail);
router.post('/signup', rateLimit({windowMs: 15 * 60 * 1000, max: 50, standardHeaders: true, legacyHeaders: false}), AuthController.signUp);
router.post('/login', rateLimit({windowMs: 15 * 60 * 1000, max: 50, standardHeaders: true, legacyHeaders: false}), AuthController.login);
router.get('/auth-user', rateLimit({windowMs: 15 * 60 * 1000, max: 50, standardHeaders: true, legacyHeaders: false}), AuthController.auth);
router.post('/logout', rateLimit({windowMs: 15 * 60 * 1000, max: 50, standardHeaders: true, legacyHeaders: false}), AuthController.logout);
router.post('/change-password', rateLimit({windowMs: 15 * 60 * 1000, max: 50, standardHeaders: true, legacyHeaders: false }), AuthController.changePassword);
router.post('/forgot-password', rateLimit({windowMs: 15 * 60 * 1000, max: 50, standardHeaders: true, legacyHeaders: false }), AuthController.forgotPassword);
router.post('/reset-password', rateLimit({windowMs: 15 * 60 * 1000, max: 50, standardHeaders: true, legacyHeaders: false}), AuthController.resetPassword);

/** Users */
router.get('/users', checkIfAdmin, UserController.getAll);
router.get('/users/about/:id', checkIfUser, UserController.user);
router.put('/users/update-profile', checkIfUser, UserController.updateProfile);

/** Category */
router.get('/category/:id', CategoryController.getCategories);
router.post('/category', checkIfAdmin, CategoryController.create);
router.put('/category/:id', checkIfAdmin, CategoryController.update);
router.delete('/category/:id', checkIfAdmin, CategoryController.remove);

/** Post */
router.get('/posts', PostController.getPosts);
router.get('/post/:id', PostController.getPost);
router.post('/post', checkIfUser, PostController.create);
router.delete('/post/:id', checkIfUser, PostController.remove);
router.put('/post/:id', checkIfUser, PostController.update);
router.put('/post/react/:id', checkIfUser, PostController.react);
router.put('/post/un-react/:id', checkIfUser, PostController.unReact);
router.get('/comments/:id', PostController.getComments);

export default router;
