import type { Lang } from '@/lib/i18n'
import type { Category } from '@/lib/alta'

/**
 * Los textos de appark.es/alta y /alta/listo, en los cuatro idiomas.
 * Aparte de lib/i18n.ts para no engordar la home con texto que solo se usa aquí.
 */
export interface AltaText {
  metaTitle: string
  eyebrow: string
  title: string
  sub: string
  pillToday: string
  pillCancel: string
  pillFounder: string
  step1: string
  step2: string
  step3: string
  recommended: string
  perMonth: string
  founderFor12: string
  thenStandard: (p: number) => string
  choose: string
  chosen: string
  limitsNone: string
  limitsRedemptions: string
  limitsPoints: string
  bizTitle: string
  prefilled: string
  lEmpresa: string
  phEmpresa: string
  lContact: string
  phContact: string
  lTel: string
  hTel: string
  lEmail: string
  hEmail: string
  lCif: string
  hCif: string
  lDir: string
  phDir: string
  lTipo: string
  tipoSelect: string
  categories: Record<Category, string>
  lRef: string
  hRef: string
  summaryTitle: string
  sumPlan: string
  sumToday: string
  sumFirst: (date: string) => string
  sumFee: (p: number, standard: number | null) => string
  sumCancel: string
  accept: [string, string, string]
  cta: string
  ctaLoading: string
  secure: string
  back: string
  next: string
  errEmpresa: string
  errContact: string
  errTel: string
  errEmail: string
  errCif: string
  errDir: string
  errTipo: string
  errAccept: string
  errAlready: string
  errServer: string
  faqTitle: string
  faq: [string, string][]
  helpCall: string
  // /alta/listo
  okEyebrow: string
  okTitle: string
  okNoCharge: (date: string) => string
  okEmail: (email: string) => string
  okStepsTitle: string
  okSteps: string[]
  okApp: string
  okPanel: string
  okWait: string
  okFail: string
}

