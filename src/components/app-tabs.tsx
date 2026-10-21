import { DarkTheme, ThemeProvider } from 'expo-router';
import { NativeTabs } from 'expo-router/unstable-native-tabs';
import { FeedProvider } from '@/context/feed-context';
import { palette } from '@/lib/theme';

// LumeKilo runs on a dark AMOLED canvas, so the navigation theme is dark too.
const lumeKiloTheme = { ...DarkTheme, colors: { ...DarkTheme.colors, background: palette.background, card: palette.surface, text: palette.ink, border: palette.border, primary: palette.blue } };

export function AppTabs() {
  return (
    <ThemeProvider value={lumeKiloTheme}>
      <FeedProvider>
        <NativeTabs tintColor={palette.blue} iconColor={{ default: palette.muted, selected: palette.blue }} labelStyle={{ default: { color: palette.muted }, selected: { color: palette.blue } }} backgroundColor="transparent" shadowColor="transparent">
          <NativeTabs.Trigger name="home" disableAutomaticContentInsets>
            <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
            <NativeTabs.Trigger.Icon sf={{ default: 'house', selected: 'house.fill' }} md="home" />
          </NativeTabs.Trigger>
          <NativeTabs.Trigger name="messages" disableAutomaticContentInsets>
            <NativeTabs.Trigger.Label>Messages</NativeTabs.Trigger.Label>
            <NativeTabs.Trigger.Icon sf={{ default: 'bubble.left', selected: 'bubble.left.fill' }} md="chat_bubble" />
          </NativeTabs.Trigger>
          <NativeTabs.Trigger name="explore" disableAutomaticContentInsets>
            <NativeTabs.Trigger.Label>Explore</NativeTabs.Trigger.Label>
            <NativeTabs.Trigger.Icon sf={{ default: 'safari', selected: 'safari.fill' }} md="explore" />
          </NativeTabs.Trigger>
          <NativeTabs.Trigger name="profile" disableAutomaticContentInsets>
            <NativeTabs.Trigger.Label>Profile</NativeTabs.Trigger.Label>
            <NativeTabs.Trigger.Icon sf={{ default: 'person.crop.circle', selected: 'person.crop.circle.fill' }} md="account_circle" />
          </NativeTabs.Trigger>
        </NativeTabs>
      </FeedProvider>
    </ThemeProvider>
  );
}
