import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useEmailAuth } from '@/hooks/use-email-auth';
import { palette, radius, spacing, typography } from '@/lib/theme';
import { FeedIcon } from './feed-icon';

type Mode = 'signIn' | 'signUp';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function EmailAuthSheet({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const auth = useEmailAuth();
  const insets = useSafeAreaInsets();
  const [mode, setMode] = useState<Mode>('signIn');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [revealed, setRevealed] = useState(false);
  const [code, setCode] = useState('');

  const emailOk = EMAIL_RE.test(email.trim());
  const passwordOk = password.length >= 8;
  const canSubmit = emailOk && passwordOk && !auth.busy;
  const canVerify = code.trim().length >= 6 && !auth.busy;

  function close() {
    auth.reset();
    setCode('');
    setRevealed(false);
    onClose();
  }

  function submit() {
    if (!canSubmit) return;
    if (mode === 'signIn') void auth.signInWithEmail(email.trim(), password);
    else void auth.signUpWithEmail(email.trim(), password);
  }

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="fullScreen" onRequestClose={close}>
      <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={[styles.header, { paddingTop: insets.top + spacing.md }]}>
          <Text accessibilityRole="header" style={styles.headerTitle}>
            {auth.stage === 'verify' ? 'Verify your email' : 'Continue with email'}
          </Text>
          <Pressable accessibilityRole="button" accessibilityLabel="Close" onPress={close} hitSlop={12} style={styles.headerButton}>
            <FeedIcon name="close" size={22} />
          </Pressable>
        </View>

        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={[styles.body, { paddingBottom: insets.bottom + spacing.xl }]}>
          {auth.stage === 'verify' ? (
            <>
              <Text style={styles.lead}>
                We sent a 6-digit code to {email.trim()}. Enter it below to finish creating your account.
              </Text>
              <Text style={styles.label}>Verification code</Text>
              <TextInput
                accessibilityLabel="Verification code"
                value={code}
                onChangeText={setCode}
                placeholder="123456"
                placeholderTextColor={palette.disabled}
                keyboardType="number-pad"
                autoComplete="one-time-code"
                maxLength={6}
                style={[styles.input, styles.codeInput]}
              />
              {!!auth.error && <Text accessibilityRole="alert" style={styles.error}>{auth.error}</Text>}
              <Pressable
                accessibilityRole="button"
                accessibilityState={{ disabled: !canVerify }}
                disabled={!canVerify}
                onPress={() => void auth.verifyEmailCode(code.trim())}
                style={[styles.primary, !canVerify && styles.disabled]}
              >
                {auth.busy ? <ActivityIndicator color={palette.background} /> : <Text style={styles.primaryLabel}>Verify and continue</Text>}
              </Pressable>
              <Pressable accessibilityRole="button" onPress={() => { auth.reset(); setCode(''); }} style={styles.linkRow}>
                <Text style={styles.link}>Use a different email</Text>
              </Pressable>
            </>
          ) : (
            <>
              <View style={styles.modeRow}>
                {(['signIn', 'signUp'] as const).map((value) => (
                  <Pressable
                    key={value}
                    accessibilityRole="button"
                    accessibilityState={{ selected: mode === value }}
                    onPress={() => { setMode(value); auth.reset(); }}
                    style={[styles.mode, mode === value && styles.modeActive]}
                  >
                    <Text style={[styles.modeLabel, mode === value && styles.modeLabelActive]}>
                      {value === 'signIn' ? 'Sign in' : 'Create account'}
                    </Text>
                  </Pressable>
                ))}
              </View>

              <Text style={styles.lead}>
                {mode === 'signIn'
                  ? 'Welcome back. Enter the email and password on your LumeKilo account.'
                  : 'Create your account with an email address and a password of at least 8 characters.'}
              </Text>

              <Text style={styles.label}>Email</Text>
              <TextInput
                accessibilityLabel="Email address"
                value={email}
                onChangeText={setEmail}
                placeholder="you@example.com"
                placeholderTextColor={palette.disabled}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="email"
                style={styles.input}
              />

              <Text style={styles.label}>Password</Text>
              <View style={styles.passwordRow}>
                <TextInput
                  accessibilityLabel="Password"
                  value={password}
                  onChangeText={setPassword}
                  placeholder="At least 8 characters"
                  placeholderTextColor={palette.disabled}
                  secureTextEntry={!revealed}
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete={mode === 'signIn' ? 'current-password' : 'new-password'}
                  style={[styles.input, styles.passwordInput]}
                />
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={revealed ? 'Hide password' : 'Show password'}
                  onPress={() => setRevealed((value) => !value)}
                  hitSlop={10}
                  style={styles.reveal}
                >
                  <FeedIcon name={revealed ? 'eye-off' : 'eye'} size={20} color={palette.muted} />
                </Pressable>
              </View>

              {!!auth.error && <Text accessibilityRole="alert" style={styles.error}>{auth.error}</Text>}

              <Pressable
                accessibilityRole="button"
                accessibilityState={{ disabled: !canSubmit }}
                disabled={!canSubmit}
                onPress={submit}
                style={[styles.primary, !canSubmit && styles.disabled]}
              >
                {auth.busy ? <ActivityIndicator color={palette.background} /> : <Text style={styles.primaryLabel}>{mode === 'signIn' ? 'Sign in' : 'Create account'}</Text>}
              </Pressable>

              <Text style={styles.fine}>
                {mode === 'signUp' && !passwordOk && password.length > 0
                  ? 'Passwords need at least 8 characters.'
                  : 'Your details are handled by Clerk and never stored on the device.'}
              </Text>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: palette.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: palette.border,
  },
  headerTitle: { ...typography.title, color: palette.ink },
  headerButton: { padding: spacing.sm },
  body: { padding: spacing.xl, gap: spacing.md },
  modeRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    backgroundColor: palette.surfaceMuted,
    borderRadius: radius.md,
    padding: spacing.xs,
  },
  mode: { flex: 1, paddingVertical: spacing.md, borderRadius: radius.sm, alignItems: 'center' },
  modeActive: { backgroundColor: palette.surface },
  modeLabel: { ...typography.label, color: palette.muted },
  modeLabelActive: { color: palette.ink },
  lead: { ...typography.body, color: palette.muted },
  label: { ...typography.label, color: palette.inkSecondary, marginTop: spacing.xs },
  input: {
    backgroundColor: palette.surfaceMuted,
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    fontSize: 16,
    color: palette.ink,
  },
  codeInput: { textAlign: 'center', fontSize: 22, letterSpacing: 6 },
  passwordRow: { flexDirection: 'row', alignItems: 'center' },
  passwordInput: { flex: 1, paddingRight: 48 },
  reveal: { position: 'absolute', right: spacing.md, padding: spacing.xs },
  error: { color: palette.danger, ...typography.body, fontSize: 14 },
  primary: {
    backgroundColor: palette.blue,
    borderRadius: radius.pill,
    minHeight: 54,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.sm,
  },
  primaryLabel: { color: palette.background, fontSize: 16, fontWeight: '700' },
  disabled: { opacity: 0.45 },
  linkRow: { alignItems: 'center', paddingVertical: spacing.sm },
  link: { color: palette.blue, ...typography.label },
  fine: { color: palette.muted, ...typography.caption, textAlign: 'center' },
});
