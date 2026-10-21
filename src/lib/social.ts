import { ConvexError, type Infer } from 'convex/values';
import type { postView, profileView } from '../../convex/lib/views';
export { api } from '../../convex/_generated/api';
export type { Id } from '../../convex/_generated/dataModel';
export type SocialPost = Infer<typeof postView>;
export type SocialProfile = Infer<typeof profileView>;
export const siteUrl = process.env.EXPO_PUBLIC_CONVEX_SITE_URL ?? '';
export function errorMessage(error: unknown) {
  return error instanceof ConvexError && typeof error.data === 'string' ? error.data : 'Something went wrong. Check your connection and try again.';
}
// Re-exported from the LumeKilo design system so existing imports keep working.
export { palette } from './theme';
