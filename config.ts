export const isLocalDevelopment: boolean =
  typeof window !== "undefined" && window.location.hostname === "localhost";
export const isProduction =
  typeof window !== "undefined" &&
  window.location.hostname === "jobvia.vercel.app";

function getApiRootUrl(): string | undefined {
  if (typeof window === "undefined") {
    return;
  }
  const { port, origin } = window.location;

  if (isProduction) {
    return "https://jobfeed-server.onrender.com/api";
  }
  if (isLocalDevelopment && port === "3000") {
    return "http://localhost:5000/api";
  }
  if (isLocalDevelopment && port === "3005") {
    return "http://localhost:5001/api";
  }

  return origin;
}

export { getApiRootUrl };