const ES: AltaText = {
  metaTitle: 'Alta de comercio | Appark',
  eyebrow: 'Alta de comercio',
  title: 'Tu comercio en el mapa de Appark, en 2 minutos',
  sub: 'El primer mes es gratis. Registras la tarjeta y no se cobra nada hasta el día 31. Si no te convence, lo cancelas antes con un clic.',
  pillToday: 'Hoy pagas 0 €',
  pillCancel: 'Sin permanencia',
  pillFounder: 'Precio fundador 12 meses',
  step1: 'Paquete',
  step2: 'Tu negocio',
  step3: 'Confirmar',
  recommended: 'Recomendado',
  perMonth: '/mes + IVA',
  founderFor12: 'precio fundador, 12 meses',
  thenStandard: (p) => `después ${p} €`,
  choose: 'Elegir',
  chosen: 'Elegido',
  limitsNone: 'Canjes y premios sin límite',
  limitsRedemptions: 'canjes a la semana',
  limitsPoints: 'puntos máx. por premio',
  bizTitle: 'Tu negocio',
  prefilled: 'Hemos rellenado lo que ya sabíamos de tu negocio. Revísalo.',
  lEmpresa: 'Nombre del negocio',
  phEmpresa: 'Ej. Café Sa Plaça',
  lContact: 'Tu nombre',
  phContact: 'Quién lleva el negocio',
  lTel: 'Móvil',
  hTel: 'Te escribimos por WhatsApp para ayudarte a dejarlo listo.',
  lEmail: 'Correo',
  hEmail: 'Con este correo entrarás en la app para poner tu local y tus premios.',
  lCif: 'CIF / NIF',
  hCif: 'Para tus facturas. No se publica en la app.',
  lDir: 'Dirección del negocio',
  phDir: 'Calle, número — Palma',
  lTipo: 'Tipo de negocio',
  tipoSelect: 'Selecciona…',
  categories: {
    restaurant: 'Restaurante, bar o cafetería', shop: 'Tienda', services: 'Servicios profesionales',
    leisure: 'Ocio', beauty: 'Belleza y estética', fitness: 'Deporte', health: 'Salud',
    automotive: 'Motor (taller, lavado, rent-a-car)', other: 'Otro',
  },
  lRef: 'Código de recomendación (opcional)',
  hRef: 'Si un conductor de Appark te lo ha pasado, ponlo aquí y se le reconocerá.',
  summaryTitle: 'Resumen',
  sumPlan: 'Paquete',
  sumToday: 'Hoy',
  sumFirst: (d) => `Primer cobro el ${d}`,
  sumFee: (p, s) => (s ? `${p} €/mes + IVA durante 12 meses (después ${s} €)` : `${p} €/mes + IVA`),
  sumCancel: 'Cancelas cuando quieras, con un clic desde el correo de Stripe. Si cancelas en el primer mes, no pagas nada.',
  accept: ['Acepto las ', 'condiciones de patrocinio', ' de Appark.'],
  cta: 'Registrar tarjeta · hoy 0 €',
  ctaLoading: 'Abriendo el pago seguro…',
  secure: 'Pago seguro con Stripe. Appark no ve los datos de tu tarjeta.',
  back: '← Atrás',
  next: 'Continuar →',
  errEmpresa: 'Escribe el nombre del negocio.',
  errContact: 'Escribe tu nombre.',
  errTel: 'Escribe un móvil de contacto.',
  errEmail: 'Escribe un correo válido.',
  errCif: 'Escribe el CIF o NIF del negocio.',
  errDir: 'Escribe la dirección del negocio.',
  errTipo: 'Elige el tipo de negocio.',
  errAccept: 'Para seguir, acepta las condiciones de patrocinio.',
  errAlready: 'Este comercio ya está dado de alta. Entra en la app con tu correo, en la pestaña Comercio.',
  errServer: 'No hemos podido continuar. Prueba otra vez o escríbenos a hola@appark.es.',
  faqTitle: 'Dudas rápidas',
  faq: [
    ['¿Cuándo pago?', 'Hoy nada. El primer cobro es el día 31, y Stripe te avisa por correo unos días antes.'],
    ['¿Y si no me convence?', 'Lo cancelas antes del día 31 con un clic desde el correo de Stripe y no pagas nada. Sin permanencia, también después.'],
    ['¿Puedo cambiar de paquete?', 'Sí, cuando quieras, desde el mismo correo. Durante el mes gratis tienes ya todo lo del paquete, salvo el banner de portada de Oro, que llega con el primer cobro.'],
    ['¿Qué pongo de premios?', 'Algo de tu propio negocio a precio de coste: un café, un 2x1, un 10 %. Tú decides cuántos y cuántos puntos cuestan.'],
  ],
  helpCall: '¿Prefieres que te llamemos?',
  okEyebrow: 'Alta completada',
  okTitle: '¡Ya estás dentro!',
  okNoCharge: (d) => `No se te cobra nada hasta el ${d}. Stripe te avisará unos días antes.`,
  okEmail: (e) => `Entra en la app con ${e}: ahí, en la pestaña Comercio, está tu panel.`,
  okStepsTitle: 'Para salir en el mapa',
  okSteps: [
    'Descarga Appark y entra con tu correo (te llega un código).',
    'En «Locales», añade tu dirección y deja el pin en tu puerta.',
    'En «Premios», crea el primero. Con foto se canjea más.',
  ],
  okApp: 'Descargar la app',
  okPanel: 'Abrir el panel web',
  okWait: 'Estamos confirmando tu alta…',
  okFail: 'No hemos podido confirmar el alta. Si has registrado la tarjeta, no te preocupes: te escribimos en unos minutos. Para cualquier cosa, hola@appark.es.',
}

