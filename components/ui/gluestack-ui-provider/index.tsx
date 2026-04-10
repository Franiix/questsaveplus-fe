import { OverlayProvider } from '@gluestack-ui/core/overlay/creator';
import { ToastProvider } from '@gluestack-ui/core/toast/creator';
import { useColorScheme } from 'nativewind';
import type React from 'react';
import { useEffect } from 'react';
import { View, type ViewProps } from 'react-native';
import { config } from './config';

export type ModeType = 'light' | 'dark' | 'system';

export function GluestackUIProvider({
 mode = 'light',
 ...props
}: {
 mode?: ModeType;
 children?: React.ReactNode;
 style?: ViewProps['style'];
}) {
 const { colorScheme, setColorScheme } = useColorScheme();
 const resolvedColorScheme = colorScheme ?? (mode === 'dark' ? 'dark' : 'light');

 useEffect(() => {
  setColorScheme(mode);
 }, [mode, setColorScheme]);

 return (
  <View
   style={[config[resolvedColorScheme], { flex: 1, height: '100%', width: '100%' }, props.style]}
  >
   <OverlayProvider>
    <ToastProvider>{props.children}</ToastProvider>
   </OverlayProvider>
  </View>
 );
}
