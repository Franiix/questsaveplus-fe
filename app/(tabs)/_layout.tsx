import { Tabs } from 'expo-router';
import { useTranslation } from 'react-i18next';

export default function TabsLayout() {
 const { t } = useTranslation();

 return (
  <Tabs
   screenOptions={{
    headerShown: false,
   }}
   tabBar={() => null}
  >
   <Tabs.Screen
    name="index"
    options={{
     title: t('tabs.home'),
    }}
   />
   <Tabs.Screen
    name="backlog"
    options={{
     title: t('tabs.backlog'),
    }}
   />
   <Tabs.Screen
    name="play-next"
    options={{
     title: t('tabs.playNext'),
    }}
   />
   <Tabs.Screen
    name="profile"
    options={{
     title: t('tabs.profile'),
    }}
   />
  </Tabs>
 );
}
