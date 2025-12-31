import twilio from 'twilio';
import config from '../config';

const twilioClient = twilio(
  config.twilio_info.twilio_account_sid,
  config.twilio_info.twilio_auth_token,
);


export default twilioClient;

