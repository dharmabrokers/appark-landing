/**
 * appark.es/colabora: el formulario de comerciales colaboradores.
 *
 * Quien guarda la candidatura es el CRM (Appark-main, apps/crm/src/app/api/colabora,
 * migración 0111): esta web no tiene la clave privada de Supabase, y la función
 * candidate_apply solo la puede llamar esa clave. Por eso la ruta /api/colabora de
 * aquí comprueba el reCAPTCHA y pasa los datos al CRM desde el servidor. El CRM
 * valida todo otra vez, frena los envíos en masa y el bot escribe por WhatsApp.
 *
 * LAS DOS LISTAS TIENEN QUE SER IGUALES QUE LAS DEL CRM (apps/crm/src/lib/colabora.ts):
 * el CRM rechaza cualquier valor que no esté en las suyas.
 */
export const ZONES = [
  'Toda Palma',
  'Centro',
  'Levante (Pere Garau, Son Gotleu, Polígono de Levante)',
  'Poniente (Santa Catalina, Son Espanyolet, El Terreno)',
  'Norte (Son Sardina, Establiments, Son Rapinya)',
  'Playa de Palma y Can Pastilla',
  'Son Ferriol y Pla de na Tesa',
  'Fuera de Palma',
] as const

export const NICHES = [
  'Ninguno en concreto',
  'Restaurantes, bares y cafeterías',
  'Tiendas y comercio de barrio',
  'Peluquerías y estética',
  'Gimnasios y deporte',
  'Salud (clínicas, fisios, farmacias)',
  'Talleres y automoción',
  'Ocio, cultura y turismo',
  'Oficinas y servicios profesionales',
] as const

export const CRM_URL = (process.env.CRM_URL || 'https://appark-crm.vercel.app').replace(/\/+$/, '')
