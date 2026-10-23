// Expo Go uses /--/ to separate the development-server URL from app routes.
// Normalize that prefix before Expo Router tries to match a screen.
export function redirectSystemPath({ path }) {
  if (typeof path !== 'string') {
    return '/';
  }

  // Handle a full Expo Go deep link, including the startup root URL.
  const expoGoPrefix = /^exps?:\/\/[^/]+\/--(?=\/|$)/i;
  if (expoGoPrefix.test(path)) {
    return path.replace(expoGoPrefix, '') || '/';
  }

  // Handle the same separator if it is already a relative path.
  const relativePrefix = /^\/--(?=\/|$)/;
  if (relativePrefix.test(path)) {
    return path.replace(relativePrefix, '') || '/';
  }

  // An Expo Go server URL without an explicit screen opens Login.
  if (/^exps?:\/\/[^/]+\/?$/.test(path)) {
    return '/';
  }

  // Preserve valid links to /register, /home and other existing screens.
  return path;
}
