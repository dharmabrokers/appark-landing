import { z } from 'zod'

export const earlyAccessSchema = z.object({
  nombre: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email'),
  acceptsUpdates: z.literal(true, {
    errorMap: () => ({ message: 'You must accept to join the list' }),
  }),
  language: z.enum(['es', 'ca', 'en', 'de']).default('es'),
  recaptchaToken: z.string().optional(),
})

export const sponsorSchema = z.object({
  empresa: z.string().min(2, 'Company name is required'),
  email: z.string().email('Invalid email'),
  telefono: z.string().optional(),
  tipoNegocio: z.string().min(1, 'Business type is required'),
  mensaje: z.string().max(500).optional(),
  recaptchaToken: z.string().optional(),
})

export type EarlyAccessInput = z.infer<typeof earlyAccessSchema>
export type SponsorInput = z.infer<typeof sponsorSchema>