const CA: AltaText = {
  ...ES,
  metaTitle: 'Alta de comerç | Appark',
  eyebrow: 'Alta de comerç',
  title: 'El teu comerç al mapa d’Appark, en 2 minuts',
  sub: 'El primer mes és gratis. Registres la targeta i no es cobra res fins al dia 31. Si no et convenç, ho cancel·les abans amb un clic.',
  pillToday: 'Avui pagues 0 €',
  pillCancel: 'Sense permanència',
  pillFounder: 'Preu fundador 12 mesos',
  step1: 'Paquet',
  step2: 'El teu negoci',
  step3: 'Confirmar',
  recommended: 'Recomanat',
  perMonth: '/mes + IVA',
  founderFor12: 'preu fundador, 12 mesos',
  thenStandard: (p) => `després ${p} €`,
  choose: 'Triar',
  chosen: 'Triat',
  limitsNone: 'Bescanvis i premis sense límit',
  limitsRedemptions: 'bescanvis a la setmana',
  limitsPoints: 'punts màx. per premi',
  bizTitle: 'El teu negoci',
  prefilled: 'Hem omplert el que ja sabíem del teu negoci. Revisa-ho.',
  lEmpresa: 'Nom del negoci',
  phEmpresa: 'Ex. Cafè Sa Plaça',
  lContact: 'El teu nom',
  phContact: 'Qui porta el negoci',
  lTel: 'Mòbil',
  hTel: 'T’escrivim per WhatsApp per ajudar-te a deixar-ho llest.',
  lEmail: 'Correu',
  hEmail: 'Amb aquest correu entraràs a l’app per posar el teu local i els teus premis.',
  lCif: 'CIF / NIF',
  hCif: 'Per a les teves factures. No es publica a l’app.',
  lDir: 'Adreça del negoci',
  phDir: 'Carrer, número — Palma',
  lTipo: 'Tipus de negoci',
  tipoSelect: 'Selecciona…',
  categories: {
    restaurant: 'Restaurant, bar o cafeteria', shop: 'Botiga', services: 'Serveis professionals',
    leisure: 'Oci', beauty: 'Bellesa i estètica', fitness: 'Esport', health: 'Salut',
    automotive: 'Motor (taller, rentat, rent-a-car)', other: 'Altre',
  },
  lRef: 'Codi de recomanació (opcional)',
  hRef: 'Si un conductor d’Appark te l’ha passat, posa’l aquí i se li reconeixerà.',
  summaryTitle: 'Resum',
  sumPlan: 'Paquet',
  sumToday: 'Avui',
  sumFirst: (d) => `Primer cobrament el ${d}`,
  sumFee: (p, s) => (s ? `${p} €/mes + IVA durant 12 mesos (després ${s} €)` : `${p} €/mes + IVA`),
  sumCancel: 'Cancel·les quan vulguis, amb un clic des del correu de Stripe. Si cancel·les el primer mes, no pagues res.',
  accept: ['Accepto les ', 'condicions de patrocini', ' d’Appark.'],
  cta: 'Registrar targeta · avui 0 €',
  ctaLoading: 'Obrint el pagament segur…',
  secure: 'Pagament segur amb Stripe. Appark no veu les dades de la teva targeta.',
  back: '← Enrere',
  next: 'Continuar →',
  errEmpresa: 'Escriu el nom del negoci.',
  errContact: 'Escriu el teu nom.',
  errTel: 'Escriu un mòbil de contacte.',
  errEmail: 'Escriu un correu vàlid.',
  errCif: 'Escriu el CIF o NIF del negoci.',
  errDir: 'Escriu l’adreça del negoci.',
  errTipo: 'Tria el tipus de negoci.',
  errAccept: 'Per continuar, accepta les condicions de patrocini.',
  errAlready: 'Aquest comerç ja està donat d’alta. Entra a l’app amb el teu correu, a la pestanya Comerç.',
  errServer: 'No hem pogut continuar. Torna-ho a provar o escriu-nos a hola@appark.es.',
  faqTitle: 'Dubtes ràpids',
  faq: [
    ['Quan pago?', 'Avui res. El primer cobrament és el dia 31, i Stripe t’avisa per correu uns dies abans.'],
    ['I si no em convenç?', 'Ho cancel·les abans del dia 31 amb un clic des del correu de Stripe i no pagues res. Sense permanència, també després.'],
    ['Puc canviar de paquet?', 'Sí, quan vulguis, des del mateix correu. Durant el mes gratis ja tens tot el del paquet, excepte el bàner de portada d’Or, que arriba amb el primer cobrament.'],
    ['Què hi poso de premis?', 'Alguna cosa del teu negoci a preu de cost: un cafè, un 2x1, un 10 %. Tu decideixes quants i quants punts costen.'],
  ],
  helpCall: 'Prefereixes que et telefonem?',
  okEyebrow: 'Alta completada',
  okTitle: 'Ja hi ets!',
  okNoCharge: (d) => `No se’t cobra res fins al ${d}. Stripe t’avisarà uns dies abans.`,
  okEmail: (e) => `Entra a l’app amb ${e}: allà, a la pestanya Comerç, hi ha el teu panell.`,
  okStepsTitle: 'Per sortir al mapa',
  okSteps: [
    'Descarrega Appark i entra amb el teu correu (t’arriba un codi).',
    'A «Locals», afegeix la teva adreça i deixa el pin a la teva porta.',
    'A «Premis», crea el primer. Amb foto es bescanvia més.',
  ],
  okApp: 'Descarregar l’app',
  okPanel: 'Obrir el panell web',
  okWait: 'Estam confirmant la teva alta…',
  okFail: 'No hem pogut confirmar l’alta. Si has registrat la targeta, no pateixis: t’escrivim en uns minuts. Per a qualsevol cosa, hola@appark.es.',
}

