export const VerificationTokenURL = (
  domain: string,
  route: string,
  token: string,
  to: string
) =>
  `https://${domain}/auth/${route}?token=${token}&email=${encodeURIComponent(
    to
  )}`;
