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
  // El alta de comercio es autoservicio y acaba publicando un negocio en
  // el mapa. Sin identificador fiscal ni dirección, cualquiera puede
  // montar uno que no existe; con ellos hay algo verificable y, de paso,
  // lo que hace falta para facturar. Mismo criterio que la migración 0050.
  // Desde el alta con tarjeta (appark.es/alta) este formulario es solo «que me
  // llamen»: el CIF y la dirección los pide el alta, no una llamada.
  cif: z.string().max(20).optional(),
  direccion: z.string().max(200).optional(),
  email: z.string().email('Invalid email'),
  telefono: z.string().min(9, 'Phone is required').max(40),
  tipoNegocio: z.string().min(1, 'Business type is required'),
  mensaje: z.string().max(500).optional(),
  // El código del conductor que le recomendó Appark, si vino por ahí
  // (migración 0055). Opcional siempre y sin validar su forma: quien
  // decide si vale es el servidor al dar de alta, y rechazar aquí un
  // código mal tecleado costaría un alta por un extra.
  referralCode: z.string().max(12).optional(),
  language: z.enum(['es', 'ca', 'en', 'de']).default('es'),
  recaptchaToken: z.string().optional(),
})

// appark.es/alta: el alta con tarjeta (ver lib/alta.ts). La casilla de las
// condiciones es obligatoria; lo demás se comprueba otra vez en la base.
export const altaSchema = z.object({
  plan: z.enum(['bronze', 'silver', 'gold']),
  empresa: z.string().trim().min(2).max(150),
  cif: z.string().trim().min(8).max(20),
  direccion: z.string().trim().min(5).max(200),
  email: z.string().trim().toLowerCase().email().max(200),
  telefono: z.string().trim().min(9).max(40),
  contactPerson: z.string().trim().max(120).optional(),
  tipo: z.enum(['restaurant', 'shop', 'services', 'leisure', 'beauty', 'fitness', 'health', 'automotive', 'other']),
  referralCode: z.string().max(12).optional(),
  token: z.string().max(64).optional(),
  code: z.string().max(16).optional(),
  accept: z.literal(true),
  language: z.enum(['es', 'ca', 'en', 'de']).default('es'),
  utm: z.object({
    source: z.string().max(80).optional(),
    medium: z.string().max(80).optional(),
    campaign: z.string().max(80).optional(),
  }).optional(),
  recaptchaToken: z.string().optional(),
})

export type EarlyAccessInput = z.infer<typeof earlyAccessSchema>
export type SponsorInput = z.infer<typeof sponsorSchema>
export type AltaInput = z.infer<typeof altaSchema>
