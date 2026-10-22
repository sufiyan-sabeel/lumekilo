import { EmailAuthSheet } from '@/components/email-auth-sheet';
import { FeedIcon } from '@/components/feed-icon';
import { useSocialAuth } from '@/hooks/use-social-auth';
import { openLegalDocument } from '@/lib/legal-links';
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const palette = { background: "#0A0A0B", ink: "#F2F3F5", blue: "#3AA0FF", muted: "#8B929C" };
const googleMark = {
  uri: `data:image/svg+xml;utf8,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><path fill="#4285F4" d="M43.6 24.5c0-1.5-.1-2.9-.4-4.3H24v8.1h11a9.4 9.4 0 0 1-4.1 6.2v5.2h6.7c3.9-3.6 6-8.8 6-15.2Z"/><path fill="#34A853" d="M24 44c5.5 0 10.1-1.8 13.5-4.9l-6.7-5.2c-1.8 1.2-4.1 1.9-6.8 1.9-5.3 0-9.8-3.6-11.4-8.4H5.7v5.4A20.4 20.4 0 0 0 24 44Z"/><path fill="#FBBC05" d="M12.6 27.4a12.2 12.2 0 0 1 0-7.8v-5.4H5.7a20 20 0 0 0 0 18.6l6.9-5.4Z"/><path fill="#EA4335" d="M24 11.2c3 0 5.6 1 7.7 3l5.8-5.8A19.4 19.4 0 0 0 24 3a20.4 20.4 0 0 0-18.3 11.2l6.9 5.4c1.6-4.8 6.1-8.4 11.4-8.4Z"/></svg>')}`,
};

function Chevron() {
  return (
    <View style={styles.arrow}>
      <View style={styles.arrowGlyph}>
        <View style={styles.arrowShaft} />
        <View style={styles.arrowTip} />
      </View>
    </View>
  );
}

