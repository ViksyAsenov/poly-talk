interface GoogleLoginParams {
  client_id: string;
  response_type: 'code';
  scope: string;
  redirect_uri: string;
}

interface GoogleToken {
  access_token: string;
  expires_in: number;
  scope: string;
  token_type: number;
  id_token: string;
}

interface GoogleUser {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  locale: string;
}

export { GoogleLoginParams, GoogleToken, GoogleUser };
