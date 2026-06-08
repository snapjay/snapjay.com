export const transformCdnUrl = (url) => {
  if (import.meta.env.PROD && url && url.startsWith('/photos/')) {
    return `https://cdn.snapjay.com/${url.slice(8)}`;
  }
  return url;
};
