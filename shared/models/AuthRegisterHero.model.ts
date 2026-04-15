import type { ComponentProps } from 'react';
import type { FontAwesome5 } from '@expo/vector-icons';

export type RegisterHeroLabelKey =
 | 'auth.register.title'
 | 'auth.register.submitButton'
 | 'auth.login.submitButton';

export type RegisterHeroHighlight = {
 icon: ComponentProps<typeof FontAwesome5>['name'];
 labelKey: RegisterHeroLabelKey;
 accentColor: string;
};