const EN: AltaText = {
  ...ES,
  metaTitle: 'Business sign-up | Appark',
  eyebrow: 'Business sign-up',
  title: 'Your business on the Appark map, in 2 minutes',
  sub: 'The first month is free. You add your card and nothing is charged until day 31. If it’s not for you, cancel before with one click.',
  pillToday: 'You pay €0 today',
  pillCancel: 'No commitment',
  pillFounder: 'Founder price for 12 months',
  step1: 'Package',
  step2: 'Your business',
  step3: 'Confirm',
  recommended: 'Recommended',
  perMonth: '/month + VAT',
  founderFor12: 'founder price, 12 months',
  thenStandard: (p) => `then €${p}`,
  choose: 'Choose',
  chosen: 'Chosen',
  limitsNone: 'Unlimited redemptions and rewards',
  limitsRedemptions: 'redemptions a week',
  limitsPoints: 'max. points per reward',
  bizTitle: 'Your business',
  prefilled: 'We’ve filled in what we already knew about your business. Please check it.',
  lEmpresa: 'Business name',
  phEmpresa: 'e.g. Café Sa Plaça',
  lContact: 'Your name',
  phContact: 'Who runs the business',
  lTel: 'Mobile',
  hTel: 'We’ll message you on WhatsApp to help you get set up.',
  lEmail: 'Email',
  hEmail: 'You’ll use this email to sign in to the app and add your venue and rewards.',
  lCif: 'Tax ID (CIF / NIF)',
  hCif: 'For your invoices. Not shown in the app.',
  lDir: 'Business address',
  phDir: 'Street, number — Palma',
  lTipo: 'Type of business',
  tipoSelect: 'Select…',
  categories: {
    restaurant: 'Restaurant, bar or café', shop: 'Shop', services: 'Professional services',
    leisure: 'Leisure', beauty: 'Beauty', fitness: 'Sport', health: 'Health',
    automotive: 'Motoring (garage, car wash, rental)', other: 'Other',
  },
  lRef: 'Referral code (optional)',
  hRef: 'If an Appark driver gave you one, enter it here so they get the credit.',
  summaryTitle: 'Summary',
  sumPlan: 'Package',
  sumToday: 'Today',
  sumFirst: (d) => `First payment on ${d}`,
  sumFee: (p, s) => (s ? `€${p}/month + VAT for 12 months (then €${s})` : `€${p}/month + VAT`),
  sumCancel: 'Cancel any time with one click from the Stripe email. Cancel in the first month and you pay nothing.',
  accept: ['I accept Appark’s ', 'sponsorship terms', '.'],
  cta: 'Add card · €0 today',
  ctaLoading: 'Opening secure payment…',
  secure: 'Secure payment with Stripe. Appark never sees your card details.',
  back: '← Back',
  next: 'Continue →',
  errEmpresa: 'Enter the business name.',
  errContact: 'Enter your name.',
  errTel: 'Enter a contact mobile number.',
  errEmail: 'Enter a valid email.',
  errCif: 'Enter the business tax ID.',
  errDir: 'Enter the business address.',
  errTipo: 'Choose the type of business.',
  errAccept: 'To continue, accept the sponsorship terms.',
  errAlready: 'This business is already signed up. Sign in to the app with your email, in the Business tab.',
  errServer: 'We couldn’t continue. Try again or write to hola@appark.es.',
  faqTitle: 'Quick questions',
  faq: [
    ['When do I pay?', 'Nothing today. The first payment is on day 31, and Stripe emails you a few days before.'],
    ['What if it’s not for me?', 'Cancel before day 31 with one click from the Stripe email and you pay nothing. No commitment afterwards either.'],
    ['Can I change package?', 'Yes, any time, from the same email. During the free month you already get everything in your package except the Gold home-screen banner, which starts with the first payment.'],
    ['What rewards should I offer?', 'Something from your own business at cost price: a coffee, a 2-for-1, 10 % off. You decide how many and how many points they cost.'],
  ],
  helpCall: 'Would you rather we called you?',
  okEyebrow: 'Sign-up complete',
  okTitle: 'You’re in!',
  okNoCharge: (d) => `Nothing is charged until ${d}. Stripe will remind you a few days before.`,
  okEmail: (e) => `Sign in to the app with ${e}: your dashboard is in the Business tab.`,
  okStepsTitle: 'To appear on the map',
  okSteps: [
    'Download Appark and sign in with your email (you’ll get a code).',
    'In “Locations”, add your address and drop the pin on your door.',
    'In “Rewards”, create your first one. Rewards with a photo get redeemed more.',
  ],
  okApp: 'Download the app',
  okPanel: 'Open the web dashboard',
  okWait: 'Confirming your sign-up…',
  okFail: 'We couldn’t confirm your sign-up. If you added your card, don’t worry: we’ll write to you in a few minutes. Anything else, hola@appark.es.',
}

