export const verificationTokenURL = (
  domain: string,
  route: string,
  query: string,
) => `https://${domain}/${route}?${query}`;
