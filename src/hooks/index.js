// import { API_DOMAIN } from '../configs/env.js';
//
// const directives = {
//     'base-uri': [
//         "'self'"
//     ],
//     'connect-src': [
//         API_DOMAIN,
//         "'self'",
//         "plausible.io",
//         "*.openstreetmap.org",
//         "*.sentry.io",
//         "geocode-api.arcgis.com"
//     ],
//     'default-src': [
//         "'self'",
//     ],
//     'font-src': [
//         "'self'",
//         "data:",
//     ],
//     'frame-src': [
//         "'none'"
//     ],
//     'img-src': [
//         "*.openstreetmap.org",
//         "'self'",
//         "data:",
//     ],
//     'media-src': [
//         "'self'"
//     ],
//     'script-src': [
//         "'self'",
//         "'unsafe-inline'",
//         "plausible.io"
//         // (req, res) => `'nonce-${res.locals.nonce}'`,
//     ],
//     'style-src': [
//         "'self'",
//         "'unsafe-inline'"
//     ],
// };
//
// let CSP = Object.entries(directives).map(([key, arr]) => key + ' ' + arr.join(' ')).join('; ');
//
// export async function handle({ request, resolve }) {
//     const response = await resolve(request);
//
//     return {
//         ...response,
//         headers: {
//             ...response.headers,
//             'X-Frame-Options': 'SAMEORIGIN',
//             'Referrer-Policy': 'strict-origin',
//             'Feature-Policy': `microphone 'none'; geolocation 'none'`,
//             'Permissions-Policy': `geolocation=(self "${API_DOMAIN}"), camera=(), fullscreen=*`,
//             'X-Content-Type-Options': `nosniff`,
//             'Content-Security-Policy': CSP
//         }
//     };
// }
