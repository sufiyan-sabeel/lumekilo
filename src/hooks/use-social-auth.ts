import { useAuth, useSSO } from '@clerk/expo';
import { makeRedirectUri } from 'expo-auth-session';
import { useRef, useState } from 'react';
import { Alert } from 'react-native';
import { authErrorMessage } from '@/lib/auth-errors';

/**
 * Google sign-in through Clerk's OAuth flow.
 *
 * Email + password sign-in/sign-up lives in `use-email-auth.ts`.
 */
export function useSocialAuth() {
  const { isLoaded } = useAuth();
  const { startSSOFlow } = useSSO();
  const inFlight = useRef(false);
  const [pending, setPending] = useState(false);

  async function signInWithGoogle() {
    if (!isLoaded || inFlight.current) return;
    inFlight.current = true;
    setPending(true);
    try {
      const result = await startSSOFlow({
        strategy: 'oauth_google',
        redirectUrl: makeRedirectUri({ scheme: 'lumekilo', path: 'sso-callback' }),
      });
      // A dismissed browser is an intentional cancellation, not a failed login.
      if (result.authSessionResult?.type === 'cancel' || result.authSessionResult?.type === 'dismiss') return;
      if (result.createdSessionId && result.setActive) {
        await result.setActive({ session: result.createdSessionId });
        // Root route guards transition only after Clerk confirms the active session.
      } else if (result.signUp?.status === 'missing_requirements') {
        Alert.alert('More information needed', 'Your account needs additional details. Please contact the LumeKilo team to finish signing up.');
      } else {
        Alert.alert('Sign-in incomplete', 'We couldn’t finish verifying your account. Please try signing in again.');
      }
    } catch (error) {
      const message = authErrorMessage(error);
      if (message) Alert.alert('Unable to sign in', message);
    } finally {
      inFlight.current = false;
      setPending(false);
    }
  }

  return { signInWithGoogle, pending, isReady: isLoaded };
}
