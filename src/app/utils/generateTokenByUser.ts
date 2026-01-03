import config from "../config";
import { User } from "../modules/user/user.models";
import { createToken } from "./tokenManage";

export const generateTokenByUser = async(payload:any)=>{

    
   const user = await User.findOne({
     appleId: payload.appleId,
     isDeleted: false,
   });

   let accessToken;
   let refreshToken;

   if (user) {
     const jwtPayload: {
       userId: string;
       role: string;
       fullName: string;
       email: string;
     } = {
       fullName: user?.fullName || 'default name',
       email: user.email,
       userId: user?._id?.toString() as string,
       role: user?.role,
     };

     console.log({ jwtPayload });

     accessToken = createToken({
       payload: jwtPayload,
       access_secret: config.jwt_access_secret as string,
       expity_time: config.jwt_access_expires_in as string,
     });

     console.log({ accessToken });

     refreshToken = createToken({
       payload: jwtPayload,
       access_secret: config.jwt_refresh_secret as string,
       expity_time: config.jwt_refresh_expires_in as string,
     });
   }

   return {
     accessToken,
     refreshToken,
   };

}