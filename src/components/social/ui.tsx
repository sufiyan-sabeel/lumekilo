import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { useConvexConnectionState } from 'convex/react';
import { palette as c } from '@/lib/social';
import { FeedIcon } from '../feed-icon';

export function Header({ title = 'LumeKilo', back = false, compose = true }: { title?: string; back?: boolean; compose?: boolean }) {
  const router = useRouter();
  return <View style={ui.header}>{back ? <Pressable accessibilityLabel="Go back" accessibilityRole="button" style={ui.round} onPress={() => router.back()}><FeedIcon name="back" /></Pressable> : <Image source={require('../../../assets/images/logo.png')} contentFit="contain" accessibilityLabel="LumeKilo logo" style={{ width: 38, height: 38 }} />}<Text numberOfLines={1} style={[ui.title, { flex: 1 }]}>{title}</Text>{!back && <Pressable accessibilityRole="button" accessibilityLabel="Search people" style={ui.round} onPress={() => router.navigate('/explore')}><FeedIcon name="search" /></Pressable>}{compose && <Pressable accessibilityRole="button" accessibilityLabel="Create a post" style={[ui.round, { backgroundColor: '#12293C' }]} onPress={() => router.push('/compose')}><FeedIcon name="plus" color={c.blue} /></Pressable>}</View>;
}
export function ConnectionStatus() {
  const state = useConvexConnectionState();
  return state.isWebSocketConnected ? null : <Text accessibilityRole="alert" style={ui.connection}>Reconnecting… Your changes will sync when connected.</Text>;
}
export function LoadMore({ status, loadMore }: { status: string; loadMore: (n: number) => void }) {
  if (status === 'LoadingFirstPage' || status === 'LoadingMore') return <ActivityIndicator style={{ padding: 24 }} color={c.blue} />;
  return status === 'CanLoadMore' ? <Pressable accessibilityRole="button" onPress={() => loadMore(20)} style={{ padding: 24, alignItems: 'center' }}><Text style={ui.link}>Load more</Text></Pressable> : null;
}
export const ui = StyleSheet.create({
  screen: { flex: 1, backgroundColor: c.background }, center: { flex: 1, backgroundColor: c.background, justifyContent: 'center', alignItems: 'center', padding: 28, gap: 18 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 16, paddingVertical: 12 },
  title: { fontSize: 23, fontWeight: '700', color: c.ink, letterSpacing: -0.8 }, text: { fontSize: 15, color: c.ink, lineHeight: 22 }, muted: { fontSize: 14, color: c.muted, lineHeight: 21 },
  round: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: '#1B1D21' },
  button: { paddingHorizontal: 22, paddingVertical: 14, borderRadius: 22, backgroundColor: c.blue, alignItems: 'center' }, buttonText: { color: 'white', fontSize: 15, fontWeight: '600' },
  input: { backgroundColor: '#1B1D21', borderRadius: 16, padding: 16, fontSize: 16, color: c.ink, borderWidth: 1, borderColor: '#2A2C30' },
  link: { color: c.blue, fontSize: 14, fontWeight: '600' }, error: { color: '#FF6B82', fontSize: 14, lineHeight: 21 }, disabled: { opacity: 0.45 },
  connection: { backgroundColor: '#3A2E14', color: '#F5B544', padding: 10, textAlign: 'center', fontSize: 12 },
});
