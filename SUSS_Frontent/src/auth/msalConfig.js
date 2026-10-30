import { PublicClientApplication } from "@azure/msal-browser";

export const msalConfig = {
  auth: {
    clientId: import.meta.env.VITE_ENTRA_CLIENT_ID,
    authority: `https://login.microsoftonline.com/${import.meta.env.VITE_ENTRA_TENANT_ID}/v2.0`,
    redirectUri: window.location.origin,
  },
  cache: {
    cacheLocation: "sessionStorage",
  },
};

export const apiScope = `api://${import.meta.env.VITE_API_ENTRA_ID}/access_as_user`;

export const loginRequest = {
  scopes: [apiScope],
};

export const msalInstance =
  new PublicClientApplication(msalConfig);