const DE: AltaText = {
  ...ES,
  metaTitle: 'Anmeldung für Geschäfte | Appark',
  eyebrow: 'Anmeldung für Geschäfte',
  title: 'Dein Geschäft auf der Appark-Karte – in 2 Minuten',
  sub: 'Der erste Monat ist kostenlos. Du hinterlegst deine Karte und bis Tag 31 wird nichts abgebucht. Gefällt es dir nicht, kündigst du vorher mit einem Klick.',
  pillToday: 'Heute zahlst du 0 €',
  pillCancel: 'Keine Mindestlaufzeit',
  pillFounder: 'Gründerpreis 12 Monate',
  step1: 'Paket',
  step2: 'Dein Geschäft',
  step3: 'Bestätigen',
  recommended: 'Empfohlen',
  perMonth: '/Monat + MwSt.',
  founderFor12: 'Gründerpreis, 12 Monate',
  thenStandard: (p) => `danach ${p} €`,
  choose: 'Wählen',
  chosen: 'Gewählt',
  limitsNone: 'Unbegrenzte Einlösungen und Prämien',
  limitsRedemptions: 'Einlösungen pro Woche',
  limitsPoints: 'max. Punkte pro Prämie',
  bizTitle: 'Dein Geschäft',
  prefilled: 'Wir haben eingetragen, was wir schon über dein Geschäft wussten. Bitte prüfen.',
  lEmpresa: 'Name des Geschäfts',
  phEmpresa: 'z. B. Café Sa Plaça',
  lContact: 'Dein Name',
  phContact: 'Wer das Geschäft führt',
  lTel: 'Handy',
  hTel: 'Wir schreiben dir per WhatsApp, um dir bei der Einrichtung zu helfen.',
  lEmail: 'E-Mail',
  hEmail: 'Mit dieser E-Mail meldest du dich in der App an, um Standort und Prämien einzutragen.',
  lCif: 'Steuernummer (CIF / NIF)',
  hCif: 'Für deine Rechnungen. Wird in der App nicht angezeigt.',
  lDir: 'Adresse des Geschäfts',
  phDir: 'Straße, Nummer — Palma',
  lTipo: 'Art des Geschäfts',
  tipoSelect: 'Auswählen…',
  categories: {
    restaurant: 'Restaurant, Bar oder Café', shop: 'Laden', services: 'Dienstleistungen',
    leisure: 'Freizeit', beauty: 'Beauty', fitness: 'Sport', health: 'Gesundheit',
    automotive: 'Auto (Werkstatt, Waschanlage, Vermietung)', other: 'Sonstiges',
  },
  lRef: 'Empfehlungscode (optional)',
  hRef: 'Wenn dir ein Appark-Fahrer einen gegeben hat, trag ihn hier ein.',
  summaryTitle: 'Zusammenfassung',
  sumPlan: 'Paket',
  sumToday: 'Heute',
  sumFirst: (d) => `Erste Zahlung am ${d}`,
  sumFee: (p, s) => (s ? `${p} €/Monat + MwSt. für 12 Monate (danach ${s} €)` : `${p} €/Monat + MwSt.`),
  sumCancel: 'Jederzeit mit einem Klick über die E-Mail von Stripe kündbar. Kündigst du im ersten Monat, zahlst du nichts.',
  accept: ['Ich akzeptiere die ', 'Sponsoring-Bedingungen', ' von Appark.'],
  cta: 'Karte hinterlegen · heute 0 €',
  ctaLoading: 'Sichere Zahlung wird geöffnet…',
  secure: 'Sichere Zahlung mit Stripe. Appark sieht deine Kartendaten nicht.',
  back: '← Zurück',
  next: 'Weiter →',
  errEmpresa: 'Gib den Namen des Geschäfts ein.',
  errContact: 'Gib deinen Namen ein.',
  errTel: 'Gib eine Handynummer ein.',
  errEmail: 'Gib eine gültige E-Mail ein.',
  errCif: 'Gib die Steuernummer des Geschäfts ein.',
  errDir: 'Gib die Adresse des Geschäfts ein.',
  errTipo: 'Wähle die Art des Geschäfts.',
  errAccept: 'Um fortzufahren, akzeptiere die Sponsoring-Bedingungen.',
  errAlready: 'Dieses Geschäft ist bereits angemeldet. Melde dich in der App mit deiner E-Mail an, im Tab Geschäft.',
  errServer: 'Es ging nicht weiter. Versuch es noch einmal oder schreib an hola@appark.es.',
  faqTitle: 'Kurz gefragt',
  faq: [
    ['Wann zahle ich?', 'Heute nichts. Die erste Zahlung ist an Tag 31, und Stripe erinnert dich ein paar Tage vorher per E-Mail.'],
    ['Und wenn es mir nicht gefällt?', 'Kündige vor Tag 31 mit einem Klick über die E-Mail von Stripe und du zahlst nichts. Auch danach ohne Mindestlaufzeit.'],
    ['Kann ich das Paket wechseln?', 'Ja, jederzeit über dieselbe E-Mail. Im Gratismonat hast du schon alles aus deinem Paket, außer dem Startseiten-Banner von Gold, das mit der ersten Zahlung startet.'],
    ['Welche Prämien biete ich an?', 'Etwas aus deinem eigenen Geschäft zum Selbstkostenpreis: einen Kaffee, 2 für 1, 10 % Rabatt. Du entscheidest, wie viele und wie viele Punkte sie kosten.'],
  ],
  helpCall: 'Sollen wir dich lieber anrufen?',
  okEyebrow: 'Anmeldung abgeschlossen',
  okTitle: 'Du bist dabei!',
  okNoCharge: (d) => `Bis zum ${d} wird nichts abgebucht. Stripe erinnert dich ein paar Tage vorher.`,
  okEmail: (e) => `Melde dich in der App mit ${e} an: dein Bereich ist im Tab Geschäft.`,
  okStepsTitle: 'Um auf der Karte zu erscheinen',
  okSteps: [
    'Lade Appark herunter und melde dich mit deiner E-Mail an (du bekommst einen Code).',
    'Unter „Standorte“ deine Adresse eintragen und den Pin an deine Tür setzen.',
    'Unter „Prämien“ die erste anlegen. Mit Foto wird mehr eingelöst.',
  ],
  okApp: 'App herunterladen',
  okPanel: 'Web-Bereich öffnen',
  okWait: 'Deine Anmeldung wird bestätigt…',
  okFail: 'Wir konnten die Anmeldung nicht bestätigen. Wenn du deine Karte hinterlegt hast, keine Sorge: Wir schreiben dir in ein paar Minuten. Sonst hola@appark.es.',
}

export const ALTA_TEXT: Record<Lang, AltaText> = { es: ES, ca: CA, en: EN, de: DE }
