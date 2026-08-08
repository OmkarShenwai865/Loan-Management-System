const TOKEN_KEY = "llm_access_token";
const REFRESH_KEY = "llm_refresh_token";
const ROLE_KEY = "llm_role";
const USERNAME_KEY = "llm_username";

export function setSession({ access, refresh, role, username }) {
  localStorage.setItem(TOKEN_KEY, access);
  if (refresh) localStorage.setItem(REFRESH_KEY, refresh);
  if (role) localStorage.setItem(ROLE_KEY, role);
  if (username) localStorage.setItem(USERNAME_KEY, username);
}

export function getAccessToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getRefreshToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(REFRESH_KEY);
}

export function getRole() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ROLE_KEY);
}

export function getUsername() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(USERNAME_KEY);
}

export function isAuthenticated() {
  return !!getAccessToken();
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_KEY);
  localStorage.removeItem(ROLE_KEY);
  localStorage.removeItem(USERNAME_KEY);
}
