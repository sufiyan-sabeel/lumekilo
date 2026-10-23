import type { AuthConfig } from 'convex/server';

const issuer = process.env.CLERK_JWT_ISSUER_DOMAIN!;

/**
 * Two ways for the app to authenticate, so it works whether or not the
 * Clerk → Convex integration has been enabled on the Clerk instance:
 *
 * 1. The integration's `convex` JWT template, whose `aud` claim is `convex`.
 * 2. A plain Clerk session token, which carries no `aud` claim. Clerk signs
 *    session tokens with RS256 and publishes a JWKS, so it can be verified as
 *    a custom JWT. `applicationID` is deliberately omitted, which means the
 *    `aud` claim is not checked.
 *
 * Omitting `applicationID` is weaker than checking the audience — it accepts
 * any JWT from this issuer. Prefer enabling the Clerk → Convex integration and
 * deleting the second provider once the client uses the template exclusively.
 */
export default {
  providers: [
    { domain: issuer, applicationID: 'convex' },
    {
      type: 'customJwt',
      issuer,
      jwks: `${issuer}/.well-known/jwks.json`,
      algorithm: 'RS256',
    },
  ],
} satisfies AuthConfig;
