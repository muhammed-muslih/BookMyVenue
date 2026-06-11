export const generateOTPTemplate = (otp: string): string => {
  return `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:24px">
      <h2>BookMyVenue</h2>

      <p>Your One-Time Password (OTP) is:</p>

      <div
        style="
          font-size:32px;
          font-weight:bold;
          letter-spacing:8px;
          margin:24px 0;
        "
      >
        ${otp}
      </div>

      <p>
        This OTP is valid for 5 minutes.
      </p>

      <p>
        Do not share this code with anyone.
      </p>
    </div>
  `;
};
