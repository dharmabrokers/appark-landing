// COPIA de Appark-main apps/mobile/src/services/tierUsage.ts (panel web, appark.es/panel).
// Si cambias uno, cambia el otro: la app y la web tienen que contar lo mismo.
/**
 * Cómo se le enseña a un comercio lo que consume de su paquete.
 *
 * La regla de diseño detrás de todo esto: **un límite sólo vende si se
 * ve antes de chocar con él**. Descubrirlo con un error, a mitad de un
 * formulario ya relleno, es la peor versión — frustra y no convierte.
 * Verlo mientras aún queda sitio («2 de 3») es información; verlo cuando
 * se acaba, con el paquete que lo abre escrito al lado, es una oferta.
 */

export type TierId = 'bronze' | 'silver' | 'gold';

export interface TierUsage {
  tier: string;
  used: number;
  /** 0 significa ilimitado, igual que en app_config. */
  limit: number;
}

/** "2 de 3", o sólo "2" cuando no hay tope que enseñar. */
export function usageLabel(usage: TierUsage): string {
  if (usage.limit === 0) return String(usage.used);
  return `${usage.used} de ${usage.limit}`;
}

export function isAtLimit(usage: TierUsage): boolean {
  if (usage.limit === 0) return false;
  return usage.used >= usage.limit;
}

/**
 * Si conviene avisar de que se está acabando.
 *
 * En el último hueco, no antes: avisar con sitio de sobra es ruido, y el
 * ruido enseña a ignorar el aviso que sí importa.
 */
export function isNearLimit(usage: TierUsage): boolean {
  if (usage.limit === 0) return false;
  return usage.used === usage.limit - 1;
}

/**
 * El paquete siguiente, o null si ya está arriba.
 *
 * Se usa para nombrar la salida. Decir "con Plata puedes tener 3" a
 * alguien que ya tiene Oro sería absurdo, y es el tipo de detalle que
 * hace que un comercio deje de leer los avisos.
 */
export function nextTier(tier: string): TierId | null {
  const order: TierId[] = ['bronze', 'silver', 'gold'];
  const i = order.indexOf(tier as TierId);
  if (i === -1) return 'silver';
  return i >= order.length - 1 ? null : order[i + 1];
}
