export const MaskEmail = (email: string) => {
  const [localPart, domain] = email.split("@");
  const masked = localPart.substring(0, 3) + "*".repeat(localPart.length - 3);
  return `${masked}@${domain}`;
};
