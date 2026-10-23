import { MessagesProvider } from '@/context/messages-context';
import { ClerkProvider, useAuth } from '@clerk/expo';
import { ConvexProviderWithAuth, ConvexReactClient } from 'convex/react';
import { tokenCache } from '@clerk/expo/token-cache';
import { Stack } from 'expo-router';
import { useCallback, useMemo } from 'react';
import { ActivityIndicator, Platform, StyleSheet, View } from 'react-native';
import * as Sentry from '@sentry/react-native';

// Set EXPO_PUBLIC_SENTRY_DSN to your own Sentry DSN. When it is empty, Sentry
// stays disabled (no events leave the device) rather than reporting to a
// project you do not own.
Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN ?? '',
  enabled: !!process.env.EXPO_PUBLIC_SENTRY_DSN,
  sendDefaultPii: false,
  enableLogs: true,
  integrations: [
    Sentry.feedbackIntegration({
      colorScheme: 'dark',
      formTitle: 'Share your feedback',
      messageLabel: 'What’s on your mind?',
      messagePlaceholder: 'Tell us what you love, what could be better, or what went wrong…',
      submitButtonLabel: 'Send feedback',
      nameLabel: 'Name (optional)',
      emailLabel: 'Email (optional)',
      emailPlaceholder: 'So we can follow up with you',
      isNameRequired: false,
      isEmailRequired: false,
      successMessageText: 'Thanks for helping improve LumeKilo!',
      styles: {
        container: { backgroundColor: '#0A0A0B' },
        title: { color: '#F2F3F5', fontWeight: '700' },
        label: { color: '#F2F3F5' },
        input: { color: '#F2F3F5', backgroundColor: '#1B1D21', borderRadius: 12 },
        textArea: { color: '#F2F3F5', backgroundColor: '#1B1D21', borderRadius: 12 },
        submitButton: { backgroundColor: '#3AA0FF', borderRadius: 14, minHeight: 48 },
        submitText: { color: '#FFFFFF', fontWeight: '600' },
        cancelButton: { borderRadius: 14, minHeight: 44 },
        cancelText: { color: '#8B929C' },
      },
    }),
  ],
});

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY ?? '';
if (!publishableKey) {
  throw new Error('Set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in .env and restart Expo.');
}

const convexUrl = process.env.EXPO_PUBLIC_CONVEX_URL;
if (!convexUrl) throw new Error('Set EXPO_PUBLIC_CONVEX_URL in .env.local and restart Expo.');
const convex = new ConvexReactClient(convexUrl);

Sentry.logger.info('LumeKilo initialized', { platform: Platform.OS });

/**
 * Bridges Clerk sessions to Convex.
 *
 * Preferred path: the Clerk → Convex integration's `convex` JWT template, whose
 * `aud` claim is `convex` (the `applicationID` in `convex/auth.config.ts`).
 *
 * Fallback: if that template is not enabled on the Clerk instance, `getToken`
 * with a template rejects. A plain Clerk session token is still a valid RS256
 * JWT issued by the same issuer, and `convex/auth.config.ts` also registers it
 * as a `customJwt` provider — so we fall back to it rather than leaving the app
 * stuck on the "couldn't reach the backend" screen.
 */
function useAuthFromClerk() {
  const { isLoaded, isSignedIn, getToken, sessionClaims } = useAuth();
  const audience = sessionClaims?.aud;

  const fetchAccessToken = useCallback(
    async ({ forceRefreshToken }: { forceRefreshToken: boolean }) => {
      try {
        if (audience === 'convex') {
          return await getToken({ skipCache: forceRefreshToken });
        }
        try {
          return await getToken({ template: 'convex', skipCache: forceRefreshToken });
        } catch {
          return await getToken({ skipCache: forceRefreshToken });
        }
      } catch {
        return null;
      }
    },
    [getToken, audience],
  );

  return useMemo(
    () => ({ isLoading: !isLoaded, isAuthenticated: isSignedIn ?? false, fetchAccessToken }),
    [isLoaded, isSignedIn, fetchAccessToken],
  );
}

function AuthenticatedRoutes() {
  const { isLoaded, isSignedIn, userId } = useAuth();
  if (!isLoaded) {
    return <View style={styles.loading}><ActivityIndicator size="large" color="#3AA0FF" accessibilityLabel="Loading your account" /></View>;
  }
  return (
    <MessagesProvider key={userId ?? "signed-out"}><Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#0A0A0B' } }}>
      <Stack.Protected guard={!isSignedIn}>
        <Stack.Screen name="index" />
      </Stack.Protected>
      <Stack.Protected guard={!!isSignedIn}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="story-compose" options={{ presentation: 'fullScreenModal', gestureEnabled: false }} />
        <Stack.Screen name="compose" options={{ presentation: 'fullScreenModal', gestureEnabled: false }} />
        <Stack.Screen name="post/[id]" />
        <Stack.Screen name="member/[id]" />
        <Stack.Screen name="chat/[id]" />
      </Stack.Protected>
      <Stack.Screen name="sso-callback" />
      <Stack.Protected guard={__DEV__}>
        <Stack.Screen name="design-preview" />
      </Stack.Protected>
    </Stack></MessagesProvider>
  );
}

function RootLayout() {
  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <ConvexProviderWithAuth client={convex} useAuth={useAuthFromClerk}>
        <AuthenticatedRoutes />
      </ConvexProviderWithAuth>
    </ClerkProvider>
  );
}

const styles = StyleSheet.create({
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#0A0A0B' },
});

export default Sentry.wrap(RootLayout);
