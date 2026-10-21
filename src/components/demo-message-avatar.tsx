import { Image, type ImageSource } from 'expo-image';
import { View } from 'react-native';

// Demo conversation avatars. These ship with the app, so the messages tab and
// its design preview render the same portraits without depending on the
// original project's `design/` reference screenshots (which are not app assets
// and are not bundled).
const avatars: ImageSource[] = [
  require('../../assets/images/chat/avatar.png'),
  require('../../assets/images/feed/maya.png'),
  require('../../assets/images/feed/jordan.png'),
  require('../../assets/images/feed/taylor.png'),
  require('../../assets/images/feed/casey.png'),
];

export function DemoMessageAvatar({ index, size }: { index: number; size: number }) {
  const source = avatars[index] ?? avatars[0];
  return (
    <View style={{ width: size, height: size, borderRadius: size / 2, overflow: 'hidden' }}>
      <Image source={source} style={{ width: size, height: size }} contentFit="cover" />
    </View>
  );
}
