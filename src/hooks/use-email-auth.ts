import { useSignIn, useSignUp } from '@clerk/expo/legacy';
import { useState } from 'react';
import { authErrorMessage } from '@/lib/auth-errors';

export type EmailAuthStage = 'credentials' | 'verify';

/**
 * Email + password sign-in and sign-up with Clerk.
 *
 * Sign-up may or may not require email verification depending on the Clerk
 * instance settings. When it does, the flow moves to the `verify` stage and
 * waits for the emailed code before the session is activated.
 */
export function useEmailAuth() {
  const { signIn, setActive } = useSignIn();
  const { signUp } = useSignUp();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [stage, setStage] = useState<EmailAuthStage>('credentials');

  async function run(task: () => Promise<void>) {
    if (busy) return;
    setBusy(true);
    setError('');
    try {
      await task();
    } catch (e) {
      setError(authErrorMessage(e) ?? '');
    } finally {
      setBusy(false);
    }
  }

  async function activate(sessionId: string | null) {
    if (!sessionId || !setActive) return false;
    await setActive({ session: sessionId });
    return true;
  }

  async function signInWithEmail(email: string, password: string) {
    await run(async () => {
      if (!signIn || !setActive) return;
      const attempt = await signIn.create({ identifier: email, password });
      if (await activate(attempt.createdSessionId)) return;
      if (attempt.status === 'needs_first_factor') {
        setError('That email and password did not match. Please try again.');
        return;
      }
      setError('This account needs an extra verification step that is not supported yet.');
    });
  }

  async function signUpWithEmail(email: string, password: string) {
    await run(async () => {
      if (!signUp || !setActive) return;
      const attempt = await signUp.create({ emailAddress: email, password });
      if (await activate(attempt.createdSessionId)) return;
      // Verification is required before the session can be activated.
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      setStage('verify');
    });
  }

  async function verifyEmailCode(code: string) {
    await run(async () => {
      if (!signUp || !setActive) return;
      const attempt = await signUp.attemptEmailAddressVerification({ code });
      if (await activate(attempt.createdSessionId)) return;
      setError('That code was not accepted. Check your inbox and try again.');
    });
  }

  function reset() {
    setStage('credentials');
    setError('');
  }

  return { busy, error, stage, signInWithEmail, signUpWithEmail, verifyEmailCode, reset };
}
