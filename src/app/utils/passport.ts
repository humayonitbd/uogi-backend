// import passport from 'passport';
// // import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
// // import { authServices } from '../modules/auth/auth.service';
// // import { Strategy as FacebookStrategy } from 'passport-facebook';
// // import app from '../../app';
// // import AppError from '../error/AppError';
// import AppleStrategy from 'passport-apple';
// import config from '../config';

// // // // Google OAuth Strategy
// // passport.use(
// //   new GoogleStrategy(
// //     {
// //       clientID: config.social.google_client_id as string,
// //       clientSecret: config.social.google_client_secret as string,
// //       callbackURL: 'http://localhost:1000/api/v1/auth/google/callback',
// //     },
// //     async (accessToken, refreshToken, profile, done): Promise<void> => {
// //       try {
// //         // done(null, profile);
// //         console.log('profile=', profile);
// //         const data = {
// //           fullName: profile.displayName,
// //           email: profile.emails?.[0]?.value,
// //           password: 'googlelogin',
// //         };
// //         // console.log('google login info', data);
// //         const result = await authServices.googleLoginService(data);
// //         // console.log('result google login-->', result);
// //         if (result.user.email) {
// //           done(null, result.user);
// //         }
// //       } catch (error) {
// //         console.log('google login error', error);
// //         done(error, undefined);
// //       }
// //     },
// //   ),
// // );

// // apple login

// // Validate config before using it
// const appleConfig = config.appleLogin_info;

// if (
//   !appleConfig.apple_client_id ||
//   !appleConfig.apple_team_id ||
//   !appleConfig.apple_key_id ||
//   !appleConfig.apple_callback_url
// ) {
//   throw new Error('Apple login configuration is incomplete');
// }

// passport.use(
//   new AppleStrategy(
//     {
//       clientID: appleConfig.apple_client_id,
//       teamID: appleConfig.apple_team_id,
//       keyID: appleConfig.apple_key_id,
//       callbackURL: appleConfig.apple_callback_url,
//       privateKeyString: appleConfig.apple_private_key,
//       passReqToCallback: true,
//     },
//     async (
//       req: any,
//       accessToken: string,
//       refreshToken: string,
//       idToken: string,
//       profile: any,
//       done: any,
//     ) => {
//       try {
//         console.log('profile=', profile);
//         console.log('email=', profile.email);
//         console.log('profile.id=', profile.id);

//         return done(null, {
//           appleId: profile.id,
//           email: profile.email || null,
//         });
//       } catch (err) {
//         return done(err);
//       }
//     },
//   ),
// );

// // // Facebook OAuth Strategy
// // passport.use(
// //   new FacebookStrategy(
// //     {
// //       clientID: config.social.facebook_client_id as string,
// //       clientSecret: config.social.facebook_client_secret as string,
// //       callbackURL: 'http://localhost:8025/api/v1/auth/facebook/callback',
// //       profileFields: ['id', 'displayName', 'emails'],
// //     },
// //     async (accessToken, refreshToken, profile, done) => {
// //       try {
// //         console.log('facebook login profile', profile);
// //         console.log('profile=', profile);
// //         const data = {
// //           fullName: profile.displayName,
// //           email: profile.emails?.[0]?.value,
// //           password: 'facebooklogin',
// //           appId: profile.id
// //         };
// //         console.log('facebook login info', data);
// //         const result = await authServices.facebookLoginService(data);
// //         // console.log('result google login-->', result);
// //         if (result.user.email) {
// //           done(null, result.user);
// //         }

// //       } catch (error) {
// //         console.log('facebook login error:',error);
// //         // throw new AppError(500, 'Internal Server Error');
// //         done(error, null);
// //       }
// //     },
// //   ),
// // );

// // Serialize & Deserialize User
// passport.serializeUser((user: any, done: any) => {
//   done(null, user.id);
// });

// passport.deserializeUser(async (id: any, done: any) => {
//   try {
//     // const user = await User.findById(id);
//     done(null, id as any);
//   } catch (error) {
//     done(error, null);
//   }
// });

// export default passport;