export default function Index() {
  const { signInWithGoogle, pending, isReady } = useSocialAuth();
  const [emailOpen, setEmailOpen] = useState(false);
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const scale = Math.min(width / 390, 1.3);
  const canvasHeight = 837 * scale;
  const top = Math.max(0, insets.top - 62 * scale);
  // Reference coordinates describe the screen content, excluding the device frame.
  // A proportional canvas preserves the artwork; short screens can scroll.
  return (
    <View style={styles.screen}>
      <StatusBar style="light" />
      <View nativeID="clerk-captcha" />
      <ScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          minHeight: height,
          paddingBottom: Math.max(0, insets.bottom - 18),
        }}
      >
        <View
          style={{
            width: 390,
            height: 837,
            alignSelf: "center",
            marginTop: top,
            transformOrigin: "top center",
            transform: [{ scale }],
            marginBottom: canvasHeight - 837,
          }}
        >
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="About LumeKilo"
            hitSlop={8}
            onPress={() =>
              Alert.alert(
                "LumeKilo",
                "A social app for trusted testers.\nReal people. Real content. A brighter tomorrow.",
              )
            }
            style={({ pressed }) => [styles.more, pressed && styles.pressed]}
          >
            <Text style={styles.dots}>•••</Text>
          </Pressable>
          <Image
            source={require("../../assets/images/logo.png")}
            style={styles.logo}
            contentFit="contain"
            accessibilityLabel="LumeKilo logo"
          />
          <Text style={styles.wordmark}>LumeKilo</Text>
          <View style={styles.headline}>
            <Text style={styles.heading}>Real people.</Text>
            <Text style={styles.heading}>Real content.</Text>
            <Text style={[styles.heading, styles.blue]}>A brighter tomorrow.</Text>
          </View>

          <View pointerEvents="none" style={styles.artwork}>
            <View style={styles.blueShape} />
            <Image
              source={require("../../assets/images/auth-demo-img.png")}
              style={styles.mountain}
              contentFit="fill"
            />
            <LinearGradient
              colors={["#0A0A0B00", "#0A0A0B99", palette.background]}
              locations={[0, 0.65, 1]}
              style={styles.fade}
            />
          </View>
          <Image
            source={require("../../assets/images/community-note.png")}
            contentFit="contain"
            style={styles.note}
            accessibilityLabel="Good people are built with great people."
          />
          <View style={styles.buttons}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Continue with Google"
              accessibilityState={{ disabled: !isReady || pending, busy: pending }}
              disabled={!isReady || pending}
              onPress={() => void signInWithGoogle()}
              style={({ pressed }) => [styles.button, pressed && styles.pressed]}
            >
              <View style={styles.buttonIcon}>
                <Image source={googleMark} style={styles.brandIcon} contentFit="contain" />
              </View>
              <Text style={styles.buttonLabel}>Continue with Google</Text>
              <Chevron />
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Continue with email"
              onPress={() => setEmailOpen(true)}
              style={({ pressed }) => [styles.button, pressed && styles.pressed]}
            >
              <View style={styles.buttonIcon}>
                <FeedIcon name="mail" size={24} color={palette.ink} />
              </View>
              <Text style={styles.buttonLabel}>Continue with email</Text>
              <Chevron />
            </Pressable>
          </View>
          <Text style={styles.legal}>
            By continuing, you agree to our{" "}
            <Text accessibilityRole="link" onPress={() => { void openLegalDocument('Terms of Service'); }} style={styles.blue}>
              Terms
            </Text>{" "}
            and acknowledge{"\n"}our{" "}
            <Text
              accessibilityRole="link"
              onPress={() => { void openLegalDocument('Privacy Policy'); }}
              style={styles.blue}
            >
              Privacy Policy.
            </Text>
          </Text>
        </View>
      </ScrollView>
      <EmailAuthSheet visible={emailOpen} onClose={() => setEmailOpen(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: palette.background },
  more: {
    position: "absolute",
    top: 58,
    right: 24,
    width: 35,
    height: 35,
    borderRadius: 20,
    backgroundColor: "#1B1D21",
    alignItems: "center",
    justifyContent: "center",
  },
  dots: { color: "#8B929C", fontSize: 13, letterSpacing: 2, marginLeft: 2, marginTop: -2 },
  logo: { position: "absolute", top: 78, left: 157, width: 78, height: 76 },
  wordmark: {
    position: "absolute",
    top: 157,
    width: "100%",
    textAlign: "center",
    fontSize: 27.5,
    fontWeight: "800",
    letterSpacing: -1.25,
    color: "#FFFFFF",
  },
  headline: { position: "absolute", top: 212, left: 71, right: 12 },
  heading: {
    fontSize: 28.5,
    lineHeight: 30,
    fontWeight: "700",
    letterSpacing: -0.7,
    color: palette.ink,
  },
  blue: { color: palette.blue },
  artwork: { position: "absolute", top: 338, left: 0, width: 390, height: 280, overflow: "hidden" },
  blueShape: {
    position: "absolute",
    top: 9,
    left: -82,
    width: 165,
    height: 210,
    borderRadius: 64,
    backgroundColor: "#12293C",
    transform: [{ rotate: "23deg" }],
  },
  mountain: { position: "absolute", left: -25, top: 22, width: 404, height: 250, opacity: 0.67 },
  fade: { position: "absolute", bottom: -1, width: "100%", height: 76 },
  note: { position: "absolute", top: 364, right: 10, width: 118, height: 72 },
  buttons: { position: "absolute", top: 611, left: 27, right: 27, gap: 12 },
  // Flex row: the provider mark, a centred label and the chevron. Absolute
  // positioning inside the scaled canvas did not render the mark reliably on
  // Android, so everything is laid out in normal flow.
  button: {
    height: 56,
    borderRadius: 28,
    backgroundColor: "#141417",
    borderWidth: 1,
    borderColor: "#26282C",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
  },
  pressed: { opacity: 0.75, transform: [{ scale: 0.985 }] },
  buttonIcon: { width: 26, height: 26, alignItems: "center", justifyContent: "center" },
  brandIcon: { width: 24, height: 24 },
  buttonLabel: {
    flex: 1,
    textAlign: "center",
    color: palette.ink,
    fontSize: 15.5,
    fontWeight: "600",
    letterSpacing: -0.25,
  },
  arrow: { width: 26, height: 26, alignItems: "center", justifyContent: "center" },
  arrowGlyph: { width: 16, height: 20, justifyContent: "center" },
  arrowShaft: { height: 1.6, width: 14, borderRadius: 1, backgroundColor: palette.muted },
  arrowTip: {
    position: "absolute",
    right: 1,
    width: 10,
    height: 10,
    borderTopWidth: 1.6,
    borderRightWidth: 1.6,
    borderColor: palette.muted,
    transform: [{ rotate: "45deg" }],
  },
  legal: {
    position: "absolute",
    top: 758,
    width: "100%",
    textAlign: "center",
    fontSize: 10.5,
    lineHeight: 14,
    letterSpacing: -0.12,
    color: palette.muted,
  },
});
