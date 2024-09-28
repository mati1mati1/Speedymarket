import { Alert, Platform } from 'react-native';

interface AlertOption {
  text?: string;
  onPress?: () => void;
  style?: 'default' | 'cancel' | 'destructive';
}

interface ExtraOptions {
  cancelable?: boolean;
  onDismiss?: () => void;
}

const alertPolyfill = (
  title: string,
  description?: string,
  options: AlertOption[] = [],
  extra?: ExtraOptions
) => {
  const result = window.confirm([title, description].filter(Boolean).join('\n'));

  if (result) {
    const confirmOption = options.find(({ style }) => style !== 'cancel');
    if (confirmOption && confirmOption.onPress) {
      confirmOption.onPress();
    }
  } else {
    const cancelOption = options.find(({ style }) => style === 'cancel');
    if (cancelOption && cancelOption.onPress) {
      cancelOption.onPress();
    }
  }

  if (extra?.onDismiss) {
    extra.onDismiss();
  }
};

const customAlert = (
  title: string,
  description?: string,
  options: AlertOption[] = [],
  extra?: ExtraOptions
) => {
  if (Platform.OS === 'web') {
    alertPolyfill(title, description, options, extra);
  } else {
    Alert.alert(title, description, options, { cancelable: extra?.cancelable });
  }
};

export default customAlert;
