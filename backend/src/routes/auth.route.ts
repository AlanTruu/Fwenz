import {Router} from 'express'
import { registerHandler } from '../controllers/auth.controller';
import { loginHandler, logoutHandler, refreshHandler, verifyEmailHandler, sendPasswordResetHandler, resetPasswordHandler } from '../controllers/auth.controller';
const authRoutes = Router();

//prefix : auth
authRoutes.post('/register', registerHandler)
authRoutes.post('/login', loginHandler)
authRoutes.get('/logout', logoutHandler)
authRoutes.get('/refresh', refreshHandler)
authRoutes.get('/email/verify/:code', verifyEmailHandler)
authRoutes.post('/password/forgot', sendPasswordResetHandler)
authRoutes.post('/password/reset', resetPasswordHandler)

export default authRoutes;