import passport from 'passport';
import { Strategy as AppleStrategy } from 'passport-apple';
import config from '../config';
import jwt from 'jsonwebtoken';
import { authServices } from '../modules/auth/auth.service';


// const appleStrategy = new AppleStrategy(
//   {
//     clientID: config.appleLogin_info.apple_client_id as string,
//     teamID: config.appleLogin_info.apple_team_id as string,
//     keyID: config.appleLogin_info.apple_key_id as string,
//     callbackURL: config.appleLogin_info.apple_callback_url as string,
//     // privateKeyString: config.appleLogin_info.apple_private_key as string,
//     privateKeyLocation: config.appleLogin_info.apple_private_key_path as string,
//     passReqToCallback: true,
//   },
//   async (
//     req: any,
//     accessToken: string,
//     refreshToken: string,
//     idToken: any,
//     profile: any,
//     cb: any,
//   ) => {
//     try {

//        const decoded = jwt.decode(idToken) as {
//          sub: string;
//          email?: string;
//          email_verified?: boolean;
//        };

//       console.log('decoded******',decoded);
//       console.log('profile******', profile);

//       const userData = {
//         appleId: decoded.sub,
//         email: decoded.email || null,
//       };

//       // await


//       return cb(null, userData);

//       //  console.log('req.body===', req.body);

//       // // User data extract করুন
//       // const appleId = profile.id;
//       // const email = profile.email || null;

//       // // Name শুধু প্রথমবার পাবেন
//       // let firstName = profile.name?.firstName;
//       // let lastName = profile.name?.lastName;

//       // // Request body থেকেও try করুন
//       // if (req.body?.user) {
//       //   try {
//       //     const userData = JSON.parse(req.body.user);
//       //     firstName = userData.name?.firstName || firstName;
//       //     lastName = userData.name?.lastName || lastName;
//       //     console.log('📧 User data from body:', userData);
//       //   } catch (e) {
//       //     console.log('⚠️ Could not parse user data');
//       //   }
//       // }

//       // const user = {
//       //   appleId,
//       //   email,
//       //   firstName,
//       //   lastName,
//       //   provider: 'apple',
//       // };

//       // console.log('✅ User authenticated:', user);

//       // এখানে database এ save করতে পারেন
//       // const dbUser = await findOrCreateUser(user);
//       // return done(null, dbUser);

//     } catch (error) {
//       console.error('❌ Apple auth error:', error);
//       return cb(error, null);
//     }
//   },
// );

passport.use(new AppleStrategy(
  {
    clientID: config.appleLogin_info.apple_client_id as string,
    teamID: config.appleLogin_info.apple_team_id as string,
    keyID: config.appleLogin_info.apple_key_id as string,
    callbackURL: config.appleLogin_info.apple_callback_url as string,
    privateKeyLocation: config.appleLogin_info.apple_private_key_path as string,
    passReqToCallback: true,
  },
  async (
    req: any,
    accessToken: string,
    refreshToken: string,
    idToken: any,
    profile: any,
    cb: any,
  ) => {
    try {

       const decoded = jwt.decode(idToken) as {
         sub: string;
         email?: string;
         email_verified?: boolean;
       };

      console.log('decoded******',decoded);
      console.log('profile******', profile);

      const user = {
        appleId: decoded.sub,
        email: decoded.email || null,
        fullName: profile.name || 'N/A',
        role: 'customer',
        asRole: 'customer',
      };

         const result:any = await authServices.appleLogin(user);


          if (result) {
          cb(null, result);
        }
      

    } catch (error) {
      console.error('❌ Apple auth error:', error);
      return cb(error, null);
    }
  },
))

// Strategy register করুন - এটা খুবই IMPORTANT
// passport.use('apple', appleStrategy);



// Serialize/Deserialize
passport.serializeUser((user: any, done) => {
  console.log('serializeUser user', user);
  done(null, user);
});

passport.deserializeUser(async (id: any, done: any) => {
  try {
    // const user = await User.findById(id);
    done(null, id as any);
  } catch (error) {
    done(error, null);
  }
});

export default passport;
