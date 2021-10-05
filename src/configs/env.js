export const APP_VERSION = import.meta.env.VITE_APP_VERSION;
export const API_URL = import.meta.env.PROD ? 'https://measureland.xyz/api' : 'http://localhost:3000/api';
export const API_DOMAIN = import.meta.env.PROD ? 'https://measureland.xyz' : 'http://localhost:3000';
export const WEB_DOMAIN = import.meta.env.PROD ? 'https://measureland.org' : 'http://localhost:8080';
