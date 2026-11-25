'use client'
import { useSearchParams } from 'next/navigation'
import AltaFlow from './AltaFlow'
import VecinoAltaFlow from './VecinoAltaFlow'

/**
 * /alta con tarjeta (Stripe, 0093) o /alta?plan=gratis, el plan Vecino sin
 * tarjeta (0124). El de gratis decide él solo si está abierto: ver VecinoAltaFlow.
 */
export default function AltaRouter() {
  const params = useSearchParams()
  return params.get('plan') === 'gratis' ? <VecinoAltaFlow /> : <AltaFlow />
}
