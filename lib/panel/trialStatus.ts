// COPIA de Appark-main apps/mobile/src/services/trialStatus.ts (panel web, appark.es/panel).
// Si cambias uno, cambia el otro: la app y la web tienen que contar lo mismo.
/**
 * How a shop's trial reads on its own panel.
 *
 * It exists because its absence was a real failure, not a missing
 * nicety: with nothing on screen saying "you are on a trial and it ends
 * in N days", a trial panel and a paying one looked identical. The first
 * self-serve signup could not be told apart from an old account by the
 * person who had just made it.
 */

export type TrialState =
  /** Not on a trial at all — an ordinary paying or beta sponsor. */
  | { kind: 'none' }
  /** On a trial with no end date yet: the beta. Nothing is counting. */
  | { kind: 'open' }
  /** Counting down. */
  | { kind: 'counting'; daysLeft: number }
  /** The end date has passed. */
  | { kind: 'ended' };

export function trialState(
  status: string | null | undefined,
  trialEndsAt: string | null | undefined,
  now: number,
): TrialState {
  if (status !== 'trial') return { kind: 'none' };
  if (!trialEndsAt) return { kind: 'open' };

  const ends = Date.parse(trialEndsAt);
  // An unparseable date must not read as expired: that would tell a shop
  // its trial is over on the strength of a malformed string.
  if (!Number.isFinite(ends)) return { kind: 'open' };
  if (ends <= now) return { kind: 'ended' };

  // Rounded up, like every other countdown shown to someone who is
  // deciding whether to pay: with four hours left, "1 día" is honest and
  // "0 días" reads as already over.
  return { kind: 'counting', daysLeft: Math.ceil((ends - now) / 86_400_000) };
}
