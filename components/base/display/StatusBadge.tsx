import { Badge } from './Badge';

type StatusBadgeProps<T extends string> = {
 value: T;
 colorMap: Record<T, string>;
 labelMap: Record<T, string>;
 size?: 'sm' | 'md';
};

/**
 * Atom: Badge generico per valori enum con colore tematico.
 *
 * Riceve il valore, una mappa colore e una mappa label dall'esterno —
 * non è accoppiato ad alcun enum di dominio.
 * Il background è la stessa tinta del colore con ~15% di opacità (26 hex).
 */
export function StatusBadge<T extends string>({
 value,
 colorMap,
 labelMap,
 size = 'sm',
}: StatusBadgeProps<T>) {
 const color = colorMap[value];

 return (
  <Badge
   label={labelMap[value]}
   color={color}
   backgroundColor={`${color}26`} // 0x26 ≈ 15% opacità
   size={size}
  />
 );
}
