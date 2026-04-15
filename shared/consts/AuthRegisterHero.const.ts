import type { RegisterHeroHighlight } from '@/shared/models/AuthRegisterHero.model';
import { colors } from '@/shared/theme/tokens';

export const REGISTER_HERO_HIGHLIGHTS: RegisterHeroHighlight[] = [
 { icon: 'bookmark', labelKey: 'auth.register.title', accentColor: colors.accent.DEFAULT },
 { icon: 'user-astronaut', labelKey: 'auth.register.submitButton', accentColor: colors.primary['200'] },
 { icon: 'gamepad', labelKey: 'auth.login.submitButton', accentColor: colors.success },
];
