import { API_DOMAIN } from '../lib/constants/env.js';
const devStyleSrc = import.meta.env.PROD ? '' : "'unsafe-inline'";

const directives = {
    'img-src': [
        "*.openstreetmap.org",
        "'self'",
        "data:",
    ],
    'font-src': [
        "'self'",
        "data:",
    ],
    'style-src': [
        "'self'",
        devStyleSrc
    ],
    'connect-src': [
        API_DOMAIN,
        "'self'",
        "plausible.io",
        "*.openstreetmap.org",
        "*.sentry.io",
        "geocode-api.arcgis.com"
    ],
    'script-src': [
        "'self'",
        "'unsafe-inline'",
        "plausible.io"
        // (req, res) => `'nonce-${res.locals.nonce}'`,
    ],
    'frame-src': [
        "'none'"
    ],
    'default-src': [
        "'self'",
    ],
    'base-uri': [
        "'self'"
    ],
    'media-src': [
        "'self'"
    ]
};

let CSP = Object.entries(directives).map(([key, arr]) => key + ' ' + arr.join(' ')).join('; ');

export async function handle({ request, resolve }) {
    const response = await resolve(request);

    return {
        ...response,
        headers: {
            ...response.headers,
            'X-Frame-Options': 'SAMEORIGIN',
            'Referrer-Policy': 'strict-origin',
            'Feature-Policy': `microphone 'none'; geolocation 'none'`,
            'Permissions-Policy': `geolocation=(self "${API_DOMAIN}"), camera=(), fullscreen=*`,
            'X-Content-Type-Options': `nosniff`,
            'Content-Security-Policy': CSP
        }
    };
}
