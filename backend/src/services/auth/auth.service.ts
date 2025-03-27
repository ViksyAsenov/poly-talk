import axios from "axios";

import { encodeQueryObject } from "src/utils/encodeQueryObject";
import config from "@config/env";

import { GoogleLoginParams, GoogleUser } from "@services/auth/types";
import { validateGoogleTokenReturn } from "@services/auth/utils";
import { AppError } from "@common/error/appError";
import { GenericErrors } from "@common/constants/error";
import { getOrCreateUserWithGoogle } from "@services/user";

function getGoogleLoginUrl() {
  const params: GoogleLoginParams = {
    response_type: "code",
    redirect_uri: config.google.redirectUrl,
    client_id: config.google.clientId,
    scope: ["https://www.googleapis.com/auth/userinfo.email", "https://www.googleapis.com/auth/userinfo.profile"].join(
      " ",
    ),
  };

  return `https://accounts.google.com/o/oauth2/v2/auth?${encodeQueryObject(params)}`;
}

async function validateAndGetUser(code: string) {
  const tokenBody = {
    code,
    client_id: config.google.clientId,
    client_secret: config.google.secret,
    redirect_uri: config.google.redirectUrl,
    grant_type: "authorization_code",
  };

  const tokenConfig = {
    headers: {
      "Accept-Language": "en",
      "Content-Type": "application/x-www-form-urlencoded",
    },
  };

  const tokenResponse = await axios.post("https://oauth2.googleapis.com/token", tokenBody, tokenConfig);

  if (!validateGoogleTokenReturn(tokenResponse.data)) {
    throw new AppError(GenericErrors.UNEXPECTED_ERROR);
  }

  const authenticationQuery = {
    alt: "json",
    access_token: tokenResponse.data.access_token,
  };

  const authenticationConfig = {
    headers: {
      Authorization: `Bearer ${tokenResponse.data.id_token}`,
    },
  };

  const authenticationResponse = await axios.get<GoogleUser>(
    `https://www.googleapis.com/oauth2/v1/userinfo?${encodeQueryObject(authenticationQuery)}`,
    authenticationConfig,
  );

  const user = await getOrCreateUserWithGoogle(authenticationResponse.data);

  return user;
}

export { getGoogleLoginUrl, validateAndGetUser };
