export const isLocalDevelopment: boolean =
  window.location.hostname === "localhost";
export const isProduction = window.location.hostname === "app.jobvia.app";

function getApiRootUrl(): string | undefined {
  const { port, origin } = window.location;

  if (isProduction) {
    return "https://app.jobvia.app";
  }
  if (isLocalDevelopment && port === "3000") {
    return "http://localhost:5000/api";
  }

  return origin;
}

export { getApiRootUrl };
