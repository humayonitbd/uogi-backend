import { Router } from 'express';
import { authControllers } from './auth.controller';
import auth from '../../middleware/auth';
import validateRequest from '../../middleware/validateRequest';
import { authValidation } from './auth.validation';
import { USER_ROLE } from '../user/user.constants';
import passport from 'passport';
import config from '../../config';
import { createToken } from '../../utils/tokenManage';
import { User } from '../user/user.models';
import { generateTokenByUser } from '../../utils/generateTokenByUser';

export const authRoutes = Router();

authRoutes
  .post('/login', authControllers.login)
  .post(
    '/refresh-token',
    validateRequest(authValidation.refreshTokenValidationSchema),
    authControllers.refreshToken,
  )
  .post(
    '/forgot-password-otp',
    validateRequest(authValidation.forgetPasswordValidationSchema),
    authControllers.forgotPassword,
  )
  .get('/seccess-login', authControllers.successLogin)
  .get(
    '/apple-login',
    (req: any, res: any, next: any) => {
      console.log('🚀 Initiating Apple Sign-In...');
      next();
    },
    passport.authenticate('apple', {
      scope: ['name', 'email'], // Apple theke name ar email request korchi
    }),
  )

  .post(
    '/apple/callback',
    (req: any, res: any, next: any) => {
      console.log('📨 Apple callback received');
      console.log('Request body:', req.body);
      next();
    },
    passport.authenticate('apple', { failureRedirect: '/login' }),
    async (req: any, res: any) => {
      console.log('✅ Authentication successful!');
      console.log('Authenticated user:', req.user);

      const { accessToken, refreshToken } = await generateTokenByUser(req.user);
      // console.log('result apple login-->', result);

      res.redirect(
        `/api/v1/auth/seccess-login?accessToken=${accessToken}&refreshToken=${refreshToken}`,
      );
    },
  )
  .patch(
    '/change-password',
    auth(
      USER_ROLE.BUSINESS,
      USER_ROLE.CUSTOMER,
      USER_ROLE.ADMIN,
      USER_ROLE.SUB_ADMIN,
      USER_ROLE.SUPER_ADMIN,
    ),
    authControllers.changePassword,
  )

  .patch(
    '/forgot-password-otp-match',
    validateRequest(authValidation.otpMatchValidationSchema),
    authControllers.forgotPasswordOtpMatch,
  )
  .patch(
    '/forgot-password-reset',
    validateRequest(authValidation.resetPasswordValidationSchema),
    authControllers.resetPassword,
  );
