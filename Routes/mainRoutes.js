import express from "express";
import routes from '../RoutesHandler/mainRoutesHandler.js';
import jwtAuth from '../middlewares/jwtAuthentication.js';
const router = express.Router();
router.get('/',jwtAuth,routes.home);
router.get('/login',routes.getLogin).post('/login',routes.postLogin);
router.get('/signup',routes.getSignup).post('/signup',routes.postSignup);
router.get('/users',routes.getUsers);
export default router;
