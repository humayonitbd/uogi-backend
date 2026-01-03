
import twilio from 'twilio';
import config from '../config/index';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import AppError from '../error/AppError';

export const formatPhoneNumber = (number: string): string => {
  const phoneNumber = parsePhoneNumberFromString(number);

  if (!phoneNumber || !phoneNumber.isValid()) {
    throw new Error('Invalid phone number. Please enter a valid number.');
  }

  return phoneNumber.format('E.164');
};



const twilioClient = twilio(
  config.twilio_info.twilio_account_sid,
  config.twilio_info.twilio_auth_token,
);
const twilioServiceSid = config.twilio_info.twilio_service_sid as string;

export const sendTwilioOTP = async (mobileNumber: string): Promise<string> => {
  try {
    const formattedNumber = formatPhoneNumber(mobileNumber);
    console.log(`📱 Sending OTP to: ${formattedNumber}`);

    const verification = await twilioClient.verify.v2
      .services(twilioServiceSid)
      .verifications.create({
        to: formattedNumber,
        channel: 'whatsapp',
      });

    console.log(`✅ OTP sent successfully, SID: ${verification.sid}`);
    return verification.sid;
  } catch (error: any) {
    console.error(`❌ Failed to send OTP:`, error);
    throw new AppError(
      403,
      `Failed to send OTP: ${error.message}`,
    );
  }
};

export const verifyTwilioOTP = async (
  mobileNumber: string,
  otpCode: string,
): Promise<boolean> => {
  try {
    const formattedNumber = formatPhoneNumber(mobileNumber);
    console.log(`🔍 Verifying OTP for: ${formattedNumber}, Code: ${otpCode}`);

    const verificationCheck = await twilioClient.verify.v2
      .services(twilioServiceSid)
      .verificationChecks.create({
        to: formattedNumber,
        code: otpCode,
      });

    console.log(`📊 Verification status: ${verificationCheck.status}`);
    return verificationCheck.status === 'approved';
  } catch (error: any) {
    console.error(`❌ OTP verification failed:`, error);

    if (error.code === 20404) {
      throw new AppError(
        403,
        'OTP has expired or is invalid',
      );
    }
    if (error.code === 60200) {
      throw new AppError(403, 'Invalid verification code');
    }

    throw new AppError(403, 'Failed to verify OTP');
  }
};

const sendSMS = async (to: string, message: string) => {
  console.log({ to, message });
  // const formattedNumber = formatPhoneNumber(to);
  const formattedNumber = formatPhoneNumber(to);
  try {
    const twilioSendSmsResult = await twilioClient.messages.create({
      body: message,
      messagingServiceSid: twilioServiceSid,
      to: formattedNumber,
    });
    console.log('🚀 ~ sendSMS ~ twilioSendSmsResult:', twilioSendSmsResult);

    // wait a bit, then check delivery
    setTimeout(async () => {
      const msg = await twilioClient.messages(twilioSendSmsResult.sid).fetch();
      console.log('Delivery status:', msg.status);
      console.log('Error:', msg.errorCode, msg.errorMessage);
    }, 5000);

    return {
      invalid: false,
      message: `Message sent successfully to ${formattedNumber}`,
    };
  } catch (error) {
    console.log('🚀 ~ sendSMS ~ error:', error);
    throw new AppError(500, 'Failed to send sms');
  }
};

export default sendSMS;
