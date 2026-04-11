import type { FontAwesome5 } from '@expo/vector-icons';

export type HomeDiscoveryContextCard = {
 icon: React.ComponentProps<typeof FontAwesome5>['name'];
 subtitle: string;
 title: string;
};
