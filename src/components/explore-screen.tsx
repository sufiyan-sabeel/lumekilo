import { useUser } from '@clerk/expo';
import { Image } from 'expo-image';
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, Share, StyleSheet, Text, TextInput, useWindowDimensions, View } from 'react-native';
import { useFeed } from '@/context/feed-context';
import { explorePosts, suggestedPeople, topics } from '@/lib/explore-data';
import { initialPosts, media, type Post } from '@/lib/feed-data';
import { ExploreLayout } from './explore-layout';
import { FeedIcon } from './feed-icon';

type Sheet = 'people' | 'topics' | 'compose' | 'post' | null;
const blue = '#3AA0FF';
const ink = '#F2F3F5';
const muted = '#8B929C';
export function ExploreTab() {
  const { user } = useUser();
  const { posts, setPosts } = useFeed();
  const [query, setQuery] = useState('');
  const [topic, setTopic] = useState('All');
  const [followed, setFollowed] = useState<string[]>([]);
  const [liked, setLiked] = useState<string[]>([]);
  const [sheet, setSheet] = useState<Sheet>(null);
  const [selected, setSelected] = useState<Post | null>(null);
  const [caption, setCaption] = useState('');
  const { width } = useWindowDimensions();
  const s = width / 390;
  const fs = (n: number) => n * s;
  const allPosts = [...posts.filter(post => post.id.startsWith('local-')), ...explorePosts];
  const needle = query.trim().toLowerCase().replace(/^#/, '');
  const filtered = allPosts.filter(post => (topic === 'All' || post.tags.includes(topic.toLowerCase())) && `${post.name} ${post.title} ${post.caption} ${post.tags.join(' ')}`.toLowerCase().replace(/\s+/g, ' ').includes(needle));
  const toggleFollow = (name: string) => setFollowed(current => current.includes(name) ? current.filter(value => value !== name) : [...current, name]);
  const toggleLike = (id: string) => setLiked(current => current.includes(id) ? current.filter(value => value !== id) : [...current, id]);
  const openPost = (post: Post) => { setSelected(post); setSheet('post'); };
  const chooseTopic = (value: string) => { setTopic(value); setSheet(null); };
  const followButton = (name: string) => <Pressable accessibilityRole="button" accessibilityLabel={`${followed.includes(name) ? 'Unfollow' : 'Follow'} ${name}`} onPress={() => toggleFollow(name)} style={[styles.follow, { height: 19 * s, borderRadius: fs(12), backgroundColor: followed.includes(name) ? '#12293C' : blue }]}><Text style={{ fontSize: fs(8.6), color: followed.includes(name) ? blue : 'white', fontWeight: '500' }}>{followed.includes(name) ? 'Following' : 'Follow'}</Text></Pressable>;
  return (
    <>
      <ExploreLayout query={query} onQuery={setQuery} topic={topic} onTopic={setTopic} onPeople={() => setSheet('people')} onTopics={() => setSheet('topics')} onCompose={() => { setCaption(''); setSheet('compose'); }}
        people={suggestedPeople.map(person => ({ id: person.name, name: person.name, topic: person.topic, portrait: <Image source={person.image} style={{ width: fs(57), height: fs(57), borderRadius: fs(29) }} />, follow: followButton(person.name), onPress: () => { setQuery(person.name); setTopic('All'); } }))}
        posts={filtered.map(post => ({ id: post.id, name: post.name, caption: post.title, media: <Image source={post.photo} style={StyleSheet.absoluteFill} contentFit="cover" />, avatar: <Image source={post.avatar} style={{ width: fs(22), height: fs(22), borderRadius: fs(11) }} />, likes: post.likes + (liked.includes(post.id) ? 1 : 0), liked: liked.includes(post.id), onLike: () => toggleLike(post.id), onPress: () => openPost(post), onAuthor: () => { setQuery(post.name); setTopic('All'); } }))} />
      <Modal visible={sheet !== null} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setSheet(null)}>
        <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={styles.sheetHeader}><Text style={styles.title}>{sheet === 'people' ? 'Suggested for you' : sheet === 'topics' ? 'Explore topics' : sheet === 'compose' ? 'Create a demo post' : selected?.name}</Text><Pressable accessibilityRole="button" accessibilityLabel="Close" onPress={() => setSheet(null)} style={{ padding: 10 }}><FeedIcon name="close" /></Pressable></View>
          <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ padding: 24, gap: 18 }}>
            {sheet === 'people' && <><Text style={styles.body}>Discover the fictional LumeKilo demo community.</Text>{suggestedPeople.map(person => <View key={person.name} style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}><Image source={person.image} style={{ width: 52, height: 52, borderRadius: 26 }} /><View style={{ flex: 1 }}><Text style={styles.personName}>{person.name}</Text><Text style={styles.body}>{person.topic}</Text></View><View style={{ width: 85 }}>{followButton(person.name)}</View></View>)}</>}
            {sheet === 'topics' && topics.map(value => <Pressable key={value} accessibilityRole="button" onPress={() => chooseTopic(value)} style={[styles.topicRow, topic === value && { backgroundColor: '#12293C' }]}><Text style={{ color: topic === value ? blue : ink, fontSize: 17 }}>{value}</Text></Pressable>)}
            {sheet === 'post' && selected && <><Image source={selected.photo} style={{ width: '100%', aspectRatio: 1, borderRadius: 18 }} /><Text style={styles.title}>{selected.title}</Text><Text style={styles.body}>{selected.caption}</Text><Text style={{ color: blue }}>{selected.tags.map(tag => `#${tag}`).join(' ')}</Text><Pressable style={styles.primary} onPress={() => toggleLike(selected.id)}><Text style={styles.primaryText}>{liked.includes(selected.id) ? 'Liked' : 'Like'} · {selected.likes + (liked.includes(selected.id) ? 1 : 0)}</Text></Pressable><Pressable style={styles.topicRow} onPress={() => { void Share.share({ message: `${selected.title} — ${selected.name} on LumeKilo` }).catch(() => Alert.alert('Unable to share', 'Please try again.')); }}><Text style={{ color: blue, textAlign: 'center' }}>Share post</Text></Pressable></>}
            {sheet === 'compose' && <><Text style={styles.body}>Try a sample post in the local demo feed.</Text><Image source={media.lake} style={{ width: '100%', aspectRatio: 2, borderRadius: 16 }} /><TextInput accessibilityLabel="Post caption" value={caption} onChangeText={setCaption} placeholder="Write a caption…" multiline maxLength={500} style={styles.captionInput} /><Pressable accessibilityRole="button" disabled={!caption.trim()} style={[styles.primary, !caption.trim() && { opacity: 0.4 }]} onPress={() => { setPosts(current => [{ ...initialPosts[0], id: `local-${Date.now()}`, name: user?.username ?? 'you', title: caption.trim(), caption: 'Local demo post', tags: ['demo'], likes: 0, comments: 0, time: 'Just now', carousel: false }, ...current]); setQuery(''); setTopic('All'); setSheet(null); }}><Text style={styles.primaryText}>Add to preview</Text></Pressable></>}
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
}
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#0A0A0B' }, headerButton: { alignItems: 'center', justifyContent: 'center', backgroundColor: '#1B1D21' }, search: { backgroundColor: '#1B1D21', flexDirection: 'row', alignItems: 'center' }, follow: { alignSelf: 'stretch', alignItems: 'center', justifyContent: 'center' }, card: { backgroundColor: '#0A0A0B', boxShadow: '0px 2px 4px #14233C0D' }, sheetHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 18, borderBottomWidth: 1, borderBottomColor: '#26282C' }, title: { fontSize: 21, fontWeight: '700', color: ink }, body: { fontSize: 15, lineHeight: 22, color: muted }, personName: { fontSize: 16, fontWeight: '600', color: ink }, topicRow: { borderRadius: 16, padding: 16, backgroundColor: '#1B1D21' }, primary: { borderRadius: 20, padding: 16, alignItems: 'center', backgroundColor: blue }, primaryText: { color: 'white', fontSize: 16, fontWeight: '600' }, captionInput: { minHeight: 100, borderRadius: 16, padding: 16, backgroundColor: '#1B1D21', color: ink, fontSize: 16 },
});
