export type VerifyOtpResult =
  | {
      status: "login";
      accessToken: string;
      refreshToken: string;
    }
  | {
      status: "register";
      tempToken: string;
    };
