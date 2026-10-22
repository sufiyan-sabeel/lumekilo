# Authentication

The welcome screen offers two ways in: **Continue with Google** (Clerk OAuth) and **Continue with email** (email + password sign-in / sign-up). Existing users sign in; new users create an account from the same sheet.

## Local development

1. Link this project to the LumeKilo Clerk app with `clerk init --app app_3J8A3Uze0XYTldcgAmx4FbqlQ7L`.
2. Set `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` in `.env` (the CLI writes it). Never prefix a secret key with `EXPO_PUBLIC_`. `.env` and local Clerk state are ignored by Git.
3. Run `npm run ios` to build and launch the iOS development app. On subsequent runs use `npx expo start --dev-client`.

The development app identifier is `com.burakorkmez.lumekilo`. The callback is `lumekilo://sso-callback`, registered with the development Clerk instance. The custom callback requires this app’s development build, not Expo Go.

Clerk Native API and Google are enabled on the linked development instance; email + password is enabled as well. No additional profile fields are required by this instance. Changing required fields, MFA, or session tasks requires extending the completion UI.

## Session behavior

- `ClerkProvider` uses Clerk’s `tokenCache` backed by the device secure store.
- The app waits for session restoration before showing routes.
- Signed-out users see the welcome screen; signed-in users see the protected account screen.
- Sign-out revokes the active session and returns to the welcome screen.
- Both buttons are locked while a provider flow is running. Cancellation is silent; errors show retryable feedback.
- Client route guards are UI protection only. Future backend endpoints must verify Clerk tokens independently.

## Native provider sheets

The current implementation uses browser OAuth because provider-owned native credentials are not configured. It does not use native Google or Apple sheets.

For native Google, configure your Google Cloud web and iOS OAuth clients, then add `@clerk/expo-google-signin`, its config plugin, and the native Clerk hook. Clerk Expo 4 requires this separate Google package. For native Apple, configure the Apple bundle identifier and Sign in with Apple credentials in Clerk, then use Clerk’s Apple hook. Rebuild after native configuration changes.

See [Clerk Expo quickstart](https://clerk.com/docs/expo/getting-started/quickstart), [Google hook](https://clerk.com/docs/reference/expo/native-hooks/use-sign-in-with-google), and [Apple hook](https://clerk.com/docs/reference/expo/native-hooks/use-sign-in-with-apple).

## Manual acceptance check

1. Tap each provider and cancel; the welcome screen must remain usable.
2. Complete Google authentication, or create an account with email + password (including the emailed code when verification is on); verify the account name/email and sign-out control.
3. Terminate and relaunch the app; the account must remain signed in.
4. Sign out; navigating directly to `lumekilo://home` must return to the welcome screen.
5. Repeat with a new account to verify automatic signup.

Provider credentials and account verification should be entered by the account owner. A provider round-trip is not verified until those steps have completed.


## Required Clerk and Convex configuration

The client authenticates to Convex with a Clerk-issued JWT. Two things must be
true or the app shows *"Unable to authenticate with Convex"* after a successful
sign-in:

1. **Clerk → Convex integration enabled.** In the Clerk dashboard open
   **Configure → Integrations → Convex** and activate it. This creates a JWT
   template named `convex` whose `aud` claim is `convex` — the name
   `ConvexProviderWithClerk` requests via `getToken({ template: 'convex' })`,
   and the `applicationID` in `convex/auth.config.ts`.
2. **`CLERK_JWT_ISSUER_DOMAIN` set on the Convex deployment.** Copy the issuer
   URL from the same Clerk integration page (for a development instance it looks
   like `https://<your-instance>.clerk.accounts.dev`) and set it as an
   environment variable on the Convex deployment, **not** as an `EXPO_PUBLIC_*`
   value. Setting it triggers a redeploy of the backend.

Because the JWT template name is fixed at `convex`, do not rename it.
