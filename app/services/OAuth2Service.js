import dotenv from "dotenv";
import { GoogleOAuth } from "@openauth/google";

dotenv.config();

const oauth = new GoogleOAuth({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  redirectUri: process.env.GOOGLE_REDIRECT_URI,
  scope: ["email", "profile", "openid"],
});

export const getUserProfile = async (accessToken) => {
  return await oauth.getAuthUser(accessToken);
};
