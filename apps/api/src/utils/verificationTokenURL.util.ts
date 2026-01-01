export const VerificationTokenURL = (
  domain: string,
  route: string,
  query: string,
) => `https://${domain}/${route}?${query}`;
