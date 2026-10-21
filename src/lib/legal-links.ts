import { Alert } from 'react-native';
import * as WebBrowser from 'expo-web-browser';

const legalUrls = {
  'Privacy Policy': 'https://lumekilo-legal.pages.dev/privacy',
  'Terms of Service': 'https://lumekilo-legal.pages.dev/terms',
} as const;

export async function openLegalDocument(document: keyof typeof legalUrls) {
  try {
    await WebBrowser.openBrowserAsync(legalUrls[document], {
      presentationStyle: WebBrowser.WebBrowserPresentationStyle.PAGE_SHEET,
      dismissButtonStyle: 'done',
      controlsColor: '#3AA0FF',
      toolbarColor: '#0A0A0B',
    });
  } catch {
    Alert.alert(`Unable to open ${document}`, 'Please try again or open this address in your browser:\n' + legalUrls[document]);
  }
}
